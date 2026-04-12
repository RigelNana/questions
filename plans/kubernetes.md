# Kubernetes 面试题子计划

> 领域: kubernetes | 目标: ~200 题 | 状态: 规划中
>
> 类型分布: concept ~25, principle ~25, comparison ~18, trivia ~18, env-config ~15, modification ~12, purpose ~15, open-ended ~15, debugging ~15, real-data ~10, requirement ~10, tuning ~10, practice ~7, project ~5
>
> 难度分布: ⭐1 ~50 | ⭐2 ~70 | ⭐3 ~55 | ⭐4 ~25
>
> 已有题目目录: `public/question-packs/kubernetes/` (当前为空)

---

## 1. K8s架构 (15 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 1 | Kubernetes 集群的整体架构由哪些核心组件组成？ | concept | 1 | — | 🔲 |
| 2 | Master 节点和 Worker 节点各自运行哪些组件？ | concept | 1 | — | 🔲 |
| 3 | API Server 在 Kubernetes 架构中承担什么角色？ | purpose | 1 | — | 🔲 |
| 4 | etcd 在集群中存储了哪些数据？为什么选择 etcd？ | principle | 2 | — | 🔲 |
| 5 | kube-scheduler 的调度流程分为哪两个阶段？ | concept | 2 | — | 🔲 |
| 6 | kube-controller-manager 中包含哪些常见的 Controller？ | trivia | 2 | — | 🔲 |
| 7 | kubelet 与 Container Runtime 之间通过什么接口通信？ | concept | 2 | — | 🔲 |
| 8 | kube-proxy 的三种代理模式（userspace / iptables / IPVS）有什么区别？ | comparison | 3 | — | 🔲 |
| 9 | 一个 Pod 从创建到运行，请求在各组件间是如何流转的？ | principle | 3 | — | 🔲 |
| 10 | Kubernetes 的声明式 API 与命令式 API 有什么区别？ | comparison | 2 | — | 🔲 |
| 11 | 如何实现 API Server 的高可用部署？ | env-config | 3 | — | 🔲 |
| 12 | cloud-controller-manager 的作用是什么？它与 kube-controller-manager 有何不同？ | comparison | 3 | — | 🔲 |
| 13 | Kubernetes 各组件之间的认证机制是怎样的？ | principle | 3 | — | 🔲 |
| 14 | 什么是 Admission Controller？常见的 Admission Controller 有哪些？ | concept | 3 | — | 🔲 |
| 15 | 设计一个生产级高可用 Kubernetes 集群架构方案 | project | 4 | — | 🔲 |

---

## 2. Pod基础 (13 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 16 | Pod 是什么？为什么 Kubernetes 不直接管理容器？ | concept | 1 | — | 🔲 |
| 17 | Pod 的生命周期（Lifecycle）有哪些阶段？ | concept | 1 | — | 🔲 |
| 18 | Pod 中的 restartPolicy 有哪几种取值？各自含义是什么？ | trivia | 1 | — | 🔲 |
| 19 | Init Container 的作用及执行顺序是怎样的？ | concept | 2 | — | 🔲 |
| 20 | Sidecar 模式的典型使用场景有哪些？ | open-ended | 2 | — | 🔲 |
| 21 | 多容器 Pod 的常见设计模式（Sidecar / Ambassador / Adapter）有什么区别？ | comparison | 2 | — | 🔲 |
| 22 | Pod 中多个容器如何共享网络和存储？ | principle | 2 | — | 🔲 |
| 23 | 什么是 Static Pod？它和普通 Pod 有什么区别？ | comparison | 2 | — | 🔲 |
| 24 | Pod 的 status.phase 和 status.conditions 分别表示什么？ | trivia | 2 | — | 🔲 |
| 25 | 如何使用 postStart 和 preStop 生命周期钩子？ | env-config | 2 | — | 🔲 |
| 26 | Ephemeral Container 的用途和限制是什么？ | concept | 3 | — | 🔲 |
| 27 | 如何在 Pod 中实现优雅停机（Graceful Shutdown）？ | practice | 3 | — | 🔲 |
| 28 | Pod 的 Overhead 字段代表什么？在什么场景下会用到？ | trivia | 3 | — | 🔲 |

