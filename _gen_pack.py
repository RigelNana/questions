import json

content = (
    "在 Kubernetes 的控制平面中，kube-controller-manager 是一个容易被忽视却极其重要的组件。"
    "很多工程师在日常运维中习惯于盯着 kube-apiserver 的延迟和 etcd 的磁盘 IOPS，"
    "却对 controller-manager 的内部结构知之甚少。事实上，Kubernetes 之所以能够实现"
    "「声明式 API」的核心理念——你只需要告诉集群你想要什么状态，集群自动帮你达成——"
    "背后最关键的执行者就是 kube-controller-manager 中运行的那一组 Controller。\n\n"

    "在 kubeadm 部署的集群中，你可以通过以下命令看到它以 Static Pod 形式运行在 master 节点上：\n\n"
    "```bash\n"
    "kubectl get pods -n kube-system -l component=kube-controller-manager\n\n"
    "NAME                                       READY   STATUS    RESTARTS   AGE\n"
    "kube-controller-manager-master-01          1/1     Running   0          42d\n"
    "```\n\n"

    "在 Kubernetes v1.30 的源码中，`NewControllerInitializers()` 函数注册了超过 30 个 Controller，"
    "它们全部编译进同一个二进制文件、运行在同一个进程中。这种「all-in-one」的设计出于部署简便性的考量"
    "——如果每个 Controller 都作为独立进程部署，运维成本将成倍增长。你也可以通过启动参数 `--controllers` "
    "来控制启用哪些 Controller，默认值为 `*`，即启用全部内置 Controller，也支持 `--controllers=-deployment` "
    "的形式禁用特定 Controller。\n\n"

    "每个 Controller 遵循同一个工作范式：通过 Informer 机制 Watch apiserver 上特定资源的变更事件，"
    "将事件对应的资源 key 压入 workqueue，再由 worker 协程从队列中取出 key 并执行 Reconcile 逻辑，"
    "把集群的「实际状态」向「期望状态」不断靠拢。这就是 Kubernetes 控制循环（Control Loop）的核心思想，"
    "所有内置 Controller 共享这套骨架。\n\n"

    "面试中被问到「kube-controller-manager 中包含哪些常见的 Controller」时，大部分候选人只能说出 "
    "Deployment Controller 和 ReplicaSet Controller，对其他同样重要的 Controller 缺乏认知。"
    "面试官考查这道题的真实意图是：你是否理解 Kubernetes 控制平面各组件的分工协作，"
    "是否清楚「声明式意图 → 实际状态收敛」这个过程到底由谁来执行、怎么执行。"
    "能否展现出对 Controller 控制循环模式的统一理解，以及对不同 Controller 各自职责的清晰认知，"
    "是区分初级和进阶候选人的关键分水岭。"
)

