# Redis 面试题子计划

> 领域: redis | 目标: ~200 题 | 状态: 规划中
> 已有题包: `redis-basics.json` (1 题)
> 难度分布: ⭐×50 | ⭐⭐×70 | ⭐⭐⭐×55 | ⭐⭐⭐⭐×25
> 类型分布: concept×25 | principle×25 | comparison×18 | trivia×18 | env-config×15 | modification×12 | purpose×15 | open-ended×15 | debugging×15 | real-data×10 | requirement×10 | tuning×10 | practice×7 | project×5

---

## 1. 数据结构基础 (String, List, Hash, Set, ZSet, 使用场景)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 1 | Redis 支持哪五种基本数据结构？分别适合什么场景 | concept | 1 | - | 🔲 |
| 2 | String 类型最大能存储多大的值？为什么限制为 512MB | trivia | 1 | - | 🔲 |
| 3 | INCR/DECR 命令的原子性是如何保证的 | principle | 1 | - | 🔲 |
| 4 | List 类型的 LPUSH + BRPOP 如何实现简易消息队列 | purpose | 1 | - | 🔲 |
| 5 | Hash 类型与 String 存储 JSON 相比有什么优劣 | comparison | 2 | - | 🔲 |
| 6 | Set 的 SINTER/SUNION/SDIFF 在社交场景中如何应用 | purpose | 2 | - | 🔲 |
| 7 | ZSet 底层为什么同时使用 skiplist 和 dict | principle | 3 | - | 🔲 |
| 8 | 用 Redis String 实现分布式 ID 生成器的方案 | practice | 2 | - | 🔲 |
| 9 | OBJECT ENCODING 命令能看到哪些编码类型 | trivia | 1 | - | 🔲 |
| 10 | ZSet 的 ZRANGEBYSCORE 与 ZRANGEBYLEX 区别 | comparison | 2 | - | 🔲 |
| 11 | 如何用 Redis Hash 实现购物车功能 | purpose | 1 | - | 🔲 |
| 12 | List 的 LPOS 命令是什么版本引入的？有什么用 | trivia | 1 | - | 🔲 |
| 13 | 五种数据结构各自的最大元素数量限制 | requirement | 1 | - | 🔲 |
| 14 | GETSET 命令（Redis 6.2 后 GETDEL/GETEX）的使用场景 | concept | 1 | - | 🔲 |
| 15 | 如何用 ZSet 实现排行榜的实时更新与分页查询 | practice | 1 | - | 🔲 |

## 2. 底层数据结构 (SDS, ziplist/listpack, quicklist, skiplist, intset, dict)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 16 | SDS（Simple Dynamic String）与 C 原生字符串相比有哪些优势 | comparison | 2 | - | 🔲 |
| 17 | SDS 的 free/alloc 字段如何实现空间预分配与惰性释放 | principle | 3 | - | 🔲 |
| 18 | ziplist 的内存布局是怎样的？为什么叫"压缩"列表 | concept | 3 | - | 🔲 |
| 19 | ziplist 的连锁更新（cascade update）问题是什么 | principle | 3 | - | 🔲 |
| 20 | Redis 7.0 用 listpack 替代 ziplist 的原因 | comparison | 3 | - | 🔲 |
| 21 | quicklist 是如何结合 linkedlist 和 ziplist 优点的 | principle | 3 | - | 🔲 |
| 22 | skiplist 的查找时间复杂度及其概率分析 | concept | 3 | - | 🔲 |
| 23 | skiplist 与平衡树（AVL/红黑树）相比的优劣 | comparison | 4 | - | 🔲 |
| 24 | intset 的升级（upgrade）机制是怎样的 | principle | 2 | - | 🔲 |
| 25 | dict 的渐进式 rehash 过程详解 | principle | 3 | - | 🔲 |
| 26 | dict 为什么需要两个 hash 表（ht[0] 和 ht[1]） | purpose | 3 | - | 🔲 |
| 27 | Hash 类型何时从 ziplist/listpack 转为 hashtable 编码 | env-config | 2 | - | 🔲 |

