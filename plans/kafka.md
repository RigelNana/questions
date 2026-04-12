# Kafka 面试题子计划

> 领域: kafka | 目标: ~200 题 | 状态: 规划中
>
> 类型分布: concept ~25, principle ~25, comparison ~18, trivia ~18, env-config ~15, modification ~12, purpose ~15, open-ended ~15, debugging ~15, real-data ~10, requirement ~10, tuning ~10, practice ~7, project ~5
>
> 难度分布: ①~50, ②~70, ③~55, ④~25
>
> 已有题目: 0 / 200

---

## 1. 核心概念 (broker, topic, partition, offset, segment)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 1 | Kafka 中 Broker 的角色是什么？ | concept | 1 | `kafka-core-broker-role` | 🔲 |
| 2 | Topic 与 Partition 的关系是什么？ | concept | 1 | `kafka-core-topic-partition-relation` | 🔲 |
| 3 | 什么是 Offset？它在消费中起什么作用？ | concept | 1 | `kafka-core-offset-role` | 🔲 |
| 4 | Kafka 的 Segment 文件由哪几部分组成？ | concept | 2 | `kafka-core-segment-structure` | 🔲 |
| 5 | Kafka 集群中 Broker 之间如何感知彼此？ | principle | 2 | `kafka-core-broker-discovery` | 🔲 |
| 6 | 一个 Topic 应该设置多少个 Partition？依据是什么？ | open-ended | 3 | `kafka-core-partition-count-decision` | 🔲 |
| 7 | Kafka 中 Offset 是全局唯一的吗？为什么？ | trivia | 2 | `kafka-core-offset-scope` | 🔲 |
| 8 | Topic 的 `__consumer_offsets` 有什么特殊之处？ | purpose | 2 | `kafka-core-consumer-offsets-topic` | 🔲 |
| 9 | 为什么 Kafka 选择 Append-Only Log 作为存储模型？ | principle | 2 | `kafka-core-append-only-log-reason` | 🔲 |
| 10 | Broker、Topic、Partition 三者的层次关系图是怎样的？ | concept | 1 | `kafka-core-hierarchy` | 🔲 |
| 11 | Kafka 的消息是如何定位到具体 Segment 文件的？ | principle | 3 | `kafka-core-message-locate-segment` | 🔲 |
| 12 | 解释 Kafka 中 Partition 的有序性保证 | principle | 2 | `kafka-core-partition-ordering` | 🔲 |

---

## 2. 生产者 (producer API, partitioner, acks, batch, compression, idempotent)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 13 | KafkaProducer 的 send() 方法是同步还是异步的？ | concept | 1 | `kafka-producer-send-sync-async` | 🔲 |
| 14 | Producer 的 acks 参数有哪些取值？分别代表什么？ | concept | 1 | `kafka-producer-acks-values` | 🔲 |
| 15 | acks=0、acks=1、acks=all 的性能与可靠性对比 | comparison | 2 | `kafka-producer-acks-comparison` | 🔲 |
| 16 | Producer 的默认 Partitioner 是如何选择分区的？ | principle | 2 | `kafka-producer-default-partitioner` | 🔲 |
| 17 | 什么是 Producer 的幂等性(Idempotent)？如何开启？ | concept | 2 | `kafka-producer-idempotent` | 🔲 |
| 18 | batch.size 和 linger.ms 如何协同工作？ | principle | 2 | `kafka-producer-batch-linger` | 🔲 |
| 19 | Producer 支持哪些压缩算法？各有什么优劣？ | comparison | 2 | `kafka-producer-compression-algorithms` | 🔲 |
| 20 | 如何实现自定义 Partitioner？ | modification | 3 | `kafka-producer-custom-partitioner` | 🔲 |
| 21 | Producer 端 buffer.memory 耗尽时会发生什么？ | debugging | 2 | `kafka-producer-buffer-memory-full` | 🔲 |
| 22 | 如何保证 Producer 发送消息的顺序性？ | requirement | 3 | `kafka-producer-ordering-guarantee` | 🔲 |
| 23 | Producer 的 Callback 机制是如何工作的？ | principle | 2 | `kafka-producer-callback-mechanism` | 🔲 |
| 24 | max.in.flight.requests.per.connection 对顺序性的影响 | tuning | 3 | `kafka-producer-inflight-requests-ordering` | 🔲 |

---

