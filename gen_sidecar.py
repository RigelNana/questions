import json
import os

content = """你所在的团队正在将一个单体应用拆分为 40+ 微服务，全部运行在 Kubernetes 1.30 集群上。随着服务数量快速增长，团队同时面临三个迫切的基础设施需求，而这三个需求有一个共同特征：它们都属于「与业务逻辑无关的横切关注点」。

第一个需求是统一日志收集。团队的微服务用 Go、Java、Python 三种语言编写，日志格式和输出方式各不相同——Go 服务用 zap 把结构化日志写到 /var/log/app/ 目录，Java 服务通过 Logback 输出到 stdout，Python 服务用 logging 模块写文件。运维团队希望在不修改任何业务代码的前提下，将所有服务的日志统一采集到 Elasticsearch 集群中，并且采集组件的升级和配置变更不能影响业务容器。

第二个需求是服务间通信安全与流量治理。安全合规团队要求所有微服务之间的通信必须启用 mTLS（双向 TLS）加密，同时 SRE 团队需要统一的流量控制能力——熔断、重试、限流、灰度路由。让 40 个业务团队各自在代码里实现这些能力，显然不现实，也无法保证一致性。

第三个需求是配置热加载。部分服务的运行时配置存储在 Kubernetes ConfigMap 中，当前每次修改配置后需要手动执行 `kubectl rollout restart` 重启 Pod 才能生效，导致短暂的服务中断和连接断开。团队希望配置变更能在不重启 Pod 的情况下自动生效。

技术 Leader 在架构评审会上提出了一个方向：能否利用 Kubernetes Pod 的多容器能力，在每个 Pod 中部署「辅助容器」来承载这些横切关注点，让业务容器保持纯净、只关注业务逻辑？

这就是 Sidecar 设计模式要解决的核心问题。作为 Kubernetes 中最重要也最广泛使用的多容器设计模式，Sidecar 的应用范围远不止上面三个场景。请系统阐述 Sidecar 模式的设计理念、与主容器的协作机制，深入分析至少五个典型使用场景（日志收集、服务网格、配置热加载、安全代理、数据库连接代理），并为每个场景给出可直接部署的 Pod YAML 配置。同时，请讨论 Kubernetes 1.28 引入的原生 Sidecar Container（KEP-753）对该模式的根本性影响。"""