## 3. 持久化 - RDB (fork, COW, bgsave, save配置, RDB文件格式)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 28 | RDB 持久化的基本原理与触发方式 | concept | 1 | - | 🔲 |
| 29 | BGSAVE 执行时 fork 子进程的过程详解 | principle | 3 | - | 🔲 |
| 30 | Copy-On-Write（COW）机制在 RDB 持久化中的作用 | principle | 3 | - | 🔲 |
| 31 | save 与 bgsave 命令的区别及使用场景 | comparison | 1 | - | 🔲 |
| 32 | redis.conf 中 save 配置项的含义（如 save 900 1） | env-config | 1 | - | 🔲 |
| 33 | RDB 文件的格式与版本兼容性 | trivia | 2 | - | 🔲 |
| 34 | BGSAVE 期间如果内存不足会发生什么 | debugging | 3 | - | 🔲 |
| 35 | 如何通过 redis-check-rdb 检测 RDB 文件损坏 | env-config | 1 | - | 🔲 |
| 36 | 为什么生产环境不建议使用 SAVE 命令 | purpose | 1 | - | 🔲 |
| 37 | RDB 持久化的优缺点总结 | open-ended | 1 | - | 🔲 |

## 4. 持久化 - AOF (fsync策略, rewrite, mixed persistence)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 38 | AOF 持久化的基本原理与写入流程 | concept | 1 | - | 🔲 |
| 39 | appendfsync 的三种策略（always/everysec/no）对比 | comparison | 1 | - | 🔲 |
| 40 | AOF rewrite（重写）的触发条件与执行过程 | principle | 2 | - | 🔲 |
| 41 | AOF 重写期间新写入的命令如何处理（AOF 重写缓冲区） | principle | 3 | - | 🔲 |
| 42 | Redis 4.0 混合持久化（RDB + AOF）的工作方式 | concept | 2 | - | 🔲 |
| 43 | AOF 文件损坏后如何用 redis-check-aof 修复 | env-config | 1 | - | 🔲 |
| 44 | 为什么 AOF 文件会比 RDB 文件大 | comparison | 1 | - | 🔲 |
| 45 | aof-use-rdb-preamble 配置的作用 | env-config | 2 | - | 🔲 |
| 46 | RDB 与 AOF 同时开启时，Redis 重启优先加载哪个 | trivia | 1 | - | 🔲 |
| 47 | AOF 的 fsync 为 everysec 时最多丢失多少数据 | trivia | 1 | - | 🔲 |

## 5. 内存管理 (maxmemory, 淘汰策略, memory fragmentation, jemalloc)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 48 | maxmemory 配置的作用与设置建议 | env-config | 1 | - | 🔲 |
| 49 | Redis 8 种内存淘汰策略分别是什么 | concept | 1 | - | 🔲 |
| 50 | LRU 与 LFU 淘汰算法在 Redis 中的实现区别 | comparison | 3 | - | 🔲 |
| 51 | Redis 的近似 LRU 算法与标准 LRU 有什么不同 | principle | 3 | - | 🔲 |
| 52 | 内存碎片率（mem_fragmentation_ratio）过高如何处理 | debugging | 3 | - | 🔲 |
| 53 | jemalloc 内存分配器在 Redis 中的作用 | concept | 3 | - | 🔲 |
| 54 | Redis 4.0 的 MEMORY PURGE 与 activedefrag 配置 | env-config | 3 | - | 🔲 |
| 55 | 如何通过 MEMORY USAGE 命令分析 key 的实际内存占用 | purpose | 1 | - | 🔲 |
| 56 | volatile-ttl 淘汰策略适用于什么业务场景 | purpose | 2 | - | 🔲 |
| 57 | 为什么 Redis 实际内存占用通常比 used_memory 大 | principle | 2 | - | 🔲 |