---

## 3. Pod调度 (12 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 29 | nodeSelector 的作用和使用方式是什么？ | concept | 1 | — | 🔲 |
| 30 | Node Affinity 与 nodeSelector 有什么区别？ | comparison | 2 | — | 🔲 |
| 31 | requiredDuringSchedulingIgnoredDuringExecution 和 preferredDuringSchedulingIgnoredDuringExecution 的区别？ | comparison | 2 | — | 🔲 |
| 32 | Pod Affinity 和 Pod Anti-Affinity 分别解决什么问题？ | purpose | 2 | — | 🔲 |
| 33 | Taints 和 Tolerations 的工作原理是什么？ | principle | 2 | — | 🔲 |
| 34 | Taint 的三种 effect（NoSchedule / PreferNoSchedule / NoExecute）有何不同？ | comparison | 2 | — | 🔲 |
| 35 | 如何将 Pod 调度到指定节点？有哪些方法？ | open-ended | 1 | — | 🔲 |
| 36 | PriorityClass 如何影响 Pod 调度和抢占（Preemption）？ | principle | 3 | — | 🔲 |
| 37 | topologySpreadConstraints 的作用和配置方式是什么？ | env-config | 3 | — | 🔲 |
| 38 | 如何配置 Pod 让它只运行在带 GPU 的节点上？ | env-config | 2 | — | 🔲 |
| 39 | 调度器扩展点（Scheduling Framework）有哪些插件阶段？ | principle | 4 | — | 🔲 |
| 40 | 实现一个自定义调度器（custom scheduler）的思路是什么？ | project | 4 | — | 🔲 |

---

## 4. 工作负载控制器 (13 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 41 | Deployment 的作用是什么？它如何管理 ReplicaSet？ | concept | 1 | — | 🔲 |
| 42 | Deployment 的 Rolling Update 策略中 maxSurge 和 maxUnavailable 分别是什么？ | concept | 2 | — | 🔲 |
| 43 | 如何回滚一个 Deployment 到之前的版本？ | modification | 1 | — | 🔲 |
| 44 | StatefulSet 和 Deployment 有什么区别？适用场景分别是什么？ | comparison | 2 | — | 🔲 |
| 45 | StatefulSet 中 Pod 的命名规则和启动 / 终止顺序是怎样的？ | principle | 2 | — | 🔲 |
| 46 | DaemonSet 的用途是什么？有哪些典型应用？ | purpose | 1 | — | 🔲 |
| 47 | DaemonSet 如何保证每个节点只运行一个 Pod？ | principle | 2 | — | 🔲 |
| 48 | Job 的 completions、parallelism 和 backoffLimit 参数各有什么作用？ | trivia | 2 | — | 🔲 |
| 49 | CronJob 的 concurrencyPolicy 有哪些选项？分别代表什么？ | trivia | 2 | — | 🔲 |
| 50 | ReplicaSet 和 ReplicationController 有什么区别？ | comparison | 1 | — | 🔲 |
| 51 | Deployment 的 revisionHistoryLimit 有什么作用？ | trivia | 1 | — | 🔲 |
| 52 | 如何让 StatefulSet 的 Pod 实现并行启动？ | modification | 3 | — | 🔲 |
| 53 | 设计一个基于 Job 的批处理任务流水线 | practice | 3 | — | 🔲 |

---

