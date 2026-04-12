# 监控与日志面试题子计划

> 领域: monitoring | 目标: ~200 题 | 状态: 规划中
>
> 现有题目: 0（`public/question-packs/monitoring/` 目录为空，所有题目状态均为 ⬜）
>
> 类型分布: concept ~25, principle ~25, comparison ~18, trivia ~18, env-config ~15, modification ~12, purpose ~15, open-ended ~15, debugging ~15, real-data ~10, requirement ~10, tuning ~10, practice ~7, project ~5
>
> 难度分布: 1 ~50, 2 ~70, 3 ~55, 4 ~25

---

## 1. 可观测性基础 (Observability Fundamentals)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 1 | 什么是可观测性（Observability）？与传统监控有何区别？ | concept | 1 | observability-basics.json | ⬜ |
| 2 | 可观测性三大支柱（Metrics、Logs、Traces）分别解决什么问题？ | concept | 1 | observability-basics.json | ⬜ |
| 3 | SLI、SLO、SLA 三者的定义及层级关系是什么？ | concept | 1 | observability-basics.json | ⬜ |
| 4 | 如何为一个 Web 服务选择合适的 SLI 指标？ | practice | 2 | observability-basics.json | ⬜ |
| 5 | SLO 的 Error Budget 用完后团队该怎么做？ | principle | 2 | observability-basics.json | ⬜ |
| 6 | Metrics 与 Logs 在排障中的适用场景对比 | comparison | 1 | observability-basics.json | ⬜ |
| 7 | "白盒监控"与"黑盒监控"的区别和各自优势 | comparison | 1 | observability-basics.json | ⬜ |
| 8 | 什么是 Telemetry Data？它包含哪些类别？ | trivia | 1 | observability-basics.json | ⬜ |
| 9 | MTTD、MTTR、MTBF 这些可靠性指标分别是什么？ | trivia | 1 | observability-basics.json | ⬜ |
| 10 | 如何为一个内部 API 制定合理的 SLO？ | requirement | 2 | observability-basics.json | ⬜ |

## 2. Prometheus 基础 (Prometheus Basics)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 11 | Prometheus 的整体架构由哪些组件组成？ | concept | 1 | prometheus-basics.json | ⬜ |
| 12 | Prometheus 的 Pull 模型与 Push 模型各有什么优缺点？ | comparison | 2 | prometheus-basics.json | ⬜ |
| 13 | Prometheus 的四种 Metric 类型（Counter、Gauge、Histogram、Summary）分别适合什么场景？ | concept | 1 | prometheus-basics.json | ⬜ |
| 14 | Counter 为什么只能递增？重启后归零怎么办？ | principle | 2 | prometheus-basics.json | ⬜ |
| 15 | Histogram 和 Summary 的核心区别是什么？ | comparison | 2 | prometheus-basics.json | ⬜ |
| 16 | PromQL 中 `rate()` 与 `irate()` 的区别和使用场景 | comparison | 2 | prometheus-basics.json | ⬜ |
| 17 | 如何用 PromQL 计算服务的 P99 延迟？ | practice | 3 | prometheus-basics.json | ⬜ |
| 18 | Prometheus 的 `scrape_interval` 设为多少比较合理？ | tuning | 2 | prometheus-basics.json | ⬜ |
| 19 | Prometheus 的 Service Discovery 支持哪些方式？ | trivia | 1 | prometheus-basics.json | ⬜ |
| 20 | `up` 指标的作用是什么？值为 0 代表什么？ | trivia | 1 | prometheus-basics.json | ⬜ |
| 21 | 为什么 Gauge 类型不需要 `rate()` 而 Counter 需要？ | principle | 1 | prometheus-basics.json | ⬜ |
| 22 | Prometheus 的 `evaluation_interval` 和 `scrape_interval` 的区别 | trivia | 1 | prometheus-basics.json | ⬜ |