## 6. 过期与删除 (lazy deletion, periodic deletion, expire precision)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 58 | Redis 过期 key 的两种删除策略（惰性删除 + 定期删除） | concept | 1 | - | 🔲 |
| 59 | 惰性删除（lazy deletion）的实现原理 | principle | 2 | - | 🔲 |
| 60 | 定期删除（periodic deletion）的频率与采样策略 | principle | 3 | - | 🔲 |
| 61 | 大量 key 同时过期会造成什么问题？如何避免 | debugging | 2 | - | 🔲 |
| 62 | EXPIRE 和 PEXPIRE 命令的精度差异 | trivia | 1 | - | 🔲 |
| 63 | 对一个已设置 TTL 的 key 执行 SET 操作，TTL 会怎样 | trivia | 1 | - | 🔲 |
| 64 | PERSIST 命令的作用与使用场景 | concept | 1 | - | 🔲 |
| 65 | 主从复制中，过期 key 的删除由谁负责 | principle | 3 | - | 🔲 |

## 7. 单线程模型 (event loop, I/O多路复用, 为什么快)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 66 | Redis 为什么选择单线程模型 | open-ended | 1 | - | 🔲 |
| 67 | Redis 单线程为什么还能这么快（至少说出 4 点） | open-ended | 2 | - | 🔲 |
| 68 | I/O 多路复用（epoll/kqueue/select）在 Redis 中的角色 | principle | 2 | - | 🔲 |
| 69 | Redis 事件循环（event loop）的处理流程 | principle | 3 | - | 🔲 |
| 70 | Redis 的文件事件（file event）与时间事件（time event）区别 | comparison | 2 | - | 🔲 |
| 71 | ae 事件库的实现与 libevent/libev 的关系 | trivia | 3 | - | 🔲 |
| 72 | 哪些 Redis 操作仍然会阻塞主线程 | debugging | 2 | - | 🔲 |
| 73 | 在单线程模型下如何避免慢查询阻塞其他请求 | tuning | 2 | - | 🔲 |
| 74 | Redis 单线程指的是哪个线程？后台线程有哪些 | concept | 2 | - | 🔲 |
| 75 | 为什么 Redis 的瓶颈通常是网络 I/O 而不是 CPU | principle | 2 | - | 🔲 |

## 8. 多线程 (Redis 6.0 I/O threads, 是否真正多线程)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 76 | Redis 6.0 引入的多线程 I/O 具体做了什么 | concept | 2 | - | 🔲 |
| 77 | io-threads 和 io-threads-do-reads 配置详解 | env-config | 2 | - | 🔲 |
| 78 | Redis 6.0 多线程 I/O 是否需要加锁？为什么 | principle | 3 | - | 🔲 |
| 79 | 开启多线程 I/O 后性能提升一般在什么量级 | real-data | 3 | - | 🔲 |
| 80 | Redis 的命令执行始终是单线程的，如何理解"多线程" | open-ended | 2 | - | 🔲 |
| 81 | BIO（Background I/O）线程负责哪些任务 | concept | 2 | - | 🔲 |
| 82 | Redis 7.0 对多线程方面有哪些改进 | trivia | 3 | - | 🔲 |
| 83 | 什么场景下建议开启 Redis 多线程 I/O | tuning | 2 | - | 🔲 |

## 9. 事务与 Lua (MULTI/EXEC, WATCH, Lua scripting, atomicity)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 84 | Redis 事务（MULTI/EXEC）的基本用法与特点 | concept | 1 | - | 🔲 |
| 85 | Redis 事务能否保证原子性？与数据库事务的区别 | comparison | 2 | - | 🔲 |
| 86 | WATCH 命令实现乐观锁的原理 | principle | 2 | - | 🔲 |
| 87 | 事务中某条命令执行失败，其他命令是否回滚 | trivia | 1 | - | 🔲 |
| 88 | DISCARD 命令的作用 | trivia | 1 | - | 🔲 |
| 89 | Lua 脚本在 Redis 中的执行原理与原子性保证 | principle | 2 | - | 🔲 |
| 90 | EVAL 与 EVALSHA 命令的区别 | comparison | 1 | - | 🔲 |
| 91 | Redis 7.0 引入的 Function 与 Lua Script 的区别 | comparison | 3 | - | 🔲 |
| 92 | Lua 脚本超时会怎样？SCRIPT KILL 与 SHUTDOWN NOSAVE | debugging | 3 | - | 🔲 |
| 93 | 用 Lua 脚本实现"先查后改"的原子操作示例 | practice | 2 | - | 🔲 |