## 5. Service与网络 (12 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 54 | Kubernetes Service 的作用是什么？ | concept | 1 | — | 🔲 |
| 55 | ClusterIP、NodePort、LoadBalancer 三种 Service 类型有什么区别？ | comparison | 1 | — | 🔲 |
| 56 | ExternalName 类型的 Service 如何工作？ | concept | 2 | — | 🔲 |
| 57 | Headless Service 是什么？什么场景下需要使用？ | purpose | 2 | — | 🔲 |
| 58 | Service 的 selector 是如何匹配后端 Pod 的？ | principle | 1 | — | 🔲 |
| 59 | Endpoints 和 EndpointSlice 有什么区别？ | comparison | 3 | — | 🔲 |
| 60 | Service 的 sessionAffinity 配置有什么作用？ | purpose | 2 | — | 🔲 |
| 61 | Kubernetes 中的 DNS 解析规则是怎样的？如何通过 DNS 访问 Service？ | principle | 2 | — | 🔲 |
| 62 | 什么是 ExternalTrafficPolicy？Local 和 Cluster 模式有什么区别？ | comparison | 3 | — | 🔲 |
| 63 | 如何将 Kubernetes Service 暴露给集群外部访问？ | open-ended | 1 | — | 🔲 |
| 64 | 如何创建一个不带 selector 的 Service 并手动管理 Endpoints？ | env-config | 3 | — | 🔲 |
| 65 | NodePort 的端口范围默认是多少？如何修改？ | trivia | 2 | — | 🔲 |

---

## 6. Ingress (8 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 66 | Ingress 资源的作用是什么？它与 Service 有什么关系？ | concept | 1 | — | 🔲 |
| 67 | Ingress Controller 是什么？为什么需要单独部署？ | purpose | 2 | — | 🔲 |
| 68 | 如何配置 Ingress 实现基于路径（path）的路由？ | env-config | 2 | — | 🔲 |
| 69 | 如何配置 Ingress 实现基于域名（host）的路由？ | env-config | 2 | — | 🔲 |
| 70 | Ingress 中如何配置 TLS 终止（TLS Termination）？ | env-config | 2 | — | 🔲 |
| 71 | Nginx Ingress Controller 常用的 annotation 有哪些？ | trivia | 2 | — | 🔲 |
| 72 | Ingress 和 Gateway API 有什么区别？Gateway API 有哪些优势？ | comparison | 3 | — | 🔲 |
| 73 | 如何在 Ingress 中配置限流（Rate Limiting）和重定向？ | modification | 3 | — | 🔲 |

---

## 7. 网络模型 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 74 | Kubernetes 网络模型的三条基本要求是什么？ | principle | 1 | — | 🔲 |
| 75 | 什么是 CNI（Container Network Interface）？它的作用是什么？ | concept | 2 | — | 🔲 |
| 76 | Flannel 和 Calico 两种 CNI 插件有什么区别？ | comparison | 2 | — | 🔲 |
| 77 | Pod-to-Pod 的通信在同节点和跨节点时分别是如何实现的？ | principle | 3 | — | 🔲 |
| 78 | NetworkPolicy 的作用是什么？如何配置一个只允许特定 namespace 访问的规则？ | env-config | 3 | — | 🔲 |
| 79 | NetworkPolicy 的 ingress 和 egress 规则分别控制什么方向的流量？ | concept | 2 | — | 🔲 |
| 80 | 为什么有些 CNI 插件不支持 NetworkPolicy？ | principle | 3 | — | 🔲 |
| 81 | 什么是 Pod CIDR 和 Service CIDR？它们如何配置？ | concept | 2 | — | 🔲 |
| 82 | Kubernetes 中如何实现跨集群的 Pod 网络通信？ | open-ended | 4 | — | 🔲 |
| 83 | 使用 Calico 实现 zero-trust 网络安全策略的最佳实践 | practice | 4 | — | 🔲 |

---

