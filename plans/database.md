# 数据库面试题子计划

> 领域: database | 目标: ~200 题 | 状态: 规划中
>
> 类型分布: concept ~25, principle ~25, comparison ~18, trivia ~18, env-config ~15, modification ~12, purpose ~15, open-ended ~15, debugging ~15, real-data ~10, requirement ~10, tuning ~10, practice ~7, project ~5
>
> 难度分布: ①~50, ②~70, ③~55, ④~25
>
> 已有题包: 无 (public/question-packs/database/ 为空)

---

## 1. SQL基础

> file: `sql-basics.json` — SELECT, JOIN types, subquery, GROUP BY, HAVING, 窗口函数

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 1 | SELECT 语句的执行顺序是什么？ | concept | 1 | |
| 2 | INNER JOIN 与 LEFT JOIN 的区别是什么？ | comparison | 1 | |
| 3 | 子查询(Subquery)与 JOIN 的性能差异及选择 | comparison | 2 | |
| 4 | GROUP BY 与 HAVING 的作用与区别 | concept | 1 | |
| 5 | UNION 与 UNION ALL 的区别和使用场景 | comparison | 1 | |
| 6 | SQL 中 NULL 值的比较和处理规则 | trivia | 1 | |
| 7 | EXISTS 与 IN 的区别与性能对比 | comparison | 2 | |
| 8 | CROSS JOIN 与笛卡尔积的关系与应用 | concept | 2 | |
| 9 | 窗口函数 ROW_NUMBER / RANK / DENSE_RANK 的区别 | concept | 2 | |
| 10 | CASE WHEN 表达式的使用场景与写法 | concept | 1 | |
| 11 | SQL 中 DISTINCT 的实现原理与性能影响 | principle | 2 | |
| 12 | 多表 JOIN 时如何控制查询性能？ | open-ended | 3 | |
| 13 | 使用 CTE (Common Table Expression) 重构复杂子查询 | practice | 2 | |
| 14 | 编写一条统计各部门平均薪资 Top 3 员工的 SQL | practice | 3 | |
| 15 | SELF JOIN 的典型使用场景有哪些？ | concept | 2 | |

## 2. 索引原理

> file: `index-fundamentals.json` — B+树, hash index, composite index, covering index, index selectivity

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 16 | B+树索引的结构与工作原理 | principle | 2 | |
| 17 | B+树与 B 树的区别是什么？ | comparison | 2 | |
| 18 | Hash 索引的原理与适用场景 | principle | 2 | |
| 19 | 聚簇索引(Clustered Index)与非聚簇索引的区别 | comparison | 2 | |
| 20 | 复合索引(Composite Index)的最左前缀原则 | principle | 2 | |
| 21 | 覆盖索引(Covering Index)是什么？为什么能提升性能？ | concept | 2 | |
| 22 | 索引选择性(Index Selectivity)如何影响查询优化器的决策？ | principle | 3 | |
| 23 | 为什么主键推荐使用自增 ID 而非 UUID？ | principle | 2 | |
| 24 | 全文索引(Full-Text Index)的原理与使用限制 | concept | 2 | |
| 25 | InnoDB 中二级索引如何回表查询？ | principle | 3 | |
| 26 | 索引的存储开销和写入性能影响 | principle | 2 | |
| 27 | 什么是索引下推(Index Condition Pushdown, ICP)？ | concept | 3 | |

## 3. 索引优化

> file: `index-optimization.json` — EXPLAIN, index hints, index merge, invisible index

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 28 | EXPLAIN 输出中各字段(type, key, rows, Extra)的含义 | concept | 2 | |
| 29 | 如何通过 EXPLAIN 判断查询是否使用了索引？ | concept | 1 | |
| 30 | 索引失效的常见场景有哪些？ | trivia | 2 | |
| 31 | 使用 Index Hint 强制指定索引的场景和语法 | env-config | 2 | |
| 32 | Index Merge 优化的原理与触发条件 | principle | 3 | |
| 33 | MySQL 8.0 Invisible Index 的作用与使用方法 | purpose | 2 | |
| 34 | 如何为慢查询设计合适的索引？ | open-ended | 3 | |
| 35 | 前缀索引(Prefix Index)的使用场景与长度选择 | modification | 2 | |
| 36 | ORDER BY 与索引的关系：如何避免 filesort？ | debugging | 3 | |
| 37 | 联合索引的列顺序应该如何选择？ | principle | 3 | |

