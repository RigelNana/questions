# 分布式系统面试题子计划

> 领域: distributed-system | 目标: ~200 题 | 状态: 规划中
>
> 类型分布: concept ~25, principle ~25, comparison ~18, trivia ~18, env-config ~15, modification ~12, purpose ~15, open-ended ~15, debugging ~15, real-data ~10, requirement ~10, tuning ~10, practice ~7, project ~5
>
> 难度分布: ①~50, ②~70, ③~55, ④~25

---

## 1. CAP与BASE
> CAP theorem, BASE, consistency models

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 1 | 什么是CAP定理？C、A、P分别代表什么含义 | concept | 1 | | ⬜ |
| 2 | CAP定理中为什么无法同时满足三个特性 | principle | 1 | ds-cap-impossibility.json | ✅ |
| 3 | 什么是BASE理论？核心思想是什么 | concept | 1 | | ⬜ |
| 4 | 什么是Soft State？它在BASE理论中的含义 | concept | 1 | | ⬜ |
| 5 | 常见的CP系统和AP系统各有哪些代表 | trivia | 1 | | ⬜ |
| 6 | ZooKeeper Session超时参数对CP特性的影响 | tuning | 2 | | ⬜ |
| 7 | 强一致性、弱一致性与最终一致性的区别 | comparison | 1 | | ⬜ |
| 8 | 网络分区恢复后数据冲突的处理策略 | open-ended | 3 | | ⬜ |
| 9 | Basically Available在实际系统中如何体现 | purpose | 2 | | ⬜ |
| 10 | 电商场景下一致性与可用性的权衡案例 | real-data | 3 | | ⬜ |

## 2. 一致性协议
> Paxos, Raft, ZAB, leader election

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 11 | 什么是Paxos协议？它解决了什么核心问题 | concept | 2 | | ⬜ |
| 12 | Paxos中Proposer、Acceptor、Learner角色划分 | trivia | 1 | | ⬜ |
| 13 | Raft协议相比Paxos有哪些设计上的简化 | comparison | 1 | | ⬜ |
| 14 | ZAB协议与Raft协议的异同分析 | comparison | 3 | | ⬜ |
| 15 | Leader Election的通用流程和关键步骤 | principle | 2 | | ⬜ |
| 16 | 为什么一致性协议都需要Quorum多数派机制 | principle | 2 | | ⬜ |
| 17 | Multi-Paxos对Basic Paxos做了哪些优化 | trivia | 3 | | ⬜ |
| 18 | 一致性协议中Term任期机制的作用 | purpose | 2 | | ⬜ |
| 19 | 一致性协议在etcd/TiKV等系统中的落地案例 | real-data | 2 | | ⬜ |
| 20 | 一致性协议运行时脑裂问题如何诊断 | debugging | 4 | | ⬜ |

## 3. Raft详解
> log replication, leader election, safety, membership change

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 21 | Raft集群最小节点数及推荐部署配置 | env-config | 1 | | ⬜ |
| 22 | Raft Leader Election的触发条件和选举规则 | principle | 2 | | ⬜ |
| 23 | Raft的Safety属性如何保证数据正确性 | principle | 3 | | ⬜ |
| 24 | Raft集群Membership Change的Joint Consensus方案 | modification | 4 | | ⬜ |
| 25 | Raft中Follower/Candidate/Leader状态转换图 | trivia | 1 | | ⬜ |
| 26 | Raft中Committed与Applied的区别是什么 | concept | 2 | | ⬜ |
| 27 | etcd中Raft相关的关键配置参数说明 | env-config | 3 | | ⬜ |
| 28 | Raft遇到网络分区导致的脑裂如何自愈 | debugging | 3 | | ⬜ |
| 29 | Raft的heartbeat-interval与election-timeout调优 | tuning | 3 | | ⬜ |
| 30 | 实现一个简化版Raft Leader Election模块 | practice | 4 | | ⬜ |

