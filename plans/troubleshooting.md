# 排错与部署面试题子计划

> 领域: troubleshooting | 目标: ~200 题 | 状态: 规划中

## 题型分布统计

| 题型 | type key | 目标 | 实际 |
|------|----------|------|------|
| 概念定义 | concept | ~25 | 28 |
| 原理机制 | principle | ~25 | 29 |
| 对比辨析 | comparison | ~18 | 24 |
| 细碎知识 | trivia | ~18 | 16 |
| 系统环境 | env-config | ~15 | 16 |
| 修改变更 | modification | ~12 | 13 |
| 作用分析 | purpose | ~15 | 9 |
| 开放设计 | open-ended | ~15 | 12 |
| 排查定位 | debugging | ~15 | 28 |
| 真实数据 | real-data | ~10 | 4 |
| 需求分析 | requirement | ~10 | 6 |
| 调优实践 | tuning | ~10 | 5 |
| 最佳实践 | practice | ~7 | 6 |
| 结合项目 | project | ~5 | 4 |
| **合计** | | **~200** | **200** |

## 难度分布统计

| 难度 | 目标 | 实际 |
|------|------|------|
| 1 基础 | ~50 | 47 |
| 2 进阶 | ~70 | 100 |
| 3 高级 | ~55 | 45 |
| 4 专家 | ~25 | 8 |
| **合计** | **~200** | **200** |

---

## 1. 排查方法论

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 1 | 什么是排查问题的 Divide and Conquer 方法 | concept | 1 | troubleshooting/divide-and-conquer-concept.json | ⬜ |
| 2 | USE Method 是什么，包含哪三个维度 | concept | 1 | troubleshooting/use-method-concept.json | ⬜ |
| 3 | RED Method 的三个指标分别指什么 | concept | 1 | troubleshooting/red-method-concept.json | ⬜ |
| 4 | USE Method 和 RED Method 适用场景有什么区别 | comparison | 2 | troubleshooting/use-vs-red-method.json | ⬜ |
| 5 | 排查问题时如何快速缩小故障范围 | principle | 2 | troubleshooting/narrow-down-fault-scope.json | ⬜ |
| 6 | 什么是 Five Whys 分析法，在排查中怎么用 | concept | 1 | troubleshooting/five-whys-analysis.json | ⬜ |
| 7 | 线上故障的第一响应流程应该是什么样的 | practice | 2 | troubleshooting/incident-first-response.json | ⬜ |
| 8 | 如何设计一个标准化的故障排查 Checklist | open-ended | 2 | troubleshooting/troubleshooting-checklist-design.json | ⬜ |
| 9 | 排查问题时如何避免「确认偏误」影响判断 | principle | 3 | troubleshooting/avoid-confirmation-bias.json | ⬜ |
| 10 | 什么是 Observability，和 Monitoring 有什么区别 | comparison | 2 | troubleshooting/observability-vs-monitoring.json | ⬜ |

## 2. 系统性能分析

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 11 | 什么是 CPU Profiling，常用的方法有哪些 | concept | 1 | troubleshooting/cpu-profiling-concept.json | ⬜ |
| 12 | top 命令的 load average 三个值分别表示什么 | trivia | 1 | troubleshooting/load-average-meaning.json | ⬜ |
| 13 | 如何区分 CPU bound 和 I/O bound 的性能问题 | comparison | 2 | troubleshooting/cpu-bound-vs-io-bound.json | ⬜ |
| 14 | vmstat 各列输出的含义是什么，怎么读 | trivia | 2 | troubleshooting/vmstat-output-meaning.json | ⬜ |
| 15 | perf top 和 perf record 分别在什么场景下使用 | comparison | 3 | troubleshooting/perf-top-vs-record.json | ⬜ |
| 16 | 什么是 CPU Steal Time，在虚拟化环境中意味着什么 | concept | 2 | troubleshooting/cpu-steal-time.json | ⬜ |
| 17 | 如何用 sar 命令做系统性能的历史回溯分析 | env-config | 2 | troubleshooting/sar-history-analysis.json | ⬜ |
| 18 | 系统整体延迟突增，怎么一步步定位到具体瓶颈 | debugging | 3 | troubleshooting/latency-spike-diagnosis.json | ⬜ |
| 19 | mpstat 看到某个 CPU 核心 100% 而其他空闲，可能是什么原因 | debugging | 2 | troubleshooting/single-cpu-core-100.json | ⬜ |
| 20 | 线上环境做性能分析时有哪些注意事项和风险 | practice | 3 | troubleshooting/production-profiling-risks.json | ⬜ |