## 4. 事务基础

> file: `transaction-basics.json` — ACID, isolation levels, read phenomena

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 38 | 什么是数据库事务？ACID 特性分别含义是什么？ | concept | 1 | |
| 39 | 四种事务隔离级别分别解决了什么问题？ | concept | 1 | |
| 40 | 脏读(Dirty Read)、不可重复读、幻读的区别 | comparison | 1 | |
| 41 | MySQL 默认隔离级别是什么？为什么选择它？ | trivia | 1 | |
| 42 | READ COMMITTED 和 REPEATABLE READ 在实际业务中如何选择？ | open-ended | 3 | |
| 43 | 事务的原子性(Atomicity)是如何通过 undo log 保证的？ | principle | 2 | |
| 44 | 事务的持久性(Durability)是如何通过 redo log 保证的？ | principle | 2 | |
| 45 | SERIALIZABLE 隔离级别的实现方式与性能影响 | principle | 3 | |
| 46 | 自动提交(autocommit)模式对事务的影响 | env-config | 1 | |
| 47 | 长事务的危害与如何监控和避免？ | debugging | 2 | |

## 5. MVCC

> file: `mvcc.json` — read view, undo log, version chain, snapshot isolation

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 48 | MVCC(多版本并发控制)的基本原理是什么？ | principle | 2 | |
| 49 | InnoDB 中 Read View 的创建时机与作用 | principle | 3 | |
| 50 | Undo Log 在 MVCC 中扮演什么角色？ | purpose | 2 | |
| 51 | 版本链(Version Chain)的结构与遍历过程 | principle | 3 | |
| 52 | 快照读(Snapshot Read)与当前读(Current Read)的区别 | comparison | 2 | |
| 53 | REPEATABLE READ 下 MVCC 如何避免幻读？ | principle | 3 | |
| 54 | READ COMMITTED 下每次 SELECT 都创建新 Read View 的影响 | principle | 3 | |
| 55 | MVCC 与锁机制是如何协同工作的？ | open-ended | 4 | |
| 56 | PostgreSQL 的 MVCC 实现与 MySQL 有何不同？ | comparison | 3 | |
| 57 | 为什么 MVCC 需要 purge 线程回收旧版本？ | purpose | 3 | |

## 6. 锁机制

> file: `lock-mechanism.json` — row lock, gap lock, next-key lock, intention lock, deadlock

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 58 | InnoDB 行锁(Row Lock)的实现原理 | principle | 2 | |
| 59 | 间隙锁(Gap Lock)的作用与触发条件 | concept | 3 | |
| 60 | Next-Key Lock 是什么？它解决了什么问题？ | concept | 3 | |
| 61 | 意向锁(Intention Lock)的作用与兼容矩阵 | concept | 3 | |
| 62 | 死锁(Deadlock)产生的四个必要条件 | trivia | 2 | |
| 63 | MySQL 如何检测和处理死锁？ | principle | 3 | |
| 64 | 如何分析 SHOW ENGINE INNODB STATUS 中的死锁信息？ | debugging | 3 | |
| 65 | 乐观锁与悲观锁的区别及适用场景 | comparison | 1 | |
| 66 | SELECT ... FOR UPDATE 与 SELECT ... LOCK IN SHARE MODE 的区别 | comparison | 2 | |
| 67 | 表锁与行锁的适用场景对比 | comparison | 1 | |
| 68 | 在线上环境遇到锁等待超时应如何排查？ | debugging | 4 | |
| 69 | 如何通过业务设计减少锁冲突？ | open-ended | 4 | |

## 7. MySQL存储引擎

