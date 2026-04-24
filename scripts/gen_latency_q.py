import json, os

content = (
    "**故障现场**：某电商平台在 2024-03-15 14:32 UTC+8 突然触发 P99 延迟告警。"
    "监控大盘显示，API 网关的 P50 延迟从正常的 45ms 上升到 320ms，P99 从 120ms 飙升至 1800ms，"
    "P999 直接超过 5000ms 触发超时。同期 QPS 并没有明显变化（维持在 4200 rps），"
    "服务实例数也是正常的 8 个 Pod。错误率从 0.1% 突增至 12%，绝大多数是 HTTP 503 和超时错误。\n\n"
    "告警日志片段如下：\n\n"
    "```\n"
    "[2024-03-15 14:32:17] WARN  RequestHandler - Request timeout after 3000ms: POST /api/orders/checkout\n"
    "[2024-03-15 14:32:18] ERROR CircuitBreaker  - inventory-service circuit breaker OPEN (failures=47, threshold=50%)\n"
    "[2024-03-15 14:32:19] WARN  ConnectionPool  - HikariCP pool exhausted, waiting 500ms for connection [pool=order-db, size=20/20]\n"
    "[2024-03-15 14:32:21] WARN  RequestHandler - Request timeout after 3000ms: GET /api/products/list\n"
    "```\n\n"
    "运维同学在 14:35 打开 Grafana，看到以下指标异常：MySQL 的 `Threads_running` 从平时的 8 跳到 76，"
    "`innodb_row_lock_waits` 计数器每秒新增约 340 次，磁盘 I/O util% 达到 91%。"
    "与此同时，数据库所在宿主机的 CPU `iowait` 从 3% 升至 38%。\n\n"
    "**问题**：整条链路从 API 网关到数据库都出现了异常，你怎么系统性地从现象层一步步收敛到具体的根因？"
    "请给出完整排查思路，包括每一步执行的命令和你预期看到的关键指标。\n\n"
    "> 提示：本次延迟突增持续了约 23 分钟，在 14:55 左右自动恢复。"
    "你需要判断是持续性资源耗尽还是偶发性抖动，并解释两种情形下排查路径的差异。"
)