answer = (
    "## kube-controller-manager 的核心概念\n\n"

    "kube-controller-manager 在 Kubernetes 架构中的定位非常明确：它是控制平面中「执行层」的核心守护进程。"
    "官方文档将其定义为「运行一组控制器（Controller）的组件」，每个 Controller 本质上是一个独立的控制循环"
    "（Control Loop），负责通过 apiserver 监听特定资源的状态变化，并执行相应的调谐（Reconcile）逻辑，"
    "将集群的实际状态不断向用户声明的期望状态收敛。换句话说，kube-apiserver 负责接收并存储你的声明式意图"
    "（比如「我要 3 个 nginx Pod」），etcd 负责持久化这些数据，而 controller-manager 则负责让这句话真正变成现实。\n\n"

    "从核心价值来看，Controller 是 Kubernetes 声明式 API 的真正执行者。没有 controller-manager，"
    "你 `kubectl apply` 的所有 YAML 都只是静静躺在 etcd 里的数据，不会有任何进程去创建 Pod、"
    "管理副本数、处理节点故障。controller-manager 适用于所有需要「持续监控 + 自动修复」的场景，"
    "涵盖了工作负载管理、节点生命周期、服务发现、垃圾回收、资源配额等几乎所有集群运维的核心能力。\n\n"

    "在日常运维中，你通过 `kubectl get pods -n kube-system -l component=kube-controller-manager` "
    "来确认它的运行状态。在 kubeadm 集群中它以 Static Pod 运行在每个 master 节点，Pod 的 manifest 文件"
    "通常位于 `/etc/kubernetes/manifests/kube-controller-manager.yaml`。如果你想查看当前实例启用了哪些 "
    "Controller 以及各项参数配置，可以直接查看这个 manifest 或通过 `kubectl describe pod` 查看启动命令：\n\n"

    "```bash\n"
    "kubectl describe pod kube-controller-manager-master-01 -n kube-system | grep -A 30 Command\n"
    "# 你会看到 --controllers=*、--node-monitor-grace-period=40s 等启动参数\n"
    "```\n\n"

    "理解每个 Controller 的工作方式之前，必须先把握它们共同遵循的核心运行范式。每个 Controller 在启动时通过 "
    "SharedInformerFactory 为其关注的资源类型创建 Informer。Informer 通过 List-Watch 机制与 apiserver 建立长连接："
    "首次启动时 List 全量资源建立本地缓存（存储在 Informer 的 Store 中），之后通过 Watch 实时接收增量变更。"
    "当 Informer 收到 Add、Update 或 Delete 事件后，注册的事件处理函数（EventHandler）会将该资源的 key"
    "（格式为 `namespace/name`）压入一个 workqueue（底层是 client-go 提供的 rate-limiting queue）。"
    "Controller 的 worker 协程不断从 workqueue 中取出 key，执行 Reconcile 函数——读取资源的最新状态、"
    "计算与期望状态的差异、调用 apiserver 执行相应的创建/更新/删除操作。如果 Reconcile 失败，key 会被重新入队"
    "（带有指数退避延迟），确保最终一致性。这个「Informer Watch → WorkQueue 入队 → Reconcile Loop」的模式"
    "是所有 Controller 的统一骨架，理解了这一点，后面逐个拆解就水到渠成了。\n\n"

    "## 常见 Controller 逐一拆解\n\n"

    "### 工作负载管理类\n\n"

    "Deployment Controller 是日常使用频率最高的 Controller。当你执行 `kubectl apply -f deployment.yaml` "
    "创建或更新一个 Deployment 时，Deployment Controller 根据 `.spec.strategy` 中定义的策略创建或更新对应的 "
    "ReplicaSet。在 RollingUpdate 策略下，它通过 `maxSurge` 和 `maxUnavailable` 两个参数精确控制滚动更新的"
    "节奏——比如默认值 25% 意味着更新过程中最多允许多出 25% 的 Pod、最多允许 25% 的 Pod 不可用。"
    "`kubectl rollout undo` 的版本回滚能力也依赖于 Deployment Controller 对历史 ReplicaSet 的保留"
    "（由 `.spec.revisionHistoryLimit` 控制，默认 10）。一个关键的设计细节是：Deployment Controller "
    "并不直接管理 Pod，它只管理 ReplicaSet。\n\n"

    "ReplicaSet Controller 承接 Deployment Controller 的输出，负责确保当前运行的 Pod 副本数与 "
    "ReplicaSet 的 `.spec.replicas` 一致。副本不足时创建新 Pod，超出时按一定策略选择并删除 Pod。"
    "Deployment → ReplicaSet → Pod 形成了一条经典的「级联控制链」，每一层只关心自己直接管理的下一层资源。\n\n"

    "StatefulSet Controller 在工作模式上与 ReplicaSet Controller 相似，但额外保证了 Pod 的有序部署"
    "（从 index 0 开始逐个创建，前一个 Ready 后才创建下一个）、有序删除（从最大 index 开始逆序删除）"
    "以及稳定的网络标识（每个 Pod 拥有固定的 DNS 名 `pod-name.headless-svc`）。"
    "DaemonSet Controller 则确保每个符合条件的节点上运行恰好一个 Pod 副本，"
    "常用于日志采集（Fluentd、Filebeat）、监控（node-exporter）、网络插件（kube-proxy、Calico agent）等"
    "需要「每节点一个」的场景，新节点加入集群时 DaemonSet Controller 会自动在该节点上调度对应的 Pod。\n\n"

    "Job Controller 和 CronJob Controller 处理批处理任务。Job Controller 确保指定数量的 Pod 成功完成"
    "（`.spec.completions`），并支持通过 `.spec.parallelism` 控制并行度。"
    "CronJob Controller 按照 Cron 表达式定时创建 Job 对象，在 v1.21 之后 CronJob 升级到 v1 稳定版，"
    "CronJob Controller v2 引入了更可靠的时间窗口调度机制，配合 `.spec.startingDeadlineSeconds` "
    "解决了旧版在 controller-manager 短暂宕机后可能漏调度的问题。\n\n"

    "### 集群基础设施类\n\n"

    "Node Controller（在源码中称为 NodeLifecycleController）负责监控节点的健康状态，是集群稳定性的关键守护者。"
    "当某个节点上的 kubelet 停止上报心跳超过 `--node-monitor-grace-period`（默认 40 秒）后，"
    "Node Controller 会将该节点的 `.status.conditions` 中 Ready 条件标记为 `Unknown`——"
    "注意这里是 Unknown 而不是 NotReady，这是一个面试中常被纠正的细节。"
    "如果节点持续处于异常状态，Node Controller 会为其添加 `node.kubernetes.io/unreachable` 污点，"
    "随后基于污点的驱逐机制（Taint-based Eviction）会在 Pod 的容忍时间"
    "（默认 tolerationSeconds=300，即 5 分钟）到期后开始驱逐该节点上的 Pod。"
    "在大规模集群中，驱逐速率由 `--node-eviction-rate`（默认 0.1，即每 10 秒处理一个节点的 Pod 驱逐）控制，"
    "并且当不健康节点比例超过 `--unhealthy-zone-threshold`（默认 0.55）时会自动降速为 "
    "`--secondary-node-eviction-rate`（默认 0.01），避免网络分区等场景下雪崩式驱逐导致整个可用区的 Pod 被错误清空。\n\n"

    "ServiceAccount Controller 的职责简洁但不可或缺：它为每个新创建的 Namespace 自动创建一个名为 `default` "
    "的 ServiceAccount。如果你曾经好奇过为什么新建一个 Namespace 后里面就已经有了一个 default SA，"
    "答案就是这个 Controller 在背后默默工作。Namespace Controller 则负责在 Namespace 被标记为删除后清理其下的"
    "所有资源——它会遍历该 Namespace 中注册的全部 API 资源类型并逐一删除，只有当所有资源和 Finalizer 都被清理完毕后，"
    "Namespace 才会从 etcd 中被真正移除。这也是为什么删除 Namespace 有时会卡在 `Terminating` 状态的根本原因："
    "某些资源（比如自定义资源）的 Finalizer 没有被正确清理，Namespace Controller 一直在等待。\n\n"

    "### 服务发现与网络类\n\n"

    "Endpoint Controller 是 Service 路由能力的基石。它根据 Service 的 `.spec.selector` 找到所有匹配的就绪 Pod，"
    "将这些 Pod 的 IP 和端口汇总写入对应的 Endpoints 对象，供 kube-proxy 或 CNI 插件消费以实现流量转发。"
    "EndpointSlice Controller（v1.21+ 默认启用）是 Endpoint Controller 的演进版本，"
    "它将一个可能非常庞大的 Endpoints 对象拆分为多个 EndpointSlice（每个默认最多包含 100 个端点），"
    "显著降低了 etcd 存储压力和 apiserver 的写放大。在拥有数千个 Pod 的 Service 场景下，"
    "单个 Endpoints 对象可能达到几 MB，每次 Pod 变更都需要全量更新这个大对象，"
    "而 EndpointSlice 只需增量更新受影响的切片，这在大规模集群中是一个质的飞跃。\n\n"

    "### 其他重要 Controller\n\n"

    "GarbageCollector Controller 通过 `ownerReferences` 字段实现级联删除机制——当你删除一个 Deployment 时，"
    "它关联的 ReplicaSet 和 Pod 会被自动级联删除，无需手动清理。"
    "ResourceQuota Controller 持续追踪 Namespace 中资源配额的使用情况，"
    "当某个 Namespace 的资源用量超过配额时拒绝新的资源创建请求。"
    "TTL Controller 在 Job 完成后根据 `.spec.ttlSecondsAfterFinished` 配置自动清理已完成的 Pod 和 Job 对象，"
    "避免大量已完成 Job 堆积消耗 etcd 存储。"
    "HPA Controller（HorizontalPodAutoscaler Controller）默认每 15 秒"
    "（由 `--horizontal-pod-autoscaler-sync-period` 控制）从 Metrics Server 采集 CPU、内存或自定义指标，"
    "根据目标利用率自动调整工作负载的副本数。"
    "PersistentVolume Controller 负责 PV 和 PVC 的自动绑定——"
    "当一个处于 Pending 状态的 PVC 的 `.spec`（storageClassName、accessModes、storage 容量）"
    "与某个 Available 状态的 PV 匹配时，将它们绑定在一起。\n\n"

    "## 扩展知识\n\n"

    "### Leader Election 机制\n\n"

    "在高可用部署中，通常运行多个 controller-manager 副本（典型配置是 3 个，与 master 节点数一致），"
    "但同一时刻只有一个实例在真正执行 Controller 逻辑，其他副本处于热备状态。"
    "Leader Election 通过在 kube-system 命名空间下创建一个 Lease 对象来实现分布式锁，"
    "默认的 `--leader-elect-lease-duration` 是 15 秒，`--leader-elect-renew-deadline` 是 10 秒，"
    "`--leader-elect-retry-period` 是 2 秒。你可以通过以下命令查看当前 leader 信息：\n\n"

    "```bash\n"
    "kubectl get lease -n kube-system kube-controller-manager -o jsonpath='{.spec.holderIdentity}'\n"
    "# 输出类似：master-01_xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx\n"
    "```\n\n"

    "当 leader 进程崩溃后，其他副本会在 lease 过期后竞选成为新的 leader，"
    "这个切换过程通常在 15-25 秒内完成。在此期间所有 Controller 暂停工作，"
    "但由于 Kubernetes 的最终一致性设计，短暂的 leader 空窗期不会导致集群状态不可恢复。\n\n"

    "### 坑点：Controller Manager 重启的影响\n\n"

    "controller-manager 重启时，所有 Informer 的本地缓存会被清空并重新 List 全量资源数据。"
    "在大规模集群（5000+ 节点、10 万+ Pod）中，这个重新同步过程会导致 apiserver 在短时间内收到大量 "
    "List 请求，带来明显的延迟抖动和内存峰值。重启期间所有 Controller 停止 Reconcile，"
    "这意味着 Node 故障不会被及时检测、Pod 副本数异常不会被自动修复、CronJob 不会按时调度。"
    "好消息是 workqueue 的重入机制保证了重启后所有 Informer 缓存重建完毕的那一刻，"
    "所有资源状态会被重新检查和同步，不会造成最终状态的不一致——"
    "但这个「重启 → 缓存重建 → 重新同步」的过程在大集群中可能需要几十秒甚至几分钟，"
    "这段时间就是集群的「自愈盲区」。\n\n"

    "### 面试考点\n\n"

    "面试官考查这道题时，真正想了解的不仅是你能列出多少个 Controller 的名字，"
    "更重要的是你是否理解「Informer → WorkQueue → Reconcile」这个控制循环范式。"
    "高分回答应该做到三点：第一，能清晰说出至少 8-10 个常见 Controller 的名字和核心职责，"
    "并按类别组织（工作负载类、基础设施类、服务发现类、辅助类）；"
    "第二，能以具体的 Controller 为例说明 Reconcile 逻辑的具体内容，"
    "比如 Deployment Controller 如何管理 ReplicaSet 的创建和滚动更新、"
    "Node Controller 如何处理节点心跳超时和 Pod 驱逐；"
    "第三，能提到 Leader Election 机制和 controller-manager 重启影响等运维层面的知识，"
    "展现出你不仅了解理论设计，还具备生产环境的实际运维经验。"
)