## 3. 进程问题排查

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 21 | 什么是 Zombie Process，它是怎么产生的 | concept | 1 | troubleshooting/zombie-process-concept.json | ⬜ |
| 22 | 如何找出占用 CPU 最高的进程和线程 | env-config | 1 | troubleshooting/find-high-cpu-process.json | ⬜ |
| 23 | Core Dump 是什么，怎么配置和分析 | principle | 2 | troubleshooting/core-dump-analysis.json | ⬜ |
| 24 | strace 和 ltrace 有什么区别，分别在什么场景用 | comparison | 2 | troubleshooting/strace-vs-ltrace.json | ⬜ |
| 25 | 进程的 D 状态（Uninterruptible Sleep）是什么意思 | trivia | 2 | troubleshooting/process-d-state.json | ⬜ |
| 26 | 怎么排查一个进程的文件描述符泄漏 | debugging | 2 | troubleshooting/fd-leak-diagnosis.json | ⬜ |
| 27 | /proc/PID/status 里有哪些关键字段，各表示什么 | trivia | 2 | troubleshooting/proc-pid-status-fields.json | ⬜ |
| 28 | 进程收到 SIGKILL 和 SIGSEGV 分别怎么排查 | comparison | 3 | troubleshooting/sigkill-vs-sigsegv.json | ⬜ |
| 29 | 如何用 gdb attach 到一个正在运行的进程做调试 | env-config | 3 | troubleshooting/gdb-attach-live-process.json | ⬜ |
| 30 | 大量 Zombie Process 堆积会导致什么问题，怎么清理 | modification | 2 | troubleshooting/zombie-process-cleanup.json | ⬜ |

## 4. 网络问题诊断

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 31 | Connection Timeout 和 Read Timeout 有什么区别 | comparison | 1 | troubleshooting/connection-vs-read-timeout.json | ⬜ |
| 32 | 如何用 ping 和 traceroute 定位网络丢包发生在哪一跳 | principle | 1 | troubleshooting/ping-traceroute-packet-loss.json | ⬜ |
| 33 | DNS 解析失败有哪些常见原因，怎么排查 | debugging | 2 | troubleshooting/dns-failure-diagnosis.json | ⬜ |
| 34 | 什么是 MTU，MTU 不匹配会导致什么问题 | concept | 2 | troubleshooting/mtu-mismatch-issues.json | ⬜ |
| 35 | TCP Retransmission 过多说明什么问题 | principle | 2 | troubleshooting/tcp-retransmission-meaning.json | ⬜ |
| 36 | netstat 和 ss 命令的区别，为什么推荐用 ss | comparison | 1 | troubleshooting/netstat-vs-ss.json | ⬜ |
| 37 | TIME_WAIT 状态过多会导致什么问题，怎么处理 | principle | 2 | troubleshooting/time-wait-too-many.json | ⬜ |
| 38 | 服务端出现大量 CLOSE_WAIT 说明什么 | debugging | 2 | troubleshooting/close-wait-diagnosis.json | ⬜ |
| 39 | 怎么用 curl 的 -w 参数分析 HTTP 请求各阶段耗时 | env-config | 1 | troubleshooting/curl-timing-analysis.json | ⬜ |
| 40 | 跨机房访问延迟突然增大，怎么逐步排查 | open-ended | 3 | troubleshooting/cross-dc-latency-diagnosis.json | ⬜ |
| 41 | 什么是 TCP Half-Open 连接，怎么检测和处理 | concept | 3 | troubleshooting/tcp-half-open-detection.json | ⬜ |

## 5. 磁盘与 I/O 问题

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 42 | 磁盘空间满了但 du 和 df 结果不一致，可能是什么原因 | debugging | 2 | troubleshooting/du-df-mismatch.json | ⬜ |
| 43 | 什么是 inode 耗尽，和磁盘空间满有什么区别 | comparison | 1 | troubleshooting/inode-exhaustion-vs-disk-full.json | ⬜ |
| 44 | I/O Wait 高意味着什么，怎么进一步定位原因 | principle | 2 | troubleshooting/io-wait-high-diagnosis.json | ⬜ |
| 45 | iostat 的 %util、await、svctm 分别表示什么 | trivia | 2 | troubleshooting/iostat-key-metrics.json | ⬜ |
| 46 | 怎么找出哪个进程在大量读写磁盘 | env-config | 1 | troubleshooting/find-io-heavy-process.json | ⬜ |
| 47 | ext4 和 xfs 在大文件场景下性能有什么区别 | comparison | 3 | troubleshooting/ext4-vs-xfs-performance.json | ⬜ |
| 48 | 日志文件被删除但空间没释放，怎么处理 | trivia | 1 | troubleshooting/deleted-file-space-not-freed.json | ⬜ |
| 49 | 什么是 Disk Thrashing，怎么识别和缓解 | concept | 2 | troubleshooting/disk-thrashing-concept.json | ⬜ |
| 50 | RAID 某块盘告警，应该怎么处理和更换 | modification | 3 | troubleshooting/raid-disk-replacement.json | ⬜ |
| 51 | 如何用 fio 做磁盘性能基准测试 | env-config | 2 | troubleshooting/fio-benchmark-usage.json | ⬜ |