answer = (
    "## 一、建立延迟排查的认知框架\n\n"
    "在面对「延迟突增」这类故障时，多数工程师的第一反应是打开 Grafana 找最红的那张图，然后凭经验猜。"
    "这种做法在简单故障里能蒙对，但在链路复杂的系统里往往浪费时间，因为你看到的「最红的图」很可能只是症状，不是根因。"
    "正确的做法是先建立一个延迟构成模型，再在模型里做减法。\n\n"
    "一次请求的总延迟可以拆成四个部分：**网络传输时间**（客户端到服务端的物理路径）、"
    "**排队等待时间**（线程池、连接池、消息队列里等待被处理的时间）、"
    "**计算处理时间**（CPU 在跑你的业务逻辑）、**I/O 时间**（等磁盘或等数据库返回）。"
    "这四项里，排队时间和 I/O 时间是生产故障里最常见的元凶，但表现在监控上都是「慢」，需要工具来区分。\n\n"
    "从系统层次看，一个请求从用户浏览器出发，经过 CDN、API 网关、负载均衡、应用服务、RPC 调用、缓存层、数据库，"
    "每一跳都可能是瓶颈。好的排查策略是「自顶向下，快速排除」：先判断故障层（网络？应用？数据库？），"
    "再在目标层做精确定位，而不是从第一层开始逐层验证——那样太慢了。\n\n"
    "另一个关键判断是：这次延迟是**持续性上升**还是**周期性抖动**？"
    "持续性通常指向资源耗尽（连接池满、磁盘 I/O 打满、内存 OOM）；"
    "周期性抖动则更可能是 GC pause、定时任务冲突、慢查询偶发。"
    "本题的现象是 23 分钟持续高延迟然后自动恢复，这个模式强烈暗示是某个资源在某个时间窗口被压满，"
    "随后慢慢消化完毕，所以排查方向优先考虑资源竞争而不是代码 bug。\n\n"
    "## 二、逐步排查命令序列\n\n"
    "**第一步：确认问题范围，判断是否全链路受影响**\n\n"
    "在真正开始挖数据之前，先花两分钟回答一个问题：延迟升高发生在哪一层？"
    "用 `curl` 的 `-w` 参数可以拆解单次请求的各阶段耗时：\n\n"
    "```bash\n"
    "curl -w '\\n     time_namelookup:  %{time_namelookup}s\\n        time_connect:  %{time_connect}s\\n  time_starttransfer:  %{time_starttransfer}s\\n          time_total:  %{time_total}s\\n' \\\n"
    "     -o /dev/null -s https://api.example.com/api/health\n\n"
    "# 故障期间输出：\n"
    "#      time_namelookup:  0.001s\n"
    "#         time_connect:  0.003s\n"
    "#   time_starttransfer:  1.847s   <- 这里突增，说明问题在服务端处理阶段\n"
    "#           time_total:  1.848s\n"
    "```\n\n"
    "`time_connect` 只有 3ms，说明网络层正常；`time_starttransfer`（TTFB）是 1.847s，"
    "问题明确在服务端处理阶段。这一步耗时两分钟，但把「网络故障」这条排查路径整个关掉了。\n\n"
    "**第二步：系统层面并行快照**\n\n"
    "确认是服务端问题后，登录到一台应用 Pod，同时打开三个终端拉系统指标快照：\n\n"
    "```bash\n"
    "# 终端 1：CPU 和负载\n"
    "top -bn1 | grep -E '(Cpu|load)'\n"
    "# 输出：%Cpu(s): 12.3 us,  3.1 sy,  0.0 ni, 44.2 id, 38.7 wa\n"
    "# wa=38.7% 是严重的 I/O 等待信号（正常应该 <5%）\n\n"
    "# 终端 2：内存和 I/O 等待进程数\n"
    "vmstat 1 5\n"
    "# procs -----------memory---------- ---swap-- -----io---- ------cpu-----\n"
    "#  r  b   swpd   free   buff  cache   si   so    bi    bo   us sy id wa\n"
    "#  3 12      0 512000  24000 2048000    0    0  8920  1240    8  2 44 46\n"
    "# b=12 表示 12 个进程在等待 I/O（不可中断 D 状态），这是关键信号\n\n"
    "# 终端 3：磁盘 I/O 详情\n"
    "iostat -x 1 3\n"
    "# Device    r/s    w/s  rkB/s   wkB/s  await  svctm  %util\n"
    "# nvme0n1  12.0  890.0   96.0 71200.0   38.4    1.1   98.2\n"
    "# %util=98.2 磁盘接近打满，await=38.4ms（正常 NVMe 应该 <1ms）\n"
    "```\n\n"
    "三个指标放在一起，`iowait` 高 + `vmstat b` 列高 + `iostat %util` 高，"
    "这是一个强相关的「磁盘 I/O 瓶颈」特征组合。如果看到的是 CPU us% 高但 iowait 低，"
    "则说明是计算瓶颈，排查路径转向 pprof 或 jstack 的 CPU 热点分析。\n\n"
    "**第三步：网络层排查连接状态**\n\n"
    "I/O 问题确认后，同时检查连接层是否有积压：\n\n"
    "```bash\n"
    "# 查看 TCP 连接状态分布\n"
    "ss -s\n"
    "# TCP: 3247 (estab 2891, closed 312, orphaned 0, timewait 44)\n"
    "# 正常服务 estab 连接约 200-300，这里 2891 明显过多\n\n"
    "# 按状态统计连接数\n"
    "ss -tan | awk '{print $1}' | sort | uniq -c | sort -rn\n"
    "# 2891 ESTAB\n"
    "#  312 CLOSE-WAIT   <- CLOSE_WAIT 过多是服务端没有正确关闭连接的信号\n"
    "#   44 TIME-WAIT\n\n"
    "# 查看哪个端口连接数最多\n"
    "ss -tan | grep ESTAB | awk '{print $5}' | cut -d: -f2 | sort | uniq -c | sort -rn | head -5\n"
    "# 2103 3306   <- 2103 个到 MySQL 3306 端口的连接，连接池只有 20 个，严重异常！\n"
    "```\n\n"
    "到 MySQL 的 ESTABLISHED 连接有 2103 个，而代码里连接池最大只配了 20。"
    "这说明有大量连接泄漏，或者有进程绕开连接池直接建连。这是一个重要线索，指向数据库方向。\n\n"
    "**第四步：应用层排查——JVM 线程栈分析**\n\n"
    "```bash\n"
    "# 找到 Java 进程 PID\n"
    "jps -l | grep order-service\n"
    "# 1842 com.example.OrderServiceApplication\n\n"
    "# 连续抓 3 次线程栈，间隔 5s，找持续 BLOCKED 的线程\n"
    "for i in 1 2 3; do jstack 1842 > /tmp/jstack-$i.txt; sleep 5; done\n\n"
    "# 统计各次快照的 BLOCKED 线程数\n"
    "grep -c 'BLOCKED' /tmp/jstack-*.txt\n"
    "# /tmp/jstack-1.txt:47\n"
    "# /tmp/jstack-2.txt:51\n"
    "# /tmp/jstack-3.txt:48   <- 三次都有大量 BLOCKED，是持续性问题，不是瞬间抖动\n\n"
    "# 定位 BLOCKED 发生在哪行代码\n"
    "grep -A 8 'BLOCKED' /tmp/jstack-1.txt | grep 'at com' | sort | uniq -c | sort -rn | head -3\n"
    "# 47 at com.zaxxer.hikari.pool.HikariPool.getConnection(HikariPool.java:213)\n"
    "# 所有 BLOCKED 线程都在等 HikariCP 连接池！\n"
    "```\n\n"
    "连续三次快照都显示 47-51 个线程 BLOCKED 在 `HikariPool.getConnection()`，"
    "说明所有业务线程都在排队等数据库连接，而连接池已经耗尽。但连接为什么不归还？是慢查询把连接占住了。\n\n"
    "**第五步：定位热点后深入数据库分析**\n\n"
    "```bash\n"
    "# 登录 MySQL，查看正在执行的查询（排除 Sleep）\n"
    "mysql -u root -p -e 'SHOW FULL PROCESSLIST\\G' 2>/dev/null | grep -v Sleep | head -20\n"
    "# Id: 4821  Time: 34  State: Updating  Info: UPDATE inventory SET stock=stock-1 WHERE product_id=10086\n"
    "# Id: 4822  Time: 31  State: Updating  Info: UPDATE inventory SET stock=stock-1 WHERE product_id=10086\n"
    "# ... 共 68 条相同 SQL 都在等锁，Time 从 28 到 47 秒不等\n\n"
    "# 查看 InnoDB 行锁等待情况\n"
    "mysql -e 'SELECT r.trx_id waiting_trx, r.trx_mysql_thread_id waiting_thread,\n"
    "       b.trx_id blocking_trx, b.trx_mysql_thread_id blocking_thread\n"
    "  FROM information_schema.INNODB_LOCK_WAITS w\n"
    "  JOIN information_schema.INNODB_TRX r ON r.trx_id = w.requesting_trx_id\n"
    "  JOIN information_schema.INNODB_TRX b ON b.trx_id = w.blocking_trx_id\n"
    "  LIMIT 10\\G' 2>/dev/null\n"
    "# 发现大量行锁等待，所有等待都指向同一个 blocking_trx，都集中在 product_id=10086 这行\n"
    "```\n\n"
    "至此，根因确认：**促销活动导致大量并发请求同时更新同一个热点商品（product_id=10086）的库存，"
    "InnoDB 行锁在这一行形成了严重的锁等待队列，数据库连接被长时间占用无法释放，"
    "HikariCP 连接池耗尽，业务线程全部阻塞，P99 从 120ms 飙升至 1800ms。**\n\n"
    "## 三、深度工具、常见坑与生产最佳实践\n\n"
    "**用 eBPF/BCC 做内核级延迟透视**\n\n"
    "当 jstack 和 processlist 给不出清晰答案时，eBPF 工具链可以做到内核级的延迟透视。"
    "`biolatency` 可以画出磁盘 I/O 的延迟直方图，`offcputime` 可以找出进程不在 CPU 上时究竟在等什么，"
    "这是传统 profiler 的盲区补全——CPU profiler 只能看 CPU 在忙什么，"
    "但延迟问题往往出现在进程「不在 CPU 上」的那段时间：\n\n"
    "```bash\n"
    "# 观察磁盘 I/O 延迟分布（30 秒采样）\n"
    "/usr/share/bcc/tools/biolatency -d nvme0n1 30\n"
    "# usecs           : count     distribution\n"
    "#   256 ->  511   : 12        |          |\n"
    "#  4096 -> 8191   : 847       |██████████|\n"
    "#  8192 -> 16383  : 1203      |████████████████| <- 大量 I/O 在 8-16ms，NVMe 正常应该 <500us\n\n"
    "# 追踪 Java 进程 off-CPU 时间（找出在等什么）\n"
    "/usr/share/bcc/tools/offcputime -p $(pgrep -f order-service) 30 2>/dev/null | head -20\n"
    "# 输出火焰图数据，大量时间卡在 futex_wait -> pthread_mutex_lock -> 连接池锁\n"
    "```\n\n"
    "**最容易被忽视的坑：GC pause 引起的周期性延迟抖动**\n\n"
    "如果故障现象不是本题的「持续 23 分钟」，而是「每隔 3-5 分钟一次、每次持续 200-500ms 的抖动」，"
    "第一个要排查的不是慢查询，而是 Full GC。Full GC 触发 Stop-The-World（STW），"
    "字面意思就是整个 JVM 暂停，期间所有请求都在等待，CPU 和 I/O 监控却可能完全正常，"
    "因为暂停期间应用根本没在跑。对于堆内存较大的服务（8GB+ 堆），单次 Full GC 可以持续 4-10 秒：\n\n"
    "```bash\n"
    "# 实时观察 GC 情况（1 秒一次，共 60 次）\n"
    "jstat -gc 1842 1000 60\n"
    "# S0C  S1C  S0U  S1U   EC    EU    OC      OU    YGC  YGCT  FGC  FGCT   GCT\n"
    "# ...  ...  ...  ...  ...  ...  20480  19876   48  3.241   3  12.847  16.088\n"
    "# FGC=3 在 60 秒内发生了 3 次 Full GC，FGCT=12.847s，平均每次暂停 4.3 秒！\n\n"
    "# 查看 GC 日志（需要 JVM 启动参数 -Xlog:gc*:file=/var/log/app/gc.log:time）\n"
    "grep 'Pause Full' /var/log/app/gc.log | tail -5\n"
    "# [2024-03-15T14:33:42.123+0800] GC(47) Pause Full (Ergonomics) 19876M->4123M(20480M) 4318.234ms\n"
    "# 一次 Full GC 暂停了 4318ms，这期间所有请求超时\n"
    "```\n\n"
    "**生产最佳实践**\n\n"
    "排查完根因，还需要建立预防机制。首先，所有服务都应该有「延迟 SLO 大盘」：P50/P99/P999 三条线，"
    "告警阈值在 P99 超过正常基线的 2 倍且持续 1 分钟以上时触发（单点超阈值不告警，避免噪音）。"
    "连接池大小不应该设置得太大——20 个连接对于一台 MySQL 主库通常已足够，"
    "但要配合熔断器一起使用，当连接等待超过 200ms 时主动快速失败，防止线程堆积引发雪崩。\n\n"
    "对于热点行锁问题，生产环境的正确解法是**库存分段**（将 1 个库存记录拆成 N 条，"
    "每次随机选一条扣减，最后聚合余量），或者引入 Redis + Lua 脚本做原子扣减，"
    "把行锁竞争从 MySQL 挪到内存操作，吞吐量可以提升 10-100 倍，再异步写回 MySQL。\n\n"
    "**面试考点**\n\n"
    "这道题的核心考点是「结构化排查思维」而非「记住某个命令」。"
    "面试官想看的是：你能不能在信息不完整的情况下快速缩小搜索范围，"
    "每一步都有明确的「验证假设 + 排除路径」逻辑。"
    "只会说「看监控找慢查询」而给不出 `vmstat b 列`、`ss -tan | grep CLOSE_WAIT`、"
    "`jstack 连续三次 BLOCKED 计数` 这样的具体细节，面试官会认为你只是理论上知道要看哪里，"
    "没有真正在凌晨三点处理过这类故障。"
)

