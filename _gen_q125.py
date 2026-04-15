# -*- coding: utf-8 -*-
import json
import os

content = '''假设你所在的电商团队使用 MySQL 8.0 作为核心 OLTP 数据库，存储了用户、商品、订单等 20 多张业务表，高峰期写入 QPS 约 5000。下游有三个消费方需要近实时数据：Elasticsearch 做商品全文搜索、Redis 做热点缓存预热、ClickHouse 做实时数仓分析。之前团队用 Confluent JDBC Source Connector 每 5 秒轮询一次 MySQL，靠自增 ID 和更新时间戳追踪增量变更，这套方案跑了半年暴露出三个严重问题。

第一个问题是 DELETE 操作完全捕获不到。行被物理删除后轮询查询自然找不到它，结果就是 Elasticsearch 里下架商品的搜索结果还在、ClickHouse 里已取消的订单还挂着「待支付」状态，下游出现了大量「数据幽灵」。第二个问题是延迟不可控，5 秒轮询间隔意味着端到端延迟至少 5 秒起步，遇到 MySQL 查询慢或 Connect 反压时实际延迟能飙到 30 秒以上，运营在实时看板上看到的数据总是「慢半拍」。第三个问题是轮询给 MySQL 带来的额外负载，20 张表每 5 秒各来一次 SELECT 查询，高峰期 QPS 凭空多了 20%。

你的团队已经在运行 Kafka 3.6 集群（三个 Broker）和 Kafka Connect Distributed 模式的 Worker 集群（三个 Worker 节点，8083 端口）。现在你被要求设计一套真正的 CDC 方案，替换掉现有的轮询同步，核心需求是：完整覆盖 INSERT、UPDATE、DELETE 三种操作，端到端延迟秒级以内，能处理 schema 变更（加列、改列类型）而不中断同步，并且上线过程中不能丢失存量数据。

在技术选型调研中你了解到 Debezium 是当前最主流的开源 CDC 方案，它以 Kafka Connect Source Connector 的形态运行，通过读取 MySQL binlog 捕获行级变更。但你还需要搞清楚几个关键问题：MySQL 侧需要做哪些前置配置？Connector 怎么部署和调参？消息格式是什么样的？初始全量快照怎么处理？和国内常用的 Canal、Maxwell 相比 Debezium 有哪些优势和劣势？这道题考察的是你对 MySQL CDC 方案从选型到生产落地的完整实践能力。'''