key_points = [
    "kube-controller-manager 将 30+ 个 Controller 编译进同一个二进制文件并运行在同一个进程中，通过 --controllers 参数可控制启用或禁用特定 Controller",
    "每个 Controller 遵循统一的控制循环范式：Informer 通过 List-Watch 监听资源变更 → 事件 key 入队 workqueue → Worker 协程执行 Reconcile 将实际状态向期望状态收敛",
    "Deployment Controller 管理 ReplicaSet，ReplicaSet Controller 管理 Pod，形成 Deployment → ReplicaSet → Pod 的级联控制链，每层只关心直接下一层",
    "Node Controller 负责节点健康检测与 Pod 驱逐，心跳超时 40 秒标记 Ready=Unknown，持续异常后添加 unreachable 污点触发驱逐，大规模集群中驱逐速率可自动降级",
    "EndpointSlice Controller 是 Endpoint Controller 的演进版本，将单个 Endpoints 拆分为多个 EndpointSlice，解决大规模集群中 Endpoints 对象过大导致的 etcd 和 apiserver 性能瓶颈",
    "ServiceAccount Controller 自动为每个新建 Namespace 创建 default ServiceAccount，Namespace Controller 在 Namespace 删除时负责清理其下所有资源和 Finalizer",
    "高可用部署下 controller-manager 通过 Lease 对象实现 Leader Election，同一时刻仅一个实例执行 Controller 逻辑，leader 故障后通常 15-25 秒完成切换",
    "controller-manager 重启会导致 Informer 缓存清空并重新 List 全量数据，大规模集群中可能对 apiserver 造成延迟抖动，但 workqueue 重入机制保证最终状态一致",
]