## 3. Prometheus 进阶 (Prometheus Advanced)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 23 | 什么是 Prometheus 的 Relabeling？常见用法有哪些？ | concept | 3 | prometheus-advanced.json | ⬜ |
| 24 | Prometheus Federation 的两种模式（Hierarchical / Cross-Service）有何区别？ | comparison | 3 | prometheus-advanced.json | ⬜ |
| 25 | Prometheus Remote Write / Remote Read 的工作原理 | principle | 3 | prometheus-advanced.json | ⬜ |
| 26 | Recording Rules 的作用是什么？什么时候该使用？ | purpose | 2 | prometheus-advanced.json | ⬜ |
| 27 | 什么是 Prometheus Exemplars？如何关联 Traces？ | concept | 3 | prometheus-advanced.json | ⬜ |
| 28 | Prometheus 的 WAL（Write-Ahead Log）机制有什么作用？ | principle | 3 | prometheus-advanced.json | ⬜ |
| 29 | 如何配置 Prometheus 进行跨集群的指标采集？ | env-config | 3 | prometheus-advanced.json | ⬜ |
| 30 | Prometheus 的 Staleness 机制是如何处理消失的时间序列的？ | principle | 4 | prometheus-advanced.json | ⬜ |
| 31 | Prometheus TSDB 的存储结构（Block、Chunk、WAL）详解 | principle | 4 | prometheus-advanced.json | ⬜ |
| 32 | `absent()` 函数的用途和典型场景是什么？ | purpose | 2 | prometheus-advanced.json | ⬜ |
| 33 | PromQL 中 `label_replace()` 和 `label_join()` 的使用方式 | modification | 3 | prometheus-advanced.json | ⬜ |

## 4. Grafana

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 34 | Grafana 支持哪些主要的 Data Source 类型？ | trivia | 1 | grafana.json | ⬜ |
| 35 | Grafana Dashboard 的 Variable（模板变量）有哪些类型？ | trivia | 2 | grafana.json | ⬜ |
| 36 | 如何使用 Grafana Provisioning 实现 Dashboard as Code？ | env-config | 3 | grafana.json | ⬜ |
| 37 | Grafana Alerting 的工作流程是怎样的？ | concept | 2 | grafana.json | ⬜ |
| 38 | 如何设计一个有效的 Grafana 监控大盘（Dashboard）？ | open-ended | 2 | grafana.json | ⬜ |
| 39 | Grafana Loki 与 Grafana 的集成方式和查询语法 | env-config | 2 | grafana.json | ⬜ |
| 40 | Grafana 中 Panel 的 Transformation 功能有哪些常见用法？ | trivia | 2 | grafana.json | ⬜ |
| 41 | Grafana 与 Prometheus 对比各自的告警能力 | comparison | 2 | grafana.json | ⬜ |
| 42 | 如何将已有 Grafana Dashboard 导出并在新环境中还原？ | modification | 1 | grafana.json | ⬜ |
| 43 | 如何实现 Grafana 多租户 Dashboard 权限管理？ | env-config | 3 | grafana.json | ⬜ |

## 5. 告警系统 (Alerting System)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 44 | Alertmanager 的核心功能（分组、抑制、静默、路由）概述 | concept | 1 | alerting.json | ⬜ |
| 45 | Alertmanager 的 Routing Tree（路由树）是如何工作的？ | principle | 2 | alerting.json | ⬜ |
| 46 | 什么是告警抑制（Inhibition）？举一个典型场景 | concept | 2 | alerting.json | ⬜ |
| 47 | 告警静默（Silencing）与 Inhibition 的区别 | comparison | 2 | alerting.json | ⬜ |
| 48 | 如何避免"告警疲劳"（Alert Fatigue）？ | open-ended | 2 | alerting.json | ⬜ |
| 49 | Alertmanager 的 Group、GroupWait、GroupInterval 参数含义 | trivia | 2 | alerting.json | ⬜ |
| 50 | 告警分级（P0/P1/P2/P3）的标准如何定义？ | principle | 2 | alerting.json | ⬜ |
| 51 | 如何配置 Alertmanager 实现告警去重（Deduplication）？ | env-config | 3 | alerting.json | ⬜ |
| 52 | Prometheus 告警规则中 `for` 子句的作用是什么？ | purpose | 1 | alerting.json | ⬜ |
| 53 | 如何测试 Alertmanager 的路由配置是否正确？ | debugging | 3 | alerting.json | ⬜ |
| 54 | 如何设计一套微服务场景下的告警收敛策略？ | open-ended | 3 | alerting.json | ⬜ |