## 3. 消费者基础 (consumer group, offset commit, rebalance, poll loop)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 25 | 什么是 Consumer Group？它解决了什么问题？ | concept | 1 | `kafka-consumer-group-purpose` | 🔲 |
| 26 | Consumer 的自动提交与手动提交有什么区别？ | comparison | 1 | `kafka-consumer-auto-vs-manual-commit` | 🔲 |
| 27 | 什么是 Rebalance？什么情况下会触发？ | concept | 2 | `kafka-consumer-rebalance-trigger` | 🔲 |
| 28 | poll() 方法的超时参数有什么意义？ | concept | 1 | `kafka-consumer-poll-timeout` | 🔲 |
| 29 | Consumer Group 中消费者数量超过 Partition 数量会怎样？ | trivia | 1 | `kafka-consumer-more-than-partitions` | 🔲 |
| 30 | enable.auto.commit 设为 true 可能带来什么问题？ | debugging | 2 | `kafka-consumer-auto-commit-issues` | 🔲 |
| 31 | 如何实现 Consumer 的优雅关闭？ | practice | 2 | `kafka-consumer-graceful-shutdown` | 🔲 |
| 32 | max.poll.interval.ms 与 session.timeout.ms 的区别 | comparison | 2 | `kafka-consumer-poll-vs-session-timeout` | 🔲 |
| 33 | 解释 Consumer 的 Heartbeat 线程机制 | principle | 2 | `kafka-consumer-heartbeat-thread` | 🔲 |
| 34 | 消费者 Offset 提交失败会导致什么后果？ | debugging | 2 | `kafka-consumer-offset-commit-failure` | 🔲 |

---

## 4. 消费者进阶 (rebalance strategies, sticky assignor, cooperative rebalance, static membership)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 35 | Kafka 内置了哪几种 Partition Assignment 策略？ | concept | 2 | `kafka-consumer-adv-assignment-strategies` | 🔲 |
| 36 | Range Assignor 与 RoundRobin Assignor 有什么区别？ | comparison | 2 | `kafka-consumer-adv-range-vs-roundrobin` | 🔲 |
| 37 | 什么是 Sticky Assignor？它解决了什么问题？ | concept | 3 | `kafka-consumer-adv-sticky-assignor` | 🔲 |
| 38 | Cooperative Rebalance 与 Eager Rebalance 有何不同？ | comparison | 3 | `kafka-consumer-adv-cooperative-vs-eager` | 🔲 |
| 39 | 什么是 Static Membership？group.instance.id 的作用 | concept | 3 | `kafka-consumer-adv-static-membership` | 🔲 |
| 40 | 如何在不停服的情况下完成 Consumer Group 滚动升级？ | practice | 3 | `kafka-consumer-adv-rolling-upgrade` | 🔲 |
| 41 | CooperativeStickyAssignor 的增量 Rebalance 流程是怎样的？ | principle | 4 | `kafka-consumer-adv-incremental-rebalance` | 🔲 |
| 42 | 如何将现有 Consumer Group 从 Eager 迁移到 Cooperative 协议？ | modification | 3 | `kafka-consumer-adv-migrate-to-cooperative` | 🔲 |
| 43 | 什么场景下 Static Membership 会带来显著收益？ | real-data | 3 | `kafka-consumer-adv-static-membership-benefit` | 🔲 |

---

## 5. 分区与副本 (leader/follower, ISR, OSR, leader election, preferred replica)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 44 | Kafka 的 Leader 和 Follower 副本分别承担什么职责？ | concept | 1 | `kafka-replica-leader-follower-role` | 🔲 |
| 45 | 什么是 ISR（In-Sync Replicas）？如何维护？ | concept | 2 | `kafka-replica-isr-definition` | 🔲 |
| 46 | 什么是 OSR（Out-of-Sync Replicas）？Follower 如何重新加入 ISR？ | principle | 3 | `kafka-replica-osr-rejoin-isr` | 🔲 |
| 47 | Preferred Replica Election 是什么意思？ | concept | 2 | `kafka-replica-preferred-election` | 🔲 |
| 48 | replica.lag.time.max.ms 这个参数控制什么行为？ | env-config | 2 | `kafka-replica-lag-time-max` | 🔲 |
| 49 | Leader Epoch 的作用是什么？ | purpose | 3 | `kafka-replica-leader-epoch-purpose` | 🔲 |
| 50 | 如果 ISR 中只剩 Leader 一个副本，写入会失败吗？ | debugging | 3 | `kafka-replica-isr-only-leader` | 🔲 |
| 51 | Follower 是如何从 Leader 拉取数据的？ | principle | 2 | `kafka-replica-follower-fetch` | 🔲 |
| 52 | ISR 与 AR (Assigned Replicas) 的关系是什么？ | comparison | 2 | `kafka-replica-isr-vs-ar` | 🔲 |
| 53 | 分区 Leader 选举的具体流程是什么？ | principle | 3 | `kafka-replica-leader-election-flow` | 🔲 |