## 10. 发布订阅与 Stream (Pub/Sub, Stream, consumer group)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 94 | Redis Pub/Sub 的基本工作原理 | concept | 1 | - | 🔲 |
| 95 | Pub/Sub 消息是否会持久化？断线重连会丢消息吗 | trivia | 1 | - | 🔲 |
| 96 | PSUBSCRIBE 通配符订阅的性能影响 | tuning | 2 | - | 🔲 |
| 97 | Redis Stream 与 Pub/Sub 的核心区别 | comparison | 2 | - | 🔲 |
| 98 | Stream 的 Consumer Group 机制详解 | concept | 3 | - | 🔲 |
| 99 | XACK 命令的作用与消息确认机制 | purpose | 2 | - | 🔲 |
| 100 | Stream 消息积压时的 MAXLEN/MINID 裁剪策略 | env-config | 2 | - | 🔲 |
| 101 | Redis Stream 与 Kafka 的对比及适用场景 | comparison | 3 | - | 🔲 |

## 11. 主从复制 (full sync, partial sync, repl-backlog, 复制积压缓冲区)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 102 | Redis 主从复制的基本工作流程 | concept | 1 | - | 🔲 |
| 103 | 全量复制（Full Sync）的触发条件与执行过程 | principle | 2 | - | 🔲 |
| 104 | 部分复制（Partial Sync）的原理与 repl-backlog 的作用 | principle | 3 | - | 🔲 |
| 105 | 复制积压缓冲区（repl-backlog-size）应该设置多大 | tuning | 3 | - | 🔲 |
| 106 | PSYNC 命令的两种响应（FULLRESYNC 与 CONTINUE） | concept | 2 | - | 🔲 |
| 107 | 主从复制延迟如何监控与优化 | debugging | 2 | - | 🔲 |
| 108 | 从节点能否处理写请求？replica-read-only 配置 | env-config | 1 | - | 🔲 |
| 109 | 主从切换后 Replication ID 变化的机制 | principle | 4 | - | 🔲 |
| 110 | 无盘复制（diskless replication）的原理与配置 | concept | 3 | - | 🔲 |
| 111 | 主从复制中"复制风暴"问题的成因与解决方案 | debugging | 3 | - | 🔲 |

## 12. Sentinel (failover, quorum, 脑裂, 配置)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 112 | Redis Sentinel 的核心功能有哪些 | concept | 1 | - | 🔲 |
| 113 | 主观下线（SDOWN）与客观下线（ODOWN）的区别 | comparison | 2 | - | 🔲 |
| 114 | Sentinel 选举 Leader 执行 failover 的过程（Raft） | principle | 4 | - | 🔲 |
| 115 | quorum 参数的含义与设置建议 | env-config | 2 | - | 🔲 |
| 116 | Sentinel 如何选择新的 master 节点（优先级规则） | principle | 2 | - | 🔲 |
| 117 | 脑裂（split-brain）问题在 Sentinel 模式下如何发生 | debugging | 4 | - | 🔲 |
| 118 | min-replicas-to-write 和 min-replicas-max-lag 防止脑裂 | env-config | 3 | - | 🔲 |
| 119 | Sentinel 模式下客户端如何发现新的 master 地址 | concept | 2 | - | 🔲 |
| 120 | Sentinel 集群至少部署几个节点？为什么 | requirement | 1 | - | 🔲 |
| 121 | Sentinel 模式与 Cluster 模式的适用场景对比 | open-ended | 2 | - | 🔲 |