## 6. 日志收集 (Log Collection)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 55 | Fluentd 与 Fluent Bit 的区别和各自适用场景 | comparison | 2 | log-collection.json | ⬜ |
| 56 | Logstash 的 Pipeline（Input → Filter → Output）工作原理 | principle | 1 | log-collection.json | ⬜ |
| 57 | 什么是 Vector？与 Fluentd / Logstash 对比优势在哪？ | comparison | 2 | log-collection.json | ⬜ |
| 58 | 日志 Pipeline 设计的基本原则有哪些？ | principle | 2 | log-collection.json | ⬜ |
| 59 | Kubernetes 中使用 DaemonSet 收集日志的方案有哪些？ | env-config | 2 | log-collection.json | ⬜ |
| 60 | 日志采集中如何处理多行日志（Multiline Log）？ | debugging | 2 | log-collection.json | ⬜ |
| 61 | Sidecar 模式 vs DaemonSet 模式收集容器日志的优缺点 | comparison | 2 | log-collection.json | ⬜ |
| 62 | 如何配置 Fluentd 的 Buffer 机制防止日志丢失？ | env-config | 3 | log-collection.json | ⬜ |
| 63 | 结构化日志（Structured Logging）的优势是什么？ | principle | 1 | log-collection.json | ⬜ |
| 64 | 日志采集的背压（Backpressure）问题如何解决？ | debugging | 3 | log-collection.json | ⬜ |
| 65 | 日志分级（DEBUG/INFO/WARN/ERROR）的标准和使用建议 | principle | 1 | log-collection.json | ⬜ |

## 7. 日志存储与查询 (Log Storage & Query)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 66 | Elasticsearch 的倒排索引（Inverted Index）原理是什么？ | principle | 2 | log-storage.json | ⬜ |
| 67 | ELK Stack（Elasticsearch + Logstash + Kibana）的架构和数据流 | concept | 1 | log-storage.json | ⬜ |
| 68 | Grafana Loki 与 Elasticsearch 的核心设计理念差异 | comparison | 2 | log-storage.json | ⬜ |
| 69 | Loki 为什么不对日志内容做全文索引？ | principle | 2 | log-storage.json | ⬜ |
| 70 | ClickHouse 用于日志存储有哪些优势？ | concept | 3 | log-storage.json | ⬜ |
| 71 | 日志索引策略：按天切分 Index 的原因和配置方法 | env-config | 2 | log-storage.json | ⬜ |
| 72 | LogQL 的基本语法和常用查询模式 | trivia | 2 | log-storage.json | ⬜ |
| 73 | Elasticsearch 查询性能优化有哪些常见手段？ | tuning | 3 | log-storage.json | ⬜ |
| 74 | 日志保留策略（Retention Policy）如何设计？ | requirement | 2 | log-storage.json | ⬜ |
| 75 | 如何在 Elasticsearch 中配置 ILM（Index Lifecycle Management）？ | modification | 3 | log-storage.json | ⬜ |

## 8. 链路追踪 (Distributed Tracing)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 76 | 什么是分布式链路追踪？它解决了什么问题？ | concept | 1 | tracing.json | ⬜ |
| 77 | OpenTelemetry 的架构和核心组件有哪些？ | concept | 2 | tracing.json | ⬜ |
| 78 | Trace、Span、SpanContext 之间的关系 | concept | 1 | tracing.json | ⬜ |
| 79 | Jaeger 与 Zipkin 的对比和选型建议 | comparison | 2 | tracing.json | ⬜ |
| 80 | 什么是 Trace Context Propagation？W3C TraceContext 标准包含什么？ | principle | 2 | tracing.json | ⬜ |
| 81 | 链路追踪中的采样策略有哪些？（Head-based vs Tail-based） | comparison | 3 | tracing.json | ⬜ |
| 82 | OpenTelemetry Collector 的 Pipeline 模型是怎样的？ | concept | 2 | tracing.json | ⬜ |
| 83 | 如何在微服务中实现 Trace ID 的跨服务传递？ | practice | 2 | tracing.json | ⬜ |
| 84 | 链路追踪对应用性能的影响如何评估和控制？ | tuning | 3 | tracing.json | ⬜ |
| 85 | OpenTelemetry 的 Auto-Instrumentation 原理是什么？ | principle | 3 | tracing.json | ⬜ |
| 86 | 如何为已有项目添加 OpenTelemetry SDK 并导出 Traces？ | modification | 2 | tracing.json | ⬜ |