> file: `storage-engines.json` — InnoDB vs MyISAM, memory engine, archive

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 70 | InnoDB 与 MyISAM 的核心区别有哪些？ | comparison | 1 | |
| 71 | 为什么 MySQL 5.5 以后默认存储引擎改为 InnoDB？ | trivia | 1 | |
| 72 | MEMORY 引擎的使用场景和限制 | concept | 2 | |
| 73 | ARCHIVE 引擎适合什么场景？ | purpose | 1 | |
| 74 | InnoDB 的表空间(Tablespace)结构是怎样的？ | concept | 2 | |
| 75 | InnoDB 的 Buffer Pool 是什么？工作原理？ | principle | 2 | |
| 76 | 如何查看和切换表的存储引擎？ | env-config | 1 | |
| 77 | 不同存储引擎在崩溃恢复方面的差异 | comparison | 3 | |

## 8. 日志系统

> file: `log-system.json` — redo log, undo log, binlog, WAL, two-phase commit

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 78 | Redo Log 的作用与写入流程 | principle | 2 | |
| 79 | Undo Log 的作用与存储方式 | concept | 2 | |
| 80 | Binlog 的三种格式(Statement/Row/Mixed)及区别 | comparison | 2 | |
| 81 | WAL(Write-Ahead Logging)机制的核心思想 | principle | 2 | |
| 82 | 两阶段提交(Two-Phase Commit)为什么是必要的？ | principle | 3 | |
| 83 | Redo Log 与 Binlog 的区别 | comparison | 2 | |
| 84 | Binlog 刷盘策略 sync_binlog 参数的含义与取值 | env-config | 3 | |
| 85 | innodb_flush_log_at_trx_commit 参数的三个取值及影响 | env-config | 3 | |
| 86 | 如何通过 mysqlbinlog 工具解析 Binlog？ | practice | 2 | |
| 87 | Redo Log 空间不足时会发生什么？ | debugging | 3 | |

## 9. 查询优化

> file: `query-optimization.json` — query plan, optimizer, join algorithms, subquery optimization

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 88 | MySQL 查询优化器是如何选择执行计划的？ | concept | 2 | |
| 89 | Nested Loop Join / Hash Join / Sort Merge Join 的区别 | comparison | 3 | |
| 90 | 子查询优化：IN 子查询与 EXISTS 的转换规则 | trivia | 3 | |
| 91 | 派生表(Derived Table)的物化策略与优化 | concept | 3 | |
| 92 | 为什么有时优化器不选择已有的索引？ | debugging | 3 | |
| 93 | STRAIGHT_JOIN 的作用与使用场景 | purpose | 2 | |
| 94 | MySQL 8.0 的 Hash Join 改进了什么？ | trivia | 2 | |
| 95 | LIMIT 分页查询在大偏移量下的性能问题与优化 | tuning | 3 | |
| 96 | COUNT(*) 和 COUNT(1) 和 COUNT(column) 的区别 | trivia | 1 | |
| 97 | 如何优化 ORDER BY + LIMIT 的查询？ | tuning | 2 | |
| 98 | 使用 FORCE INDEX 时需要注意什么？ | trivia | 2 | |
| 99 | 如何分析一个复杂查询的执行瓶颈？ | open-ended | 4 | |

## 10. 慢查询分析

> file: `slow-query.json` — slow query log, pt-query-digest, EXPLAIN format

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 100 | 如何开启和配置 MySQL 慢查询日志？ | env-config | 1 | |
| 101 | long_query_time 参数的设置建议 | env-config | 1 | |
| 102 | pt-query-digest 工具的使用方法与输出解读 | practice | 2 | |
| 103 | EXPLAIN FORMAT=JSON/TREE 比默认格式多了哪些信息？ | trivia | 2 | |
| 104 | 慢查询中 Rows_examined 远大于 Rows_sent 说明什么问题？ | debugging | 2 | |
| 105 | 如何在不重启实例的情况下动态开启慢查询日志？ | env-config | 1 | |
| 106 | Performance Schema 中哪些表可以用于慢查询分析？ | trivia | 3 | |
| 107 | 一条线上慢查询的完整分析流程是怎样的？ | open-ended | 3 | |

## 11. 连接管理

> file: `connection-management.json` — connection pool, max_connections, thread pool

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 108 | MySQL 连接的建立过程是怎样的？ | concept | 1 | |
| 109 | max_connections 参数的设置原则与注意事项 | env-config | 2 | |
| 110 | 连接池(Connection Pool)的工作原理与配置 | concept | 2 | |
| 111 | 短连接 vs 长连接 vs 连接池的优缺点 | comparison | 2 | |
| 112 | Thread Pool 与 Per-Connection-Per-Thread 模型的区别 | concept | 3 | |
| 113 | 出现 Too many connections 错误时如何紧急处理？ | debugging | 2 | |
| 114 | wait_timeout 和 interactive_timeout 参数的区别 | trivia | 1 | |
| 115 | 如何监控数据库的活跃连接数和连接状态？ | env-config | 1 | |