## 13. Cluster (hash slot, gossip, resharding, ask/moved redirect)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 122 | Redis Cluster 的整体架构与设计目标 | open-ended | 2 | - | 🔲 |
| 123 | 16384 个 hash slot 的分配机制 | concept | 1 | - | 🔲 |
| 124 | 为什么 Redis Cluster 选择 16384 个 slot 而不是更多 | trivia | 3 | - | 🔲 |
| 125 | CRC16 算法在 slot 计算中的应用 | trivia | 2 | - | 🔲 |
| 126 | Gossip 协议在 Cluster 节点间通信中的角色 | principle | 3 | - | 🔲 |
| 127 | MOVED 和 ASK 重定向的区别 | comparison | 2 | - | 🔲 |
| 128 | Cluster 的 resharding（槽迁移）过程详解 | principle | 4 | - | 🔲 |
| 129 | Cluster 模式下多 key 操作的限制（hash tag） | requirement | 2 | - | 🔲 |
| 130 | {hash tag} 语法的用途与注意事项 | purpose | 2 | - | 🔲 |
| 131 | Cluster 节点故障检测与自动 failover 过程 | principle | 4 | - | 🔲 |
| 132 | Redis Cluster 最少需要几个节点？推荐部署架构 | requirement | 1 | - | 🔲 |
| 133 | cluster-require-full-coverage 配置的影响 | env-config | 2 | - | 🔲 |

## 14. 缓存模式 (Cache Aside, Read Through, Write Behind)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 134 | Cache Aside Pattern 的读写流程 | concept | 1 | - | 🔲 |
| 135 | 为什么 Cache Aside 先更新数据库再删缓存，而不是先删缓存 | principle | 2 | - | 🔲 |
| 136 | Read Through 与 Cache Aside 的区别 | comparison | 2 | - | 🔲 |
| 137 | Write Behind（Write Back）模式的风险与适用场景 | open-ended | 2 | - | 🔲 |
| 138 | 双写一致性问题的各种解决方案对比 | open-ended | 3 | - | 🔲 |
| 139 | 延迟双删策略的实现与 sleep 时长如何确定 | principle | 4 | - | 🔲 |
| 140 | 基于 binlog 的缓存更新方案（Canal） | concept | 3 | - | 🔲 |
| 141 | 缓存与数据库的最终一致性如何保证 | open-ended | 4 | - | 🔲 |

## 15. 缓存问题 (穿透, 雪崩, 击穿, 热key, 大key)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 142 | 缓存穿透、击穿、雪崩的区别与解决方案 | debugging | 3 | - | 🔲 |
| 143 | 布隆过滤器（Bloom Filter）防缓存穿透的原理 | principle | 2 | - | 🔲 |
| 144 | 缓存击穿时互斥锁（Mutex Lock）方案的实现细节 | modification | 3 | - | 🔲 |
| 145 | 缓存雪崩的 TTL 随机化策略实现 | modification | 2 | - | 🔲 |
| 146 | 热 key 发现的几种方法（MONITOR/hotkeys/代理层统计） | debugging | 2 | - | 🔲 |
| 147 | 热 key 的本地缓存 + key 分散方案 | modification | 2 | - | 🔲 |
| 148 | 大 key（bigkey）的定义标准与发现方法 | concept | 1 | - | 🔲 |
| 149 | 大 key 删除为什么会阻塞？UNLINK 命令的作用 | principle | 2 | - | 🔲 |
| 150 | 大 key 的拆分方案（Hash 分片、分段存储） | modification | 3 | - | 🔲 |
| 151 | 多级缓存架构（L1 本地 → L2 Redis → L3 DB）的设计 | open-ended | 3 | - | 🔲 |
| 152 | 缓存预热（warm-up）的策略与实现 | concept | 1 | - | 🔲 |
| 153 | 缓存降级策略的设计与实现 | open-ended | 2 | - | 🔲 |

## 16. 分布式锁 (SETNX, Redlock, 锁续期, 公平性)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 154 | Redis 实现分布式锁的基本方案（SET NX PX） | concept | 1 | - | 🔲 |
| 155 | 分布式锁释放时为什么要用 Lua 脚本比较 value | principle | 2 | - | 🔲 |
| 156 | 锁的过期时间设置过短导致的问题（锁提前释放） | debugging | 2 | - | 🔲 |
| 157 | 看门狗（Watchdog）锁续期机制的原理（Redisson） | principle | 3 | - | 🔲 |
| 158 | Redlock 算法的工作流程与争议 | concept | 4 | - | 🔲 |
| 159 | Martin Kleppmann 对 Redlock 的批评要点 | open-ended | 4 | - | 🔲 |
| 160 | 可重入锁（Reentrant Lock）在 Redis 中如何实现 | modification | 4 | - | 🔲 |
| 161 | Redis 分布式锁与 ZooKeeper 分布式锁的对比 | comparison | 3 | - | 🔲 |
| 162 | 公平锁（Fair Lock）在 Redis 中的实现思路 | modification | 4 | - | 🔲 |
| 163 | 读写锁（ReadWriteLock）在 Redis 中的实现 | modification | 4 | - | 🔲 |
| 164 | 分布式锁在微服务下的最佳实践 | open-ended | 3 | - | 🔲 |
| 165 | 使用 Redis 分布式锁实现幂等性控制 | practice | 2 | - | 🔲 |