## 6. 内存问题

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 52 | OOM Killer 的触发机制是什么，oom_score 怎么算的 | principle | 2 | troubleshooting/oom-killer-mechanism.json | ⬜ |
| 53 | 什么是 Memory Fragmentation，对性能有什么影响 | concept | 2 | troubleshooting/memory-fragmentation-concept.json | ⬜ |
| 54 | Swap Thrashing 是什么现象，怎么判断是否在发生 | concept | 2 | troubleshooting/swap-thrashing-concept.json | ⬜ |
| 55 | 如何检测 C/C++ 程序的 Memory Leak | debugging | 3 | troubleshooting/memory-leak-detection-c.json | ⬜ |
| 56 | free 命令输出的 buffers 和 cached 分别是什么 | trivia | 1 | troubleshooting/free-buffers-vs-cached.json | ⬜ |
| 57 | 系统可用内存很少但没有触发 OOM，这正常吗 | trivia | 1 | troubleshooting/low-available-memory-normal.json | ⬜ |
| 58 | vm.overcommit_memory 的三个值分别代表什么策略 | env-config | 2 | troubleshooting/overcommit-memory-settings.json | ⬜ |
| 59 | 怎么用 valgrind 检测内存泄漏和非法访问 | env-config | 3 | troubleshooting/valgrind-memory-check.json | ⬜ |
| 60 | 进程 RSS 和 VSZ 有什么区别，监控哪个更有意义 | comparison | 1 | troubleshooting/rss-vs-vsz.json | ⬜ |
| 61 | 怎么调整 oom_score_adj 来保护关键进程不被 OOM Kill | modification | 2 | troubleshooting/oom-score-adj-protect.json | ⬜ |

## 7. 应用层排查

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 62 | Go pprof 能采集哪些类型的 Profile | concept | 1 | troubleshooting/go-pprof-profile-types.json | ⬜ |
| 63 | Java Heap Dump 和 Thread Dump 分别用来排查什么问题 | comparison | 2 | troubleshooting/heap-dump-vs-thread-dump.json | ⬜ |
| 64 | 什么是 Flame Graph，怎么解读它 | concept | 2 | troubleshooting/flame-graph-concept.json | ⬜ |
| 65 | 如何用 go tool pprof 排查 Goroutine Leak | debugging | 2 | troubleshooting/goroutine-leak-pprof.json | ⬜ |
| 66 | Java 应用频繁 Full GC 怎么排查 | debugging | 3 | troubleshooting/java-full-gc-diagnosis.json | ⬜ |
| 67 | arthas 和 jstack 排查 Java 线程问题有什么区别 | comparison | 2 | troubleshooting/arthas-vs-jstack.json | ⬜ |
| 68 | 怎么给线上 Go 服务开启 Continuous Profiling | env-config | 2 | troubleshooting/go-continuous-profiling.json | ⬜ |
| 69 | 应用层出现 Connection Pool Exhaustion 怎么排查 | debugging | 3 | troubleshooting/connection-pool-exhaustion.json | ⬜ |
| 70 | 什么是 Distributed Tracing，它怎么帮助排查微服务问题 | principle | 2 | troubleshooting/distributed-tracing-principle.json | ⬜ |
| 71 | 线上 Java 服务 CPU 飙升，用 jstack 的标准排查流程是什么 | practice | 2 | troubleshooting/jstack-cpu-spike-procedure.json | ⬜ |