## 8. 存储 (12 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 84 | PersistentVolume（PV）和 PersistentVolumeClaim（PVC）分别是什么？ | concept | 1 | — | 🔲 |
| 85 | PV 的 accessModes 有哪些？分别代表什么？ | trivia | 1 | — | 🔲 |
| 86 | PV 的回收策略（Reclaim Policy）有哪些？Retain、Delete、Recycle 的区别？ | comparison | 2 | — | 🔲 |
| 87 | StorageClass 的作用是什么？什么是 Dynamic Provisioning？ | concept | 2 | — | 🔲 |
| 88 | CSI（Container Storage Interface）是什么？它解决了什么问题？ | purpose | 3 | — | 🔲 |
| 89 | emptyDir 和 hostPath 两种 Volume 类型有什么区别和限制？ | comparison | 1 | — | 🔲 |
| 90 | 如何配置 PVC 使用特定的 StorageClass 进行动态供应？ | env-config | 2 | — | 🔲 |
| 91 | StatefulSet 中 volumeClaimTemplates 是如何工作的？ | principle | 3 | — | 🔲 |
| 92 | PV 的状态有哪些（Available / Bound / Released / Failed）？各自的含义是什么？ | trivia | 2 | — | 🔲 |
| 93 | 如何扩容一个已有的 PVC？需要满足什么条件？ | modification | 3 | — | 🔲 |
| 94 | 在 Kubernetes 上部署有状态数据库（如 MySQL）时，存储方案如何设计？ | open-ended | 3 | — | 🔲 |
| 95 | VolumeSnapshot 和 VolumeSnapshotClass 的作用和使用场景？ | concept | 3 | — | 🔲 |

---

## 9. ConfigMap与Secret (8 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 96 | ConfigMap 的作用是什么？有哪些创建方式？ | concept | 1 | — | 🔲 |
| 97 | ConfigMap 通过 Volume Mount 和环境变量注入有什么区别？ | comparison | 2 | — | 🔲 |
| 98 | Secret 和 ConfigMap 有什么区别？Secret 是真正安全的吗？ | comparison | 2 | — | 🔲 |
| 99 | Secret 的几种类型（Opaque / dockerconfigjson / tls 等）分别用于什么场景？ | trivia | 2 | — | 🔲 |
| 100 | 如何实现 ConfigMap 更新后 Pod 自动重载配置？ | modification | 3 | — | 🔲 |
| 101 | 如何在 Kubernetes 中对 Secret 进行静态加密（Encryption at Rest）？ | env-config | 3 | — | 🔲 |
| 102 | 如何使用外部密钥管理系统（如 Vault）管理 Kubernetes Secrets？ | open-ended | 4 | — | 🔲 |
| 103 | Immutable ConfigMap / Secret 的作用和优势是什么？ | purpose | 2 | — | 🔲 |

---

## 10. RBAC与安全 (12 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 104 | Kubernetes RBAC 的四个核心资源是什么？ | concept | 1 | — | 🔲 |
| 105 | Role 和 ClusterRole 有什么区别？ | comparison | 1 | — | 🔲 |
| 106 | RoleBinding 和 ClusterRoleBinding 分别在什么作用域生效？ | concept | 2 | — | 🔲 |
| 107 | ServiceAccount 的作用是什么？Pod 如何使用 ServiceAccount？ | purpose | 2 | — | 🔲 |
| 108 | 如何为开发团队创建一个只能读取特定 namespace 资源的 RBAC 策略？ | env-config | 2 | — | 🔲 |
| 109 | PodSecurityPolicy（PSP）被废弃后，Pod Security Admission（PSA）如何替代？ | principle | 3 | — | 🔲 |
| 110 | Pod Security Standards 的三个级别（Privileged / Baseline / Restricted）各有什么要求？ | trivia | 3 | — | 🔲 |
| 111 | SecurityContext 中可以配置哪些安全选项？ | trivia | 2 | — | 🔲 |
| 112 | 如何防止容器以 root 用户运行？ | requirement | 2 | — | 🔲 |
| 113 | 什么是 Kubernetes 中的 Audit Logging？如何配置？ | env-config | 3 | — | 🔲 |
| 114 | Open Policy Agent（OPA）/ Gatekeeper 在 Kubernetes 安全中的作用？ | purpose | 4 | — | 🔲 |
| 115 | 设计一个多团队共享集群的 RBAC 权限模型 | project | 4 | — | 🔲 |