---

## 6. 可靠性保证 (exactly-once, at-least-once, at-most-once, transactional API)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 54 | 解释 Kafka 中 At-Most-Once、At-Least-Once、Exactly-Once 三种语义 | concept | 2 | `kafka-reliability-three-semantics` | 🔲 |
| 55 | Kafka 如何实现 Exactly-Once Semantics (EOS)？ | principle | 3 | `kafka-reliability-eos-impl` | 🔲 |
| 56 | Transactional API 的使用步骤是什么？ | practice | 3 | `kafka-reliability-transactional-api-steps` | 🔲 |
| 57 | 幂等性 Producer 如何通过 PID + Sequence Number 去重？ | principle | 3 | `kafka-reliability-pid-sequence-dedup` | 🔲 |
| 58 | transaction.timeout.ms 设置过短会导致什么问题？ | debugging | 3 | `kafka-reliability-tx-timeout-issue` | 🔲 |
| 59 | 消费端如何配合 Transactional Producer 实现 EOS？ | principle | 4 | `kafka-reliability-consumer-eos` | 🔲 |
| 60 | isolation.level 设为 read_committed 与 read_uncommitted 的区别 | comparison | 3 | `kafka-reliability-isolation-level` | 🔲 |
| 61 | Kafka 的 EOS 是否意味着端到端的 Exactly-Once？ | open-ended | 3 | `kafka-reliability-eos-end-to-end` | 🔲 |
| 62 | enable.idempotence=true 时，哪些参数会被自动调整？ | trivia | 3 | `kafka-reliability-idempotence-auto-config` | 🔲 |
| 63 | 跨 Topic 写入如何保证原子性？ | requirement | 4 | `kafka-reliability-cross-topic-atomicity` | 🔲 |

---

## 7. 存储机制 (log segment, index file, timeindex, log compaction, retention)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 64 | Kafka 的日志文件 (.log)、索引文件 (.index)、时间索引 (.timeindex) 各有什么作用？ | concept | 2 | `kafka-storage-log-index-timeindex` | 🔲 |
| 65 | Log Segment 文件名是如何命名的？ | trivia | 1 | `kafka-storage-segment-naming` | 🔲 |
| 66 | 什么是 Log Compaction？适用于什么场景？ | concept | 2 | `kafka-storage-log-compaction` | 🔲 |
| 67 | log.retention.hours 与 log.retention.bytes 哪个优先级更高？ | trivia | 2 | `kafka-storage-retention-priority` | 🔲 |
| 68 | Log Compaction 过程中 Cleaner 线程做了什么？ | principle | 3 | `kafka-storage-compaction-cleaner-thread` | 🔲 |
| 69 | 如何通过 Offset 快速定位到 Segment 中的消息？ | principle | 3 | `kafka-storage-offset-to-message` | 🔲 |
| 70 | log.segment.bytes 和 log.roll.hours 的作用是什么？ | env-config | 2 | `kafka-storage-segment-roll-config` | 🔲 |
| 71 | delete 策略和 compact 策略可以同时配置吗？ | trivia | 2 | `kafka-storage-delete-and-compact` | 🔲 |
| 72 | Log Compaction 是否会丢失消息？Tombstone 记录是什么？ | principle | 3 | `kafka-storage-compaction-tombstone` | 🔲 |
| 73 | Kafka 的稀疏索引(Sparse Index)与 B-Tree 索引有什么区别？ | comparison | 3 | `kafka-storage-sparse-vs-btree` | 🔲 |

---