## 9. 指标设计 (Metrics Design)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 87 | RED 方法（Rate、Errors、Duration）适用于什么场景？ | concept | 1 | metrics-design.json | ⬜ |
| 88 | USE 方法（Utilization、Saturation、Errors）适用于什么场景？ | concept | 1 | metrics-design.json | ⬜ |
| 89 | Google 四大黄金信号（Four Golden Signals）是哪四个？ | trivia | 1 | metrics-design.json | ⬜ |
| 90 | RED 方法与 USE 方法的适用对象有什么不同？ | comparison | 2 | metrics-design.json | ⬜ |
| 91 | 如何为一个微服务设计自定义 Metrics？ | open-ended | 2 | metrics-design.json | ⬜ |
| 92 | Metric 命名规范（naming convention）有哪些最佳实践？ | principle | 2 | metrics-design.json | ⬜ |
| 93 | 什么是 Label Cardinality？为什么要严格控制？ | principle | 2 | metrics-design.json | ⬜ |
| 94 | 业务指标（Business Metrics）与技术指标的关系 | open-ended | 2 | metrics-design.json | ⬜ |
| 95 | Histogram Bucket 的边界值如何合理设置？ | tuning | 3 | metrics-design.json | ⬜ |
| 96 | 如何设计一套完整的 API 网关监控指标？ | project | 3 | metrics-design.json | ⬜ |

## 10. APM (Application Performance Monitoring)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 97 | APM 的核心功能包含哪些方面？ | concept | 1 | apm.json | ⬜ |
| 98 | 如何进行请求延迟分解（Latency Breakdown）？ | debugging | 2 | apm.json | ⬜ |
| 99 | Continuous Profiling 与传统 Profiling 的区别 | comparison | 3 | apm.json | ⬜ |
| 100 | 什么是 Flame Graph？如何用它定位性能瓶颈？ | concept | 2 | apm.json | ⬜ |
| 101 | 如何通过 APM 数据定位一个慢接口的根因？ | debugging | 3 | apm.json | ⬜ |
| 102 | 什么是 Service Map？它对微服务治理有什么帮助？ | purpose | 2 | apm.json | ⬜ |
| 103 | Java 应用的 APM Agent（如 SkyWalking Agent）工作原理 | principle | 3 | apm.json | ⬜ |
| 104 | 如何评估 APM 工具自身对应用性能的 Overhead？ | real-data | 3 | apm.json | ⬜ |

## 11. 基础设施监控 (Infrastructure Monitoring)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 105 | Node Exporter 能采集哪些系统级指标？ | trivia | 1 | infra-monitoring.json | ⬜ |
| 106 | cAdvisor 与 Kubelet 内置 Metrics 的关系和区别 | comparison | 2 | infra-monitoring.json | ⬜ |
| 107 | kube-state-metrics 采集的是什么类型的数据？ | concept | 1 | infra-monitoring.json | ⬜ |
| 108 | 如何监控 Kubernetes Node 的 CPU、内存、磁盘使用率？ | env-config | 1 | infra-monitoring.json | ⬜ |
| 109 | 如何监控 Pod 的 OOMKilled 事件？ | debugging | 2 | infra-monitoring.json | ⬜ |
| 110 | Kubernetes 中 Metrics Server 的作用和局限性 | purpose | 2 | infra-monitoring.json | ⬜ |
| 111 | 如何监控 etcd 集群的健康状态？ | env-config | 3 | infra-monitoring.json | ⬜ |
| 112 | 磁盘 I/O 监控的关键指标有哪些？ | trivia | 2 | infra-monitoring.json | ⬜ |
| 113 | Node Exporter 的 Textfile Collector 有什么用途？ | purpose | 1 | infra-monitoring.json | ⬜ |
| 114 | 容器环境中 CPU Throttling 的监控指标和排查方式 | debugging | 2 | infra-monitoring.json | ⬜ |