---

## 11. 资源管理 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 116 | resources.requests 和 resources.limits 分别代表什么？ | concept | 1 | — | 🔲 |
| 117 | Kubernetes 的三种 QoS 等级（Guaranteed / Burstable / BestEffort）是如何划分的？ | principle | 2 | — | 🔲 |
| 118 | 当节点资源不足时，Kubernetes 按什么顺序驱逐 Pod？ | principle | 3 | — | 🔲 |
| 119 | LimitRange 的作用是什么？如何为 namespace 设置默认资源限制？ | purpose | 2 | — | 🔲 |
| 120 | ResourceQuota 如何限制 namespace 的资源使用总量？ | concept | 2 | — | 🔲 |
| 121 | CPU 的 requests/limits 使用 millicore 单位，1000m 等于多少 CPU？ | trivia | 1 | — | 🔲 |
| 122 | 如果 Pod 超过了 Memory Limit 会怎样？超过 CPU Limit 呢？ | principle | 2 | — | 🔲 |
| 123 | 如何查看节点的资源使用情况和可分配资源？ | debugging | 1 | — | 🔲 |
| 124 | 如何合理设置 requests 和 limits 避免资源浪费？ | tuning | 3 | — | 🔲 |
| 125 | 节点的 Allocatable 和 Capacity 有什么区别？ | concept | 2 | — | 🔲 |

---

## 12. HPA与自动伸缩 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 126 | HPA（Horizontal Pod Autoscaler）的工作原理是什么？ | concept | 1 | — | 🔲 |
| 127 | HPA 默认根据什么指标进行扩缩容？如何配置基于自定义指标？ | env-config | 2 | — | 🔲 |
| 128 | HPA 的扩缩容算法公式是什么？ | principle | 3 | — | 🔲 |
| 129 | VPA（Vertical Pod Autoscaler）的作用是什么？它和 HPA 能同时使用吗？ | comparison | 3 | — | 🔲 |
| 130 | Cluster Autoscaler 如何实现节点级别的自动伸缩？ | principle | 3 | — | 🔲 |
| 131 | HPA 的 behavior 字段可以配置什么？如何防止频繁扩缩容？ | tuning | 3 | — | 🔲 |
| 132 | HPA v2 相比 v1 有哪些新特性？ | trivia | 2 | — | 🔲 |
| 133 | metrics-server 的作用是什么？HPA 依赖它吗？ | purpose | 1 | — | 🔲 |
| 134 | 如何为微服务配置基于 QPS 的自定义指标 HPA？ | practice | 4 | — | 🔲 |
| 135 | KEDA（Kubernetes Event-Driven Autoscaler）与原生 HPA 有什么区别？ | comparison | 3 | — | 🔲 |

---

## 13. Helm (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 136 | Helm 是什么？它解决了 Kubernetes 部署中的什么问题？ | purpose | 1 | — | 🔲 |
| 137 | Helm Chart 的目录结构包含哪些文件和文件夹？ | trivia | 1 | — | 🔲 |
| 138 | Helm 的 values.yaml 和 templates 之间是什么关系？ | principle | 2 | — | 🔲 |
| 139 | Helm 的 Release、Chart、Repository 分别是什么概念？ | concept | 1 | — | 🔲 |
| 140 | 如何执行 Helm 的升级和回滚操作？ | modification | 1 | — | 🔲 |
| 141 | Helm Hooks 的作用是什么？有哪些常见的 Hook 类型？ | concept | 3 | — | 🔲 |
| 142 | Helm 模板中的 include 和 template 函数有什么区别？ | comparison | 3 | — | 🔲 |
| 143 | 如何管理多环境（dev / staging / prod）的 Helm 部署？ | open-ended | 2 | — | 🔲 |
| 144 | Helm 3 相比 Helm 2 有哪些重大变化？ | trivia | 2 | — | 🔲 |
| 145 | 如何编写 Helm Chart 的测试（helm test）？ | practice | 3 | — | 🔲 |