answer = '''## 核心概念基础详解

CDC 的全称是 Change Data Capture（变更数据捕获），核心思想是从数据库的变更日志中实时捕获行级别的数据变更事件。理解 CDC 之前要先搞清楚它解决了什么问题。传统的数据同步方式分为两大类：全量同步和增量轮询。全量同步每次 SELECT * 把整张表导出一遍，适合数据量小且对时效性要求不高的场景，但表一大就完全不可行。增量轮询（也就是 JDBC Source Connector 的 incrementing/timestamp 模式）靠表上的自增 ID 或 updated_at 字段每隔几秒做一次 WHERE id > last_id 查询，看起来更聪明，但有三个无法绕过的硬伤：第一，DELETE 操作捕获不到——行被删了，WHERE 条件自然查不到它；第二，UPDATE 依赖 updated_at 字段的可靠性，如果业务代码某个路径忘了更新这个字段，变更就会被漏掉；第三，轮询间隔直接决定了延迟下限，5 秒轮询意味着最好情况下延迟也是 5 秒。日志级 CDC 从根本上解决了这些问题——MySQL 的 binlog（Binary Log）忠实记录了每一条 INSERT、UPDATE 和 DELETE 的行级变更，包括变更前后的完整字段值。

Debezium（发音类似「DEE-bee-zee-um」）是目前最主流的开源 CDC 平台，由 Red Hat 维护，2016 年首次发布，截至 2024 年最新稳定版为 2.5.x，GitHub 上超过 10k star。它以 Kafka Connect Source Connector 的形态运行，支持 MySQL、PostgreSQL、MongoDB、SQL Server、Oracle、Db2 等 10 多种数据源。Debezium 的工作原理是伪装成一个 MySQL 从节点（Replica），通过 MySQL 复制协议订阅 binlog 事件流，把每个行变更事件转换为 Kafka 消息写入对应的 Topic。这个过程不需要修改任何业务代码，不需要在表上加触发器，对 MySQL 的额外负载仅相当于多了一个 Slave 在拉 binlog。选择 Debezium 而不是自己写 binlog 解析器的核心原因是：binlog 协议解析、GTID 追踪、快照管理、schema 演进处理这些底层细节异常复杂，Debezium 把这些全部封装好了，你只需要提交一份 JSON 配置。

## Debezium MySQL Connector 完整部署实践

### MySQL 前置配置

部署 Debezium 之前，MySQL 侧需要确认三项关键配置。在 my.cnf（或 mysqld.cnf）中确保以下参数正确设置：

```ini
[mysqld]
server-id         = 1          # 集群内唯一 ID，Debezium 也需要一个不同的 server-id
log_bin           = mysql-bin  # 开启 binlog
binlog_format     = ROW        # 必须是 ROW，STATEMENT 和 MIXED 都不行
binlog_row_image  = FULL       # 必须是 FULL，记录变更前后所有列的值
expire_logs_days  = 3          # binlog 保留天数，建议至少 3 天
```

binlog_format=ROW 是硬性要求，因为只有 ROW 模式才会记录每行数据变更前后的完整字段值。STATEMENT 模式只记录 SQL 语句原文，同一条 SQL 在不同的执行上下文中可能产生不同的结果（比如包含 NOW() 或 UUID() 的语句），Debezium 无法从 SQL 文本可靠地反推出行级变更。binlog_row_image=FULL 确保 UPDATE 事件包含所有列的旧值和新值，而不仅仅是被修改的列——下游消费者往往需要未修改字段的值来做业务逻辑判断。接下来为 Debezium 创建一个专用的 MySQL 用户并授权：

```sql
CREATE USER 'debezium'@'%' IDENTIFIED BY 'strong_password';
GRANT SELECT, RELOAD, SHOW DATABASES, REPLICATION SLAVE, REPLICATION CLIENT ON *.* TO 'debezium'@'%';
FLUSH PRIVILEGES;
```

这里 REPLICATION SLAVE 和 REPLICATION CLIENT 是 Debezium 读取 binlog 所必需的权限，SELECT 权限用于执行初始快照时的全表扫描，RELOAD 权限用于快照时获取全局读锁。在 MySQL 8.0 中如果使用 snapshot.locking.mode=minimal，Debezium 会用 FLUSH TABLES WITH READ LOCK 获取一个短暂的全局锁来记录一致性位点，然后立即释放，对业务写入的影响通常在毫秒级。

### Connector 部署与配置

首先将 Debezium MySQL Connector 插件部署到 Connect Worker 的 plugin.path 目录。以 Debezium 2.5 为例，从 Maven Central 或 Debezium 官网下载 debezium-connector-mysql-2.5.0.Final-plugin.tar.gz，解压到 /opt/kafka-connect/plugins/debezium-mysql/ 目录，重启 Connect Worker 加载新插件。验证插件是否加载成功：

```bash
$ curl -s http://localhost:8083/connector-plugins | jq '.[].class' | grep -i debezium
"io.debezium.connector.mysql.MySqlConnector"
```

确认插件可用后，通过 REST API 提交 Connector 配置：

```bash
$ curl -X POST http://localhost:8083/connectors \\
  -H "Content-Type: application/json" \\
  -d '{
    "name": "mysql-cdc-source",
    "config": {
      "connector.class": "io.debezium.connector.mysql.MySqlConnector",
      "database.hostname": "mysql-primary.internal",
      "database.port": "3306",
      "database.user": "debezium",
      "database.password": "strong_password",
      "database.server.id": "184054",
      "topic.prefix": "cdc",
      "database.include.list": "ecommerce",
      "table.include.list": "ecommerce.orders,ecommerce.order_items,ecommerce.products",
      "schema.history.internal.kafka.bootstrap.servers": "kafka-1:9092,kafka-2:9092,kafka-3:9092",
      "schema.history.internal.kafka.topic": "cdc.schema-history",
      "snapshot.mode": "initial",
      "snapshot.locking.mode": "minimal",
      "include.schema.changes": "true",
      "key.converter": "org.apache.kafka.connect.json.JsonConverter",
      "key.converter.schemas.enable": "false",
      "value.converter": "org.apache.kafka.connect.json.JsonConverter",
      "value.converter.schemas.enable": "false",
      "tasks.max": "1",
      "tombstones.on.delete": "true",
      "decimal.handling.mode": "string",
      "time.precision.mode": "connect"
    }
  }'
```

几个关键配置需要特别说明。topic.prefix 定义了 Topic 命名的前缀，Debezium 的 Topic 命名规范是 {topic.prefix}.{database}.{table}，所以 ecommerce.orders 表的变更事件会写入 cdc.ecommerce.orders 这个 Topic。database.server.id 必须是集群中唯一的数字 ID，不能与 MySQL Master 或其他 Slave 的 server-id 冲突。tasks.max 对于 MySQL Connector 来说只能设为 1，因为 MySQL binlog 是单一的顺序日志流，无法并行读取——这和 JDBC Source Connector 可以按表分多个 Task 不同。tombstones.on.delete=true 表示在 DELETE 事件之后额外发送一条 key 相同但 value 为 null 的墓碑消息（tombstone），这对 Kafka Log Compaction 正确清理已删除 key 至关重要。

### 消息格式详解

Debezium 的消息由 key 和 value 两部分组成。key 包含变更行的主键值，value 是一个结构化的 JSON 对象，核心字段包括 before（变更前的行数据，INSERT 时为 null）、after（变更后的行数据，DELETE 时为 null）、source（元数据，包含 binlog 文件名、位点、表名、server-id 等）、op（操作类型：c=create 即 INSERT，u=update，d=delete，r=read 即快照）和 ts_ms（Debezium 处理事件的时间戳）。以下是一条真实的 UPDATE 事件示例，用户将订单状态从「待支付」改为「已支付」：

```json
{
  "before": {
    "id": 10042,
    "user_id": 8821,
    "status": "pending",
    "amount": "199.00",
    "updated_at": "2024-01-15T10:30:00Z"
  },
  "after": {
    "id": 10042,
    "user_id": 8821,
    "status": "paid",
    "amount": "199.00",
    "updated_at": "2024-01-15T10:35:22Z"
  },
  "source": {
    "version": "2.5.0.Final",
    "connector": "mysql",
    "name": "cdc",
    "ts_ms": 1705312522000,
    "db": "ecommerce",
    "table": "orders",
    "server_id": 1,
    "file": "mysql-bin.000003",
    "pos": 154872,
    "row": 0
  },
  "op": "u",
  "ts_ms": 1705312522341
}
```

这条消息的 key 是 {"id": 10042}，下游消费者通过 op 字段判断操作类型，通过 before 和 after 字段获取变更前后的完整数据，通过 source 字段追踪到精确的 binlog 文件名和位点。注意消息体中有两个 ts_ms：source.ts_ms 是 MySQL binlog 事件的原始时间戳，外层 ts_ms 是 Debezium 处理该事件的时间戳，两者的差值可以用来衡量 Debezium 的处理延迟。

### 初始快照与 Schema History

Debezium 默认的 snapshot.mode=initial 意味着 Connector 首次启动时会先执行一次全量快照：对配置的每张表执行 SELECT * 查询，将每一行转换为 op="r" 的事件发送到 Kafka，快照完成后自动切换到 binlog 实时流模式。对于数据量大的表，快照阶段可能持续数分钟甚至数小时——一张 5000 万行的订单表首次快照大约需要 15-30 分钟（取决于行大小和网络带宽）。快照期间 Debezium 会记录开始时的 binlog 位点，快照结束后从该位点开始消费 binlog，确保不会遗漏快照期间发生的变更。后续 Connector 重启时，由于 __connect-offsets 中已经记录了 binlog 位点，不会重复快照，而是直接从上次位点继续消费。

schema.history.internal.kafka.topic 是 Debezium 用来追踪 DDL 变更的内部 Topic。每当 Debezium 在 binlog 中遇到 ALTER TABLE、CREATE TABLE 等 DDL 语句时，会将 DDL 信息写入这个 Topic。为什么需要这个机制？因为 binlog 中的 ROW 事件不包含列名信息，只有列的序号和值。假设 orders 表原来有 5 列，后来 ALTER TABLE 加了一列 coupon_code，加列之后的 binlog 事件有 6 个值，加列之前的事件只有 5 个。Debezium 必须根据 DDL 历史判断每条 binlog 事件对应的 schema 版本，才能正确映射字段名。如果 schema history topic 数据丢失，Debezium 将无法正确解析历史 binlog 事件，通常需要重做全量快照来恢复。

## 体系化扩展延伸

### Exactly-Once 语义与监控

Debezium 2.x 配合 Kafka Connect 3.3+ 的 Exactly-Once Source 支持（KIP-618），可以实现 Source 端的精确一次语义。原理是将 binlog offset 提交和 Kafka Producer 事务绑定为原子操作，即使 Connector 在写入 Kafka 成功但提交 offset 之前崩溃，重启后也不会重复发送已提交的消息。启用方式是在 Connect Worker 配置中设置 exactly.once.source.support=enabled，但要注意这会增加约 5-10% 的吞吐开销，且要求 Broker 版本 >= 2.6。在大多数 CDC 场景中，下游系统通常需要具备幂等处理能力（比如 Elasticsearch 的 upsert 天然幂等），所以默认的 at-least-once 语义配合下游幂等也是一种务实可行的策略。

监控 Debezium 同步延迟的核心指标是 JMX metric MilliSecondsBehindSource，它表示当前处理的 binlog 事件时间戳与 MySQL 服务器当前时间的差值。正常运行时这个值应在几百毫秒以内，如果持续增长说明消费速度跟不上 binlog 产生速度。配合 Kafka Consumer Lag 指标可以端到端监控从 MySQL binlog 到 Kafka Topic 再到下游消费者的全链路延迟。在 Grafana 中建议设置两个告警：MilliSecondsBehindSource > 10s 触发 Warning，> 60s 触发 Critical。

### 常见问题与避坑指南

GTID（Global Transaction ID）是 MySQL 5.6+ 引入的全局事务标识符。如果 MySQL 开启了 GTID 模式（gtid_mode=ON），Debezium 会自动使用 GTID 来追踪 binlog 位置而不是传统的 file+position 方式——传统方式在主从切换后可能失效，而 GTID 是全局唯一的，切换到新 Master 后 Debezium 可以无缝继续消费。强烈建议在生产环境中开启 GTID。binlog 轮转是另一个需要注意的问题，MySQL 的 binlog 文件会按 max_binlog_size（默认 1GB）轮转并按 expire_logs_days 清理。如果 Debezium 长时间停机后重启，上次记录的 binlog 文件可能已被 MySQL 清理掉，Connector 会报「binlog file not found」错误进入 FAILED 状态。解决方案是将 expire_logs_days 设置得足够长（建议至少 3 天），或在长时间停机后将 snapshot.mode 临时改为 initial 重做快照。时区处理是 Debezium 的一个经典坑：MySQL 的 TIMESTAMP 类型存储 UTC 时间戳，DATETIME 存储本地时间字符串。如果 MySQL 服务器时区是 Asia/Shanghai 而 Debezium 运行在 UTC 环境中，DATETIME 字段可能出现 8 小时偏移，需要在 Connector 配置中设置 database.connectionTimeZone=Asia/Shanghai。

### Debezium vs Canal vs Maxwell

在 MySQL CDC 领域，国内常见的三个方案是 Debezium、Canal（阿里开源）和 Maxwell（Zendesk 开源）。Canal 在阿里系生态中积淀深厚，架构是独立部署的 Canal Server 进程伪装成 MySQL Slave 读取 binlog，通过自己的 Client SDK 或 Canal Adapter 推送到下游。Canal 的优势在于国内社区活跃、中文文档丰富、和阿里云生态集成好，但它只支持 MySQL 单一数据源，且不具备 Kafka Connect 框架提供的 offset 自动管理和 Worker 级容错。Maxwell 更加轻量，单进程直接将 binlog 事件以 JSON 写入 Kafka，配置极其简单，但同样只支持 MySQL，不支持初始快照（存量数据需要自行处理），不支持 schema history 追踪，社区维护活跃度也不如 Debezium。如果你的技术栈已经包含 Kafka Connect，Debezium 是最自然的选择——多数据源支持、原生 Connect 生态集成、完善的 schema 演进处理，这三点是其核心差异化优势。

值得一提的是 Debezium Server，这是一个不依赖 Kafka Connect 的独立运行模式，可以将 CDC 事件直接推送到 Amazon Kinesis、Google Cloud Pub/Sub、Apache Pulsar 等非 Kafka 消息系统。如果你的下游不在 Kafka 生态内，Debezium Server 提供了灵活的替代方案。在数据最终落地方面，Debezium 只负责 MySQL 到 Kafka 这一段（Source），从 Kafka 到下游系统需要配合对应的 Sink Connector：Elasticsearch Sink Connector 将变更事件索引到 ES，JDBC Sink Connector 写入另一个数据库，S3 Sink Connector 或 Iceberg Sink Connector 将数据落入数据湖。完整的 CDC 管道是 Debezium Source + Kafka Topics + Sink Connectors 的三段式架构，每一段都可以独立扩展和运维。'''