## 8. 网络模型 (request handling, NIO, zero-copy sendfile)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 74 | Kafka Broker 的网络线程模型是怎样的？ | concept | 2 | `kafka-network-thread-model` | 🔲 |
| 75 | 什么是 Zero-Copy？Kafka 如何利用 sendfile 优化传输？ | principle | 3 | `kafka-network-zero-copy-sendfile` | 🔲 |
| 76 | Acceptor 线程、Network 线程、IO 线程各自的职责是什么？ | concept | 3 | `kafka-network-acceptor-network-io` | 🔲 |
| 77 | num.network.threads 和 num.io.threads 应该如何设置？ | tuning | 3 | `kafka-network-thread-count-tuning` | 🔲 |
| 78 | Kafka 使用 Java NIO 的 Selector 还是 Epoll？ | trivia | 3 | `kafka-network-nio-selector-epoll` | 🔲 |
| 79 | 为什么 Kafka 不使用 Netty 而是自己实现网络层？ | open-ended | 3 | `kafka-network-why-not-netty` | 🔲 |
| 80 | Request Queue 与 Response Queue 在 Broker 中的作用 | principle | 3 | `kafka-network-request-response-queue` | 🔲 |
| 81 | PageCache 在 Kafka 读写中起到什么作用？ | principle | 2 | `kafka-network-pagecache-role` | 🔲 |
| 82 | 传统 IO 读取 vs Kafka 的 Zero-Copy 需要几次拷贝和上下文切换？ | comparison | 3 | `kafka-network-traditional-vs-zerocopy` | 🔲 |

---

## 9. Controller (controller election, partition state machine, replica state machine)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 83 | Kafka Controller 的职责有哪些？ | concept | 2 | `kafka-controller-responsibilities` | 🔲 |
| 84 | Controller 是如何选举出来的？ | principle | 2 | `kafka-controller-election` | 🔲 |
| 85 | Partition State Machine 中有哪几种状态？ | concept | 3 | `kafka-controller-partition-states` | 🔲 |
| 86 | Replica State Machine 中的状态转换流程 | principle | 3 | `kafka-controller-replica-states` | 🔲 |
| 87 | Controller 发生脑裂(Split Brain)时会发生什么？ | debugging | 4 | `kafka-controller-split-brain` | 🔲 |
| 88 | Controller Epoch 的作用是什么？ | purpose | 3 | `kafka-controller-epoch-purpose` | 🔲 |
| 89 | Controller 宕机后 Partition Leader 选举会受什么影响？ | debugging | 3 | `kafka-controller-crash-leader-election` | 🔲 |
| 90 | 当 Broker 加入或离开集群时 Controller 做了什么？ | principle | 2 | `kafka-controller-broker-change` | 🔲 |

---

## 10. ZooKeeper 与 KRaft (ZK dependency, KRaft mode, metadata quorum)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 91 | Kafka 依赖 ZooKeeper 存储哪些元数据？ | concept | 2 | `kafka-zk-metadata-stored` | 🔲 |
| 92 | 什么是 KRaft 模式？为什么要去除 ZooKeeper？ | concept | 2 | `kafka-kraft-why-remove-zk` | 🔲 |
| 93 | KRaft 模式下 Controller Quorum 是如何工作的？ | principle | 3 | `kafka-kraft-controller-quorum` | 🔲 |
| 94 | ZooKeeper 模式与 KRaft 模式的架构对比 | comparison | 3 | `kafka-zk-vs-kraft-architecture` | 🔲 |
| 95 | 如何将现有集群从 ZooKeeper 迁移到 KRaft？ | modification | 4 | `kafka-kraft-migration-from-zk` | 🔲 |
| 96 | KRaft 中 __cluster_metadata Topic 的作用是什么？ | purpose | 3 | `kafka-kraft-cluster-metadata-topic` | 🔲 |
| 97 | ZooKeeper 中 /brokers/ids 节点存储了什么信息？ | trivia | 2 | `kafka-zk-brokers-ids-node` | 🔲 |
| 98 | KRaft 模式对 Kafka 集群性能有哪些提升？ | open-ended | 3 | `kafka-kraft-performance-benefits` | 🔲 |
| 99 | KRaft 模式下 Broker 和 Controller 角色可以合并吗？ | trivia | 2 | `kafka-kraft-combined-mode` | 🔲 |

---