---

## 14. 健康检查 (8 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 146 | Kubernetes 的三种探针（Liveness / Readiness / Startup）分别有什么作用？ | concept | 1 | — | 🔲 |
| 147 | Liveness Probe 失败后 Kubernetes 会执行什么操作？ | principle | 1 | — | 🔲 |
| 148 | Readiness Probe 失败会导致什么后果？ | principle | 1 | — | 🔲 |
| 149 | 探针的三种检测方式（httpGet / tcpSocket / exec）分别适用什么场景？ | comparison | 2 | — | 🔲 |
| 150 | initialDelaySeconds、periodSeconds、failureThreshold 等探针参数如何配置？ | env-config | 2 | — | 🔲 |
| 151 | Startup Probe 解决了什么问题？为什么不能只用 initialDelaySeconds？ | purpose | 2 | — | 🔲 |
| 152 | 为一个 Java Spring Boot 应用设计合理的健康检查方案 | open-ended | 3 | — | 🔲 |
| 153 | 配置不当的 Liveness Probe 可能导致什么问题？ | debugging | 2 | — | 🔲 |

---

## 15. 日志与监控 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 154 | Kubernetes 中常见的日志收集架构有哪些？ | concept | 2 | — | 🔲 |
| 155 | 如何使用 kubectl logs 查看 Pod 日志？多容器 Pod 如何指定？ | trivia | 1 | — | 🔲 |
| 156 | Sidecar 日志收集方案 vs 节点级 DaemonSet 方案各有什么优劣？ | comparison | 3 | — | 🔲 |
| 157 | Prometheus 在 Kubernetes 监控中的核心架构是怎样的？ | concept | 2 | — | 🔲 |
| 158 | metrics-server 和 Prometheus 有什么区别？它们分别适用于什么场景？ | comparison | 2 | — | 🔲 |
| 159 | kube-state-metrics 采集的是什么类型的指标？ | purpose | 2 | — | 🔲 |
| 160 | 如何为自定义应用暴露 Prometheus 格式的 metrics？ | modification | 3 | — | 🔲 |
| 161 | Kubernetes 事件（Events）的作用是什么？如何利用事件进行问题排查？ | debugging | 1 | — | 🔲 |
| 162 | 如何配置 Prometheus 的 ServiceMonitor 来自动发现监控目标？ | env-config | 3 | — | 🔲 |
| 163 | 设计一个完整的 Kubernetes 集群可观测性方案（日志 + 指标 + 追踪） | project | 4 | — | 🔲 |

---

## 16. CRD与Operator (8 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 164 | CRD（Custom Resource Definition）是什么？它有什么作用？ | concept | 2 | — | 🔲 |
| 165 | 自定义资源（Custom Resource）和内置资源有什么区别？ | comparison | 2 | — | 🔲 |
| 166 | Operator 模式的核心思想是什么？ | principle | 3 | — | 🔲 |
| 167 | Controller 的 Reconcile Loop 是如何工作的？ | principle | 3 | — | 🔲 |
| 168 | Operator SDK 和 Kubebuilder 有什么区别？ | comparison | 3 | — | 🔲 |
| 169 | 列举几个知名的 Kubernetes Operator 及其用途 | trivia | 2 | — | 🔲 |
| 170 | CRD 的 Validation（OpenAPI Schema）和 Conversion Webhook 分别用来做什么？ | purpose | 4 | — | 🔲 |
| 171 | 为一个 MySQL 数据库设计 Operator 的核心 Reconcile 逻辑 | project | 4 | — | 🔲 |