answer = """## 第一部分：Sidecar 模式的核心概念

在 Kubernetes 中，Pod 是最小的调度单元，一个 Pod 可以包含一个或多个容器。这些容器共享同一个 Network Namespace（意味着它们拥有相同的 IP 地址，可以通过 localhost 互相通信）、共享同一组 Volume 挂载（可以读写相同的文件目录）、以及共享同一个 IPC Namespace（可以通过共享内存或信号量通信）。正是这种「共享隔离边界」的特性，为多容器协作模式提供了基础。

Sidecar 模式的核心思想非常简单：在 Pod 中，除了运行业务逻辑的主容器（Main Container）之外，再部署一个或多个辅助容器（Sidecar Container），这些辅助容器为主容器提供支撑性功能——日志收集、流量代理、配置管理、安全认证等。主容器完全不需要知道 Sidecar 的存在，两者通过共享的 Network 或 Volume 进行隐式协作。

这种设计背后的理念是「关注点分离（Separation of Concerns）」和「单一职责原则（Single Responsibility Principle）」。业务开发团队只需要关心业务逻辑，基础设施团队独立维护 Sidecar 容器的镜像和配置。两者的发布周期完全解耦——你升级 Fluentd Sidecar 的版本不需要重新构建业务镜像，反之亦然。这在大规模微服务架构中具有巨大的工程价值。

一个最简的 Sidecar Pod 结构如下所示，主容器每秒写入一条日志到共享 Volume，Sidecar 容器实时读取并输出：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: sidecar-demo
spec:
  containers:
    # 主容器：业务逻辑，写日志到共享目录
    - name: app
      image: busybox:1.36
      command: ["sh", "-c", "while true; do echo $(date) hello >> /var/log/app/access.log; sleep 1; done"]
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log/app
    # Sidecar 容器：读取并转发日志
    - name: log-reader
      image: busybox:1.36
      command: ["sh", "-c", "tail -f /var/log/app/access.log"]
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log/app
  volumes:
    - name: shared-logs
      emptyDir: {}
```

这个例子虽然简单，但已经体现了 Sidecar 模式的两个关键特征：主容器和 Sidecar 通过共享 Volume 协作，且两者的生命周期绑定在同一个 Pod 中。

## 第二部分：五大典型场景深度解析

### 场景一：日志收集（Fluentd / Filebeat Sidecar）

日志收集是 Sidecar 模式最经典、也是最早被广泛采用的场景。在没有 Sidecar 的方案中，通常有两种选择：一是在每个节点上部署 DaemonSet 形式的日志采集器（如 Fluentd DaemonSet）读取容器的 stdout/stderr；二是让应用直接通过 SDK 将日志发送到远端。前者的问题是只能采集标准输出，对于写文件的应用无能为力，且所有 Pod 共享一个采集器，配置粒度粗糙；后者的问题是侵入业务代码，且不同语言需要不同的 SDK 集成。

Sidecar 方案完美解决了这两个问题。主容器将日志写入 Pod 内的共享 Volume（通常是 emptyDir），Sidecar 容器运行 Fluentd 或 Filebeat，持续监听日志文件变化并转发到 Elasticsearch、Loki 或 Kafka。以下是一个生产级的 Fluentd Sidecar 配置：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: order-service
  labels:
    app: order-service
spec:
  containers:
    - name: order-app
      image: myregistry/order-service:v2.3.1
      ports:
        - containerPort: 8080
      volumeMounts:
        - name: app-logs
          mountPath: /var/log/app
      resources:
        requests: { cpu: "200m", memory: "256Mi" }
        limits: { cpu: "500m", memory: "512Mi" }
    - name: fluentd-sidecar
      image: fluent/fluentd:v1.16-debian-1
      env:
        - name: ELASTICSEARCH_HOST
          value: "elasticsearch.logging.svc.cluster.local"
        - name: ELASTICSEARCH_PORT
          value: "9200"
      volumeMounts:
        - name: app-logs
          mountPath: /var/log/app
          readOnly: true  # Sidecar 只读，避免误写
        - name: fluentd-config
          mountPath: /fluentd/etc
      resources:
        requests: { cpu: "50m", memory: "64Mi" }
        limits: { cpu: "100m", memory: "128Mi" }
  volumes:
    - name: app-logs
      emptyDir: {}
    - name: fluentd-config
      configMap:
        name: fluentd-sidecar-config
```

这里有几个生产经验值得注意：Sidecar 挂载日志 Volume 时设置 `readOnly: true` 防止误写；Sidecar 的资源 limits 要独立设置且远小于主容器，避免日志采集抢占业务资源；使用 ConfigMap 管理 Fluentd 配置，方便统一更新采集规则。

### 场景二：服务网格（Istio Envoy Proxy）

服务网格是 Sidecar 模式最具影响力的应用场景。以 Istio 为例，当你给 Namespace 打上 `istio-injection=enabled` 标签后，Istio 的 MutatingAdmissionWebhook 会自动在每个新建 Pod 中注入两个容器：一个 `istio-init` Init Container（负责用 iptables 规则劫持所有进出 Pod 的流量）和一个 `istio-proxy` Sidecar 容器（运行 Envoy 代理，处理被劫持的流量）。

注入完成后，Pod 中所有的入站和出站 TCP 流量都会被透明地重定向到 Envoy。这意味着业务容器发出的每一个 HTTP/gRPC 请求，实际上都先经过本地的 Envoy，由 Envoy 完成 mTLS 握手、负载均衡、重试、熔断、指标采集等工作，然后再转发到目标服务的 Envoy。整个过程对业务代码完全透明。

执行 `kubectl get pod order-service-7d8f9b6c5-xk2mp -o jsonpath='{.spec.containers[*].name}'` 你会看到输出 `order-app istio-proxy`，说明 Sidecar 已成功注入。通过 `istioctl proxy-status` 可以检查所有 Envoy 代理的同步状态，确保 xDS 配置已经下发到位。

### 场景三：配置热加载

当应用的配置存储在 ConfigMap 中并以 Volume 形式挂载到 Pod 时，Kubernetes 会在 ConfigMap 更新后自动同步文件内容（默认同步周期约 60 秒，由 kubelet 的 `--sync-frequency` 控制）。但文件更新了不代表应用会重新读取——大部分应用只在启动时加载配置文件。

Sidecar 模式可以优雅地解决这个问题。一个轻量的 Sidecar 容器使用 inotifywait 监听配置文件的变化事件，检测到变化后向主容器发送 SIGHUP 信号（前提是 Pod 启用了 `shareProcessNamespace: true`）或调用主容器暴露的 reload HTTP 端点。以下是一个实际配置：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: nginx-hot-reload
spec:
  shareProcessNamespace: true  # 允许容器间发送信号
  containers:
    - name: nginx
      image: nginx:1.25
      volumeMounts:
        - name: nginx-config
          mountPath: /etc/nginx/conf.d
    - name: config-reloader
      image: jimmidyson/configmap-reload:v0.9.0
      args:
        - --volume-dir=/etc/nginx/conf.d
        - --webhook-url=http://localhost:80/-/reload
      volumeMounts:
        - name: nginx-config
          mountPath: /etc/nginx/conf.d
          readOnly: true
  volumes:
    - name: nginx-config
      configMap:
        name: nginx-site-config
```

在这个方案中，`configmap-reload` Sidecar 会监听 `/etc/nginx/conf.d` 目录的文件系统事件。一旦 ConfigMap 内容被 kubelet 同步更新，Sidecar 立即向 nginx 发送 reload 请求，nginx 执行优雅重载，整个过程无需重启 Pod、不中断任何连接。

### 场景四：安全认证代理（OAuth2 Proxy）

很多内部微服务本身不具备认证能力，在对外暴露或接入 SSO 时需要一个认证层。与其在每个服务中集成 OAuth2/OIDC 客户端库，不如用 Sidecar 统一处理。OAuth2 Proxy 作为 Sidecar 运行在 Pod 中，监听一个端口接收外部请求，完成 OAuth2 认证流程后将已认证的请求转发给主容器。主容器只需要关心业务逻辑，完全不需要处理 token 验证、session 管理、登录重定向这些问题。

### 场景五：数据库连接代理（Cloud SQL Proxy）

在 Google Cloud 环境中，Cloud SQL Proxy 是一个典型的 Sidecar 应用。它作为 Sidecar 容器运行在 Pod 中，通过 Google IAM 进行身份认证，建立到 Cloud SQL 实例的加密隧道。业务容器只需要连接 `localhost:5432`（PostgreSQL）或 `localhost:3306`（MySQL），完全不需要处理 SSL 证书、IP 白名单、IAM 认证这些复杂的连接管理问题：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: myapp-with-cloudsql
spec:
  serviceAccountName: myapp-sa  # 绑定具有 Cloud SQL Client 角色的 SA
  containers:
    - name: myapp
      image: myregistry/myapp:v1.5.0
      env:
        - name: DB_HOST
          value: "127.0.0.1"  # 通过 localhost 连接 proxy
        - name: DB_PORT
          value: "5432"
    - name: cloud-sql-proxy
      image: gcr.io/cloud-sql-connectors/cloud-sql-proxy:2.11.0
      args:
        - "--structured-logs"
        - "--auto-iam-authn"
        - "my-project:us-central1:my-db-instance"
      securityContext:
        runAsNonRoot: true
      resources:
        requests: { cpu: "50m", memory: "64Mi" }
```

这种代理模式的价值在于：数据库连接凭证不需要硬编码到应用配置中，IAM 认证由 Sidecar 自动处理；加密隧道对应用透明，开发环境可以直接连接本地数据库而不需要改代码；Sidecar 的镜像由 Google 维护和更新，应用团队不需要关心连接安全细节。

## 第三部分：体系化扩展

### K8s 1.28 原生 Sidecar Container（KEP-753）

在 Kubernetes 1.28 之前，Sidecar 容器只是一个「约定」——你把辅助容器和主容器放在同一个 Pod 里，Kubernetes 本身并不知道哪个是主容器、哪个是 Sidecar。这带来了一个长期困扰社区的问题：**生命周期管理**。所有普通容器是并行启动的，没有先后顺序保证。这意味着主容器可能在 Envoy Sidecar 就绪之前就开始发送请求，导致连接失败；Pod 终止时，Sidecar 可能先于主容器退出，导致主容器在 graceful shutdown 过程中无法完成最后的日志上报或请求排空。对于 Job 和 CronJob 场景更为棘手——主容器执行完成后，Sidecar 容器仍在运行，导致 Job 永远不会被标记为 Completed。

KEP-753 从 Kubernetes 1.28（Alpha）引入、1.29（Beta）默认启用、1.31（GA）正式稳定，它通过一个巧妙的设计解决了这个问题：在 `initContainers` 中声明的容器如果设置了 `restartPolicy: Always`，就会被视为原生 Sidecar Container。这些容器在所有普通 Init Container 完成后启动，但在任何普通容器启动之前就绑定就绪；Pod 终止时，它们会在所有普通容器退出之后才被终止。以下是原生 Sidecar 的配置方式：

```yaml
apiVersion: v1
kind: Pod
metadata:
  name: native-sidecar-demo
spec:
  initContainers:
    # 原生 Sidecar：设置 restartPolicy: Always
    - name: log-collector
      image: fluent/fluentd:v1.16-debian-1
      restartPolicy: Always  # 关键字段：标记为原生 Sidecar
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log/app
          readOnly: true
      resources:
        requests: { cpu: "50m", memory: "64Mi" }
  containers:
    - name: app
      image: myregistry/app:v3.0.0
      volumeMounts:
        - name: shared-logs
          mountPath: /var/log/app
  volumes:
    - name: shared-logs
      emptyDir: {}
```

这个变化看似简单，实际上解决了困扰 Kubernetes 社区五年之久的 Sidecar 生命周期问题。对于 Istio 等服务网格项目而言，这意味着不再需要各种 hack（比如 Istio 之前通过 `holdApplicationUntilProxyStarts` 和 `EXIT_ON_ZERO_ACTIVE_CONNECTIONS` 环境变量来缓解启动和关闭顺序问题）。

### Sidecar vs Ambassador vs Adapter

Kubernetes 多容器 Pod 有三种经典设计模式，它们的区别在于辅助容器与主容器的「协作方向」。Sidecar 模式的方向是「增强/扩展」——辅助容器为主容器添加它本身不具备的能力，比如日志收集、监控指标暴露。Ambassador 模式的方向是「代理外部访问」——辅助容器充当主容器与外部系统之间的中间人，简化主容器的网络交互，典型代表就是 Cloud SQL Proxy。Adapter 模式的方向是「标准化输出」——辅助容器将主容器的非标准输出转换为统一格式，典型代表是 Prometheus Exporter Sidecar，它读取应用的私有指标格式，转换为 Prometheus 能够抓取的标准 /metrics 端点。

在实际面试中，面试官通常不会纠结于三种模式的精确分类（Cloud SQL Proxy 到底算 Sidecar 还是 Ambassador 有时见仁见智），他们更关心的是你是否理解「为什么要把这个功能放在独立容器里而不是集成到主容器中」这个核心问题。答好这个问题的关键是讲清楚：关注点分离带来的可维护性提升、独立的发布和升级周期、以及跨语言栈的统一基础设施能力。

### 面试高频考点

面试中 Sidecar 相关问题通常有三个层次。第一层是定义和场景——什么是 Sidecar、有哪些典型用途，这是基础。第二层是实现机制——Sidecar 如何与主容器通信（共享 Network、Volume、IPC）、Istio 如何自动注入（MutatingAdmissionWebhook）、流量如何被劫持（iptables REDIRECT），这是进阶。第三层是生命周期管理和生产实践——Sidecar 的启动顺序问题、优雅退出的协调、K8s 原生 Sidecar 的原理、Sidecar 带来的资源开销和 Pod 密度影响，这是高级。能把三个层次串联起来讲清楚，就是一个让面试官满意的回答。"""