## 11. 性能优化 (batch size, linger.ms, compression, buffer memory, fetch size)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 100 | 调大 batch.size 一定能提升吞吐吗？有什么副作用？ | tuning | 2 | `kafka-perf-batch-size-tradeoff` | 🔲 |
| 101 | linger.ms 设为 0 和设为 5ms 对延迟和吞吐的影响？ | tuning | 2 | `kafka-perf-linger-ms-impact` | 🔲 |
| 102 | 压缩在 Producer 端还是 Broker 端进行？ | trivia | 2 | `kafka-perf-compression-location` | 🔲 |
| 103 | fetch.min.bytes 和 fetch.max.wait.ms 如何配合？ | env-config | 2 | `kafka-perf-fetch-min-bytes-max-wait` | 🔲 |
| 104 | 如何通过 JVM 参数优化 Kafka Broker 性能？ | tuning | 3 | `kafka-perf-jvm-tuning` | 🔲 |
| 105 | Kafka 为什么推荐使用 XFS 文件系统？ | trivia | 3 | `kafka-perf-xfs-recommendation` | 🔲 |
| 106 | 如何通过 OS 参数(vm.dirty_ratio 等)优化 Kafka？ | tuning | 4 | `kafka-perf-os-level-tuning` | 🔲 |
| 107 | Producer 端 compression.type 设为 lz4 vs snappy vs zstd 的吞吐对比 | real-data | 3 | `kafka-perf-compression-benchmark` | 🔲 |
| 108 | Consumer 端 max.poll.records 设置过大或过小的影响 | tuning | 2 | `kafka-perf-max-poll-records` | 🔲 |
| 109 | 如何诊断和解决 Kafka 端到端延迟高的问题？ | debugging | 3 | `kafka-perf-e2e-latency-diagnosis` | 🔲 |

---

## 12. 消息格式 (record batch, header, key/value, timestamp)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 110 | Kafka 消息由哪些字段组成？ | concept | 1 | `kafka-format-message-fields` | 🔲 |
| 111 | Record Batch 与单条 Record 的关系是什么？ | concept | 2 | `kafka-format-record-batch-vs-record` | 🔲 |
| 112 | Kafka 消息中的 Key 为 null 时会怎样分区？ | trivia | 1 | `kafka-format-null-key-partition` | 🔲 |
| 113 | Kafka 消息的 Timestamp 有哪两种类型？ | concept | 2 | `kafka-format-timestamp-types` | 🔲 |
| 114 | Headers 字段在 Kafka 消息中的用途是什么？ | purpose | 2 | `kafka-format-headers-usage` | 🔲 |
| 115 | V0、V1、V2 三种消息格式有什么演进？ | comparison | 3 | `kafka-format-v0-v1-v2-evolution` | 🔲 |
| 116 | 如何计算一条 Kafka 消息的实际大小？ | practice | 2 | `kafka-format-message-size-calc` | 🔲 |
| 117 | message.max.bytes 和 fetch.message.max.bytes 的配合使用 | env-config | 2 | `kafka-format-max-bytes-config` | 🔲 |

---

## 13. Kafka Connect (source/sink connector, offset management, SMT)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 118 | Kafka Connect 是什么？它解决了什么问题？ | concept | 1 | `kafka-connect-overview` | 🔲 |
| 119 | Source Connector 与 Sink Connector 的区别？ | comparison | 1 | `kafka-connect-source-vs-sink` | 🔲 |
| 120 | Kafka Connect 的 Standalone 模式与 Distributed 模式有何不同？ | comparison | 2 | `kafka-connect-standalone-vs-distributed` | 🔲 |
| 121 | 什么是 Single Message Transform (SMT)？举例说明 | concept | 2 | `kafka-connect-smt` | 🔲 |
| 122 | Kafka Connect 如何管理 Offset？ | principle | 3 | `kafka-connect-offset-management` | 🔲 |
| 123 | 如何开发自定义 Kafka Connect Connector？ | modification | 4 | `kafka-connect-custom-connector` | 🔲 |
| 124 | Kafka Connect 与直接使用 Producer/Consumer API 相比有什么优势？ | comparison | 2 | `kafka-connect-vs-producer-consumer` | 🔲 |
| 125 | 如何配置 Kafka Connect 实现 MySQL CDC 到 Kafka？ | practice | 3 | `kafka-connect-mysql-cdc` | 🔲 |

---

## 14. Kafka Streams (topology, state store, exactly-once processing)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 126 | Kafka Streams 与 Flink/Spark Streaming 有什么区别？ | comparison | 2 | `kafka-streams-vs-flink-spark` | 🔲 |
| 127 | 什么是 Kafka Streams 的 Topology？ | concept | 2 | `kafka-streams-topology` | 🔲 |
| 128 | State Store 的作用是什么？有哪些实现？ | concept | 3 | `kafka-streams-state-store` | 🔲 |
| 129 | Kafka Streams 如何实现 Exactly-Once 处理？ | principle | 4 | `kafka-streams-exactly-once` | 🔲 |
| 130 | KTable 与 KStream 的区别是什么？ | comparison | 2 | `kafka-streams-ktable-vs-kstream` | 🔲 |
| 131 | GlobalKTable 的使用场景是什么？ | purpose | 3 | `kafka-streams-global-ktable` | 🔲 |
| 132 | Kafka Streams 中 Windowed Aggregation 有哪些窗口类型？ | concept | 3 | `kafka-streams-window-types` | 🔲 |
| 133 | 如何处理 Kafka Streams 中的 Late-Arriving Data？ | debugging | 3 | `kafka-streams-late-data` | 🔲 |
| 134 | Kafka Streams 的 Interactive Queries 是什么？ | concept | 3 | `kafka-streams-interactive-queries` | 🔲 |