## 4. 分布式事务
> 2PC, 3PC, TCC, Saga, Seata

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 31 | 什么是分布式事务？与本地事务有何不同 | concept | 1 | | ⬜ |
| 32 | 2PC两阶段提交的Prepare和Commit流程 | principle | 2 | | ⬜ |
| 33 | 3PC相比2PC增加了什么阶段和改进 | comparison | 2 | | ⬜ |
| 34 | TCC模式中Try/Confirm/Cancel各阶段的职责 | purpose | 1 | | ⬜ |
| 35 | Saga编排（Orchestration）与协同（Choreography）对比 | principle | 3 | | ⬜ |
| 36 | Seata AT模式的全局锁和undo log机制 | concept | 3 | | ⬜ |
| 37 | Seata Server和Client端的部署配置 | env-config | 2 | | ⬜ |
| 38 | 2PC协调者故障后参与者如何恢复 | debugging | 3 | | ⬜ |
| 39 | 电商下单扣库存场景的事务方案选型 | open-ended | 3 | | ⬜ |
| 40 | 分布式事务方案对业务侵入性和性能的需求分析 | requirement | 4 | | ⬜ |

## 5. 分布式锁
> Redis lock, ZooKeeper lock, etcd lock, fencing token

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 41 | 什么是分布式锁？常见应用场景有哪些 | concept | 1 | | ⬜ |
| 42 | 基于Redis SETNX+EXPIRE实现分布式锁原理 | principle | 2 | | ⬜ |
| 43 | Redis分布式锁过期时间设置的最佳实践 | tuning | 1 | | ⬜ |
| 44 | RedLock算法的流程及Martin Kleppmann的质疑 | principle | 3 | | ⬜ |
| 45 | Redis锁与ZooKeeper锁的优缺点对比 | comparison | 2 | | ⬜ |
| 46 | Redisson看门狗（Watchdog）自动续期机制 | modification | 3 | | ⬜ |
| 47 | 基于etcd Lease和Revision实现分布式锁配置 | env-config | 3 | | ⬜ |
| 48 | 分布式锁死锁问题的排查与预防策略 | debugging | 3 | | ⬜ |
| 49 | 高并发秒杀场景对分布式锁的性能需求评估 | requirement | 4 | | ⬜ |
| 50 | 实现一个基于Redis的可重入分布式锁 | practice | 4 | | ⬜ |

## 6. 分布式ID
> snowflake, UUID, leaf, 号段模式

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 51 | 分布式系统为什么需要全局唯一ID生成方案 | purpose | 1 | | ⬜ |
| 52 | UUID的版本区别及不适合做数据库主键的原因 | trivia | 1 | | ⬜ |
| 53 | Snowflake算法的64位结构及各段含义 | principle | 2 | | ⬜ |
| 54 | Snowflake时钟回拨问题的成因和解决方案 | debugging | 3 | | ⬜ |
| 55 | 号段模式（Segment）的核心思想与双Buffer优化 | concept | 2 | | ⬜ |
| 56 | 美团Leaf在生产环境的QPS和可用性数据 | real-data | 2 | | ⬜ |
| 57 | Snowflake、UUID、数据库自增ID的全面对比 | comparison | 1 | | ⬜ |
| 58 | Leaf-Snowflake模式Worker ID分配策略配置 | env-config | 1 | | ⬜ |
| 59 | 分布式ID生成器的QPS瓶颈和延迟优化 | tuning | 4 | | ⬜ |
| 60 | 设计一个支持多数据中心的高可用ID服务 | open-ended | 4 | | ⬜ |

## 7. 一致性哈希
> hash ring, virtual nodes, bounded loads

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 61 | 什么是一致性哈希？解决了普通哈希的什么问题 | concept | 1 | | ⬜ |
| 62 | 一致性哈希环的工作原理和数据定位过程 | principle | 1 | | ⬜ |
| 63 | 虚拟节点的概念及解决数据倾斜的原理 | concept | 2 | | ⬜ |
| 64 | 一致性哈希与取模哈希在节点变更时的差异 | comparison | 1 | | ⬜ |
| 65 | 虚拟节点数量对负载均衡效果的量化影响 | tuning | 3 | | ⬜ |
| 66 | Google Bounded Loads一致性哈希的改进思路 | trivia | 3 | | ⬜ |
| 67 | Memcached和Redis Cluster中一致性哈希应用 | real-data | 2 | | ⬜ |
| 68 | 一致性哈希环上热点Key负载不均的排查 | debugging | 2 | | ⬜ |
| 69 | 实现一个带虚拟节点的一致性哈希算法 | practice | 3 | | ⬜ |
| 70 | 一致性哈希扩缩容时的数据迁移策略 | modification | 2 | | ⬜ |