## 12. 网络监控 (Network Monitoring)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 115 | Blackbox Exporter 能做哪些类型的探测？ | trivia | 1 | network-monitoring.json | ⬜ |
| 116 | 如何使用 Blackbox Exporter 监控 HTTPS 证书过期时间？ | env-config | 2 | network-monitoring.json | ⬜ |
| 117 | ICMP Ping 监控与 TCP Check 监控的区别 | comparison | 1 | network-monitoring.json | ⬜ |
| 118 | DNS 监控需要关注哪些关键指标？ | requirement | 2 | network-monitoring.json | ⬜ |
| 119 | 如何检测和告警网络丢包率异常？ | debugging | 2 | network-monitoring.json | ⬜ |
| 120 | 什么是 Synthetic Monitoring（合成监控）？ | concept | 2 | network-monitoring.json | ⬜ |
| 121 | 如何监控 Kubernetes 集群内 Service 之间的网络连通性？ | env-config | 3 | network-monitoring.json | ⬜ |
| 122 | 用 Prometheus 监控 HTTP 接口可用性的完整配置方案 | practice | 2 | network-monitoring.json | ⬜ |

## 13. 数据库监控 (Database Monitoring)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 123 | MySQL Exporter 能采集哪些核心指标？ | trivia | 1 | db-monitoring.json | ⬜ |
| 124 | Redis Exporter 监控需要重点关注的指标有哪些？ | trivia | 1 | db-monitoring.json | ⬜ |
| 125 | 如何监控 MySQL 慢查询（Slow Query）并设置告警？ | env-config | 2 | db-monitoring.json | ⬜ |
| 126 | 数据库连接池（Connection Pool）监控的关键指标 | requirement | 2 | db-monitoring.json | ⬜ |
| 127 | 如何监控 PostgreSQL 的锁等待和死锁情况？ | debugging | 3 | db-monitoring.json | ⬜ |
| 128 | 数据库主从复制延迟的监控方案 | debugging | 2 | db-monitoring.json | ⬜ |
| 129 | 如何通过监控数据判断是否需要分库分表？ | real-data | 3 | db-monitoring.json | ⬜ |
| 130 | 通过监控数据判断 Redis 是否存在大 Key 问题 | real-data | 2 | db-monitoring.json | ⬜ |
| 131 | 如何为数据库监控设置合理的告警阈值？ | requirement | 2 | db-monitoring.json | ⬜ |

## 14. 事件管理 (Incident Management)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 132 | 事件管理（Incident Management）的标准流程是什么？ | concept | 1 | incident-management.json | ⬜ |
| 133 | On-Call 轮值制度的最佳实践有哪些？ | principle | 2 | incident-management.json | ⬜ |
| 134 | PagerDuty 与 OpsGenie 的功能对比 | real-data | 2 | incident-management.json | ⬜ |
| 135 | 什么是 Runbook？一个好的 Runbook 应该包含哪些内容？ | requirement | 1 | incident-management.json | ⬜ |
| 136 | 如何衡量 MTTR（Mean Time To Recovery）？ | concept | 2 | incident-management.json | ⬜ |
| 137 | 事件升级（Escalation）机制如何设计？ | principle | 2 | incident-management.json | ⬜ |
| 138 | 告警与事件（Alert vs Incident）的区别是什么？ | comparison | 1 | incident-management.json | ⬜ |
| 139 | 如何建立有效的事件复盘（Postmortem）文化？ | open-ended | 2 | incident-management.json | ⬜ |
| 140 | MTTA（Mean Time To Acknowledge）为什么是重要的事件指标？ | purpose | 1 | incident-management.json | ⬜ |