---

## 15. 监控指标 (under-replicated partitions, lag, request latency, JMX metrics)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 135 | UnderReplicatedPartitions 指标代表什么？出现时如何排查？ | debugging | 2 | `kafka-monitor-under-replicated` | 🔲 |
| 136 | Consumer Lag 是什么？如何监控？ | concept | 1 | `kafka-monitor-consumer-lag` | 🔲 |
| 137 | Kafka 中哪些 JMX 指标是必须监控的？ | requirement | 2 | `kafka-monitor-essential-jmx` | 🔲 |
| 138 | RequestLatency 指标异常升高的常见原因 | debugging | 3 | `kafka-monitor-request-latency-causes` | 🔲 |
| 139 | ActiveControllerCount 为 0 代表什么？如何处理？ | debugging | 3 | `kafka-monitor-active-controller-zero` | 🔲 |
| 140 | 如何使用 kafka-consumer-groups.sh 查看消费组状态？ | env-config | 1 | `kafka-monitor-consumer-groups-cli` | 🔲 |
| 141 | ISRShrinkRate 与 ISRExpandRate 指标的意义 | purpose | 3 | `kafka-monitor-isr-shrink-expand` | 🔲 |
| 142 | 如何搭建 Kafka + Prometheus + Grafana 监控体系？ | project | 3 | `kafka-monitor-prometheus-grafana` | 🔲 |
| 143 | LogFlushLatency 指标反映了什么问题？ | debugging | 3 | `kafka-monitor-log-flush-latency` | 🔲 |
| 144 | 生产环境 Consumer Lag 持续增长如何处理？ | real-data | 2 | `kafka-monitor-lag-growing` | 🔲 |

---

## 16. 运维操作 (topic CRUD, partition reassignment, throttling, preferred election)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 145 | 如何创建、删除、修改 Topic 配置？ | env-config | 1 | `kafka-ops-topic-crud` | 🔲 |
| 146 | Topic 的 Partition 数量能增加但不能减少，为什么？ | principle | 2 | `kafka-ops-partition-increase-only` | 🔲 |
| 147 | 什么是 Partition Reassignment？如何操作？ | concept | 3 | `kafka-ops-partition-reassignment` | 🔲 |
| 148 | 如何对 Partition 迁移进行限速(Throttling)？ | env-config | 3 | `kafka-ops-reassignment-throttling` | 🔲 |
| 149 | kafka-preferred-replica-election.sh 的使用场景 | purpose | 2 | `kafka-ops-preferred-election-cli` | 🔲 |
| 150 | 如何安全地下线一个 Broker？ | practice | 3 | `kafka-ops-decommission-broker` | 🔲 |
| 151 | kafka-dump-log.sh 工具的作用是什么？ | purpose | 2 | `kafka-ops-dump-log` | 🔲 |
| 152 | 如何回溯 Consumer Offset 到指定时间点？ | modification | 2 | `kafka-ops-reset-offset-to-time` | 🔲 |
| 153 | 生产环境滚动重启 Kafka 集群的正确步骤 | practice | 3 | `kafka-ops-rolling-restart` | 🔲 |
| 154 | 如何使用 kafka-reassign-partitions.sh 做跨机架迁移？ | modification | 4 | `kafka-ops-cross-rack-migration` | 🔲 |

---