## 8. 容器问题

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 72 | 容器内进程被 OOM Kill 和宿主机 OOM Kill 有什么区别 | comparison | 2 | troubleshooting/container-oom-vs-host-oom.json | ⬜ |
| 73 | CrashLoopBackOff 状态表示什么，常见原因有哪些 | concept | 1 | troubleshooting/crashloopbackoff-causes.json | ⬜ |
| 74 | Image Pull Failure 有哪些常见原因，怎么排查 | debugging | 1 | troubleshooting/image-pull-failure-diagnosis.json | ⬜ |
| 75 | Overlay2 存储驱动满了怎么清理 | modification | 2 | troubleshooting/overlay2-storage-cleanup.json | ⬜ |
| 76 | 容器内看到的 CPU 核数和实际 limits 不一致，为什么 | trivia | 2 | troubleshooting/container-cpu-visibility.json | ⬜ |
| 77 | 怎么进入一个正在运行的容器做调试（没有 shell 的镜像怎么办） | env-config | 1 | troubleshooting/debug-container-no-shell.json | ⬜ |
| 78 | 容器 DNS 解析慢，可能是什么原因 | debugging | 2 | troubleshooting/container-dns-slow.json | ⬜ |
| 79 | Docker Daemon 卡死不响应，怎么排查和恢复 | debugging | 3 | troubleshooting/docker-daemon-hang.json | ⬜ |
| 80 | 容器的 cgroup 资源限制是怎么工作的 | principle | 2 | troubleshooting/cgroup-resource-limit.json | ⬜ |
| 81 | 多个容器共享宿主机网络命名空间会有什么问题 | purpose | 3 | troubleshooting/shared-network-namespace-issues.json | ⬜ |

## 9. Kubernetes 排查

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 82 | Pod 一直 Pending 状态，常见原因和排查步骤是什么 | debugging | 1 | troubleshooting/pod-pending-diagnosis.json | ⬜ |
| 83 | Service 无法访问后端 Pod，怎么逐步排查 | debugging | 2 | troubleshooting/service-connectivity-diagnosis.json | ⬜ |
| 84 | Ingress 返回 502/503 错误，可能的原因有哪些 | trivia | 2 | troubleshooting/ingress-502-503-causes.json | ⬜ |
| 85 | RBAC 权限不足报错怎么排查和修复 | modification | 2 | troubleshooting/rbac-permission-denied-fix.json | ⬜ |
| 86 | kubectl describe pod 输出中哪些 Events 是关键信息 | purpose | 1 | troubleshooting/kubectl-describe-events.json | ⬜ |
| 87 | Node NotReady 状态怎么排查 | debugging | 2 | troubleshooting/node-notready-diagnosis.json | ⬜ |
| 88 | Pod 的 Readiness Probe 和 Liveness Probe 配置不当会导致什么问题 | purpose | 2 | troubleshooting/probe-misconfiguration-issues.json | ⬜ |
| 89 | 怎么排查 Pod 之间的网络不通问题（CNI 层面） | open-ended | 3 | troubleshooting/cni-network-troubleshoot.json | ⬜ |
| 90 | kubectl logs、exec、port-forward 分别在什么排查场景用 | comparison | 1 | troubleshooting/kubectl-debug-commands.json | ⬜ |
| 91 | Kubernetes 集群 etcd 延迟过高怎么排查 | debugging | 4 | troubleshooting/etcd-high-latency-diagnosis.json | ⬜ |
| 92 | Kubernetes 滚动更新过程中出现服务中断，怎么排查 | open-ended | 3 | troubleshooting/rolling-update-disruption.json | ⬜ |

## 10. 数据库问题

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 93 | 怎么识别和优化 MySQL 慢查询 | principle | 1 | troubleshooting/mysql-slow-query-optimize.json | ⬜ |
| 94 | 什么是数据库 Deadlock，怎么检测和解决 | concept | 2 | troubleshooting/database-deadlock-detection.json | ⬜ |
| 95 | MySQL Replication Lag 过大怎么排查 | debugging | 3 | troubleshooting/mysql-replication-lag.json | ⬜ |
| 96 | 数据库连接池耗尽的常见原因和解决方案 | principle | 2 | troubleshooting/db-connection-pool-exhaustion.json | ⬜ |
| 97 | EXPLAIN 输出中 type 列各值的含义和性能差异 | trivia | 2 | troubleshooting/explain-type-column-meaning.json | ⬜ |
| 98 | 数据库 CPU 突然飙升，排查的第一步应该做什么 | purpose | 2 | troubleshooting/db-cpu-spike-first-step.json | ⬜ |
| 99 | 怎么处理 MySQL 的 Too many connections 错误 | modification | 1 | troubleshooting/mysql-too-many-connections.json | ⬜ |
| 100 | 长事务未提交会导致哪些问题 | principle | 2 | troubleshooting/long-transaction-issues.json | ⬜ |
| 101 | 在线上做 DDL 变更（如加索引）需要注意什么 | practice | 3 | troubleshooting/online-ddl-best-practices.json | ⬜ |
| 102 | 主从切换后数据不一致怎么修复 | modification | 4 | troubleshooting/master-slave-data-inconsistency.json | ⬜ |