key_points = [
    "Sidecar 模式的核心理念是关注点分离与单一职责——业务容器只关注业务逻辑，基础设施功能（日志、安全、代理）由独立的 Sidecar 容器承载，两者可独立发布和升级",
    "Sidecar 与主容器在同一个 Pod 中共享 Network Namespace（同 IP、localhost 互通）、Volume（读写同一目录）和 IPC Namespace，这是两者协作的基础",
    "日志收集 Sidecar（Fluentd/Filebeat）通过共享 emptyDir Volume 读取主容器写入的日志文件，无需修改业务代码即可实现统一日志采集",
    "Istio 通过 MutatingAdmissionWebhook 自动注入 Envoy Sidecar，istio-init 容器用 iptables 规则劫持流量，实现对业务代码完全透明的 mTLS、熔断和可观测性",
    "Kubernetes 1.28 引入原生 Sidecar Container（KEP-753），通过在 initContainers 中设置 restartPolicy: Always 实现，解决了长期困扰社区的 Sidecar 启动顺序和退出顺序问题",
    "在 1.28 之前，Sidecar 生命周期管理是最大痛点——主容器可能在 Sidecar 就绪前启动，Job 因 Sidecar 不退出而永远不会标记为 Completed",
    "Sidecar、Ambassador、Adapter 三种多容器模式的核心区别在于协作方向：Sidecar 增强扩展、Ambassador 代理外部访问、Adapter 标准化输出格式",
]