## 17. 安全 (SASL, SSL/TLS, ACL, encryption at rest)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 155 | Kafka 支持哪些安全认证机制？ | concept | 2 | `kafka-security-auth-mechanisms` | 🔲 |
| 156 | SASL/PLAIN 与 SASL/SCRAM 的区别是什么？ | comparison | 3 | `kafka-security-sasl-plain-vs-scram` | 🔲 |
| 157 | 如何为 Kafka 配置 SSL/TLS 加密传输？ | env-config | 3 | `kafka-security-ssl-tls-setup` | 🔲 |
| 158 | Kafka ACL 的授权模型是怎样的？ | concept | 3 | `kafka-security-acl-model` | 🔲 |
| 159 | 如何实现 Kafka 消息的静态加密(Encryption at Rest)？ | requirement | 4 | `kafka-security-encryption-at-rest` | 🔲 |
| 160 | inter.broker.listener.name 配置的作用是什么？ | env-config | 2 | `kafka-security-inter-broker-listener` | 🔲 |
| 161 | 如何配置 Kafka 使用 Kerberos 认证？ | modification | 4 | `kafka-security-kerberos-setup` | 🔲 |
| 162 | SASL/OAUTHBEARER 机制的应用场景 | open-ended | 4 | `kafka-security-oauthbearer` | 🔲 |

---

## 18. 高可用 (rack awareness, min.insync.replicas, unclean leader election)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 163 | min.insync.replicas 配置的作用是什么？ | env-config | 2 | `kafka-ha-min-insync-replicas` | 🔲 |
| 164 | unclean.leader.election.enable 设为 true 有什么风险？ | principle | 3 | `kafka-ha-unclean-leader-election` | 🔲 |
| 165 | 什么是 Rack Awareness？如何配置？ | concept | 2 | `kafka-ha-rack-awareness` | 🔲 |
| 166 | acks=all + min.insync.replicas=2 能保证不丢消息吗？ | principle | 3 | `kafka-ha-acks-all-min-isr` | 🔲 |
| 167 | Kafka 集群在丢失少数 Broker 时如何保证服务不中断？ | open-ended | 2 | `kafka-ha-broker-failure-tolerance` | 🔲 |
| 168 | 多数据中心部署 Kafka 有哪些方案？ | open-ended | 4 | `kafka-ha-multi-dc-deployment` | 🔲 |
| 169 | MirrorMaker 2 的工作原理是什么？ | principle | 3 | `kafka-ha-mirrormaker2` | 🔲 |
| 170 | 如何设计 Kafka 集群的容灾与故障转移方案？ | project | 4 | `kafka-ha-disaster-recovery-plan` | 🔲 |
| 171 | replication.factor 设为 3 时，最多可以容忍几个 Broker 宕机？ | trivia | 1 | `kafka-ha-replication-factor-tolerance` | 🔲 |
| 172 | 跨 Region 的 Kafka 集群延迟如何估算？ | real-data | 4 | `kafka-ha-cross-region-latency` | 🔲 |

---

## 19. 容量规划 (partition count, replication factor, disk sizing, network bandwidth)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 173 | 如何根据吞吐需求计算 Partition 数量？ | requirement | 3 | `kafka-capacity-partition-calculation` | 🔲 |
| 174 | Replication Factor 对磁盘空间的影响如何计算？ | requirement | 2 | `kafka-capacity-replication-disk` | 🔲 |
| 175 | 如何估算 Kafka 集群所需的磁盘空间？ | requirement | 2 | `kafka-capacity-disk-sizing` | 🔲 |
| 176 | 网络带宽是 Kafka 的瓶颈吗？如何评估？ | real-data | 3 | `kafka-capacity-network-bandwidth` | 🔲 |
| 177 | 单个 Broker 承载多少 Partition 是合理的？ | requirement | 3 | `kafka-capacity-partitions-per-broker` | 🔲 |
| 178 | Kafka 集群扩容时应该关注哪些指标？ | open-ended | 2 | `kafka-capacity-scaling-metrics` | 🔲 |
| 179 | 日均 10 亿消息的场景下如何做容量规划？ | real-data | 4 | `kafka-capacity-billion-msg-planning` | 🔲 |
| 180 | Partition 数量过多带来的副作用有哪些？ | principle | 3 | `kafka-capacity-too-many-partitions` | 🔲 |
| 181 | SSD 与 HDD 对 Kafka 性能的影响差异 | comparison | 2 | `kafka-capacity-ssd-vs-hdd` | 🔲 |

---