## 11. Redis 问题

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 103 | Redis 出现高延迟，怎么用 SLOWLOG 排查 | debugging | 2 | troubleshooting/redis-slowlog-diagnosis.json | ⬜ |
| 104 | Redis 内存突增，怎么定位是哪些 Key 占用的 | debugging | 2 | troubleshooting/redis-memory-spike-diagnosis.json | ⬜ |
| 105 | 什么是 Big Key 问题，为什么要避免 | concept | 1 | troubleshooting/redis-big-key-problem.json | ⬜ |
| 106 | Redis Hot Key 怎么发现和处理 | principle | 2 | troubleshooting/redis-hot-key-handling.json | ⬜ |
| 107 | Redis Cluster Failover 过程中客户端会有什么影响 | principle | 3 | troubleshooting/redis-cluster-failover-impact.json | ⬜ |
| 108 | Redis 持久化导致延迟抖动，怎么优化 | tuning | 3 | troubleshooting/redis-persistence-latency-tuning.json | ⬜ |
| 109 | Redis 的 INFO 命令输出中有哪些关键监控指标 | trivia | 1 | troubleshooting/redis-info-key-metrics.json | ⬜ |
| 110 | CLIENT LIST 中看到大量连接处于 idle 状态，正常吗 | purpose | 2 | troubleshooting/redis-client-list-idle.json | ⬜ |
| 111 | Redis 主从同步断开后重连的 Full Resync 对性能的影响 | real-data | 3 | troubleshooting/redis-full-resync-impact.json | ⬜ |
| 112 | 如何安全地删除一个 Big Key 而不阻塞 Redis | modification | 2 | troubleshooting/redis-safe-delete-big-key.json | ⬜ |

## 12. 消息队列问题

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 113 | 什么是 Consumer Lag，怎么监控和处理 | concept | 1 | troubleshooting/consumer-lag-concept.json | ⬜ |
| 114 | Kafka Consumer Rebalance Storm 是什么，怎么避免 | principle | 3 | troubleshooting/kafka-rebalance-storm.json | ⬜ |
| 115 | 消息丢失发生在哪些环节，分别怎么排查 | principle | 2 | troubleshooting/message-loss-diagnosis.json | ⬜ |
| 116 | Kafka Partition Skew 是什么，怎么检测和处理 | concept | 2 | troubleshooting/kafka-partition-skew.json | ⬜ |
| 117 | Consumer 消费速度跟不上 Producer 怎么处理 | open-ended | 2 | troubleshooting/consumer-cant-keep-up.json | ⬜ |
| 118 | Kafka Broker 磁盘满了怎么紧急处理 | modification | 2 | troubleshooting/kafka-broker-disk-full.json | ⬜ |
| 119 | 消息重复消费的原因有哪些，怎么实现幂等 | principle | 2 | troubleshooting/message-duplicate-idempotent.json | ⬜ |
| 120 | Kafka 的 __consumer_offsets topic 的作用是什么 | purpose | 2 | troubleshooting/consumer-offsets-topic-purpose.json | ⬜ |
| 121 | 消息队列堆积的排查思路和应急方案 | open-ended | 3 | troubleshooting/mq-backlog-emergency.json | ⬜ |
| 122 | Kafka ISR 列表频繁变化说明什么问题 | real-data | 3 | troubleshooting/kafka-isr-fluctuation.json | ⬜ |