key_points = [
    "CDC（Change Data Capture）通过读取 MySQL binlog 捕获行级变更，相比轮询方式能完整覆盖 INSERT、UPDATE、DELETE 操作且不会遗漏，端到端延迟可达毫秒级",
    "Debezium 是 Red Hat 开源的 CDC 平台（最新稳定版 2.5），以 Kafka Connect Source Connector 形态运行，伪装成 MySQL Slave 通过复制协议订阅 binlog 事件流",
    "MySQL 侧必须配置 binlog_format=ROW 和 binlog_row_image=FULL，Debezium 用户需要 REPLICATION SLAVE、REPLICATION CLIENT 和 SELECT 权限",
    "Debezium 消息核心字段包括 before（变更前）、after（变更后）、source（binlog 元数据）、op（操作类型 c/u/d/r）和 ts_ms，Topic 命名规范为 {topic.prefix}.{database}.{table}",
    "默认 snapshot.mode=initial 在首次启动时全量读取表数据生成 op=r 事件，然后自动切换到 binlog 实时流，后续重启直接从上次 binlog 位点继续",
    "schema.history.internal.kafka.topic 记录所有 DDL 变更历史，使 Debezium 在解析不同时期的 binlog 事件时能匹配正确的表结构版本",
    "生产环境必须监控 MilliSecondsBehindSource 指标（正常应在数百毫秒以内），并建议开启 GTID 模式确保主从切换时 binlog 位点追踪不丢失",
    "Debezium 相比 Canal（阿里开源，仅 MySQL）和 Maxwell（Zendesk 开源，无快照支持）的核心优势在于多数据源支持、Kafka Connect 原生集成和完善的 schema 演进处理"
]