## 8. 服务发现与注册
> etcd, Consul, Nacos, ZooKeeper

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 71 | 什么是服务注册与发现？核心解决什么问题 | concept | 1 | | ⬜ |
| 72 | etcd Watch机制的概念及在服务发现中的应用 | concept | 1 | | ⬜ |
| 73 | Consul健康检查（Health Check）的多种模式 | trivia | 2 | | ⬜ |
| 74 | Nacos默认Namespace和Group的初始值及用途 | trivia | 1 | | ⬜ |
| 75 | etcd、Consul、Nacos、ZooKeeper注册中心对比 | comparison | 3 | | ⬜ |
| 76 | 服务注册中心在微服务体系中的定位与作用 | purpose | 1 | | ⬜ |
| 77 | 大规模微服务场景下注册中心如何选型 | open-ended | 2 | | ⬜ |
| 78 | 注册中心全部宕机后服务间如何保持通信 | debugging | 3 | | ⬜ |
| 79 | 服务实例规模增长后注册中心的容量规划 | requirement | 2 | | ⬜ |
| 80 | Nacos注册中心从单机升级为集群的改造步骤 | modification | 2 | | ⬜ |

## 9. 负载均衡
> round-robin, weighted, least-connections, consistent hashing

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 81 | 负载均衡的概念和常见分类方式 | concept | 1 | | ⬜ |
| 82 | Round-Robin与Weighted Round-Robin策略对比 | comparison | 1 | | ⬜ |
| 83 | Least-Connections策略的原理与适用场景 | principle | 1 | | ⬜ |
| 84 | 负载均衡中一致性哈希策略的应用意义 | purpose | 2 | | ⬜ |
| 85 | 四层负载均衡与七层负载均衡的工作差异 | trivia | 2 | | ⬜ |
| 86 | Nginx upstream负载均衡配置详解 | env-config | 1 | | ⬜ |
| 87 | Session Sticky（会话保持）的实现和问题 | modification | 2 | | ⬜ |
| 88 | 根据业务特征选择负载均衡策略的决策方法 | open-ended | 4 | | ⬜ |
| 89 | gRPC长连接场景下负载均衡的特殊处理 | tuning | 3 | | ⬜ |
| 90 | 负载均衡器自身的高可用方案设计 | requirement | 3 | | ⬜ |

## 10. 限流
> token bucket, leaky bucket, sliding window, distributed rate limiting

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 91 | 什么是限流？分布式系统中为什么需要限流 | concept | 1 | | ⬜ |
| 92 | 令牌桶（Token Bucket）算法的工作原理 | principle | 1 | | ⬜ |
| 93 | 漏桶算法最早源于网络流量整形的背景知识 | trivia | 1 | | ⬜ |
| 94 | 令牌桶与漏桶算法的差异和适用场景 | comparison | 2 | | ⬜ |
| 95 | 基于Redis+Lua实现分布式滑动窗口限流 | modification | 3 | | ⬜ |
| 96 | Sentinel限流规则的配置方式详解 | env-config | 2 | | ⬜ |
| 97 | 限流触发后常见的降级响应策略 | purpose | 2 | | ⬜ |
| 98 | 如何通过压测确定合理的限流阈值 | open-ended | 3 | | ⬜ |
| 99 | 单机限流与分布式限流的一致性挑战 | principle | 2 | | ⬜ |
| 100 | 突发流量导致服务抖动的限流排查 | debugging | 2 | | ⬜ |