## 13. 日志分析技巧

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 123 | grep、awk、sed 在日志分析中的常用组合技巧 | env-config | 1 | troubleshooting/grep-awk-sed-log-analysis.json | ⬜ |
| 124 | 怎么从海量日志中做时间线重建（Timeline Reconstruction） | principle | 3 | troubleshooting/log-timeline-reconstruction.json | ⬜ |
| 125 | 多服务的日志怎么做关联分析（Log Correlation） | principle | 3 | troubleshooting/log-correlation-analysis.json | ⬜ |
| 126 | 结构化日志和非结构化日志各有什么优缺点 | comparison | 1 | troubleshooting/structured-vs-unstructured-log.json | ⬜ |
| 127 | 日志级别（DEBUG/INFO/WARN/ERROR）的使用规范是什么 | concept | 1 | troubleshooting/log-level-conventions.json | ⬜ |
| 128 | 怎么设计日志采样策略来降低日志量但不丢失关键信息 | open-ended | 3 | troubleshooting/log-sampling-strategy.json | ⬜ |
| 129 | 日志中的 TraceID 和 SpanID 是怎么生成和传递的 | principle | 2 | troubleshooting/traceid-spanid-propagation.json | ⬜ |
| 130 | 怎么用 jq 命令分析 JSON 格式的日志 | env-config | 1 | troubleshooting/jq-json-log-analysis.json | ⬜ |
| 131 | ELK Stack 中日志丢失怎么排查 | debugging | 3 | troubleshooting/elk-log-loss-diagnosis.json | ⬜ |
| 132 | 日志量过大导致磁盘写满，怎么配置日志轮转 | modification | 1 | troubleshooting/log-rotation-config.json | ⬜ |

## 14. 网络抓包分析

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 133 | tcpdump 的常用过滤表达式有哪些 | env-config | 1 | troubleshooting/tcpdump-filter-expressions.json | ⬜ |
| 134 | 怎么用 Wireshark 分析 TCP 三次握手和四次挥手 | principle | 2 | troubleshooting/wireshark-tcp-handshake.json | ⬜ |
| 135 | 抓包发现大量 TCP RST 包，可能是什么原因 | debugging | 2 | troubleshooting/tcp-rst-packet-causes.json | ⬜ |
| 136 | 怎么用 tcpdump 抓取特定端口的 HTTP 请求和响应 | env-config | 1 | troubleshooting/tcpdump-http-capture.json | ⬜ |
| 137 | TCP Stream 分析中怎么判断是客户端还是服务端的问题 | principle | 3 | troubleshooting/tcp-stream-client-vs-server.json | ⬜ |
| 138 | 抓包文件过大怎么高效过滤和分析 | tuning | 2 | troubleshooting/large-pcap-efficient-analysis.json | ⬜ |
| 139 | 在 HTTPS 环境下怎么做 HTTP 层面的抓包分析 | trivia | 3 | troubleshooting/https-http-layer-capture.json | ⬜ |
| 140 | tcpdump 和 tshark 在命令行抓包分析中的区别 | comparison | 2 | troubleshooting/tcpdump-vs-tshark.json | ⬜ |

## 15. 部署故障

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 141 | 什么是 Deployment Rollback，Kubernetes 中怎么操作 | concept | 1 | troubleshooting/deployment-rollback-concept.json | ⬜ |
| 142 | 什么是 Configuration Drift，怎么检测和预防 | concept | 2 | troubleshooting/configuration-drift-concept.json | ⬜ |
| 143 | 依赖冲突（Dependency Conflict）导致部署失败怎么排查 | debugging | 2 | troubleshooting/dependency-conflict-diagnosis.json | ⬜ |
| 144 | Blue-Green Deployment 和 Canary Deployment 的回滚策略区别 | comparison | 2 | troubleshooting/blue-green-vs-canary-rollback.json | ⬜ |
| 145 | 部署新版本后 Pod 启动超时，怎么排查 | debugging | 2 | troubleshooting/pod-startup-timeout.json | ⬜ |
| 146 | 怎么实现数据库 Schema Migration 的安全回滚 | open-ended | 3 | troubleshooting/schema-migration-rollback.json | ⬜ |
| 147 | Feature Flag 在降低部署风险中起什么作用 | purpose | 2 | troubleshooting/feature-flag-deployment-risk.json | ⬜ |
| 148 | Helm Release 失败后怎么排查和修复 | modification | 3 | troubleshooting/helm-release-failure-fix.json | ⬜ |
| 149 | CI/CD Pipeline 中构建通过但部署失败的常见原因 | trivia | 2 | troubleshooting/build-pass-deploy-fail-causes.json | ⬜ |
| 150 | 灰度发布过程中发现异常，怎么快速止损 | requirement | 3 | troubleshooting/canary-release-emergency-stop.json | ⬜ |