## 12. 主从复制

> file: `replication.json` — binlog replication, GTID, semi-sync, replication lag

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 116 | MySQL 主从复制的基本原理与流程 | purpose | 1 | |
| 117 | 基于 Binlog Position 与基于 GTID 复制的区别 | trivia | 2 | |
| 118 | 半同步复制(Semi-Sync)与异步复制的区别 | trivia | 2 | |
| 119 | 主从复制延迟(Replication Lag)的常见原因 | debugging | 2 | |
| 120 | 如何监控和解决主从复制延迟？ | tuning | 3 | |
| 121 | 并行复制(Parallel Replication)的原理与配置 | env-config | 3 | |
| 122 | 主从数据不一致的排查与修复方法 | debugging | 3 | |
| 123 | 读写分离的实现方式及注意事项 | open-ended | 2 | |
| 124 | 级联复制(Cascading Replication)的使用场景 | purpose | 2 | |
| 125 | 主从复制中 relay log 的作用 | purpose | 1 | |

## 13. 分库分表

> file: `sharding.json` — sharding strategies, consistent hashing, middleware

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 126 | 什么时候需要分库分表？判断依据是什么？ | requirement | 1 | |
| 127 | 垂直分库与水平分库的区别 | trivia | 1 | |
| 128 | 常见的分片键(Sharding Key)选择原则 | requirement | 1 | |
| 129 | 一致性哈希(Consistent Hashing)在分库分表中的应用 | purpose | 4 | |
| 130 | 分库分表后如何处理跨分片查询？ | open-ended | 4 | |
| 131 | ShardingSphere 中间件的核心功能与使用方式 | env-config | 2 | |
| 132 | 分库分表后全局唯一 ID 的生成方案有哪些？ | requirement | 3 | |
| 133 | 分表后如何实现分页排序查询？ | debugging | 4 | |
| 134 | 将一张 5000 万行的订单表进行分表的方案设计 | project | 4 | |
| 135 | 分库分表的数据迁移(扩容)策略 | modification | 4 | |

## 14. 高可用

> file: `high-availability.json` — MGR, Galera, Orchestrator, failover

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 136 | MySQL Group Replication (MGR) 的工作原理 | purpose | 4 | |
| 137 | Galera Cluster 的特点与适用场景 | purpose | 3 | |
| 138 | Orchestrator 在 MySQL 高可用中的作用 | purpose | 2 | |
| 139 | 数据库主库故障时的 Failover 流程 | requirement | 3 | |
| 140 | MHA (Master High Availability) 的工作原理与局限性 | trivia | 3 | |
| 141 | 如何设计一个可用性达到 99.99% 的数据库架构？ | project | 4 | |
| 142 | 脑裂(Split-Brain)问题的产生与解决 | debugging | 4 | |
| 143 | 自动 Failover 与手动 Failover 的选择 | open-ended | 4 | |

## 15. 备份恢复

> file: `backup-recovery.json` — mysqldump, xtrabackup, point-in-time recovery

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 144 | mysqldump 的工作原理与常用参数 | env-config | 1 | |
| 145 | Percona XtraBackup 的热备原理 | trivia | 3 | |
| 146 | 基于 Binlog 的 Point-in-Time Recovery 流程 | practice | 3 | |
| 147 | 逻辑备份与物理备份的区别与适用场景 | requirement | 1 | |
| 148 | 如何验证备份的有效性？ | open-ended | 2 | |
| 149 | 某日数据库误删除一张表，描述完整的恢复流程 | real-data | 4 | |
| 150 | 备份策略：全量备份、增量备份与差异备份的搭配 | modification | 1 | |
| 151 | 大规模数据库(>1TB)的备份方案选择 | requirement | 4 | |

## 16. 数据类型与设计