quiz = [
    {
        "id": "k8s-pod-sidecar-pattern-q1-quiz1",
        "question": "Sidecar 容器与主容器能够协作的根本原因是什么？",
        "choices": [
            {"id": "A", "text": "Kubernetes 为 Sidecar 容器提供了专用的 API 接口进行容器间通信"},
            {"id": "B", "text": "同一 Pod 中的容器共享 Network Namespace、Volume 和 IPC Namespace"},
            {"id": "C", "text": "Sidecar 容器通过 Service 的 ClusterIP 与主容器建立网络连接"},
            {"id": "D", "text": "Kubernetes 在容器之间自动建立 gRPC 通道进行数据交换"},
        ],
        "correctAnswer": "B",
        "explanation": "Sidecar 模式的技术基础是 Kubernetes Pod 的共享隔离边界。同一个 Pod 中的所有容器共享 Network Namespace（拥有相同 IP，可通过 localhost 互访）、可以挂载相同的 Volume（读写同一目录下的文件）、以及共享 IPC Namespace。A 选项错误，Kubernetes 没有提供专门的 Sidecar 通信 API；C 选项错误，同 Pod 容器不需要通过 Service 通信；D 选项错误，容器间没有自动建立的 gRPC 通道。",
    },
    {
        "id": "k8s-pod-sidecar-pattern-q1-quiz2",
        "question": "Sidecar 模式的核心设计理念是什么？",
        "choices": [
            {"id": "A", "text": "关注点分离与单一职责——业务逻辑和基础设施职责分别由不同容器承载"},
            {"id": "B", "text": "通过多容器提升 Pod 的 CPU 并行处理能力和整体吞吐量"},
            {"id": "C", "text": "利用多个容器实现主备高可用，当主容器故障时 Sidecar 自动接管流量"},
            {"id": "D", "text": "将微服务进一步拆分为更细粒度的 Nano Service 以降低单个容器的复杂度"},
        ],
        "correctAnswer": "A",
        "explanation": "Sidecar 模式的核心设计理念是关注点分离（Separation of Concerns）和单一职责原则（Single Responsibility Principle）。业务容器只关注业务逻辑，日志收集、流量代理、配置管理等横切关注点由独立的 Sidecar 容器处理。B 选项错误，Sidecar 的目的不是提升并行性能；C 选项错误，Sidecar 不是主备模式，它提供的是辅助功能而非冗余；D 选项错误，Sidecar 不是更细粒度的服务拆分，而是功能职责的分离。",
    },
    {
        "id": "k8s-pod-sidecar-pattern-q1-quiz3",
        "question": "Istio 的 Envoy Sidecar 是通过什么机制自动注入到 Pod 中的？",
        "choices": [
            {"id": "A", "text": "kubelet 在创建 Pod 时自动检测 Namespace 标签并注入 Envoy 容器"},
            {"id": "B", "text": "Istio Pilot 组件直接修改 etcd 中的 Pod Spec 添加 Envoy 容器定义"},
            {"id": "C", "text": "API Server 的 MutatingAdmissionWebhook 在 Pod 创建请求通过时自动修改 Pod Spec 注入 Sidecar"},
            {"id": "D", "text": "Istio Operator 通过 DaemonSet 在每个节点上运行 Envoy 并自动关联到对应的 Pod"},
        ],
        "correctAnswer": "C",
        "explanation": "Istio 利用 Kubernetes 的 MutatingAdmissionWebhook 机制实现自动 Sidecar 注入。当给 Namespace 添加 istio-injection=enabled 标签后，所有在该 Namespace 中创建的 Pod 请求会被 API Server 转发到 Istio 的 Webhook 服务，该服务自动在 Pod Spec 中添加 istio-init（Init Container，配置 iptables 规则）和 istio-proxy（Envoy Sidecar）容器。A 选项错误，kubelet 不负责 Sidecar 注入；B 选项错误，没有组件直接修改 etcd；D 选项错误，Envoy 以 Sidecar 而非 DaemonSet 形式运行。",
    },
    {
        "id": "k8s-pod-sidecar-pattern-q1-quiz4",
        "question": "日志收集 Sidecar（如 Fluentd）获取主容器日志的典型方式是什么？",
        "choices": [
            {"id": "A", "text": "通过 Kubernetes API 调用 kubectl logs 命令获取主容器的 stdout 输出"},
            {"id": "B", "text": "通过容器运行时的 CRI 接口直接读取主容器的内存缓冲区"},
            {"id": "C", "text": "通过 TCP 连接到主容器开放的日志端口拉取日志数据"},
            {"id": "D", "text": "通过共享的 emptyDir Volume 读取主容器写入的日志文件"},
        ],
        "correctAnswer": "D",
        "explanation": "日志收集 Sidecar 的标准做法是通过共享 Volume（通常是 emptyDir）与主容器协作。主容器将日志写入 Volume 中的指定目录，Sidecar 容器挂载同一个 Volume 并使用 tail -f 或 Fluentd 的 in_tail 插件持续读取日志文件，然后转发到 Elasticsearch、Loki 等后端存储。A 选项错误，Sidecar 不需要通过 API Server 获取日志；B 选项错误，CRI 接口不用于跨容器日志读取；C 选项错误，日志收集通常不通过网络端口而是通过文件共享。",
    },
    {
        "id": "k8s-pod-sidecar-pattern-q1-quiz5",
        "question": "执行 kubectl get pod myapp -o jsonpath='{.spec.initContainers[0].restartPolicy}' 返回 Always，这说明什么？",
        "choices": [
            {"id": "A", "text": "该 Init Container 已被配置为 Kubernetes 1.28+ 的原生 Sidecar Container，它会在普通容器之前启动并持续运行"},
            {"id": "B", "text": "该 Init Container 配置异常，restartPolicy 不应设置在容器级别而应在 Pod 级别"},
            {"id": "C", "text": "该 Init Container 会在执行失败时无限重启，直到成功执行完毕后退出"},
            {"id": "D", "text": "该 Pod 的所有容器都会采用 Always 重启策略，与容器级别设置无关"},
        ],
        "correctAnswer": "A",
        "explanation": "在 Kubernetes 1.28 及以上版本中，如果 initContainers 中的容器设置了 restartPolicy: Always，它就被视为原生 Sidecar Container（KEP-753）。这种容器会在所有普通 Init Container 完成后启动，在任何普通容器启动之前就绑定就绪，并且在 Pod 生命周期内持续运行，直到所有普通容器退出后才被终止。B 选项错误，这是 1.28 引入的合法容器级别配置；C 选项错误，设置 Always 的目的不是重试直到成功，而是持续运行；D 选项错误，这只影响该特定 Init Container。",
    },
    {
        "id": "k8s-pod-sidecar-pattern-q1-quiz6",
        "question": "在 Kubernetes 1.28 之前，使用 Sidecar 模式运行 Job 时最常遇到的问题是什么？",
        "choices": [
            {"id": "A", "text": "Sidecar 容器会抢占 Job 主容器的 CPU 资源导致任务执行缓慢"},
            {"id": "B", "text": "Job 主容器执行完毕后 Sidecar 仍在运行，导致 Job 永远不会被标记为 Completed"},
            {"id": "C", "text": "Sidecar 容器无法在 Job 类型的 Pod 中运行，Kubernetes 会拒绝创建"},
            {"id": "D", "text": "Job 的 backoffLimit 设置会导致 Sidecar 容器被频繁重启"},
        ],
        "correctAnswer": "B",
        "explanation": "这是 Kubernetes 1.28 之前 Sidecar 模式最臭名昭著的问题之一。在 Job 场景中，主容器（执行任务的容器）完成后退出，但 Sidecar 容器（如 Istio 的 Envoy 代理）仍在运行。Kubernetes 判断 Job 完成的条件是 Pod 中所有容器都退出，所以 Sidecar 不退出就意味着 Job 永远处于 Running 状态。社区不得不用各种 hack 解决，比如 Istio 的 EXIT_ON_ZERO_ACTIVE_CONNECTIONS 环境变量。1.28 的原生 Sidecar 通过保证 Sidecar 在普通容器退出后自动终止，彻底解决了这个问题。",
    },
    {
        "id": "k8s-pod-sidecar-pattern-q1-quiz7",
        "question": "Sidecar 模式、Ambassador 模式和 Adapter 模式的核心区别是什么？",
        "choices": [
            {"id": "A", "text": "三者使用不同的 Kubernetes API 版本和资源类型来定义辅助容器"},
            {"id": "B", "text": "三者的容器资源配额策略不同，Sidecar 优先级最高，Adapter 最低"},
            {"id": "C", "text": "三者在 Kubernetes 中有不同的调度策略，Ambassador 只能运行在特定标签的节点上"},
            {"id": "D", "text": "三者的协作方向不同：Sidecar 增强扩展主容器功能，Ambassador 代理外部访问，Adapter 标准化输出格式"},
        ],
        "correctAnswer": "D",
        "explanation": "这三种多容器 Pod 设计模式在 Kubernetes 资源层面没有任何区别（都是普通容器），它们的区分完全在于辅助容器与主容器的「协作方向」。Sidecar 模式增强或扩展主容器的功能（如日志收集、监控指标暴露）；Ambassador 模式充当主容器与外部系统之间的代理（如 Cloud SQL Proxy 代理数据库连接）；Adapter 模式将主容器的非标准输出转换为统一格式（如 Prometheus Exporter 将私有指标格式转为标准 /metrics 端点）。A、B、C 选项都是编造的，三种模式在 API、调度和资源配额层面完全相同。",
    },
    {
        "id": "k8s-pod-sidecar-pattern-q1-quiz8",
        "question": "在生产环境中使用 Cloud SQL Proxy 作为 Sidecar 的核心价值是什么？",
        "choices": [
            {"id": "A", "text": "Cloud SQL Proxy 可以将 SQL 查询缓存在本地，显著降低数据库的查询延迟"},
            {"id": "B", "text": "Cloud SQL Proxy 会自动将单个数据库连接复用为连接池，减少数据库端的连接数"},
            {"id": "C", "text": "Cloud SQL Proxy 自动处理 IAM 认证和连接加密，应用只需连接 localhost 无需管理凭证和 TLS 证书"},
            {"id": "D", "text": "Cloud SQL Proxy 会自动在多个 Cloud SQL 实例之间做读写分离和负载均衡"},
        ],
        "correctAnswer": "C",
        "explanation": "Cloud SQL Proxy 作为 Sidecar 的核心价值在于将复杂的数据库连接安全问题从应用层完全剥离。它通过 Google IAM 进行身份认证（无需在应用配置中存储数据库密码），自动建立加密隧道（无需管理 SSL/TLS 证书），应用只需要连接 localhost 上的对应端口即可。A 选项错误，Cloud SQL Proxy 不做查询缓存；B 选项错误，连接池管理是应用层的责任，Proxy 只负责安全隧道；D 选项错误，Proxy 不提供读写分离功能，只代理单个实例的连接。",
    },
    {
        "id": "k8s-pod-sidecar-pattern-q1-quiz9",
        "question": "配置热加载 Sidecar 通过 shareProcessNamespace 实现信号通知时，以下哪个描述是正确的？",
        "choices": [
            {"id": "A", "text": "shareProcessNamespace: true 允许 Pod 内所有容器共享 PID Namespace，Sidecar 可通过 kill 命令向主容器进程发送 SIGHUP 信号"},
            {"id": "B", "text": "shareProcessNamespace: true 会让所有容器共享同一个进程，因此 Sidecar 检测到配置变更后主容器会自动感知"},
            {"id": "C", "text": "shareProcessNamespace 只在 Init Container 和普通容器之间生效，普通容器之间无法共享"},
            {"id": "D", "text": "设置 shareProcessNamespace 后，任何容器的进程崩溃都会导致整个 Pod 被终止"},
        ],
        "correctAnswer": "A",
        "explanation": "当 Pod 设置 shareProcessNamespace: true 时，该 Pod 中所有容器共享同一个 PID Namespace，意味着一个容器可以看到其他容器的进程并向它们发送信号。配置热加载 Sidecar 利用这个机制，在检测到 ConfigMap 文件变更后，通过 kill -HUP <pid> 向主容器进程发送 SIGHUP 信号触发配置重载。B 选项错误，容器共享的是 PID Namespace 而非进程本身；C 选项错误，shareProcessNamespace 对 Pod 中所有容器生效；D 选项错误，单个进程崩溃不会导致整个 Pod 终止，只有对应的容器会重启。",
    },
    {
        "id": "k8s-pod-sidecar-pattern-q1-quiz10",
        "question": "线上一个 Pod 的 Fluentd Sidecar 容器状态为 CrashLoopBackOff，但主容器运行正常。以下哪个排查步骤最优先？",
        "choices": [
            {"id": "A", "text": "立即删除 Pod 重新调度，因为 Sidecar 异常会导致主容器也很快崩溃"},
            {"id": "B", "text": "检查主容器日志确认是否有异常，因为 Sidecar 崩溃通常由主容器导致"},
            {"id": "C", "text": "直接升级 Fluentd 镜像到最新版本，因为 CrashLoopBackOff 通常是镜像 bug 导致的"},
            {"id": "D", "text": "使用 kubectl describe pod 检查 Sidecar 容器的 Last State 退出码和事件，再用 kubectl logs -c fluentd-sidecar --previous 查看崩溃前日志"},
        ],
        "correctAnswer": "D",
        "explanation": "排查 Sidecar 容器 CrashLoopBackOff 的正确第一步是收集信息而非盲目操作。kubectl describe pod 可以查看容器的 Last State（退出码、退出原因、OOMKilled 标记）和 Events（拉取镜像失败、资源不足等）。kubectl logs -c fluentd-sidecar --previous 可以查看上一次崩溃前的日志输出，通常能直接定位问题（比如配置文件语法错误、Volume 挂载路径不存在、内存超限被 OOM Kill 等）。A 选项错误，Sidecar 崩溃不会直接导致主容器崩溃；B 选项错误，应该先看 Sidecar 自身的日志；C 选项错误，盲目升级不是排查手段。",
    },
]