## 16. 高可用问题

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 151 | 什么是 Split-Brain 问题，怎么预防 | concept | 2 | troubleshooting/split-brain-prevention.json | ⬜ |
| 152 | Failover 之后数据不一致怎么检测和修复 | open-ended | 4 | troubleshooting/failover-data-inconsistency.json | ⬜ |
| 153 | Keepalived 的 VIP 漂移失败怎么排查 | debugging | 3 | troubleshooting/keepalived-vip-failover-fail.json | ⬜ |
| 154 | 主从切换时客户端连接怎么做到无感知 | requirement | 3 | troubleshooting/transparent-failover-client.json | ⬜ |
| 155 | 脑裂之后两个 Master 都在写数据，怎么恢复 | modification | 4 | troubleshooting/dual-master-recovery.json | ⬜ |
| 156 | 健康检查的超时和间隔参数怎么设置才合理 | tuning | 2 | troubleshooting/healthcheck-timeout-tuning.json | ⬜ |
| 157 | 怎么做 Chaos Engineering 来验证系统的高可用性 | open-ended | 3 | troubleshooting/chaos-engineering-ha-validation.json | ⬜ |
| 158 | 多活架构下流量切换失败怎么排查 | project | 4 | troubleshooting/multi-active-traffic-switch-fail.json | ⬜ |
| 159 | 什么是 Graceful Degradation，降级策略怎么设计 | principle | 2 | troubleshooting/graceful-degradation-design.json | ⬜ |
| 160 | 分布式锁失效导致数据不一致怎么排查 | debugging | 4 | troubleshooting/distributed-lock-failure.json | ⬜ |

## 17. 性能基线与回归

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 161 | 什么是 Performance Baseline，怎么建立 | concept | 1 | troubleshooting/performance-baseline-concept.json | ⬜ |
| 162 | 怎么检测 Performance Regression | principle | 2 | troubleshooting/performance-regression-detection.json | ⬜ |
| 163 | Benchmark 测试结果受哪些因素干扰，怎么保证可重复性 | trivia | 3 | troubleshooting/benchmark-reproducibility.json | ⬜ |
| 164 | P50、P99、P999 延迟指标分别表示什么，为什么不看平均值 | concept | 1 | troubleshooting/percentile-latency-meaning.json | ⬜ |
| 165 | 怎么在 CI/CD 中集成性能回归测试 | requirement | 3 | troubleshooting/cicd-performance-regression.json | ⬜ |
| 166 | SLA/SLO/SLI 三者的区别和关系 | comparison | 1 | troubleshooting/sla-slo-sli-difference.json | ⬜ |
| 167 | 怎么用 Grafana 做性能基线的可视化对比 | env-config | 2 | troubleshooting/grafana-baseline-comparison.json | ⬜ |
| 168 | 性能测试中 Warm-up 阶段的必要性是什么 | purpose | 2 | troubleshooting/benchmark-warmup-necessity.json | ⬜ |
| 169 | 服务上线后 Latency P99 从 50ms 涨到 200ms，怎么定位原因 | real-data | 3 | troubleshooting/p99-latency-regression-diagnosis.json | ⬜ |
| 170 | 压测工具 wrk、vegeta、k6 各有什么特点 | comparison | 2 | troubleshooting/wrk-vegeta-k6-comparison.json | ⬜ |

## 18. 事故复盘

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 171 | Postmortem 文档应该包含哪些核心内容 | concept | 1 | troubleshooting/postmortem-document-structure.json | ⬜ |
| 172 | Root Cause Analysis 和 Contributing Factors 有什么区别 | comparison | 2 | troubleshooting/rca-vs-contributing-factors.json | ⬜ |
| 173 | 事故复盘中如何做好时间线还原 | principle | 2 | troubleshooting/incident-timeline-reconstruction.json | ⬜ |
| 174 | Action Items 怎么写才能真正落地执行 | practice | 2 | troubleshooting/actionable-action-items.json | ⬜ |
| 175 | 什么是 Blameless Postmortem，为什么很重要 | concept | 1 | troubleshooting/blameless-postmortem-concept.json | ⬜ |
| 176 | 怎么衡量一次故障的影响范围和严重程度（Severity Level） | requirement | 2 | troubleshooting/incident-severity-assessment.json | ⬜ |
| 177 | 从一次线上事故中应该提取哪些系统改进点 | open-ended | 2 | troubleshooting/systemic-improvements-from-incident.json | ⬜ |
| 178 | 复盘发现监控覆盖不足，怎么补充告警规则 | requirement | 2 | troubleshooting/post-incident-alerting-gaps.json | ⬜ |
| 179 | 怎么建立事故复盘的文化，避免走过场 | project | 3 | troubleshooting/postmortem-culture-building.json | ⬜ |
| 180 | MTTR 和 MTTD 分别是什么，怎么缩短 | comparison | 2 | troubleshooting/mttr-vs-mttd.json | ⬜ |