quiz = [
    {
        "id": "kafka-connect-mysql-cdc-q1-quiz1",
        "question": "CDC（Change Data Capture）相比传统轮询方式最根本的优势是什么？",
        "choices": [
            {"id": "A", "text": "直接读取数据库变更日志捕获行级变更，能完整覆盖 INSERT/UPDATE/DELETE 且延迟可达毫秒级"},
            {"id": "B", "text": "通过定时 SELECT 查询发现数据变更，延迟取决于轮询间隔"},
            {"id": "C", "text": "在数据库表上创建触发器，每次数据变更时同步写入 Kafka"},
            {"id": "D", "text": "通过数据库的物化视图监听表变更事件，自动推送到消息队列"}
        ],
        "correctAnswer": "A",
        "explanation": "A 是正确答案。CDC 的核心优势在于直接读取数据库的变更日志（如 MySQL binlog），从日志层面获取完整的行级变更信息，包括 INSERT、UPDATE 和 DELETE 三种操作，延迟可以达到毫秒级。B 选项描述的是传统轮询方式，不是 CDC 的优势而是 CDC 要替代的方案，轮询方式无法捕获 DELETE 且延迟受限于轮询间隔。C 选项描述的是触发器（Trigger）方案，虽然也能捕获变更，但触发器在高并发场景下对数据库性能影响极大，且触发器内的错误可能直接阻塞业务写入，生产环境几乎不采用。D 选项的物化视图是一种预计算的查询结果缓存，不是变更捕获机制。"
    },
    {
        "id": "kafka-connect-mysql-cdc-q1-quiz2",
        "question": "Debezium 在 Kafka 生态中的运行形态是什么？",
        "choices": [
            {"id": "A", "text": "独立的 JVM 进程，通过 TCP 连接直接将数据推送到 Kafka Broker"},
            {"id": "B", "text": "Kafka Broker 的内置插件，在 Broker 进程内运行"},
            {"id": "C", "text": "Kafka Connect Source Connector，运行在 Connect Worker 进程中"},
            {"id": "D", "text": "Kafka Streams 应用程序，从 Kafka Topic 中读取 binlog 数据进行处理"}
        ],
        "correctAnswer": "C",
        "explanation": "C 是正确答案。Debezium 以 Kafka Connect Source Connector 的形态运行，插件部署到 Connect Worker 的 plugin.path 目录后，通过 REST API 提交 JSON 配置即可创建 Connector 实例。它复用了 Kafka Connect 框架的所有能力，包括分布式任务调度、offset 自动管理、REST API 运维接口和 Worker 级容错。A 选项描述的更像 Debezium Server 的运行方式，不是标准的 Debezium Kafka Connector 部署模式。B 选项完全错误，Debezium 不是 Broker 内置插件，和 Broker 进程没有直接关系。D 选项混淆了 Kafka Streams 和 Kafka Connect，Streams 是流处理框架，Connect 是数据集成框架，两者定位完全不同。"
    },
    {
        "id": "kafka-connect-mysql-cdc-q1-quiz3",
        "question": "Debezium MySQL Connector 要求 MySQL 的 binlog_format 必须设置为什么？",
        "choices": [
            {"id": "A", "text": "STATEMENT，因为 Debezium 需要解析原始 SQL 语句来还原数据变更"},
            {"id": "B", "text": "ROW，因为只有 ROW 格式才提供确定性的行级变更前后的完整字段值"},
            {"id": "C", "text": "MIXED，MySQL 自动选择最优格式，Debezium 两种格式都能解析"},
            {"id": "D", "text": "MINIMAL，只记录被修改的列以减少 binlog 体积和网络传输量"}
        ],
        "correctAnswer": "B",
        "explanation": "B 是正确答案。Debezium 要求 binlog_format 必须设置为 ROW，因为只有 ROW 格式的 binlog 才会记录每一行数据变更前后的完整字段值，Debezium 可以直接从中提取结构化的行级变更数据。A 选项的 STATEMENT 模式只记录 SQL 语句原文，同一条 SQL 在不同执行上下文中可能产生不同结果（如包含 NOW()、UUID() 等非确定性函数），Debezium 无法从 SQL 文本可靠地反推出行级数据变更。C 选项的 MIXED 模式由 MySQL 自动选择 STATEMENT 或 ROW，无法保证所有事件都是 ROW 格式，Debezium 不接受这种不确定性。D 选项的 MINIMAL 不是 binlog_format 的合法值，它是 binlog_row_image 的可选值。"
    },
    {
        "id": "kafka-connect-mysql-cdc-q1-quiz4",
        "question": "Debezium CDC 事件中 op 字段的值为「r」时，表示什么操作？",
        "choices": [
            {"id": "A", "text": "行被执行了 ROLLBACK 回滚操作"},
            {"id": "B", "text": "行被执行了 REPLACE INTO 替换操作"},
            {"id": "C", "text": "行数据来自初始快照（snapshot read），不是 binlog 实时流中的事件"},
            {"id": "D", "text": "行被执行了 RENAME TABLE 操作导致表名变更"}
        ],
        "correctAnswer": "C",
        "explanation": "C 是正确答案。Debezium 消息中 op 字段有四种值：c 表示 create（INSERT），u 表示 update（UPDATE），d 表示 delete（DELETE），r 表示 read（初始快照读取）。当 snapshot.mode=initial 时，Debezium 首次启动会对配置的表执行全量 SELECT *，每一行生成一条 op=r 的事件写入 Kafka。快照完成后切换到 binlog 流模式，后续事件的 op 值就变为 c、u 或 d。这个区分让下游消费者可以识别哪些数据来自历史快照、哪些来自实时变更。A 选项把 r 误解为 rollback；B 选项把 r 误解为 replace，实际上 MySQL 的 REPLACE INTO 在 binlog 中会被分解为 DELETE + INSERT 两条事件；D 选项的 RENAME TABLE 是 DDL 操作，不会产生行级 CDC 事件。"
    },
    {
        "id": "kafka-connect-mysql-cdc-q1-quiz5",
        "question": "一条 Debezium CDC 事件中 before 不为 null、after 不为 null、op 字段为「u」，这条消息表示什么？",
        "choices": [
            {"id": "A", "text": "一条新记录被插入（INSERT），before 是表的默认值，after 是插入的数据"},
            {"id": "B", "text": "一条记录被更新（UPDATE），before 是更新前的完整行数据，after 是更新后的完整行数据"},
            {"id": "C", "text": "一条记录先被删除再被插入（DELETE + INSERT），before 是删除的数据，after 是新插入的数据"},
            {"id": "D", "text": "一条记录被快照读取（SELECT），before 和 after 分别是两次读取的结果"}
        ],
        "correctAnswer": "B",
        "explanation": "B 是正确答案。当 op=u 时表示这是一条 UPDATE 事件，before 字段包含更新前该行所有列的完整数据，after 字段包含更新后该行所有列的完整数据。这要求 MySQL 的 binlog_row_image 设置为 FULL，否则 before 中可能只包含主键和被修改的列。A 选项错误，INSERT 事件的 op 值是 c 而不是 u，且 INSERT 事件的 before 字段为 null。C 选项描述的场景虽然技术上可能发生，但 DELETE 和 INSERT 会生成两条独立的 CDC 事件（分别是 op=d 和 op=c），不会被合并为一条 op=u 的事件。D 选项完全不合理，快照读取的 op 值是 r，且快照事件的 before 字段固定为 null。"
    },
    {
        "id": "kafka-connect-mysql-cdc-q1-quiz6",
        "question": "关于 Debezium 默认的 snapshot.mode=initial，以下哪项描述是正确的？",
        "choices": [
            {"id": "A", "text": "每次 Connector 重启都会重新执行全量快照，确保数据完整性"},
            {"id": "B", "text": "只在首次启动时执行全量快照，快照完成后自动切换到 binlog 流模式，后续重启从上次 binlog 位点继续"},
            {"id": "C", "text": "不执行任何快照，直接从最新的 binlog 位点开始消费，历史存量数据需要手动导入"},
            {"id": "D", "text": "快照期间会锁定整个 MySQL 实例所有表，阻塞全部业务写入直到快照完成"}
        ],
        "correctAnswer": "B",
        "explanation": "B 是正确答案。snapshot.mode=initial 表示 Debezium 在首次启动时（即 __connect-offsets 中没有该 Connector 的 offset 记录时）执行一次全量快照，对配置的每张表做 SELECT * 查询，每行生成 op=r 事件写入 Kafka。快照完成后记录当时的 binlog 位点，后续自动切换到 binlog 实时流模式。后续 Connector 重启时由于 offset 已存在，不会重做快照，直接从上次 binlog 位点继续。A 选项是最常见的误解，initial 的含义是「只在初始时做」而不是「每次都做」。C 选项描述的是 snapshot.mode=never 的行为。D 选项夸大了锁的影响，Debezium 使用 snapshot.locking.mode=minimal 时只获取一个短暂的全局读锁来记录一致性位点，通常毫秒级释放。"
    },
    {
        "id": "kafka-connect-mysql-cdc-q1-quiz7",
        "question": "与 Canal 和 Maxwell 相比，Debezium 的核心差异化优势是什么？",
        "choices": [
            {"id": "A", "text": "Debezium 只支持 MySQL 一种数据源，但 binlog 解析性能比 Canal 和 Maxwell 快 10 倍以上"},
            {"id": "B", "text": "Debezium 支持 MySQL、PostgreSQL、MongoDB 等 10+ 数据源，原生集成 Kafka Connect 生态，具备完善的 schema 演进追踪"},
            {"id": "C", "text": "Debezium 不需要 MySQL 开启 binlog，直接通过 SQL 查询实现 CDC，部署更简单"},
            {"id": "D", "text": "Debezium 可以同时作为 Source 和 Sink Connector 运行，一个插件实现 MySQL 双向同步"}
        ],
        "correctAnswer": "B",
        "explanation": "B 是正确答案。Debezium 支持 MySQL、PostgreSQL、MongoDB、SQL Server、Oracle 等 10 多种数据源，以 Kafka Connect Source Connector 形态原生集成 Kafka 生态，并且具备完善的 schema history 追踪机制来处理 DDL 变更。Canal 由阿里开源，只支持 MySQL，独立部署运行，不集成 Kafka Connect 生态，但在阿里系技术栈和国内社区中有更丰富的运维工具和中文文档。Maxwell 同样只支持 MySQL，不支持初始全量快照，不支持 schema 演进追踪，社区维护活跃度较低。A 选项错误，Debezium 支持多种数据源而非只支持 MySQL，且性能差异远没有 10 倍。C 选项完全错误，Debezium 必须依赖 binlog。D 选项错误，Debezium 是 Source Connector，不是 Sink Connector。"
    },
    {
        "id": "kafka-connect-mysql-cdc-q1-quiz8",
        "question": "生产环境中监控 Debezium MySQL Connector 同步延迟的核心指标是什么？",
        "choices": [
            {"id": "A", "text": "Kafka Topic 的消息总条数（log-end-offset），条数越多说明延迟越大"},
            {"id": "B", "text": "Connect Worker 进程的 JVM heap 使用率，heap 越满说明处理越慢"},
            {"id": "C", "text": "Debezium JMX 指标 MilliSecondsBehindSource，即当前处理的 binlog 事件时间戳与 MySQL 当前时间的差值"},
            {"id": "D", "text": "MySQL 的 Threads_running 指标，活跃线程越多说明 Debezium 给数据库造成的负载越大"}
        ],
        "correctAnswer": "C",
        "explanation": "C 是正确答案。Debezium 通过 JMX 暴露了 MilliSecondsBehindSource 指标，它计算的是 Debezium 当前正在处理的 binlog 事件的时间戳与 MySQL 服务器当前时间的差值。正常运行时这个值应该在几百毫秒以内，如果持续增长说明 Debezium 的消费速度跟不上 binlog 的产生速度。配合 Kafka Consumer Lag 指标可以端到端监控全链路延迟。A 选项错误，Topic 消息总条数不能直接反映同步延迟，高消息量不等于高延迟。B 选项过于间接，JVM heap 使用率高可能有很多原因，不是延迟的直接指标。D 选项监控的是 MySQL 侧负载而不是同步延迟。"
    },
    {
        "id": "kafka-connect-mysql-cdc-q1-quiz9",
        "question": "Debezium 通过什么机制处理 MySQL 的 ALTER TABLE 等 schema 变更？",
        "choices": [
            {"id": "A", "text": "每次启动时查询 MySQL 的 information_schema 获取最新表结构，运行中不处理历史 schema 变化"},
            {"id": "B", "text": "通过 schema.history.internal.kafka.topic 记录所有 DDL 变更历史，根据 binlog 位点匹配对应的 schema 版本来解析事件"},
            {"id": "C", "text": "不支持 schema 变更，遇到 ALTER TABLE 时 Connector 会自动停止并要求手动删除重建"},
            {"id": "D", "text": "通过 Confluent Schema Registry 自动拉取最新 schema，不依赖任何额外的 Kafka Topic"}
        ],
        "correctAnswer": "B",
        "explanation": "B 是正确答案。Debezium 通过 schema.history.internal.kafka.topic 这个专用的 Kafka Topic 记录所有 DDL 变更事件。当 Debezium 在 binlog 流中遇到 ALTER TABLE 等 DDL 语句时，会将 DDL 信息写入此 Topic。后续解析 binlog ROW 事件时，Debezium 根据事件的 binlog 位点查找对应时期的 schema 版本，确保正确映射列名和类型。这个机制的关键作用是让 Debezium 能够在 schema 发生变化后，仍然正确解析变化前后不同结构的 binlog 事件。A 选项错误，仅查询当前 schema 无法处理历史 binlog 事件的结构差异。C 选项错误，Debezium 完整支持 schema 变更处理。D 选项混淆了 Schema Registry 和 Schema History Topic，前者是 Converter 层面的 schema 管理，后者是 Debezium 内部的 DDL 追踪机制。"
    },
    {
        "id": "kafka-connect-mysql-cdc-q1-quiz10",
        "question": "Debezium MySQL Connector 重启后报错「binlog file mysql-bin.000001 not found on the server」，最可能的原因和解决方案是什么？",
        "choices": [
            {"id": "A", "text": "MySQL 的 binlog 因 expire_logs_days 到期被自动清理，需要将 snapshot.mode 临时设为 initial 重做全量快照"},
            {"id": "B", "text": "Debezium 的 database.server.id 与 MySQL Master 的 server-id 冲突，修改为不同的值即可"},
            {"id": "C", "text": "Kafka Connect 的 __connect-offsets Topic 数据损坏，需要删除并重建该 Topic"},
            {"id": "D", "text": "MySQL 服务器切换了新的数据目录，binlog 文件路径改变，需要更新 Debezium 的 database.hostname"}
        ],
        "correctAnswer": "A",
        "explanation": "A 是正确答案。这个错误说明 Debezium 上次记录的 binlog 消费位点所对应的文件（mysql-bin.000001）已经不存在于 MySQL 服务器上了。最常见的原因是 MySQL 配置的 expire_logs_days（或 binlog_expire_logs_seconds）导致过期的 binlog 文件被自动清理，而 Debezium 在停机期间没有消费这些 binlog。解决方案是将 Connector 的 snapshot.mode 临时改为 initial（或 when_needed），让 Debezium 重新执行全量快照并从最新的 binlog 位点开始消费，之后再改回 initial。预防措施是将 expire_logs_days 设置得足够长（建议至少 3 天）。B 选项的 server-id 冲突会导致完全不同的错误信息。C 选项中 offset topic 数据损坏是极罕见的情况。D 选项中数据目录变更与 binlog 文件找不到是不同层面的问题。"
    }
]