## 11. 熔断与降级
> circuit breaker pattern, hystrix, sentinel, degradation策略

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 101 | 什么是Circuit Breaker Pattern熔断器模式 | concept | 1 | | ⬜ |
| 102 | 熔断器Closed/Open/Half-Open三态转换逻辑 | principle | 1 | | ⬜ |
| 103 | Hystrix线程隔离与信号量隔离的区别 | trivia | 2 | | ⬜ |
| 104 | Hystrix与Sentinel的核心功能对比 | comparison | 2 | | ⬜ |
| 105 | 服务降级常见策略（默认值/缓存/排队） | purpose | 1 | | ⬜ |
| 106 | Sentinel Dashboard熔断规则配置步骤 | env-config | 2 | | ⬜ |
| 107 | 从Hystrix迁移到Sentinel的改造要点 | modification | 3 | | ⬜ |
| 108 | Netflix生产环境Hystrix的实际效果数据 | real-data | 3 | | ⬜ |
| 109 | 设计一个微服务熔断降级的全链路防护方案 | project | 4 | | ⬜ |
| 110 | 微服务架构中熔断降级策略的整体设计 | open-ended | 4 | | ⬜ |

## 12. 消息队列模式
> pub/sub, queue, exactly-once delivery, dead letter

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 111 | Pub/Sub模式与Point-to-Point Queue模式的区别 | comparison | 1 | | ⬜ |
| 112 | At-Least-Once/At-Most-Once/Exactly-Once语义 | concept | 1 | | ⬜ |
| 113 | Dead Letter Queue的作用和使用场景 | purpose | 1 | | ⬜ |
| 114 | Kafka如何通过事务机制实现Exactly-Once | principle | 3 | | ⬜ |
| 115 | 消息队列保证顺序性的场景需求与约束 | requirement | 2 | | ⬜ |
| 116 | 延迟消息（Delay Message）的多种实现方案 | modification | 2 | | ⬜ |
| 117 | 消息积压（Backlog）的监控指标与应急处理 | debugging | 2 | | ⬜ |
| 118 | 消息队列在事件驱动架构中的最佳实践 | open-ended | 3 | | ⬜ |
| 119 | 实现一个可靠的消息投递与ACK确认机制 | practice | 3 | | ⬜ |
| 120 | 设计一个支持百万级TPS的消息系统架构 | project | 4 | | ⬜ |

## 13. 分布式缓存
> cache consistency, cache invalidation, multi-level cache

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 121 | 缓存穿透、缓存击穿、缓存雪崩的区别及应对 | concept | 1 | | ⬜ |
| 122 | Cache-Aside/Read-Through/Write-Through模式 | principle | 1 | | ⬜ |
| 123 | Write-Behind与Write-Through的策略对比 | comparison | 2 | | ⬜ |
| 124 | 多级缓存架构（L1 Local + L2 Redis）设计思路 | purpose | 2 | | ⬜ |
| 125 | Redis Cluster的哈希槽（Hash Slot）分片机制 | trivia | 2 | | ⬜ |
| 126 | 缓存与数据库双写一致性的常见方案 | modification | 2 | | ⬜ |
| 127 | 缓存热Key导致单节点压力过大的排查方法 | debugging | 2 | | ⬜ |
| 128 | 缓存命中率监控与TTL策略调优 | tuning | 2 | | ⬜ |
| 129 | 大促场景下缓存容量和带宽的评估方法 | requirement | 3 | | ⬜ |
| 130 | 业界多级缓存架构的性能数据对比 | real-data | 3 | | ⬜ |

## 14. 分布式存储
> replication, sharding, erasure coding, Dynamo-style

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 131 | 主从复制与多主复制的原理和适用场景 | principle | 2 | | ⬜ |
| 132 | 数据Sharding分片的常见策略与配置方法 | env-config | 2 | | ⬜ |
| 133 | Erasure Coding与多副本在成本和可靠性上的取舍 | open-ended | 4 | | ⬜ |
| 134 | Dynamo-style存储的一致性哈希+向量时钟设计 | concept | 3 | | ⬜ |
| 135 | HDFS副本放置策略和机架感知机制 | trivia | 2 | | ⬜ |
| 136 | 跨分片查询的性能瓶颈及优化方案 | debugging | 3 | | ⬜ |
| 137 | 存储系统水平扩展时的数据再均衡策略 | requirement | 3 | | ⬜ |
| 138 | 分布式存储系统可靠性指标的评估方法 | open-ended | 4 | | ⬜ |
| 139 | 设计一个支持自动扩缩容的KV存储系统 | project | 4 | | ⬜ |
| 140 | Amazon Dynamo与Google Bigtable的设计对比 | real-data | 4 | | ⬜ |