## 19. 容量问题

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 181 | 突发流量（Traffic Spike）打爆服务怎么应急处理 | open-ended | 2 | troubleshooting/traffic-spike-emergency.json | ⬜ |
| 182 | 什么是 Throttling（限流），常见的限流算法有哪些 | principle | 1 | troubleshooting/throttling-algorithms.json | ⬜ |
| 183 | 队列积压（Queue Backlog）怎么排查和处理 | debugging | 2 | troubleshooting/queue-backlog-diagnosis.json | ⬜ |
| 184 | 服务的 Resource Exhaustion 有哪些常见表现 | trivia | 1 | troubleshooting/resource-exhaustion-symptoms.json | ⬜ |
| 185 | 怎么做容量规划（Capacity Planning）来避免资源不足 | requirement | 3 | troubleshooting/capacity-planning-approach.json | ⬜ |
| 186 | 自动扩缩容（HPA）触发不及时怎么调优 | tuning | 3 | troubleshooting/hpa-scaling-too-slow-tuning.json | ⬜ |
| 187 | 连接数、线程数、文件描述符这些系统限制怎么查看和调整 | env-config | 1 | troubleshooting/system-limits-ulimit.json | ⬜ |
| 188 | 熔断（Circuit Breaker）和降级（Degradation）的区别 | comparison | 2 | troubleshooting/circuit-breaker-vs-degradation.json | ⬜ |
| 189 | 线上服务 QPS 从 1000 涨到 5000，需要关注哪些容量指标 | real-data | 2 | troubleshooting/qps-growth-capacity-checklist.json | ⬜ |
| 190 | 怎么用压测验证系统的容量上限 | tuning | 2 | troubleshooting/load-test-capacity-ceiling.json | ⬜ |

## 20. 安全事件响应

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 191 | 入侵检测（IDS）和入侵防御（IPS）有什么区别 | comparison | 1 | troubleshooting/ids-vs-ips.json | ⬜ |
| 192 | 发现服务器被入侵后的第一响应步骤是什么 | practice | 2 | troubleshooting/intrusion-first-response.json | ⬜ |
| 193 | 密钥/密码泄露后的应急处理流程是什么 | principle | 2 | troubleshooting/credential-leak-response.json | ⬜ |
| 194 | DDoS 攻击有哪些类型，怎么缓解 | concept | 2 | troubleshooting/ddos-types-mitigation.json | ⬜ |
| 195 | 怎么检测服务器上是否有异常进程或后门 | debugging | 3 | troubleshooting/detect-malicious-process.json | ⬜ |
| 196 | CVE 漏洞披露后的补丁管理流程是什么 | principle | 2 | troubleshooting/cve-patch-management.json | ⬜ |
| 197 | 安全事件的日志审计应该关注哪些内容 | purpose | 2 | troubleshooting/security-audit-log-focus.json | ⬜ |
| 198 | 容器镜像中发现高危漏洞怎么处理 | modification | 2 | troubleshooting/container-image-vulnerability.json | ⬜ |
| 199 | 怎么设计一个安全事件响应的 Runbook | project | 4 | troubleshooting/security-incident-runbook.json | ⬜ |
| 200 | 零信任架构（Zero Trust）在故障排查中带来哪些额外挑战 | project | 4 | troubleshooting/zero-trust-troubleshooting-challenges.json | ⬜ |

---

## 统计校验

### 子主题覆盖

| # | 子主题 | 题数 |
|---|--------|------|
| 1 | 排查方法论 | 10 |
| 2 | 系统性能分析 | 10 |
| 3 | 进程问题排查 | 10 |
| 4 | 网络问题诊断 | 11 |
| 5 | 磁盘与 I/O 问题 | 10 |
| 6 | 内存问题 | 10 |
| 7 | 应用层排查 | 10 |
| 8 | 容器问题 | 10 |
| 9 | Kubernetes 排查 | 11 |
| 10 | 数据库问题 | 10 |
| 11 | Redis 问题 | 10 |
| 12 | 消息队列问题 | 10 |
| 13 | 日志分析技巧 | 10 |
| 14 | 网络抓包分析 | 8 |
| 15 | 部署故障 | 10 |
| 16 | 高可用问题 | 10 |
| 17 | 性能基线与回归 | 10 |
| 18 | 事故复盘 | 10 |
| 19 | 容量问题 | 10 |
| 20 | 安全事件响应 | 10 |
| **合计** | | **200** |