---

## 17. etcd (8 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 172 | etcd 的 Raft 一致性算法基本原理是什么？ | principle | 3 | — | 🔲 |
| 173 | etcd 集群为什么推荐奇数个节点？ | principle | 2 | — | 🔲 |
| 174 | 如何备份和恢复 etcd 数据？ | modification | 2 | — | 🔲 |
| 175 | etcd 的 Compaction 和 Defragmentation 分别解决什么问题？ | purpose | 3 | — | 🔲 |
| 176 | etcd 的性能瓶颈通常出现在哪些方面？如何优化？ | tuning | 4 | — | 🔲 |
| 177 | etcd 中存储的 Kubernetes 数据的 key 结构是怎样的？ | real-data | 3 | — | 🔲 |
| 178 | etcd 的 Watch 机制在 Kubernetes 中是如何使用的？ | principle | 3 | — | 🔲 |
| 179 | etcd 出现 "database space exceeded" 错误时如何处理？ | debugging | 3 | — | 🔲 |

---

## 18. 故障排查 (12 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 180 | Pod 状态为 CrashLoopBackOff 时，排查步骤是什么？ | debugging | 1 | — | 🔲 |
| 181 | Pod 状态为 ImagePullBackOff 的常见原因和解决方法？ | debugging | 1 | — | 🔲 |
| 182 | Pod 一直处于 Pending 状态，可能的原因有哪些？ | debugging | 2 | — | 🔲 |
| 183 | Pod 被 OOMKilled 意味着什么？如何排查和解决？ | debugging | 2 | — | 🔲 |
| 184 | 如何排查 Service 无法访问后端 Pod 的问题？ | debugging | 2 | — | 🔲 |
| 185 | kubectl describe 和 kubectl get events 在排查中分别有什么用？ | purpose | 1 | — | 🔲 |
| 186 | Pod 状态为 Evicted 是什么原因？如何处理？ | debugging | 2 | — | 🔲 |
| 187 | 容器内进程收到 SIGKILL 而非 SIGTERM 是什么原因？ | debugging | 3 | — | 🔲 |
| 188 | Node 状态变为 NotReady 时，排查思路是什么？ | debugging | 3 | — | 🔲 |
| 189 | 如何排查 DNS 解析失败导致的 Pod 间通信问题？ | debugging | 3 | — | 🔲 |
| 190 | 生产环境出现间歇性 Pod 重启，如何定位根因？ | open-ended | 4 | — | 🔲 |
| 191 | 分享一次真实的 Kubernetes 生产故障排查经历 | real-data | 3 | — | 🔲 |

---

## 19. 升级与维护 (10 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 192 | Deployment 的 Rolling Update 原理是什么？ | principle | 1 | — | 🔲 |
| 193 | Blue-Green 部署和 Canary 部署有什么区别？ | comparison | 2 | — | 🔲 |
| 194 | kubectl drain 和 kubectl cordon 命令的作用分别是什么？ | concept | 1 | — | 🔲 |
| 195 | Kubernetes 集群升级（如 1.27 → 1.28）的正确步骤是什么？ | requirement | 3 | — | 🔲 |
| 196 | PodDisruptionBudget（PDB）的作用是什么？如何配置？ | purpose | 2 | — | 🔲 |
| 197 | 如何实现零停机（Zero Downtime）的应用部署？ | requirement | 3 | — | 🔲 |
| 198 | 什么是 Kubernetes 版本偏差策略（Version Skew Policy）？ | requirement | 3 | — | 🔲 |
| 199 | 如何使用 Istio 或 Argo Rollouts 实现高级发布策略？ | open-ended | 4 | — | 🔲 |
| 200 | 大规模集群（1000+ 节点）的运维有哪些特殊挑战和优化手段？ | tuning | 4 | — | 🔲 |
| 201 | etcd 升级时需要注意什么？如何保证数据安全？ | requirement | 3 | — | 🔲 |