## 15. SRE 实践 (SRE Practices)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 141 | 什么是 Error Budget？如何计算？ | concept | 2 | sre-practices.json | ⬜ |
| 142 | Error Budget Policy 通常包含哪些条款？ | principle | 3 | sre-practices.json | ⬜ |
| 143 | 什么是 Toil？如何识别和减少 Toil？ | open-ended | 2 | sre-practices.json | ⬜ |
| 144 | Reliability 与 Velocity 的平衡策略 | open-ended | 3 | sre-practices.json | ⬜ |
| 145 | Postmortem 的 Blameless 原则是什么？ | principle | 1 | sre-practices.json | ⬜ |
| 146 | SRE 中"只做能自动化的 On-Call"是什么含义？ | principle | 2 | sre-practices.json | ⬜ |
| 147 | 如何从 SLO 反推告警阈值？ | practice | 3 | sre-practices.json | ⬜ |
| 148 | Burn Rate Alert 是什么？Multi-Window 策略如何实现？ | principle | 4 | sre-practices.json | ⬜ |
| 149 | SRE 团队与传统运维团队的核心区别 | comparison | 1 | sre-practices.json | ⬜ |
| 150 | 什么是 SLO-based Alerting？与阈值告警有何区别？ | principle | 3 | sre-practices.json | ⬜ |

## 16. 容量规划 (Capacity Planning)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 151 | 容量规划需要收集哪些监控数据？ | requirement | 2 | capacity-planning.json | ⬜ |
| 152 | 如何利用 Prometheus 数据做资源使用趋势分析？ | real-data | 3 | capacity-planning.json | ⬜ |
| 153 | `predict_linear()` 函数在容量预测中的使用方式 | purpose | 3 | capacity-planning.json | ⬜ |
| 154 | 什么时候应该触发扩容？如何设置扩容阈值？ | requirement | 2 | capacity-planning.json | ⬜ |
| 155 | Kubernetes HPA 基于自定义 Metrics 扩缩容的方案 | modification | 3 | capacity-planning.json | ⬜ |
| 156 | 如何避免过度供给（Over-Provisioning）带来的成本浪费？ | open-ended | 2 | capacity-planning.json | ⬜ |
| 157 | 流量突增场景下的容量保障策略 | principle | 3 | capacity-planning.json | ⬜ |
| 158 | 通过监控数据回顾一次真实扩容决策的合理性 | real-data | 4 | capacity-planning.json | ⬜ |

## 17. 自定义 Exporter (Custom Exporters)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 159 | 如何用 Go 编写一个简单的 Prometheus Exporter？ | practice | 3 | custom-exporter.json | ⬜ |
| 160 | Prometheus Client Library 支持哪些语言？ | trivia | 1 | custom-exporter.json | ⬜ |
| 161 | Collector 模式与直接注册 Metrics 的区别 | comparison | 3 | custom-exporter.json | ⬜ |
| 162 | 自定义 Exporter 的 `/metrics` 端点需要满足什么规范？ | requirement | 2 | custom-exporter.json | ⬜ |
| 163 | 如何处理 Exporter 采集超时的问题？ | debugging | 3 | custom-exporter.json | ⬜ |
| 164 | Pushgateway 的使用场景和注意事项 | purpose | 2 | custom-exporter.json | ⬜ |
| 165 | 如何为一个遗留系统（Legacy System）开发监控 Exporter？ | project | 4 | custom-exporter.json | ⬜ |

## 18. 指标聚合 (Metrics Aggregation)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 166 | Thanos 的架构和核心组件有哪些？ | concept | 3 | metrics-aggregation.json | ⬜ |
| 167 | Cortex 与 Thanos 的设计理念和架构对比 | comparison | 4 | metrics-aggregation.json | ⬜ |
| 168 | Grafana Mimir 相对于 Cortex 做了哪些改进？ | concept | 4 | metrics-aggregation.json | ⬜ |
| 169 | 如何实现 Prometheus 指标的长期存储？ | requirement | 3 | metrics-aggregation.json | ⬜ |
| 170 | Thanos Sidecar 与 Thanos Receive 模式的区别 | comparison | 4 | metrics-aggregation.json | ⬜ |
| 171 | 全局视图（Global View）在多集群监控中的意义 | purpose | 3 | metrics-aggregation.json | ⬜ |
| 172 | Thanos Compactor 的 Downsampling 策略是怎样的？ | principle | 4 | metrics-aggregation.json | ⬜ |
| 173 | 如何在 Thanos 中配置 Object Storage（S3/GCS）？ | env-config | 3 | metrics-aggregation.json | ⬜ |
| 174 | Thanos Query 的 Deduplication 机制是如何工作的？ | principle | 4 | metrics-aggregation.json | ⬜ |