key_points = [
    "延迟排查要先建立构成模型（网络/排队/计算/I/O），用 curl -w 的时间分解快速定位延迟发生在哪个阶段，两分钟内排除网络层或确认故障在服务端",
    "系统层面三项指标要并行采集：top 的 iowait%、vmstat 的 b 列（等待 I/O 的进程数）、iostat 的 %util 和 await，三者同时偏高才能确认磁盘 I/O 瓶颈",
    "ss -tan 看到大量 CLOSE_WAIT 说明服务端连接未正确关闭；到数据库端口的 ESTABLISHED 连接数远超连接池配置上限，是连接泄漏或绕池直连的强信号",
    "jstack 连续抓 3 次（间隔 5s）找持续 BLOCKED 的线程，配合 SHOW FULL PROCESSLIST 的 Time 列定位慢 SQL 或行锁热点，是 Java 服务应用层排查的黄金组合",
    "GC pause 是最容易被忽视的周期性延迟抖动根因：Full GC 触发 STW 可暂停数秒，期间 CPU/IO 监控可能完全正常，用 jstat -gc 的 FGC/FGCT 列和 GC 日志的 Pause Full 行来捕捉",
    "eBPF/BCC 的 biolatency 画出磁盘 I/O 延迟分布直方图，offcputime 找出进程不在 CPU 时在等什么，两者能覆盖传统 profiler 看不到的 off-CPU 等待时间",
    "热点行锁问题的根治方案是库存分段（1 行拆 N 行随机选一行扣减）或 Redis+Lua 原子扣减；单纯增大连接池只会让更多线程排队等同一把锁，延迟不降反升"
]