> file: `data-types-design.json` — char vs varchar, datetime vs timestamp, normalization

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 152 | CHAR 与 VARCHAR 的存储方式与选择建议 | modification | 1 | |
| 153 | DATETIME 与 TIMESTAMP 的区别 | trivia | 1 | |
| 154 | INT(11) 中的 11 代表什么？是否影响存储空间？ | trivia | 1 | |
| 155 | 三大范式(1NF/2NF/3NF)分别解决什么问题？ | requirement | 1 | |
| 156 | 为什么实际业务中经常需要反范式化设计？ | open-ended | 2 | |
| 157 | DECIMAL 与 FLOAT/DOUBLE 在金额存储中的选择 | modification | 1 | |
| 158 | TEXT / BLOB 类型的使用注意事项 | modification | 1 | |
| 159 | ENUM 类型的优缺点与替代方案 | modification | 1 | |
| 160 | 数据库表设计中如何处理软删除？ | modification | 2 | |
| 161 | 设计一个百万级用户系统的用户表结构 | real-data | 3 | |
| 162 | JSON/JSONB 类型在 MySQL 和 PostgreSQL 中的使用 | modification | 2 | |
| 163 | 如何设计合理的数据库命名规范？ | requirement | 1 | |

## 17. SQL注入与安全

> file: `sql-security.json` — prepared statements, privilege management

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 164 | SQL 注入的原理与常见攻击方式 | real-data | 1 | |
| 165 | Prepared Statement 如何防止 SQL 注入？ | purpose | 1 | |
| 166 | MySQL 权限管理：GRANT/REVOKE 的使用 | env-config | 1 | |
| 167 | 最小权限原则在数据库账号管理中的实践 | requirement | 1 | |
| 168 | 数据库审计日志(Audit Log)的配置与分析 | env-config | 4 | |
| 169 | 如何检测应用中是否存在 SQL 注入漏洞？ | debugging | 3 | |
| 170 | 数据脱敏(Data Masking)的常见方案 | modification | 1 | |
| 171 | 数据库 SSL/TLS 连接的配置方法 | modification | 3 | |

## 18. PostgreSQL特性

> file: `postgresql.json` — MVCC差异, JSONB, extension, vacuum

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 172 | PostgreSQL 的 MVCC 与 MySQL 的实现差异 | real-data | 4 | |
| 173 | PostgreSQL 中 VACUUM 和 AUTOVACUUM 的作用与配置 | tuning | 3 | |
| 174 | PostgreSQL 的 JSONB 类型与操作符使用 | practice | 2 | |
| 175 | PostgreSQL 的 Extension 机制与常用扩展 | purpose | 2 | |
| 176 | PostgreSQL 的 TOAST 机制是什么？ | trivia | 3 | |
| 177 | PostgreSQL 的分区表(Declarative Partitioning)实现 | modification | 3 | |
| 178 | PostgreSQL 的 CTE 与递归查询 | practice | 4 | |
| 179 | PostgreSQL WAL 日志与流复制的配置 | tuning | 3 | |
| 180 | PostgreSQL 的 pg_stat_statements 性能分析 | tuning | 2 | |
| 181 | PostgreSQL 与 MySQL 在选型时如何决策？ | open-ended | 2 | |

## 19. NoSQL对比

> file: `nosql-comparison.json` — RDBMS vs NoSQL, use cases, CAP in databases

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 182 | RDBMS 与 NoSQL 数据库的核心区别 | real-data | 1 | |
| 183 | CAP 定理在数据库选型中的应用 | real-data | 1 | |
| 184 | 什么场景适合用 MongoDB 替代 MySQL？ | open-ended | 2 | |
| 185 | Redis 作为缓存层与 MySQL 的数据一致性问题 | real-data | 4 | |
| 186 | NewSQL 数据库(TiDB/CockroachDB)的定位与特点 | real-data | 2 | |
| 187 | 时序数据库(InfluxDB/TimescaleDB)的使用场景 | requirement | 2 | |
| 188 | 图数据库(Neo4j)适合解决什么问题？ | real-data | 1 | |
| 189 | 多模型数据库的趋势与代表产品 | open-ended | 1 | |

## 20. 性能调优

> file: `performance-tuning.json` — buffer pool, innodb parameters, disk I/O optimization