quiz = [
    {
        "id": "k8s-arch-controller-manager-controllers-q1-quiz1",
        "question": "kube-controller-manager 中的所有内置 Controller 默认运行在几个进程中？",
        "choices": [
            {"id": "A", "text": "一个进程，所有 Controller 编译在同一个二进制文件中"},
            {"id": "B", "text": "每个 Controller 运行在各自独立的进程中"},
            {"id": "C", "text": "按功能类别分组，分为工作负载、基础设施、网络 3 个进程"},
            {"id": "D", "text": "取决于集群规模，可通过参数配置动态调整进程数"},
        ],
        "correctAnswer": "A",
        "explanation": "kube-controller-manager 将所有内置 Controller 编译进同一个二进制文件，运行在同一个进程中。这种「all-in-one」的设计是出于部署简便性的考量。B 选项描述的是一种理论上的微服务化部署方式，但 Kubernetes 并未采用；C 和 D 选项都是凭空捏造的机制，controller-manager 的进程模型是固定的单进程设计，不存在按类别分组或动态调整的能力。",
    },
    {
        "id": "k8s-arch-controller-manager-controllers-q1-quiz2",
        "question": "每个 Controller 的核心控制循环范式是什么？",
        "choices": [
            {"id": "A", "text": "Poll apiserver → Compare State → Update Resource"},
            {"id": "B", "text": "Informer Watch → WorkQueue 入队 → Reconcile Loop"},
            {"id": "C", "text": "Cron 定时轮询 → Diff 计算 → Patch 更新"},
            {"id": "D", "text": "Event Stream → Filter Chain → Apply Action"},
        ],
        "correctAnswer": "B",
        "explanation": "Kubernetes Controller 的标准范式是 Informer 通过 List-Watch 机制监听资源变更，将变更事件的资源 key 压入 workqueue，再由 worker 协程从队列中取出 key 执行 Reconcile 逻辑。A 选项的「Poll」是轮询模式，效率远低于 Watch 的事件驱动模式；C 选项的「Cron 定时轮询」完全不是 Controller 的工作方式——CronJob Controller 本身是定时创建 Job，但它自身的控制循环仍然是事件驱动的；D 选项描述的更像消息流处理系统，而非 Kubernetes Controller 模式。",
    },
    {
        "id": "k8s-arch-controller-manager-controllers-q1-quiz3",
        "question": "Deployment Controller 直接管理的下游资源是什么？",
        "choices": [
            {"id": "A", "text": "Pod，Deployment Controller 直接创建和管理 Pod 的生命周期"},
            {"id": "B", "text": "ReplicaSet，Deployment Controller 通过管理 ReplicaSet 间接控制 Pod"},
            {"id": "C", "text": "Service，Deployment Controller 同时管理工作负载和服务发现"},
            {"id": "D", "text": "Endpoint，Deployment Controller 管理 Pod 并同步更新 Endpoint"},
        ],
        "correctAnswer": "B",
        "explanation": "Deployment Controller 只负责管理 ReplicaSet，并不直接操作 Pod。这是一个「级联控制」的设计模式：Deployment Controller 根据更新策略创建或调整 ReplicaSet，ReplicaSet Controller 再确保 Pod 副本数与 ReplicaSet 的 .spec.replicas 一致。A 是最常见的误解，很多人以为 Deployment 直接管理 Pod，实际上中间隔了一层 ReplicaSet。C 和 D 完全混淆了不同 Controller 的职责——Service 和 Endpoint 由 Endpoint Controller 管理。",
    },
    {
        "id": "k8s-arch-controller-manager-controllers-q1-quiz4",
        "question": "Node Controller 在 kubelet 停止上报心跳后，默认多久将节点的 Ready 条件标记为异常状态？",
        "choices": [
            {"id": "A", "text": "10 秒，由 --node-monitor-period 控制"},
            {"id": "B", "text": "40 秒，由 --node-monitor-grace-period 控制"},
            {"id": "C", "text": "60 秒，由 --node-status-update-frequency 控制"},
            {"id": "D", "text": "5 分钟，由 --pod-eviction-timeout 控制"},
        ],
        "correctAnswer": "B",
        "explanation": "Node Controller 通过 --node-monitor-grace-period 参数控制心跳超时的宽限期，默认值为 40 秒。超过这个时间后节点的 Ready 条件会被标记为 Unknown。A 选项的 --node-monitor-period 控制的是 Node Controller 检查节点状态的频率（默认 5 秒），而非宽限期；C 选项的 --node-status-update-frequency 是 kubelet 端上报心跳的频率（默认 10 秒），不是 controller-manager 的参数；D 选项的 5 分钟是 Pod 被驱逐前的容忍时间，而非节点标记异常的时间。",
    },
    {
        "id": "k8s-arch-controller-manager-controllers-q1-quiz5",
        "question": "执行 `kubectl get lease -n kube-system kube-controller-manager` 命令可以获取什么信息？",
        "choices": [
            {"id": "A", "text": "controller-manager 管理的所有 Controller 列表及其运行状态"},
            {"id": "B", "text": "controller-manager 进程的 CPU 和内存资源使用量"},
            {"id": "C", "text": "当前 controller-manager 的 Leader Election 信息，包括哪个实例是 leader"},
            {"id": "D", "text": "controller-manager 的健康检查端点状态和最近的错误日志"},
        ],
        "correctAnswer": "C",
        "explanation": "kube-controller-manager 使用 kube-system 命名空间下名为 kube-controller-manager 的 Lease 对象来实现 Leader Election。这个 Lease 对象的 spec.holderIdentity 字段记录了当前 leader 的标识信息，spec.leaseDurationSeconds 记录了锁的持有时长，spec.renewTime 记录了最后一次续约时间。A 选项混淆了 Lease 对象的用途，Controller 列表无法通过 Lease 获取；B 和 D 选项描述的信息分别通过 metrics 端点和 healthz 端点获取，与 Lease 对象无关。",
    },
    {
        "id": "k8s-arch-controller-manager-controllers-q1-quiz6",
        "question": "删除 Namespace 后一直卡在 Terminating 状态不消失，最可能的原因是什么？",
        "choices": [
            {"id": "A", "text": "kube-apiserver 负载过高，无法处理删除请求"},
            {"id": "B", "text": "该 Namespace 下某些资源的 Finalizer 没有被正确清理，Namespace Controller 在等待"},
            {"id": "C", "text": "controller-manager 进程已崩溃，没有 Controller 执行清理操作"},
            {"id": "D", "text": "etcd 磁盘空间不足，无法执行删除操作"},
        ],
        "correctAnswer": "B",
        "explanation": "Namespace Controller 在删除 Namespace 时会遍历其下所有 API 资源类型并逐一清理，只有当所有资源和 Finalizer 都被处理完毕后 Namespace 才会被真正删除。如果某个资源（比如自定义资源或带有 Finalizer 的 PVC）的 Finalizer 没有被对应的控制器正确移除，Namespace Controller 会一直等待，导致卡在 Terminating 状态。这是生产环境中最常见的 Namespace 删除问题。A、C、D 虽然理论上也会影响删除操作，但它们会导致更广泛的集群问题，不会仅表现为单个 Namespace 卡住。",
    },
    {
        "id": "k8s-arch-controller-manager-controllers-q1-quiz7",
        "question": "EndpointSlice Controller 相比 Endpoint Controller 主要解决了什么问题？",
        "choices": [
            {"id": "A", "text": "支持 IPv6 双栈网络和更丰富的端点拓扑信息"},
            {"id": "B", "text": "大规模集群中单个 Endpoints 对象过大导致的 etcd 写入和 apiserver 性能瓶颈"},
            {"id": "C", "text": "实现了跨集群的服务发现和多集群负载均衡能力"},
            {"id": "D", "text": "优化了 Service 的负载均衡算法，支持加权轮询和最少连接"},
        ],
        "correctAnswer": "B",
        "explanation": "EndpointSlice 的核心设计动机是解决大规模集群中 Endpoints 对象的性能瓶颈。当一个 Service 背后有数千个 Pod 时，单个 Endpoints 对象可能达到几 MB，每次 Pod 变更都需要全量更新这个大对象，给 etcd 和 apiserver 带来巨大的写放大压力。EndpointSlice 将其拆分为多个小对象（每个默认最多 100 个端点），只需增量更新受影响的切片。A 选项虽然 EndpointSlice 确实改善了拓扑感知能力，但这不是核心解决的问题；C 是 Multi-Cluster Service API 的范畴；D 是 kube-proxy 或 Service Mesh 层面的能力，与 EndpointSlice 无关。",
    },
    {
        "id": "k8s-arch-controller-manager-controllers-q1-quiz8",
        "question": "在一个 5000 节点的大规模集群中，controller-manager 发生重启后需要重点关注什么风险？",
        "choices": [
            {"id": "A", "text": "所有已运行的 Pod 会被重新调度到其他节点"},
            {"id": "B", "text": "etcd 中的数据可能因 controller-manager 重启而丢失"},
            {"id": "C", "text": "Informer 重新 List 全量数据可能对 apiserver 造成显著的延迟抖动和内存压力"},
            {"id": "D", "text": "所有 Service 的网络路由会立即中断，直到 controller-manager 恢复"},
        ],
        "correctAnswer": "C",
        "explanation": "controller-manager 重启后所有 Informer 的本地缓存会被清空，需要重新向 apiserver 发送 List 请求获取全量资源数据来重建缓存。在 5000+ 节点的大规模集群中，全量 List 所有 Pod、Node、Service 等资源的数据量是巨大的，会导致 apiserver 在短时间内承受很高的请求压力，可能引起延迟抖动。A 完全错误，controller-manager 重启不会导致已运行的 Pod 被重新调度；B 也不对，etcd 数据持久化与 controller-manager 完全独立；D 夸大了影响，已有的 iptables/ipvs 规则不会因为 controller-manager 重启而消失。",
    },
    {
        "id": "k8s-arch-controller-manager-controllers-q1-quiz9",
        "question": "在高可用部署中，controller-manager 的 leader 进程崩溃后，新 leader 选举大约需要多长时间完成？",
        "choices": [
            {"id": "A", "text": "1-2 秒，Raft 共识算法可以快速完成选举"},
            {"id": "B", "text": "15-25 秒，需要等待 Lease 过期后其他副本才能竞选"},
            {"id": "C", "text": "1-2 分钟，需要等待所有副本达成共识"},
            {"id": "D", "text": "5 分钟，与 Pod 驱逐超时时间一致"},
        ],
        "correctAnswer": "B",
        "explanation": "controller-manager 的 Leader Election 通过 Lease 对象实现，默认 lease duration 为 15 秒。当 leader 崩溃后不再续约，其他副本需要等待 Lease 过期（最长 15 秒）后才能开始竞选，加上竞选过程中的 retry 周期（默认 2 秒），整个切换通常在 15-25 秒内完成。A 选项混淆了 Lease-based 选举和 Raft 共识——controller-manager 不使用 Raft，它通过 apiserver 之上的 Lease 机制实现选举；C 和 D 的时间估计都远超实际值。",
    },
    {
        "id": "k8s-arch-controller-manager-controllers-q1-quiz10",
        "question": "在高可用集群中发现 Deployment 的副本数异常（期望 3 但只有 1 个 Pod 在运行），且长时间未自动恢复，以下哪个排查方向应最优先？",
        "choices": [
            {"id": "A", "text": "检查 kube-proxy 是否正常运行，可能是网络路由异常"},
            {"id": "B", "text": "检查 controller-manager 是否有 leader、leader 是否正常执行 Reconcile 逻辑"},
            {"id": "C", "text": "检查目标节点的 kubelet 日志，可能是节点资源不足"},
            {"id": "D", "text": "直接重启所有 master 节点来恢复控制平面"},
        ],
        "correctAnswer": "B",
        "explanation": "Deployment 副本数异常且长时间未自动恢复，最直接的嫌疑对象是负责维护副本数的 Deployment Controller 和 ReplicaSet Controller，而它们都运行在 controller-manager 中。首先应该确认 controller-manager 是否有一个正常工作的 leader：检查 Lease 对象的 holderIdentity 和 renewTime，确认 leader 是否在持续续约；再查看 controller-manager 的日志确认是否有 Reconcile 错误。A 方向错误，kube-proxy 负责 Service 流量转发与副本数管理无关；C 的排查对象不对，kubelet 只负责 Pod 的实际创建和运行；D 是最不应该优先尝试的暴力手段。",
    },
]