---

## 20. 多租户与多集群 (8 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 202 | Namespace 在多租户场景下如何实现资源隔离？ | concept | 1 | — | 🔲 |
| 203 | Namespace 级别的隔离有哪些不足？如何加强？ | open-ended | 3 | — | 🔲 |
| 204 | 什么是 Virtual Cluster（vCluster）？它解决了什么问题？ | concept | 3 | — | 🔲 |
| 205 | Kubernetes Federation（联邦）的作用和局限性是什么？ | principle | 4 | — | 🔲 |
| 206 | 多集群管理工具（Rancher / KubeSphere / Karmada）的对比 | real-data | 3 | — | 🔲 |
| 207 | 如何实现跨集群的服务发现和流量调度？ | open-ended | 4 | — | 🔲 |
| 208 | 多租户场景下的 RBAC + ResourceQuota + NetworkPolicy 综合配置方案 | requirement | 3 | — | 🔲 |
| 209 | 设计一个支持 50 个团队共享的 Kubernetes 多租户平台 | project | 4 | — | 🔲 |

---

## 补充题目 — 跨主题综合 (7 题)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 210 | Kubernetes 中各种超时参数（terminationGracePeriodSeconds 等）的含义和影响？ | tuning | 2 | — | 🔲 |
| 211 | 如何使用 kubectl debug 命令排查正在运行的 Pod？ | debugging | 2 | — | 🔲 |
| 212 | Kubernetes 1.28 / 1.29 / 1.30 有哪些值得关注的新特性？ | real-data | 2 | — | 🔲 |
| 213 | 一个 HTTP 请求从客户端到达 Pod 的完整路径是怎样的？ | principle | 3 | — | 🔲 |
| 214 | 生产环境中 Kubernetes 资源 YAML 的最佳实践有哪些？ | requirement | 2 | — | 🔲 |
| 215 | 如何评估是否应该使用 Kubernetes？有哪些替代方案？ | open-ended | 2 | — | 🔲 |
| 216 | Kubernetes 的 Finalizer 机制是什么？有什么常见问题？ | principle | 3 | — | 🔲 |

---

## 统计

### 按类型

| type | 目标 | 实际 | 差值 |
|------|------|------|------|
| concept | ~25 | 37 | +12 |
| principle | ~25 | 33 | +8 |
| comparison | ~18 | 29 | +11 |
| trivia | ~18 | 20 | +2 |
| env-config | ~15 | 16 | +1 |
| modification | ~12 | 8 | -4 |
| purpose | ~15 | 19 | +4 |
| open-ended | ~15 | 13 | -2 |
| debugging | ~15 | 14 | -1 |
| real-data | ~10 | 4 | -6 |
| requirement | ~10 | 7 | -3 |
| tuning | ~10 | 5 | -5 |
| practice | ~7 | 5 | -2 |
| project | ~5 | 6 | +1 |
| **合计** | **~200** | **216** | **+16** |

> ⚠️ concept/principle/comparison 偏多，可在生成时将部分题目调整为 modification / real-data / tuning 类型。
> 总量略超目标，生成时可按优先级裁剪或保留作为备选。

### 按难度

| difficulty | 目标 | 实际 | 差值 |
|-----------|------|------|------|
| 1 | ~50 | 44 | -6 |
| 2 | ~70 | 85 | +15 |
| 3 | ~55 | 67 | +12 |
| 4 | ~25 | 20 | -5 |
| **合计** | **~200** | **216** | **+16** |

> ⚠️ 难度 2/3 偏多。生成时可将部分 d2 题目下调为 d1，部分 d3 上调为 d4。

### 文件状态

| 状态 | 数量 |
|------|------|
| 🔲 待生成 | 216 |
| ✅ 已存在 | 0 |