| # | 题目 | type | difficulty | 状态 |
|---|------|------|-----------|------|
| 190 | InnoDB Buffer Pool 的大小如何设置？ | tuning | 2 | |
| 191 | innodb_buffer_pool_instances 参数的作用 | tuning | 3 | |
| 192 | innodb_io_capacity 和 innodb_io_capacity_max 参数配置 | tuning | 3 | |
| 193 | 数据库服务器的磁盘 I/O 瓶颈如何定位？ | debugging | 4 | |
| 194 | 如何通过 SHOW GLOBAL STATUS 分析数据库性能？ | real-data | 2 | |
| 195 | 内存与磁盘比例对数据库性能的影响 | tuning | 3 | |
| 196 | 大表 ALTER TABLE 的性能问题与在线 DDL 方案 | modification | 4 | |
| 197 | 设计一个日均千万级写入的数据库架构 | project | 4 | |
| 198 | 线上数据库 CPU 飙升的排查流程 | debugging | 4 | |
| 199 | 数据库连接风暴(Connection Storm)的原因与应对 | real-data | 4 | |
| 200 | 如何制定一套完整的数据库性能基准测试方案？ | project | 4 | |

---

## 统计汇总

### 类型分布

| type | 目标 | 实际 | 差异 |
|------|------|------|------|
| concept | ~25 | 24 | -1 |
| principle | ~25 | 24 | -1 |
| comparison | ~18 | 18 | 0 |
| trivia | ~18 | 20 | +2 |
| env-config | ~15 | 15 | 0 |
| modification | ~12 | 13 | +1 |
| purpose | ~15 | 14 | -1 |
| open-ended | ~15 | 15 | 0 |
| debugging | ~15 | 15 | 0 |
| real-data | ~10 | 11 | +1 |
| requirement | ~10 | 10 | 0 |
| tuning | ~10 | 10 | 0 |
| practice | ~7 | 7 | 0 |
| project | ~5 | 4 | -1 |
| **合计** | **~200** | **200** | — |

### 难度分布

| difficulty | 目标 | 实际 | 差异 |
|-----------|------|------|------|
| 1 | ~50 | 50 | 0 |
| 2 | ~70 | 71 | +1 |
| 3 | ~55 | 54 | -1 |
| 4 | ~25 | 25 | 0 |
| **合计** | **~200** | **200** | — |

### 题包文件清单

| 文件名 | 子主题 | 题数 | 路径 |
|--------|--------|------|------|
| `sql-basics.json` | SQL基础 | 15 | `public/question-packs/database/` |
| `index-fundamentals.json` | 索引原理 | 12 | `public/question-packs/database/` |
| `index-optimization.json` | 索引优化 | 10 | `public/question-packs/database/` |
| `transaction-basics.json` | 事务基础 | 10 | `public/question-packs/database/` |
| `mvcc.json` | MVCC | 10 | `public/question-packs/database/` |
| `lock-mechanism.json` | 锁机制 | 12 | `public/question-packs/database/` |
| `storage-engines.json` | MySQL存储引擎 | 8 | `public/question-packs/database/` |
| `log-system.json` | 日志系统 | 10 | `public/question-packs/database/` |
| `query-optimization.json` | 查询优化 | 12 | `public/question-packs/database/` |
| `slow-query.json` | 慢查询分析 | 8 | `public/question-packs/database/` |
| `connection-management.json` | 连接管理 | 8 | `public/question-packs/database/` |
| `replication.json` | 主从复制 | 10 | `public/question-packs/database/` |
| `sharding.json` | 分库分表 | 10 | `public/question-packs/database/` |
| `high-availability.json` | 高可用 | 8 | `public/question-packs/database/` |
| `backup-recovery.json` | 备份恢复 | 8 | `public/question-packs/database/` |
| `data-types-design.json` | 数据类型与设计 | 12 | `public/question-packs/database/` |
| `sql-security.json` | SQL注入与安全 | 8 | `public/question-packs/database/` |
| `postgresql.json` | PostgreSQL特性 | 10 | `public/question-packs/database/` |
| `nosql-comparison.json` | NoSQL对比 | 8 | `public/question-packs/database/` |
| `performance-tuning.json` | 性能调优 | 11 | `public/question-packs/database/` |