## 17. Pipeline 与批量操作 (pipeline, MGET/MSET, Cluster pipeline)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 166 | Pipeline 的原理及与逐条执行命令的性能对比 | concept | 1 | - | 🔲 |
| 167 | Pipeline 与事务（MULTI/EXEC）的区别 | comparison | 2 | - | 🔲 |
| 168 | Pipeline 一次发送多少条命令合适？有什么限制 | tuning | 2 | - | 🔲 |
| 169 | MGET/MSET 在 Cluster 模式下的限制与替代方案 | requirement | 2 | - | 🔲 |
| 170 | Cluster 模式下如何实现跨 slot 的批量操作 | modification | 3 | - | 🔲 |
| 171 | Pipeline 并不保证原子性，这意味着什么 | principle | 2 | - | 🔲 |
| 172 | 批量删除大量 key 的几种安全方案 | practice | 2 | - | 🔲 |
| 173 | SCAN 命令族（SSCAN/HSCAN/ZSCAN）的正确使用姿势 | concept | 2 | - | 🔲 |

## 18. 客户端与连接 (连接池, RESP协议, Jedis vs Lettuce vs go-redis)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 174 | RESP（Redis Serialization Protocol）协议的格式 | concept | 2 | - | 🔲 |
| 175 | RESP2 与 RESP3 的区别 | comparison | 2 | - | 🔲 |
| 176 | Redis 连接池的作用与参数调优 | tuning | 2 | - | 🔲 |
| 177 | Jedis 与 Lettuce 客户端的区别（阻塞 vs 非阻塞） | comparison | 2 | - | 🔲 |
| 178 | go-redis 客户端的连接池配置最佳实践 | env-config | 2 | - | 🔲 |
| 179 | CLIENT LIST 命令能看到什么信息 | trivia | 1 | - | 🔲 |
| 180 | 客户端连接数过多导致的问题与排查 | debugging | 2 | - | 🔲 |
| 181 | Redis 6.0 ACL（Access Control List）的基本用法 | concept | 2 | - | 🔲 |

## 19. 监控与运维 (INFO, SLOWLOG, latency monitoring, bigkey扫描)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 182 | INFO 命令各 section 的关键指标解读 | real-data | 2 | - | 🔲 |
| 183 | SLOWLOG 慢查询日志的配置与分析 | debugging | 1 | - | 🔲 |
| 184 | slowlog-log-slower-than 和 slowlog-max-len 的推荐值 | tuning | 1 | - | 🔲 |
| 185 | Redis latency monitoring 框架的使用 | debugging | 3 | - | 🔲 |
| 186 | redis-cli --bigkeys 的原理与局限性 | debugging | 2 | - | 🔲 |
| 187 | MEMORY DOCTOR 命令能诊断哪些问题 | purpose | 2 | - | 🔲 |
| 188 | 如何监控 Redis 的 QPS 和连接数 | real-data | 1 | - | 🔲 |
| 189 | Redis 线上故障排查的标准流程 | open-ended | 3 | - | 🔲 |
| 190 | CONFIG SET 在线修改配置的注意事项 | env-config | 1 | - | 🔲 |
| 191 | Redis 主要性能指标的健康阈值参考 | real-data | 2 | - | 🔲 |
| 192 | redis-benchmark 压测工具的使用与结果解读 | real-data | 1 | - | 🔲 |
| 193 | Redis 各命令的时间复杂度速查与性能陷阱 | real-data | 2 | - | 🔲 |