quiz = [
    {
        "id": "latency-spike-diagnosis-q1-quiz1",
        "question": "用 `curl -w` 排查延迟时，`time_connect` 正常（3ms）但 `time_starttransfer`（TTFB）异常高（1.8s），这说明什么？",
        "choices": [
            {"id": "A", "text": "DNS 解析出现了问题，域名解析耗时增加"},
            {"id": "B", "text": "网络链路正常，问题发生在服务端处理阶段（应用层或数据库层）"},
            {"id": "C", "text": "TCP 握手耗时过长，说明网络拥塞"},
            {"id": "D", "text": "TLS 握手耗时过长，说明证书验证失败"}
        ],
        "correctAnswer": "B",
        "explanation": "`time_connect` 代表 TCP 三次握手的耗时，这个值正常说明网络连通性没有问题，物理链路不是瓶颈。`time_starttransfer` 是从发出请求到收到第一字节响应的时间（TTFB），包含了服务端处理的全部时间。TTFB 异常高而 connect 正常，明确排除了网络层故障，问题锁定在服务端——可能是线程池耗尽、数据库慢查询或行锁等待。A 的 DNS 问题会体现在 `time_namelookup` 里；C 的 TCP 拥塞会让 `time_connect` 也偏高；D 的 TLS 问题体现在 `time_appconnect` 里。这种分层快速排除法是 SRE 排查的第一个动作。",
        "relatedConcepts": ["TTFB", "curl -w", "网络分层排查"]
    },
    {
        "id": "latency-spike-diagnosis-q1-quiz2",
        "question": "vmstat 输出中，哪一列的值持续偏高（如 b=12）最直接说明系统存在严重的 I/O 等待问题？",
        "choices": [
            {"id": "A", "text": "r 列（Run queue，等待 CPU 的进程数）"},
            {"id": "B", "text": "si/so 列（swap in/out）"},
            {"id": "C", "text": "b 列（处于不可中断睡眠状态的进程数）"},
            {"id": "D", "text": "cs 列（context switch，上下文切换次数）"}
        ],
        "correctAnswer": "C",
        "explanation": "vmstat 的 b 列（blocked）显示的是处于不可中断睡眠（D 状态）的进程数。进程进入 D 状态通常是在等待 I/O 完成，包括磁盘读写、网络 I/O 或 NFS 挂载。b 列持续偏高（正常应该接近 0，b 超过 5 就需要关注，b=10+ 是明显异常）是系统存在严重 I/O 瓶颈的强信号，配合 iostat 的 %util 和 top 的 iowait 一起看可以相互印证。r 列高说明 CPU 资源竞争激烈；si/so 高说明在用 swap，内存压力大；cs 高说明上下文切换频繁，可能是线程过多或锁竞争。",
        "relatedConcepts": ["vmstat", "进程状态 D", "I/O 等待"]
    },
    {
        "id": "latency-spike-diagnosis-q1-quiz3",
        "question": "iostat -x 中，nvme0n1 显示 %util=98.2，await=38.4ms，svctm=1.1ms。以下对这组数据解读正确的是？",
        "choices": [
            {"id": "A", "text": "磁盘硬件正在老化，需要更换，因为 await 过高"},
            {"id": "B", "text": "磁盘实际处理每个 I/O 只需 1.1ms，但请求在队列中等待了约 37ms，说明并发 I/O 请求量远超磁盘处理能力"},
            {"id": "C", "text": "读写比例失衡导致的写放大，需要优化写入策略"},
            {"id": "D", "text": "await=38.4ms 就是磁盘本身的物理延迟，NVMe 磁盘就是这么慢的"}
        ],
        "correctAnswer": "B",
        "explanation": "await 是 I/O 请求从进入队列到完成的端到端时间（排队时间 + 实际服务时间）。svctm 是磁盘实际处理单个请求的时间。await - svctm ≈ 37ms 就是 I/O 在内核 I/O 调度队列中等待的时间。NVMe 磁盘的物理延迟通常在 100-300 微秒（即 0.1-0.3ms），svctm=1.1ms 说明磁盘本身没问题，但 await=38.4ms 说明每个请求要在队列里等 37ms 才能被磁盘处理。结合 %util=98.2%，可以确认磁盘已接近饱和，是 I/O 队列积压而非硬件故障。",
        "relatedConcepts": ["iostat", "I/O 队列深度", "await vs svctm"]
    },
    {
        "id": "latency-spike-diagnosis-q1-quiz4",
        "question": "通过 `ss -tan` 发现应用到 MySQL 3306 端口有 2000+ 个 ESTABLISHED 连接，但 HikariCP 连接池最大配置 maximumPoolSize=20。以下哪个解释最合理？",
        "choices": [
            {"id": "A", "text": "TIME_WAIT 状态的连接被统计进去了，实际活跃连接数没有问题"},
            {"id": "B", "text": "HikariCP 在高并发下会自动突破 maximumPoolSize 上限扩容，这是正常行为"},
            {"id": "C", "text": "存在连接泄漏（代码中有绕过连接池直接建连的路径），或者是宿主机上多个实例的连接被合并统计"},
            {"id": "D", "text": "ss 命令的统计不可信，要用 MySQL 侧的 SHOW STATUS LIKE 'Threads_connected' 来核实"}
        ],
        "correctAnswer": "C",
        "explanation": "HikariCP 是严格固定大小的连接池，maximumPoolSize 是硬上限，不会自动扩容（B 选项错误）。ESTABLISHED 连接里不包含 TIME_WAIT（A 选项错误，TIME_WAIT 有独立状态）。ss 数据来自内核，是可信的（D 选项错误）。最可能的原因是：某处代码使用了 `DriverManager.getConnection()` 直接建立连接绕过了连接池；或者宿主机上有多个服务实例（如多个 Pod 调度到同一节点），ss 看到的是节点维度的所有连接总和。用 `ss -tan | grep ESTAB | grep 3306 | awk '{print $4}' | cut -d: -f1 | sort -u` 可以确认源 IP 是否只有本机。",
        "relatedConcepts": ["HikariCP", "连接泄漏", "ss 命令"]
    },
    {
        "id": "latency-spike-diagnosis-q1-quiz5",
        "question": "连续 3 次 jstack 快照（间隔 5s），每次都有 47-51 个线程 BLOCKED 在 `HikariPool.getConnection()`。以下对根因的分析最准确的是？",
        "choices": [
            {"id": "A", "text": "这是正常的瞬间竞争，jstack 的 BLOCKED 状态持续时间很短，3 次快照的巧合概率很高"},
            {"id": "B", "text": "持续性连接池耗尽：全部 20 个连接被长时间占用不归还，说明有慢 SQL 或行锁把数据库连接「卡死」了"},
            {"id": "C", "text": "线程池配置太小，需要把业务线程池从 50 增加到 500"},
            {"id": "D", "text": "HikariCP 版本有 bug，需要升级到最新版本"}
        ],
        "correctAnswer": "B",
        "explanation": "三次间隔 5 秒的快照里同一批线程都 BLOCKED 在同一处，说明是持续性阻塞而非瞬间竞争（A 错误）。BLOCKED 在 `getConnection()` 意味着池里没有空闲连接可用。连接池空了的原因不是池太小，而是已借出的 20 个连接全部在执行超慢操作迟迟不归还——通常是慢查询、行锁等待或死锁。增加业务线程（C）只会让更多线程排队等同一个瓶颈，雪崩更快。正确的下一步是执行 `SHOW FULL PROCESSLIST` 查看 MySQL 侧正在运行的查询及其 Time 列，找到占据连接的慢事务。",
        "relatedConcepts": ["jstack", "线程状态 BLOCKED", "连接池耗尽"]
    },
    {
        "id": "latency-spike-diagnosis-q1-quiz6",
        "question": "系统延迟表现为「每隔 3-5 分钟一次、持续 200-500ms 的抖动，抖动期间 CPU 和 I/O 监控均无异常」。以下哪个根因最容易被忽视？",
        "choices": [
            {"id": "A", "text": "Nginx 的 keepalive_timeout 到期导致短暂连接断开重建"},
            {"id": "B", "text": "MySQL 的 innodb_buffer_pool 周期性刷脏页（checkpoint）"},
            {"id": "C", "text": "Java Full GC 触发 Stop-The-World 暂停，JVM 冻结期间所有请求堆积等待"},
            {"id": "D", "text": "Linux cron 任务每分钟执行一次导致 CPU 负载短暂升高"}
        ],
        "correctAnswer": "C",
        "explanation": "Full GC 的 Stop-The-World 是最容易被忽视的周期性抖动根因。原因在于：STW 期间 JVM 所有线程暂停，既没有 CPU 计算（us/sy 不高），也没有 I/O 操作（iowait 不高），传统监控完全看不到异常信号，只有 P99 延迟和错误率出现短暂脉冲。对于 8GB+ 堆的 Java 服务，单次 Full GC 可能暂停 2-5 秒。排查命令是 `jstat -gc <pid> 1000`，观察 FGC 列（Full GC 次数）是否在增加，以及查看 GC 日志里的 `Pause Full` 行。eBPF 的 offcputime 也能抓到 STW 期间的 off-CPU 尖刺。",
        "relatedConcepts": ["Full GC", "Stop-The-World", "jstat -gc"]
    },
    {
        "id": "latency-spike-diagnosis-q1-quiz7",
        "question": "在排查「持续性延迟突增」和「周期性延迟抖动」时，排查路径有何本质区别？",
        "choices": [
            {"id": "A", "text": "没有区别，两种情况都应该先看慢查询日志"},
            {"id": "B", "text": "持续性问题优先排查资源耗尽（连接池、磁盘 I/O、内存）；周期性抖动优先排查 GC pause、定时任务或周期性锁竞争"},
            {"id": "C", "text": "持续性问题看应用日志；周期性抖动看系统日志"},
            {"id": "D", "text": "区别在于排查工具不同：持续性用 top，周期性用 vmstat"}
        ],
        "correctAnswer": "B",
        "explanation": "延迟类型的判断直接决定排查方向，能节省大量时间。持续性高延迟（如本题的 23 分钟连续）通常意味着某个资源被压满且无法自行恢复：磁盘 I/O 打满、连接池耗尽、内存 OOM、CPU 跑满，这些问题的特征是「指标持续偏高」，vmstat/iostat/top 会给出明显信号。周期性抖动（每隔几分钟一次）的特征是「短暂尖峰随即恢复」，这类问题排查传统监控往往没有异常，需要专门检查：GC 日志里的 Full GC 频率和暂停时长、cron 任务时间是否与抖动对齐、是否有定时批量 SQL。两种情形用同一套工具但关注的指标和时序完全不同。",
        "relatedConcepts": ["持续性延迟", "周期性抖动", "延迟类型判断"]
    },
    {
        "id": "latency-spike-diagnosis-q1-quiz8",
        "question": "秒杀场景下，MySQL inventory 表的 product_id=10086 这一行出现严重热点行锁，68 个并发 UPDATE 在排队等锁。以下哪种解决方案能从根本上消除瓶颈？",
        "choices": [
            {"id": "A", "text": "把 HikariCP 连接池从 20 增加到 200，允许更多并发请求同时进入数据库"},
            {"id": "B", "text": "给 inventory 表加 FORCE INDEX 强制走主键索引，减少锁等待"},
            {"id": "C", "text": "使用库存分段（1 行拆 N 行随机选一行扣减）或 Redis Lua 脚本原子扣减，消除单行热点竞争"},
            {"id": "D", "text": "把数据库隔离级别从 REPEATABLE READ 降低到 READ COMMITTED，减少锁的持有时间"}
        ],
        "correctAnswer": "C",
        "explanation": "热点行锁的本质是 N 个并发事务串行争抢修改同 1 行数据。增加连接池（A）只会让更多请求进来排队等同一把锁，反而加剧等待时间。FORCE INDEX（B）对行锁完全无效，行锁是 InnoDB 的事务隔离机制，不是索引问题。降低隔离级别（D）不能消除 UPDATE 的行锁，只能减少读操作的锁范围。正确做法是消除热点：库存分段把 1 个行锁分散成 N 个行锁，N 个并发可以各自获取不同行的锁，吞吐量提升 N 倍；Redis Lua 脚本利用 Redis 单线程特性实现无锁原子扣减，延迟降至微秒级，再异步批量写回 MySQL。",
        "relatedConcepts": ["热点行锁", "库存分段", "Redis 原子操作"]
    },
    {
        "id": "latency-spike-diagnosis-q1-quiz9",
        "question": "BCC 工具 `offcputime` 相比传统 CPU profiler（perf/pprof），在延迟排查中的核心优势是什么？",
        "choices": [
            {"id": "A", "text": "offcputime 采样频率更高，能抓到 CPU 热路径中更细粒度的函数调用"},
            {"id": "B", "text": "offcputime 追踪进程不在 CPU 上时在等什么（锁、I/O、sleep），覆盖了传统 profiler 完全看不到的 off-CPU 等待时间"},
            {"id": "C", "text": "offcputime 可以同时分析多个进程，而 perf 只能分析单个进程"},
            {"id": "D", "text": "offcputime 不需要 root 权限，比 perf 更容易在生产环境部署"}
        ],
        "correctAnswer": "B",
        "explanation": "传统 CPU profiler 基于采样或计数 CPU 时间，只能告诉你 CPU 在忙什么。但在 I/O 密集或锁竞争严重的服务里，延迟高恰恰是因为进程大量时间在「等」而不是在「算」。等待期间进程被内核调度出 CPU，CPU profiler 完全无法感知这段时间。`offcputime` 基于 eBPF，在进程被调度出 CPU 时记录调用栈，在被调度回来时计算等待时长，从而精确展示「进程在等什么、等了多久」。对于数据库连接等待、文件锁阻塞、磁盘 I/O 等待、网络等待等场景，offcputime 的分析价值远超 oncpu profiler，是传统工具的重要补充。",
        "relatedConcepts": ["eBPF", "offcputime", "off-CPU 分析"]
    },
    {
        "id": "latency-spike-diagnosis-q1-quiz10",
        "question": "生产环境延迟告警策略中，以下哪种配置最合理？",
        "choices": [
            {"id": "A", "text": "只监控平均响应时间（avg），超过 500ms 告警"},
            {"id": "B", "text": "监控 P99 单点值，只要有一个数据点超过阈值立即 PagerDuty"},
            {"id": "C", "text": "监控 P50/P99/P999 三条延迟线，P99 超过正常基线 2 倍且持续超过 1 分钟才触发告警"},
            {"id": "D", "text": "只监控错误率，错误率超过 1% 才告警（延迟高但没超时不影响业务）"}
        ],
        "correctAnswer": "C",
        "explanation": "平均响应时间（A）是「谎言指标」：99% 的请求 10ms 完成、1% 的请求 10s 超时，平均值依然可能显示为正常，但受影响的用户已经在投诉。只监控错误率（D）会遗漏「慢但未超时」的场景。P99 单点告警（B）噪音极高，每次流量波动都会误报，导致告警疲劳。最佳实践是：P50 代表典型用户体验，P99 捕捉长尾，P999 监控最坏情况；使用时间窗口（1 分钟持续超阈值）过滤瞬间抖动；告警阈值基于历史基线的倍数而非绝对值，这样能适应业务增长带来的基线变化。SLO 的定义需要同时约束延迟和错误率，两者缺一不可。",
        "relatedConcepts": ["SLO", "P99 延迟", "告警策略"]
    }
]