## 15. 微服务架构
> service mesh, sidecar, API gateway, BFF

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 141 | 什么是Service Mesh？解决了哪些基础设施问题 | concept | 1 | | ⬜ |
| 142 | Sidecar代理模式的原理和流量劫持方式 | principle | 2 | | ⬜ |
| 143 | API Gateway的核心功能（路由/鉴权/限流/协议转换） | purpose | 1 | | ⬜ |
| 144 | BFF（Backend For Frontend）模式的适用场景 | purpose | 2 | | ⬜ |
| 145 | 微服务间同步通信与异步通信的选型对比 | comparison | 2 | | ⬜ |
| 146 | Istio VirtualService和DestinationRule配置 | env-config | 3 | | ⬜ |
| 147 | 微服务拆分粒度过粗或过细带来的风险 | open-ended | 3 | | ⬜ |
| 148 | 微服务架构下数据库按服务拆分的策略 | requirement | 3 | | ⬜ |
| 149 | 单体应用渐进式拆分为微服务的实践步骤 | practice | 3 | | ⬜ |
| 150 | 设计一个完整的微服务技术栈选型方案 | project | 4 | | ⬜ |

## 16. RPC框架
> gRPC, Thrift, Dubbo, serialization

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 151 | 什么是RPC？与RESTful HTTP调用的本质区别 | concept | 1 | | ⬜ |
| 152 | gRPC基于HTTP/2和Protocol Buffers的技术优势 | principle | 2 | | ⬜ |
| 153 | Dubbo SPI扩展机制和服务治理功能概览 | trivia | 2 | | ⬜ |
| 154 | gRPC四种通信模式（Unary/Server-Stream/Client-Stream/Bidi） | trivia | 1 | | ⬜ |
| 155 | Thrift与gRPC的序列化性能和生态对比 | comparison | 3 | | ⬜ |
| 156 | Dubbo注册中心和配置中心的配置方式 | env-config | 2 | | ⬜ |
| 157 | RPC框架中序列化协议的选择与影响 | modification | 2 | | ⬜ |
| 158 | RPC调用的超时设置与重试策略设计 | open-ended | 2 | | ⬜ |
| 159 | 实现一个基于Netty的简易RPC框架 | practice | 4 | | ⬜ |
| 160 | RPC服务端线程池参数调优实践 | tuning | 3 | | ⬜ |

## 17. 链路追踪
> OpenTelemetry, trace/span/context, sampling

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 161 | 什么是分布式链路追踪？解决什么可观测性问题 | concept | 1 | | ⬜ |
| 162 | Trace、Span、SpanContext的概念与层级关系 | principle | 1 | | ⬜ |
| 163 | OpenTelemetry SDK/Collector/Exporter架构 | trivia | 2 | | ⬜ |
| 164 | Jaeger与Zipkin的功能定位和架构差异 | comparison | 2 | | ⬜ |
| 165 | Spring Boot项目集成OpenTelemetry配置 | env-config | 2 | | ⬜ |
| 166 | 链路追踪中Head/Tail/Adaptive采样策略 | purpose | 3 | | ⬜ |
| 167 | 采样率对追踪完整性和系统性能的平衡 | tuning | 3 | | ⬜ |
| 168 | 通过Trace数据定位调用链中的延迟瓶颈 | debugging | 2 | | ⬜ |
| 169 | 链路追踪在大规模集群中的存储成本分析 | real-data | 3 | | ⬜ |
| 170 | W3C Trace Context跨进程传播标准 | requirement | 2 | | ⬜ |