references = [
    "https://debezium.io/documentation/reference/2.5/connectors/mysql.html",
    "https://debezium.io/blog/2023/06/29/debezium-2-3-final-released/",
    "https://cwiki.apache.org/confluence/display/KAFKA/KIP-618%3A+Exactly-Once+Support+for+Source+Connectors"
]

data = {
    "id": "kafka-connect-mysql-cdc",
    "name": "MySQL CDC \u5b9e\u65f6\u540c\u6b65\u5b9e\u8df5",
    "domain": "kafka",
    "description": "\u8be6\u89e3\u4f7f\u7528 Debezium + Kafka Connect \u5b9e\u73b0 MySQL \u5b9e\u65f6\u6570\u636e\u540c\u6b65\u7684\u5b8c\u6574\u65b9\u6848",
    "version": "1.0.0",
    "questions": [
        {
            "id": "kafka-connect-mysql-cdc-q1",
            "domain": "kafka",
            "type": "practice",
            "difficulty": 3,
            "tags": ["Kafka", "Kafka Connect", "CDC", "Debezium", "MySQL \u540c\u6b65"],
            "title": "\u5982\u4f55\u7528 Kafka Connect \u5b9e\u73b0 MySQL \u5230 Kafka \u7684\u5b9e\u65f6\u6570\u636e\u540c\u6b65\uff08CDC\uff09\uff1f",
            "content": content,
            "answer": answer,
            "keyPoints": key_points,
            "quiz": quiz,
            "references": references
        }
    ]
}

output_path = os.path.join("public", "question-packs", "kafka", "kafka-connect-mysql-cdc.json")
with open(output_path, "w", encoding="utf-8") as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Written to {output_path}")
print(f"File size: {os.path.getsize(output_path)} bytes")