pack = {
    "id": "latency-spike-diagnosis",
    "name": "系统整体延迟突增的逐步定位方法",
    "domain": "troubleshooting",
    "description": "系统 P99 延迟突增时如何系统性地从现象层收敛到根因，涵盖分层排查思路、核心诊断命令、GC pause 陷阱和 eBPF 深度分析",
    "version": "1.0.0",
    "questions": [
        {
            "id": "latency-spike-diagnosis-q1",
            "domain": "troubleshooting",
            "type": "debugging",
            "difficulty": 3,
            "tags": ["性能分析", "延迟排查", "系统诊断", "JVM", "MySQL", "eBPF"],
            "title": "系统整体延迟突增，怎么一步步定位到具体瓶颈",
            "content": content,
            "answer": answer,
            "keyPoints": key_points,
            "quiz": quiz,
            "references": [
                "https://www.brendangregg.com/usemethod.html",
                "https://www.brendangregg.com/offcpuanalysis.html",
                "https://github.com/iovisor/bcc",
                "https://dev.mysql.com/doc/refman/8.0/en/innodb-locking.html",
                "https://github.com/brettwooldridge/HikariCP#gear-configuration-knobs-baby"
            ]
        }
    ]
}

output_path = r'C:\Users\RigelShrimp\questions\public\question-packs\troubleshooting\latency-spike-diagnosis.json'
with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(pack, f, ensure_ascii=False, indent=2)

print('Done! File size:', os.path.getsize(output_path), 'bytes')