## 19. 安全监控 (Security Monitoring)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 175 | Audit Log（审计日志）需要记录哪些关键信息？ | requirement | 2 | security-monitoring.json | ⬜ |
| 176 | 什么是 SIEM？它与传统日志分析有什么区别？ | concept | 2 | security-monitoring.json | ⬜ |
| 177 | Kubernetes Audit Log 的配置和分析方法 | env-config | 3 | security-monitoring.json | ⬜ |
| 178 | 如何通过监控检测异常登录行为？ | debugging | 3 | security-monitoring.json | ⬜ |
| 179 | Falco 在 Kubernetes 安全监控中的作用 | purpose | 3 | security-monitoring.json | ⬜ |
| 180 | 如何构建一套最小可行的安全监控体系？ | project | 4 | security-monitoring.json | ⬜ |
| 181 | 合规要求（如等保）对日志审计的具体要求有哪些？ | requirement | 2 | security-monitoring.json | ⬜ |
| 182 | Kubernetes RBAC 权限变更的审计监控方案 | modification | 4 | security-monitoring.json | ⬜ |
| 183 | 安全监控中"异常基线"（Baseline）如何建立？ | open-ended | 3 | security-monitoring.json | ⬜ |

## 20. 成本与存储 (Cost & Storage)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 184 | 什么是 Metric Cardinality？高基数指标会导致什么问题？ | principle | 2 | cost-storage.json | ⬜ |
| 185 | Label 使用的最佳实践有哪些？哪些值不适合做 Label？ | principle | 2 | cost-storage.json | ⬜ |
| 186 | 如何监控 Prometheus 自身的内存和存储使用？ | debugging | 2 | cost-storage.json | ⬜ |
| 187 | Prometheus 的 Retention 配置（基于时间 vs 基于大小） | env-config | 2 | cost-storage.json | ⬜ |
| 188 | Downsampling（降采样）的原理和实现方式 | principle | 3 | cost-storage.json | ⬜ |
| 189 | 如何排查导致 Prometheus OOM 的高基数指标？ | debugging | 3 | cost-storage.json | ⬜ |
| 190 | 日志存储成本优化的常见策略 | tuning | 2 | cost-storage.json | ⬜ |
| 191 | Prometheus 存储压缩（Compression）算法的工作原理 | principle | 4 | cost-storage.json | ⬜ |
| 192 | 如何通过 Recording Rules 降低查询时的资源消耗？ | modification | 3 | cost-storage.json | ⬜ |
| 193 | 如何估算 Prometheus 存储容量需求？ | real-data | 3 | cost-storage.json | ⬜ |
| 194 | 什么是 Metric Relabeling？如何用它减少无用指标？ | modification | 2 | cost-storage.json | ⬜ |

---

## 补充题目 (Supplementary Questions)