references = [
    "https://kubernetes.io/docs/concepts/workloads/pods/sidecar-containers/",
    "https://kubernetes.io/blog/2023/08/25/native-sidecar-containers/",
    "https://istio.io/latest/docs/setup/additional-setup/sidecar-injection/",
    "https://github.com/kubernetes/enhancements/tree/master/keps/sig-node/753-sidecar-containers",
]

pack = {
    "id": "k8s-pod-sidecar-pattern",
    "name": "Sidecar 模式典型场景",
    "domain": "kubernetes",
    "description": "深入剖析 Sidecar 容器设计模式的核心思想、典型场景（日志收集、服务网格、配置热加载）及 K8s 原生支持",
    "version": "1.0.0",
    "questions": [
        {
            "id": "k8s-pod-sidecar-pattern-q1",
            "domain": "kubernetes",
            "type": "open-ended",
            "difficulty": 2,
            "tags": ["kubernetes", "pod", "sidecar", "设计模式"],
            "title": "Sidecar 模式的典型使用场景有哪些？",
            "content": content,
            "answer": answer,
            "keyPoints": key_points,
            "quiz": quiz,
            "references": references,
        }
    ],
}

output_path = "public/question-packs/kubernetes/k8s-pod-sidecar-pattern.json"
os.makedirs(os.path.dirname(output_path), exist_ok=True)
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(pack, f, ensure_ascii=False, indent=2)

# Validate
with open(output_path, "r", encoding="utf-8") as f:
    loaded = json.load(f)

q = loaded["questions"][0]
print(f"Pack ID: {loaded['id']}")
print(f"Domain: {loaded['domain']}")
print(f"Question ID: {q['id']}")
print(f"Type: {q['type']}, Difficulty: {q['difficulty']}")
print(f"Content length: {len(q['content'])} chars")
print(f"Answer length: {len(q['answer'])} chars")
print(f"KeyPoints: {len(q['keyPoints'])}")
print(f"Quiz: {len(q['quiz'])}")
print(f"References: {len(q['references'])}")

from collections import Counter

ans_dist = Counter([qz["correctAnswer"] for qz in q["quiz"]])
print(f"Answer distribution: {dict(ans_dist)}")

# Check forbidden quotes
all_text = q["content"] + q["answer"]
for kp in q["keyPoints"]:
    all_text += kp
for qz in q["quiz"]:
    all_text += qz["question"] + qz["explanation"]
    for c in qz["choices"]:
        all_text += c["text"]
bad = all_text.count("\u201c") + all_text.count("\u201d")
print(f"Forbidden Chinese quotes: {bad}")
print("OK - File written successfully!")