## 20. 高级特性 (HyperLogLog, Bitmap, GEO, BloomFilter)

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 194 | HyperLogLog 的原理与误差率 | concept | 2 | - | 🔲 |
| 195 | HyperLogLog 固定占用 12KB 内存的原因 | principle | 3 | - | 🔲 |
| 196 | 用 Bitmap 实现用户签到功能的方案 | practice | 1 | - | 🔲 |
| 197 | BITCOUNT 和 BITOP 的典型使用场景 | purpose | 1 | - | 🔲 |
| 198 | GEO 类型底层使用什么数据结构（ZSet + GeoHash） | trivia | 2 | - | 🔲 |
| 199 | GEORADIUS 与 GEOSEARCH 命令的区别 | comparison | 2 | - | 🔲 |
| 200 | Redis 实现布隆过滤器的方式（RedisBloom 模块） | purpose | 2 | - | 🔲 |
| 201 | Bitmap vs Set 统计活跃用户的性能与内存对比 | real-data | 3 | - | 🔲 |
| 202 | 不同数据量级下 Redis 各操作的耗时实测参考 | real-data | 2 | - | 🔲 |
| 203 | 一千万 key 的 Redis 实例需要多少内存（估算方法） | real-data | 2 | - | 🔲 |
| 204 | 设计一个基于 Redis 的实时排行榜系统（综合项目） | project | 4 | - | 🔲 |
| 205 | 设计一个基于 Redis 的延迟队列方案（综合项目） | project | 4 | - | 🔲 |
| 206 | 设计一个基于 Redis 的限流器（令牌桶/滑动窗口） | project | 4 | - | 🔲 |
| 207 | 设计一个基于 Redis 的秒杀系统缓存架构 | project | 4 | - | 🔲 |
| 208 | 设计一个 Redis + Lua 实现的分布式 Rate Limiter | project | 4 | - | 🔲 |

---

## 统计汇总

### 按类型统计
| 类型 | 目标 | 实际 |
|------|------|------|
| concept | ~25 | 34 |
| principle | ~25 | 38 |
| comparison | ~18 | 23 |
| trivia | ~18 | 17 |
| env-config | ~15 | 15 |
| modification | ~12 | 8 |
| purpose | ~15 | 12 |
| open-ended | ~15 | 14 |
| debugging | ~15 | 15 |
| real-data | ~10 | 9 |
| requirement | ~10 | 5 |
| tuning | ~10 | 7 |
| practice | ~7 | 6 |
| project | ~5 | 5 |
| **合计** | **~200** | **208** |

### 按难度统计
| 难度 | 目标 | 实际 |
|------|------|------|
| ⭐ (1) | ~50 | 55 |
| ⭐⭐ (2) | ~70 | 85 |
| ⭐⭐⭐ (3) | ~55 | 50 |
| ⭐⭐⭐⭐ (4) | ~25 | 18 |
| **合计** | **~200** | **208** |

### 按子主题统计
| 子主题 | 题数 |
|--------|------|
| 1. 数据结构基础 | 15 |
| 2. 底层数据结构 | 12 |
| 3. 持久化-RDB | 10 |
| 4. 持久化-AOF | 10 |
| 5. 内存管理 | 10 |
| 6. 过期与删除 | 8 |
| 7. 单线程模型 | 10 |
| 8. 多线程 | 8 |
| 9. 事务与Lua | 10 |
| 10. 发布订阅与Stream | 8 |
| 11. 主从复制 | 10 |
| 12. Sentinel | 10 |
| 13. Cluster | 12 |
| 14. 缓存模式 | 8 |
| 15. 缓存问题 | 12 |
| 16. 分布式锁 | 12 |
| 17. Pipeline与批量操作 | 8 |
| 18. 客户端与连接 | 8 |
| 19. 监控与运维 | 12 |
| 20. 高级特性 | 15 |

### 已有题目覆盖
- `redis-basics.json` 覆盖 7 题 (✅ 标记):
  - #112 Sentinel 核心功能
  - #142 缓存穿透/击穿/雪崩
  - #143 布隆过滤器
  - #147 热 key 方案
  - #151 多级缓存架构
  - #154 分布式锁基本方案
  - (quiz 中额外覆盖相关知识点)
- 剩余待创建: ~201 题