## 18. 幂等性设计
> idempotency key, deduplication, retry safety

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 171 | 什么是幂等性？分布式场景为什么需要幂等设计 | concept | 1 | | ⬜ |
| 172 | Idempotency Key的生成规则和使用流程 | principle | 2 | | ⬜ |
| 173 | 数据库唯一约束实现接口幂等的方案 | modification | 1 | | ⬜ |
| 174 | HTTP各方法（GET/POST/PUT/DELETE）的幂等性 | trivia | 1 | | ⬜ |
| 175 | 消息消费去重（Deduplication）的存储方案 | purpose | 2 | | ⬜ |
| 176 | 支付系统中幂等性设计的实际案例分析 | real-data | 3 | | ⬜ |
| 177 | 重试风暴下幂等性失效的根因排查 | debugging | 4 | | ⬜ |
| 178 | 实现一个基于Redis的通用幂等性中间件 | practice | 3 | | ⬜ |
| 179 | 幂等表清理策略和过期时间设计 | env-config | 2 | | ⬜ |
| 180 | 接口幂等性与业务补偿机制的协同设计 | open-ended | 4 | | ⬜ |

## 19. 数据一致性
> eventual consistency, read-your-writes, monotonic reads

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 181 | 什么是最终一致性（Eventual Consistency） | concept | 1 | | ⬜ |
| 182 | Read-Your-Writes一致性的含义和实现方式 | principle | 2 | | ⬜ |
| 183 | Monotonic Reads与Monotonic Writes的含义 | concept | 2 | | ⬜ |
| 184 | 线性一致性（Linearizability）与顺序一致性的区别 | comparison | 3 | | ⬜ |
| 185 | 向量时钟（Vector Clock）的原理与应用场景 | principle | 3 | | ⬜ |
| 186 | Quorum NWR中N、W、R各参数的含义与配置 | env-config | 2 | | ⬜ |
| 187 | CRDTs无冲突复制数据类型的核心思想 | trivia | 4 | | ⬜ |
| 188 | 一致性级别对延迟和可用性的量化影响 | tuning | 4 | | ⬜ |
| 189 | 数据不一致的检测工具和修复流程 | debugging | 3 | | ⬜ |
| 190 | 设计一个支持多种一致性级别的读写系统 | project | 4 | | ⬜ |

## 20. 容灾与多活
> active-active, active-passive, geo-replication, split-brain

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 191 | Active-Active与Active-Passive架构的核心差异 | comparison | 2 | | ⬜ |
| 192 | 异地多活架构中数据同步的核心挑战 | principle | 3 | | ⬜ |
| 193 | Geo-Replication同步复制与异步复制的选型 | open-ended | 3 | | ⬜ |
| 194 | Split-brain问题的成因和常用解决方案 | debugging | 3 | | ⬜ |
| 195 | RPO和RTO指标的含义及目标值如何确定 | requirement | 2 | | ⬜ |
| 196 | 异地多活流量路由和机房切换方案 | modification | 4 | | ⬜ |
| 197 | 容灾演练（Chaos Engineering）的目的和方法 | purpose | 2 | | ⬜ |
| 198 | 互联网公司异地多活的落地案例与教训 | real-data | 4 | | ⬜ |
| 199 | 多机房部署时中间件的跨机房配置策略 | env-config | 3 | | ⬜ |
| 200 | 容灾架构在成本和可靠性之间如何取舍 | open-ended | 3 | | ⬜ |

---

## 统计

### 类型分布
| type | 数量 | 目标 |
|------|------|------|
| concept | 25 | ~25 |
| principle | 25 | ~25 |
| comparison | 18 | ~18 |
| trivia | 18 | ~18 |
| env-config | 15 | ~15 |
| modification | 12 | ~12 |
| purpose | 15 | ~15 |
| open-ended | 15 | ~15 |
| debugging | 15 | ~15 |
| real-data | 10 | ~10 |
| requirement | 10 | ~10 |
| tuning | 10 | ~10 |
| practice | 7 | ~7 |
| project | 5 | ~5 |

### 难度分布
| difficulty | 数量 | 目标 |
|-----------|------|------|
| 1 | 50 | ~50 |
| 2 | 70 | ~70 |
| 3 | 55 | ~55 |
| 4 | 25 | ~25 |