> 以下题目用于补齐类型分布，覆盖跨子主题的综合场景。

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 195 | 从零搭建一套完整的 Kubernetes 可观测性平台需要哪些组件？ | project | 4 | supplementary.json | ⬜ |
| 196 | 如何将现有 Spring Boot 应用接入 OpenTelemetry？ | modification | 2 | supplementary.json | ⬜ |
| 197 | Prometheus Operator 中 ServiceMonitor 和 PodMonitor 的区别 | trivia | 2 | supplementary.json | ⬜ |
| 198 | 如何通过 PromQL 分析某次故障的影响范围？ | real-data | 3 | supplementary.json | ⬜ |
| 199 | 大规模集群下 Prometheus 的性能瓶颈和调优手段 | tuning | 4 | supplementary.json | ⬜ |
| 200 | 如何实现 Metrics、Logs、Traces 三者的关联查询？ | modification | 3 | supplementary.json | ⬜ |
| 201 | 监控系统自身的高可用方案如何设计？ | open-ended | 3 | supplementary.json | ⬜ |
| 202 | 如何用 Grafana + Prometheus 构建业务指标看板？ | practice | 2 | supplementary.json | ⬜ |
| 203 | 线上出现大量 5xx 错误，如何利用监控快速定位？ | debugging | 2 | supplementary.json | ⬜ |
| 204 | `histogram_quantile()` 计算结果不准确的常见原因 | debugging | 4 | supplementary.json | ⬜ |
| 205 | 可观测性驱动开发（Observability-Driven Development）是什么理念？ | open-ended | 2 | supplementary.json | ⬜ |
| 206 | 监控目标（Target）频繁 Down 的排查思路 | debugging | 1 | supplementary.json | ⬜ |
| 207 | 如何修改 Prometheus 的 External Labels 实现多环境标识？ | modification | 1 | supplementary.json | ⬜ |
| 208 | 生产环境中一个完整监控告警的配置实例（从采集到通知） | real-data | 4 | supplementary.json | ⬜ |
| 209 | 什么是 eBPF-based Monitoring？与传统 Agent 监控有何区别？ | open-ended | 4 | supplementary.json | ⬜ |
| 210 | 什么是 Golden Dashboard？每个服务应该有怎样的标准监控面板？ | purpose | 1 | supplementary.json | ⬜ |
| 211 | 如何用 `changes()` 函数检测配置漂移（Config Drift）？ | purpose | 2 | supplementary.json | ⬜ |
| 212 | 开源日志方案（ELK vs PLG）的总体拥有成本对比 | real-data | 2 | supplementary.json | ⬜ |
| 213 | 云厂商监控（CloudWatch、Azure Monitor）与自建 Prometheus 如何选择？ | open-ended | 2 | supplementary.json | ⬜ |

---

## 统计汇总

### 按类型统计

| type | 目标 | 实际 |
|------|------|------|
| concept | ~25 | 28 |
| principle | ~25 | 34 |
| comparison | ~18 | 23 |
| trivia | ~18 | 18 |
| env-config | ~15 | 16 |
| modification | ~12 | 11 |
| purpose | ~15 | 13 |
| open-ended | ~15 | 14 |
| debugging | ~15 | 17 |
| real-data | ~10 | 10 |
| requirement | ~10 | 12 |
| tuning | ~10 | 6 |
| practice | ~7 | 7 |
| project | ~5 | 4 |
| **合计** | **~200** | **213** |

### 按难度统计

| difficulty | 目标 | 实际 |
|-----------|------|------|
| 1 | ~50 | 45 |
| 2 | ~70 | 93 |
| 3 | ~55 | 57 |
| 4 | ~25 | 18 |
| **合计** | **~200** | **213** |

### 按子主题统计

| # | 子主题 | 题数 |
|---|--------|------|
| 1 | 可观测性基础 | 10 |
| 2 | Prometheus 基础 | 12 |
| 3 | Prometheus 进阶 | 11 |
| 4 | Grafana | 10 |
| 5 | 告警系统 | 11 |
| 6 | 日志收集 | 11 |
| 7 | 日志存储与查询 | 10 |
| 8 | 链路追踪 | 11 |
| 9 | 指标设计 | 10 |
| 10 | APM | 8 |
| 11 | 基础设施监控 | 10 |
| 12 | 网络监控 | 8 |
| 13 | 数据库监控 | 9 |
| 14 | 事件管理 | 9 |
| 15 | SRE 实践 | 10 |
| 16 | 容量规划 | 8 |
| 17 | 自定义 Exporter | 7 |
| 18 | 指标聚合 | 9 |
| 19 | 安全监控 | 9 |
| 20 | 成本与存储 | 11 |
| 补充 | 跨主题综合 | 19 |
| **合计** | | **213** |