pack = {
    "id": "k8s-arch-controller-manager-controllers",
    "name": "kube-controller-manager 内置 Controller",
    "domain": "kubernetes",
    "description": "了解 kube-controller-manager 中包含的常见 Controller 及其职责",
    "version": "1.0.0",
    "questions": [
        {
            "id": "k8s-arch-controller-manager-controllers-q1",
            "domain": "kubernetes",
            "type": "trivia",
            "difficulty": 2,
            "tags": ["controller-manager", "controller", "reconcile", "k8s-arch"],
            "title": "kube-controller-manager 中包含哪些常见的 Controller？",
            "content": content,
            "answer": answer,
            "keyPoints": key_points,
            "quiz": quiz,
            "references": [
                "https://kubernetes.io/docs/concepts/overview/components/#kube-controller-manager",
                "https://kubernetes.io/docs/reference/command-line-tools-reference/kube-controller-manager/",
                "https://kubernetes.io/docs/concepts/architecture/controller/",
            ],
        }
    ],
}

output_path = r"C:\Users\RigelShrimp\questions\public\question-packs\kubernetes\k8s-arch-controller-manager-controllers.json"
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(pack, f, ensure_ascii=False, indent=2)

print(f"Written to {output_path}")
print(f"Content length: {len(content)} chars")
print(f"Answer length: {len(answer)} chars")
print(f"Key points: {len(key_points)}")
print(f"Quiz questions: {len(quiz)}")