## 20. 应用场景 (event sourcing, CQRS, CDC, log aggregation, stream processing)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 182 | Kafka 常见的应用场景有哪些？ | concept | 1 | `kafka-usecase-common-scenarios` | 🔲 |
| 183 | 什么是 Event Sourcing？Kafka 如何支持？ | concept | 2 | `kafka-usecase-event-sourcing` | 🔲 |
| 184 | Kafka 在 CQRS 架构中扮演什么角色？ | purpose | 3 | `kafka-usecase-cqrs-role` | 🔲 |
| 185 | 什么是 CDC (Change Data Capture)？Kafka 如何实现？ | concept | 2 | `kafka-usecase-cdc` | 🔲 |
| 186 | Kafka 作为日志聚合系统与 ELK 的关系 | purpose | 2 | `kafka-usecase-log-aggregation-elk` | 🔲 |
| 187 | Kafka 与传统消息队列(RabbitMQ/ActiveMQ)的核心区别 | comparison | 2 | `kafka-usecase-vs-traditional-mq` | 🔲 |
| 188 | 如何基于 Kafka 实现延迟消息？ | modification | 3 | `kafka-usecase-delayed-message` | 🔲 |
| 189 | Kafka 在微服务架构中如何实现异步解耦？ | open-ended | 2 | `kafka-usecase-microservice-decouple` | 🔲 |
| 190 | 如何设计一个基于 Kafka 的实时数据管道？ | project | 3 | `kafka-usecase-realtime-pipeline` | 🔲 |
| 191 | Kafka 在金融交易场景下需要注意什么？ | requirement | 3 | `kafka-usecase-financial-trading` | 🔲 |
| 192 | 基于 Kafka 实现分布式事务的 Saga 模式 | modification | 4 | `kafka-usecase-saga-pattern` | 🔲 |
| 193 | 如何用 Kafka 实现 Exactly-Once 的订单处理？ | project | 4 | `kafka-usecase-exactly-once-order` | 🔲 |
| 194 | Kafka + Debezium 做 CDC 的典型架构 | real-data | 3 | `kafka-usecase-debezium-cdc` | 🔲 |
| 195 | 如何用 Kafka 构建事件驱动的通知系统？ | project | 3 | `kafka-usecase-event-driven-notification` | 🔲 |
| 196 | Kafka 在大数据生态中与 Hadoop/Spark/Flink 的集成方式 | open-ended | 2 | `kafka-usecase-bigdata-integration` | 🔲 |
| 197 | Kafka 消息积压(Backpressure)的常见处理方案 | debugging | 2 | `kafka-usecase-backpressure-handling` | 🔲 |
| 198 | 秒杀场景下 Kafka 如何做流量削峰？ | real-data | 3 | `kafka-usecase-traffic-shaping` | 🔲 |
| 199 | 如何保证 Kafka 消息的全局有序消费？ | requirement | 3 | `kafka-usecase-global-ordering` | 🔲 |
| 200 | 用 Kafka 实现 A/B 测试的事件分流架构 | modification | 3 | `kafka-usecase-ab-test-routing` | 🔲 |

---

## 统计

### 按类型统计

| type | 目标 | 实际 |
|------|------|------|
| concept | ~25 | 26 |
| principle | ~25 | 25 |
| comparison | ~18 | 18 |
| trivia | ~18 | 17 |
| env-config | ~15 | 13 |
| modification | ~12 | 11 |
| purpose | ~15 | 13 |
| open-ended | ~15 | 13 |
| debugging | ~15 | 15 |
| real-data | ~10 | 10 |
| requirement | ~10 | 10 |
| tuning | ~10 | 9 |
| practice | ~7 | 7 |
| project | ~5 | 5 |
| **合计** | **~200** | **200** |

### 按难度统计

| difficulty | 目标 | 实际 |
|-----------|------|------|
| 1 | ~50 | 18 |
| 2 | ~70 | 80 |
| 3 | ~55 | 76 |
| 4 | ~25 | 26 |
| **合计** | **~200** | **200** |

### 按子话题统计

| # | 子话题 | 题数 |
|---|--------|------|
| 1 | 核心概念 | 12 |
| 2 | 生产者 | 12 |
| 3 | 消费者基础 | 10 |
| 4 | 消费者进阶 | 9 |
| 5 | 分区与副本 | 10 |
| 6 | 可靠性保证 | 10 |
| 7 | 存储机制 | 10 |
| 8 | 网络模型 | 9 |
| 9 | Controller | 8 |
| 10 | ZooKeeper 与 KRaft | 9 |
| 11 | 性能优化 | 10 |
| 12 | 消息格式 | 8 |
| 13 | Kafka Connect | 8 |
| 14 | Kafka Streams | 9 |
| 15 | 监控指标 | 10 |
| 16 | 运维操作 | 10 |
| 17 | 安全 | 8 |
| 18 | 高可用 | 10 |
| 19 | 容量规划 | 9 |
| 20 | 应用场景 | 19 |
| | **合计** | **200** |
