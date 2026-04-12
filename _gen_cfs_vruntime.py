#!/usr/bin/env python3
"""Generate the CFS vruntime calculation question pack JSON."""
import json
import os

content = r"""在一台运行 Linux 5.15 内核的服务器上，你同时启动了两个 CPU 密集型进程，一个 nice 值为 0，另一个 nice 值为 5。跑了一段时间后，你用 `/proc` 文件系统查看它们的调度统计信息：

```bash
# 进程 A：nice 0
$ cat /proc/18201/sched | grep -E '(vruntime|sum_exec_runtime|nr_involuntary)'
se.vruntime                        :      89723156.291083
se.sum_exec_runtime                :      45028391.726154
nr_involuntary_switches            :            12847

# 进程 B：nice 5
$ cat /proc/18202/sched | grep -E '(vruntime|sum_exec_runtime|nr_involuntary)'
se.vruntime                        :      89724012.553291
se.sum_exec_runtime                :      14976523.108762
nr_involuntary_switches            :            38541
```

这份输出里藏着 CFS 最核心的秘密。两个进程的 `se.vruntime` 几乎一模一样——差距不到 1ms。但 `se.sum_exec_runtime`（实际在 CPU 上运行的物理时间）相差了整整 3 倍：进程 A 实际跑了约 45 秒，进程 B 只跑了约 15 秒。也就是说进程 A 拿到了约 75% 的 CPU 时间，B 只拿到约 25%。

如果 vruntime 是用来衡量「进程用了多少 CPU」的指标，为什么用了 3 倍 CPU 的进程 A 的 vruntime 跟只用了 1/3 的进程 B 几乎相同？vruntime 显然不是简单地等于实际运行时间。那它到底是怎么算出来的？

再看 `nr_involuntary_switches`（被调度器强制抢占的次数）：B 的被动切换是 A 的 3 倍。这说明 B 频繁被赶下 CPU——为什么同样是普通进程，B 就这么「倒霉」？

这些现象背后是 CFS 的 vruntime 计算公式和权重机制在起作用。面试官问这道题时，期望你能回答清楚这几个关键点：vruntime 的精确计算公式是什么？nice 值是怎么转换成权重的？权重表 `sched_prio_to_weight[]` 的设计逻辑是什么？CFS 是怎么用红黑树组织 vruntime 的？`min_vruntime` 这个变量的作用是什么？新创建的进程和长时间睡眠后醒来的进程，它们的 vruntime 分别是怎么初始化的？"""

answer = r"""## CFS 调度器基础：「虚拟时间」的公平哲学

CFS（Completely Fair Scheduler，完全公平调度器）是 Linux 内核自 2.6.23 版本（2007 年 10 月发布）以来的默认进程调度器，由 Ingo Molnár 开发，用于调度所有使用 `SCHED_NORMAL`（也叫 `SCHED_OTHER`）策略的普通进程。在一台典型的 Linux 服务器上，除了少量实时进程（使用 `SCHED_FIFO` 或 `SCHED_RR`）外，几乎所有用户态进程都由 CFS 管理——你的 Web 服务、数据库、定时任务、Shell 会话，全部在 CFS 的管辖范围内。

CFS 替代了之前的 O(1) 调度器。O(1) 调度器虽然在性能上做到了常数时间选择下一个进程，但它的「优先级→时间片」硬编码映射导致了一系列反直觉行为：两个 nice 0 进程各得 100ms 时间片、调度周期 200ms，而两个 nice 19 进程各得 5ms、周期只有 10ms——低优先级进程的调度延迟反而更好。CFS 的设计灵感来自一个理想化模型：「理想多任务处理器」。假设有一颗 CPU 和 N 个同优先级进程，理想状态下每个进程应该恰好获得 1/N 的 CPU 算力并「同时」运行。物理上当然做不到真正同时，但 CFS 用一个精巧的记账机制逼近了这个理想——这就是 vruntime（virtual runtime，虚拟运行时间）。

vruntime 的核心思想是：**不直接记录物理时间，而是记录一个经过权重归一化后的「虚拟时间」，让所有进程的 vruntime 以接近相同的速度推进**。权重大的进程 vruntime 增长慢，权重小的增长快；CFS 每次选 vruntime 最小的进程运行，权重大的进程就自然获得更多 CPU 时间。在内核中，每个可调度实体用 `struct sched_entity` 表示（定义在 `include/linux/sched.h`），其中最关键的字段就是 `vruntime`（u64 类型，单位纳秒）和 `load`（`struct load_weight`，包含 weight 和 inv_weight 两个字段）。

## vruntime 计算公式与内核实现

CFS 更新 vruntime 的逻辑集中在 `kernel/sched/fair.c` 的 `update_curr()` 函数中。每次时钟中断（tick）到来或进程主动让出 CPU 时，`update_curr()` 被调用，计算当前进程本次运行的物理时间 `delta_exec`，然后通过以下公式转换成 vruntime 增量：

```
vruntime += delta_exec × (NICE_0_WEIGHT / weight)
```

其中 `NICE_0_WEIGHT` 是 nice 值为 0 的进程的基准权重，值固定为 **1024**；`weight` 是当前进程的权重，由 nice 值查 `sched_prio_to_weight[]` 表得到。公式的含义非常直白：对于 nice 0 的进程，vruntime 增量等于物理时间（1024/1024 = 1）；权重更大的进程（nice 值更小）vruntime 增长更慢；权重更小的进程（nice 值更大）vruntime 增长更快。

用开头的例子来验算：进程 A 的 nice 值为 0、权重 1024，实际跑了 10ms，vruntime 增量 = 10ms × (1024/1024) = 10ms。进程 B 的 nice 值为 5、权重 335（查表所得），实际跑了 10ms，vruntime 增量 = 10ms × (1024/335) ≈ 30.57ms。B 的 vruntime 膨胀了约 3 倍，这正好解释了为什么 A 实际跑了 45 秒、B 只跑了 15 秒，但两者的 vruntime 几乎相同——A 的 vruntime 以 1:1 速率增长，B 以约 3:1 速率增长，最终两者在同一水位上「齐头并进」。

在内核源码中，这个除法运算不是直接做 64 位整数除法（在许多架构上开销很大，可达几十个时钟周期），而是通过预计算的**逆权重**（inverse weight）转换成乘法和移位操作。具体实现在 `__calc_delta()` 函数中：

```c
// kernel/sched/fair.c（Linux 6.1 简化）
static u64 __calc_delta(u64 delta_exec, unsigned long weight,
                        struct load_weight *lw)
{
    u64 fact = scale_load_down(weight);
    u32 shift = WMULT_SHIFT;  // 32

    // 用逆权重将除法转为乘法 + 右移
    fact = mul_u64_u32_shr(delta_exec, lw->inv_weight, shift);
    return fact;
}
```

`inv_weight` 值预存在 `sched_prio_to_wmult[]` 数组中，由 `set_load_weight()` 在进程创建或 nice 值变化时一次性计算好，公式为 `inv_weight ≈ 2^32 / weight`。这个优化让 vruntime 更新的开销降到几条乘法和移位指令——这至关重要，因为 `update_curr()` 在每次时钟中断（典型配置下每秒 250-1000 次，取决于 `CONFIG_HZ`）和每次调度切换时都会被调用，是内核中最热的代码路径之一。

## nice 值到权重的映射表

Linux 的 nice 值范围是 -20（最高优先级）到 19（最低优先级），共 40 个级别。内核通过 `sched_prio_to_weight[]` 数组（定义在 `kernel/sched/core.c`）将每个 nice 值映射为一个权重值。这张表有一个精妙的数学性质：**相邻两个 nice 级别的权重比始终约为 1.25:1**。完整的权重表如下：

```c
// kernel/sched/core.c
const int sched_prio_to_weight[40] = {
 /* nice -20 */ 88761, 71755, 56483, 46273, 36291,
 /* nice -15 */ 29154, 23254, 18705, 14949, 11916,
 /* nice -10 */  9548,  7620,  6100,  4904,  3906,
 /* nice  -5 */  3121,  2501,  1991,  1586,  1277,
 /* nice   0 */  1024,   820,   655,   526,   423,
 /* nice   5 */   335,   272,   215,   172,   137,
 /* nice  10 */   110,    87,    70,    56,    45,
 /* nice  15 */    36,    29,    23,    18,    15,
};
```

为什么选 1.25:1 这个比例？因为这意味着在两个只差一个 nice 级别的进程之间，高优先级的那个大约多获得 10% 的 CPU 时间。验算一下：nice 0 权重 1024，nice 1 权重 820，比值 1024/820 ≈ 1.249。两个进程竞争时，nice 0 分到 1024/(1024+820) ≈ 55.5% 的 CPU，nice 1 分到 44.5%，差异约 10 个百分点。这个梯度让系统管理员可以精细地调整优先级——每降一个 nice 值多给约 10% 的 CPU，语义清晰可预测。权重最大值（nice -20 = 88761）和最小值（nice 19 = 15）之间差距约 5917 倍，极端情况下 nice -20 能拿到约 99.98% 的 CPU。

## 红黑树组织与 min_vruntime

CFS 用一棵红黑树（red-black tree，一种自平衡二叉搜索树，保证所有操作 O(log n) 且最坏情况不退化）以 vruntime 为键组织所有 `TASK_RUNNING` 状态的调度实体。每个 CPU 维护一个 `struct cfs_rq`（CFS 运行队列），其中包含这棵红黑树和一个关键变量——`min_vruntime`。

`min_vruntime` 是整个运行队列的「最低水位线」，其值大致等于所有就绪进程中最小的 vruntime，但有一个核心约束：**min_vruntime 只能单调递增，永远不会倒退**。即使当前最小 vruntime 的进程离开队列，min_vruntime 也保持不变。内核在 `update_min_vruntime()` 中这样维护：

```c
// kernel/sched/fair.c（简化）
static void update_min_vruntime(struct cfs_rq *cfs_rq)
{
    u64 vruntime = cfs_rq->min_vruntime;
    struct sched_entity *curr = cfs_rq->curr;
    struct rb_node *leftmost = rb_first_cached(
                                   &cfs_rq->tasks_timeline);

    if (curr)
        vruntime = curr->vruntime;
    if (leftmost) {
        struct sched_entity *se = rb_entry(
            leftmost, struct sched_entity, run_node);
        if (!curr)
            vruntime = se->vruntime;
        else
            vruntime = min_vruntime(vruntime, se->vruntime);
    }
    // 关键：只允许向前推进，永不回退
    cfs_rq->min_vruntime = max_vruntime(
                               cfs_rq->min_vruntime, vruntime);
}
```

单调性至关重要：min_vruntime 是新进程和唤醒进程 vruntime 初始化的基准，如果它能回退，新进程可能获得过小的 vruntime 导致长时间霸占 CPU。另外，Linux 内核的红黑树实现通过 `rb_first_cached()` 缓存了最左节点指针，使得取 vruntime 最小的进程仅需 O(1) 时间，无需每次从根节点遍历。

## 新进程与唤醒进程的 vruntime 初始化

新进程（通过 `fork()` 创建）的 vruntime 由 `place_entity()` 函数设定，基本逻辑是将其初始化为当前队列的 `min_vruntime`。如果内核参数 `sched_child_runs_first` 为 1（默认在很多发行版中是 0），子进程会被设置为一个略小于父进程的 vruntime，让子进程先运行——这对 `fork()+exec()` 模式有利，因为子进程通常会立即调用 `exec()` 加载新程序，先运行可以避免一次不必要的 COW（Copy-on-Write，写时复制，即 fork 时父子共享物理页面、只在某一方写入时才真正复制那一页）页面拷贝。

长时间睡眠后醒来的进程情况更复杂。如果一个进程 sleep 了 300 秒，其 vruntime 在睡眠期间完全没有增长，可能远远落后于当前的 min_vruntime。CFS 的处理方式是：唤醒时将 vruntime 补偿到 `max(自身 vruntime, min_vruntime - sched_latency_ns)`。补偿量最多为一个 `sched_latency`（默认 6ms）的虚拟时间，让唤醒的进程有一小段优先调度窗口以改善交互响应，但不会无限期饿死其他进程。这个设计在交互响应性和调度公平性之间达成了精确的平衡。

## CFS 带宽控制与容器调度

在 Kubernetes 和容器化环境中，CFS 的权重机制通过 cgroup 的 `cpu.weight`（cgroup v2）或 `cpu.shares`（cgroup v1）暴露给用户。Pod 的 `resources.requests.cpu` 对应 cpu.weight，控制在 CPU 竞争时的比例分配。而 `resources.limits.cpu` 对应 CFS 带宽控制器（CFS Bandwidth Controller），具体参数是 `cpu.max`（cgroup v2）或 `cpu.cfs_quota_us / cpu.cfs_period_us`（cgroup v1）。

CFS 带宽控制的工作原理是在每个 `cpu.cfs_period_us` 周期（默认 100ms）开始时给 cgroup 一个配额。当 cgroup 内所有进程在周期内耗尽配额时，这些进程被「限流」（throttled）——从 CFS 红黑树中移除，直到下一个周期开始。你可以通过 `cat /sys/fs/cgroup/<path>/cpu.stat` 查看 `nr_throttled`（被限流次数）和 `throttled_usec`（累计限流时间）来监控限流情况。

生产环境中一个经典的坑是 Java 应用的 CPU throttling。JVM 在 JDK 8u191 之前通过 `Runtime.getRuntime().availableProcessors()` 读取的是宿主机 CPU 核数而非容器限制。如果容器限制为 2 核但宿主机有 64 核，JVM 可能创建 60+ 个 GC 线程，在 GC 期间瞬间打爆 CPU 配额触发 throttle，表现为偶发的 P99 延迟毛刺。从 JDK 8u191 开始，`-XX:+UseContainerSupport`（默认开启）让 JVM 正确识别容器 CPU 限制，或者用 `-XX:ActiveProcessorCount=N` 手动指定。

理解 vruntime 的计算机制是理解整个 CFS 调度系统的基础。从 vruntime 公式出发，你能推导出权重比例分配、时间片计算、睡眠补偿、组调度等一系列机制。面试时把这条线串起来讲——从公式到权重表到红黑树到 min_vruntime 到容器场景——会比零散地列知识点有说服力得多。"""

key_points = [
    "vruntime 的更新公式为 vruntime += delta_exec × (NICE_0_WEIGHT / weight)，权重越大 vruntime 增长越慢，进程自然获得更多 CPU 时间，这是 CFS 按比例分配 CPU 的核心数学模型",
    "内核通过预计算的逆权重（inv_weight ≈ 2^32 / weight）将 vruntime 更新中的 64 位除法转换为乘法加右移操作，实现在 __calc_delta() 中，让每次时钟中断的 vruntime 更新开销仅需几条指令",
    "sched_prio_to_weight 权重表中相邻 nice 级别的权重比约为 1.25:1，使得每降低一个 nice 值约多获得 10% 的 CPU 时间，nice -20（88761）到 nice 19（15）的权重跨度约 5917 倍",
    "min_vruntime 是 CFS 运行队列中单调递增的最低水位线，作为新进程和唤醒进程 vruntime 初始化的基准，其单调性防止了新进程获得过小 vruntime 导致的 CPU 饥饿问题",
    "新 fork 进程的 vruntime 由 place_entity() 初始化为 min_vruntime 附近值；长时间睡眠唤醒的进程 vruntime 被补偿到 max(自身 vruntime, min_vruntime - sched_latency_ns)，最多补偿一个调度周期以平衡响应性和公平性",
    "CFS 带宽控制器通过 cpu.max（cgroup v2）对容器施加硬性 CPU 上限，配额耗尽时进程被 throttle 直到下一周期，生产环境中需通过 cpu.stat 的 nr_throttled 监控是否触发限流",
    "CFS 的 vruntime 更新入口是 update_curr() 函数（kernel/sched/fair.c），在每次时钟中断和进程调度切换时被调用，是理解整个 CFS 调度源码的最佳起点"
]

quiz = [
    {
        "id": "os-cfs-vruntime-calculation-1-q1",
        "question": "一个 nice 0 和一个 nice 5 的 CPU 密集型进程同时运行，一段时间后两者 vruntime 几乎相同，但实际运行时间差了约 3 倍。下列解释最准确的是？",
        "choices": [
            {"id": "A", "text": "vruntime 就是实际运行时间，两者几乎相同说明它们获得的 CPU 时间一样多"},
            {"id": "B", "text": "vruntime 是经权重归一化后的虚拟时间，nice 5 权重小导致 vruntime 增长快，用更少的实际时间就追上了 nice 0 进程的 vruntime"},
            {"id": "C", "text": "vruntime 是内核随机分配的调度优先级数值，跟实际运行时间没有直接关系"},
            {"id": "D", "text": "vruntime 只记录被动上下文切换次数的累加值，与物理时间或权重无关"}
        ],
        "correctAnswer": "B",
        "explanation": "vruntime 不是物理时间的直接记录，而是通过公式 vruntime += delta_exec × (NICE_0_WEIGHT / weight) 计算出的「虚拟时间」。nice 0 权重 1024，nice 5 权重 335，所以 nice 5 的 vruntime 增长速率是 nice 0 的 1024/335 ≈ 3.06 倍。这意味着 nice 5 的进程每运行 1ms 物理时间，vruntime 增加约 3.06ms，而 nice 0 每运行 1ms vruntime 只增加 1ms。CFS 总是调度 vruntime 最小的进程，结果就是两者 vruntime 齐平但实际 CPU 时间分配比约为 3:1。A 把 vruntime 等同于物理时间，完全忽略了权重归一化。C 和 D 都杜撰了 vruntime 的含义。"
    },
    {
        "id": "os-cfs-vruntime-calculation-1-q2",
        "question": "CFS 的 vruntime 计算公式中，NICE_0_WEIGHT 的值是多少，它代表什么？",
        "choices": [
            {"id": "A", "text": "值为 100，代表 nice 0 进程的调度优先级编号"},
            {"id": "B", "text": "值为 1024，代表 nice 值为 0 时进程的基准权重，vruntime 计算以此为归一化基准"},
            {"id": "C", "text": "值为 120，代表 nice 0 对应的内核静态优先级 static_prio"},
            {"id": "D", "text": "值为 1000，代表每秒的时钟中断次数 CONFIG_HZ"}
        ],
        "correctAnswer": "B",
        "explanation": "NICE_0_WEIGHT 固定为 1024，对应 sched_prio_to_weight 数组中 nice 0 的那个槽位。vruntime 计算公式 vruntime += delta_exec × (NICE_0_WEIGHT / weight) 以 1024 为分子，使得 nice 0 的进程 vruntime 增长速率恰好等于物理时间（1024/1024 = 1），其他 nice 值的增长速率按比例缩放。A 的 100 毫无来由。C 的 120 确实是 nice 0 对应的内核 static_prio 值（nice + 120 = static_prio），但这是优先级编号不是权重值。D 的 1000 是 CONFIG_HZ=1000 时每秒的时钟中断频率，与权重无关。"
    },
    {
        "id": "os-cfs-vruntime-calculation-1-q3",
        "question": "Linux 内核在 __calc_delta() 中计算 vruntime 增量时，为什么不直接做 delta_exec × NICE_0_WEIGHT / weight 的 64 位除法？",
        "choices": [
            {"id": "A", "text": "因为 64 位除法在内核态是非法操作，会触发 kernel panic"},
            {"id": "B", "text": "因为内核出于代码可读性考虑，统一使用乘法和位移代替除法"},
            {"id": "C", "text": "因为 64 位整数除法在许多架构上开销很大，内核通过预计算逆权重（inv_weight）将除法转换为乘法加右移，大幅降低每次 tick 的 vruntime 更新开销"},
            {"id": "D", "text": "因为直接除法会导致精度丢失，乘法加右移可以保留更多有效位数"}
        ],
        "correctAnswer": "C",
        "explanation": "在 x86 等架构上，64 位整数除法指令（div/idiv）的延迟可达几十个时钟周期，而乘法加右移通常只需几个周期。vruntime 更新发生在每次时钟中断（典型配置每秒 250-1000 次）和每次调度切换时，是内核最热的代码路径之一。内核在 set_load_weight() 中预计算 inv_weight ≈ 2^32 / weight 并存入 sched_prio_to_wmult 表，__calc_delta() 通过 mul_u64_u32_shr(delta_exec, inv_weight, 32) 完成等价计算。A 不对，64 位除法在内核中不是非法操作，只是某些架构需要软件模拟而更慢。B 的「可读性」理由站不住脚，位移运算并不比除法更易读。D 不准确，精度不是主要考量——两种方式在纳秒级精度上差异可忽略。"
    },
    {
        "id": "os-cfs-vruntime-calculation-1-q4",
        "question": "CFS 运行队列中的 min_vruntime 有什么特殊约束？",
        "choices": [
            {"id": "A", "text": "min_vruntime 始终精确等于红黑树最左节点的 vruntime，进程出队时可能减小"},
            {"id": "B", "text": "min_vruntime 只能单调递增，即使最小 vruntime 的进程离开队列也不会回退"},
            {"id": "C", "text": "min_vruntime 在每个调度周期开始时重置为 0，防止 u64 数值溢出"},
            {"id": "D", "text": "min_vruntime 是所有就绪进程 vruntime 的算术平均值，用于判断哪些进程落后"}
        ],
        "correctAnswer": "B",
        "explanation": "min_vruntime 由 update_min_vruntime() 维护，核心逻辑是取当前运行进程和红黑树最左节点 vruntime 的较小值，然后与已有的 min_vruntime 取较大值——保证只能向前推进。单调递增这个性质至关重要：min_vruntime 是新创建进程和唤醒进程确定起始 vruntime 的基准。如果 min_vruntime 能回退，新进程可能获得过小的 vruntime，从而长时间霸占 CPU。A 的错误在于 min_vruntime 不等于最左节点值，当最左节点出队后 min_vruntime 保持原值不回退。C 完全错误，min_vruntime 不会重置，u64 类型极大（约 584 年的纳秒），不用担心溢出。D 也不对，min_vruntime 不是平均值而是下限基准。"
    },
    {
        "id": "os-cfs-vruntime-calculation-1-q5",
        "question": "两个进程的 /proc/PID/sched 输出如下：\n进程 X：se.vruntime = 50000000, se.sum_exec_runtime = 50000000\n进程 Y：se.vruntime = 50000000, se.sum_exec_runtime = 12500000\n两者 vruntime 相同但 sum_exec_runtime 差 4 倍。关于进程 Y 的 nice 值，最合理的推断是？",
        "choices": [
            {"id": "A", "text": "nice 值约为 -7（权重约 4096），vruntime 增长速率约为 nice 0 的 1/4"},
            {"id": "B", "text": "nice 值约为 7（权重约 215），vruntime 增长速率约为 nice 0 的 4.76 倍"},
            {"id": "C", "text": "nice 值为 0，只是进程 Y 启动时间较晚导致 sum_exec_runtime 较少"},
            {"id": "D", "text": "无法判断，vruntime 与 sum_exec_runtime 之间没有确定性关系"}
        ],
        "correctAnswer": "B",
        "explanation": "进程 X 的 vruntime 等于 sum_exec_runtime，说明其权重为 NICE_0_WEIGHT = 1024，即 nice 0。进程 Y 的 sum_exec_runtime 只有 vruntime 的 1/4，意味着每运行 1ms 物理时间 vruntime 增加约 4ms，增长倍率 = 1024/weight = 4，weight ≈ 256。查权重表：nice 5 权重 335，nice 6 权重 272，nice 7 权重 215。nice 7 的 1024/215 ≈ 4.76 倍与观察到的 4 倍最接近（考虑到还有其他调度开销的影响）。A 把方向搞反了——vruntime 增长慢（权重大、nice 小）才需要更多实际时间积累相同 vruntime，而 Y 是用更少时间就达到了相同 vruntime，说明 vruntime 增长更快、权重更小、nice 更大。C 不成立，两者 vruntime 相同意味着在同一队列中被跟踪了相同的虚拟时间。D 忽略了 vruntime 计算公式的确定性关系。"
    },
    {
        "id": "os-cfs-vruntime-calculation-1-q6",
        "question": "关于 fork() 新创建子进程的 vruntime 初始化，以下哪个说法是正确的？",
        "choices": [
            {"id": "A", "text": "子进程的 vruntime 初始化为 0，这样它会最先被调度以便尽快执行 exec()"},
            {"id": "B", "text": "子进程完全继承父进程的 vruntime 值，不做任何调整"},
            {"id": "C", "text": "子进程的 vruntime 初始化为当前运行队列的 min_vruntime 附近值，确保站在公平的起跑线上"},
            {"id": "D", "text": "子进程的 vruntime 设置为红黑树最右节点的值加 1，排到队列末尾等待调度"}
        ],
        "correctAnswer": "C",
        "explanation": "新进程的 vruntime 由 place_entity() 函数设定，基本策略是初始化为当前 CFS 运行队列的 min_vruntime。这保证新进程既不会因为 vruntime 过小（如初始化为 0）而疯狂霸占 CPU，也不会因为 vruntime 过大而长期得不到调度。如果内核参数 sched_child_runs_first 为 1，place_entity() 还会微调父子进程的 vruntime 让子进程先运行，这对 fork+exec 模式有利——子进程先运行 exec() 可以避免不必要的 COW 页面拷贝。A 是最常见的误区，如果初始化为 0，恶意程序只需不停 fork 就能永远霸占 CPU。B 直接继承父进程 vruntime 可能让子进程被推到树的右侧长期得不到调度。D 排到末尾会造成严重的调度不公平。"
    },
    {
        "id": "os-cfs-vruntime-calculation-1-q7",
        "question": "与 O(1) 调度器的固定时间片分配相比，CFS 的 vruntime 模型在以下哪个方面有本质性改进？",
        "choices": [
            {"id": "A", "text": "CFS 完全消除了上下文切换开销，因为 vruntime 只在进程主动让出 CPU 时才更新"},
            {"id": "B", "text": "CFS 让 CPU 密集型进程获得更多时间片，专门优化了计算密集型任务的吞吐量"},
            {"id": "C", "text": "CFS 的时间片按权重比例动态计算，不会出现 O(1) 中「低优先级进程调度延迟反而更短」的反直觉行为"},
            {"id": "D", "text": "CFS 使用固定大小的时间片 sched_min_granularity，仅通过 vruntime 决定调度顺序来实现公平"}
        ],
        "correctAnswer": "C",
        "explanation": "O(1) 调度器的核心问题在于「优先级→时间片」的硬编码映射：nice 0 得 100ms，nice 19 得 5ms。两个 nice 0 进程调度周期 200ms，两个 nice 19 进程周期只有 10ms——低优先级进程的调度延迟反而更好，完全违反直觉。CFS 摒弃了固定映射，改为 时间片 = 调度周期 × (自身权重/总权重)，调度周期随进程数量动态伸缩，所有进程的延迟体验一致。A 不对，CFS 同样有上下文切换开销，vruntime 在每次 tick 时都会通过 update_curr() 更新。B 因果关系不成立——CFS 的目标是公平而非偏向计算密集型。D 的「固定大小时间片」不准确，sched_min_granularity 只是最小运行粒度下限而非固定时间片。"
    },
    {
        "id": "os-cfs-vruntime-calculation-1-q8",
        "question": "某 Kubernetes Pod 设置了 resources.limits.cpu: 2，运行时 P99 延迟出现不规律毛刺。通过 cat cpu.stat 发现 nr_throttled 在持续增长。最可能的排查方向是？",
        "choices": [
            {"id": "A", "text": "检查 Pod 是否存在内存泄漏导致频繁 GC，进而间接导致 CPU 使用率飙升触发限流"},
            {"id": "B", "text": "增大 resources.requests.cpu 以提高 cpu.weight 权重，让 Pod 在竞争中获得更多 CPU"},
            {"id": "C", "text": "检查应用线程数是否远超容器 CPU limit（如 JVM 按宿主机 64 核创建了 60+ GC 线程），导致瞬时 CPU 突增被 CFS 带宽控制器 throttle"},
            {"id": "D", "text": "将调度策略从 SCHED_NORMAL 改为 SCHED_FIFO 以绕过 CFS 带宽限流"}
        ],
        "correctAnswer": "C",
        "explanation": "nr_throttled 增长说明 CFS 带宽控制器在生效——每个 100ms period 内，容器 CPU 使用超出 2 核的 quota（200ms），进程被 throttle。最经典的场景是应用线程数按宿主机 CPU 核数创建而非容器限制（JDK 8u191 之前的默认行为），在 GC 或 JIT 编译期间所有线程同时活跃导致 CPU 瞬时尖峰。排查方法是对比 JVM 的 ActiveProcessorCount 和实际线程数，用 -XX:ActiveProcessorCount=2 手动限制。A 虽然 GC 消耗 CPU，但根因是线程数过多而非内存泄漏本身。B 方向错误，requests 影响调度权重和节点分配，不影响 cpu.max 硬限制。D 实时调度策略同样受 cgroup CPU 限制约束，改策略不能绕过带宽控制器。"
    },
    {
        "id": "os-cfs-vruntime-calculation-1-q9",
        "question": "一个进程执行 sleep(300) 后被唤醒时，CFS 如何处理它的 vruntime？",
        "choices": [
            {"id": "A", "text": "保持 sleep 前的 vruntime 不变，让它在红黑树最左侧持续运行直到追上其他进程"},
            {"id": "B", "text": "将 vruntime 重置为 0，给予最高调度优先级作为睡眠补偿"},
            {"id": "C", "text": "将 vruntime 调整为 max(自身 vruntime, min_vruntime - sched_latency_ns)，给予有限的唤醒补偿"},
            {"id": "D", "text": "将 vruntime 设置为当前 min_vruntime，与其他进程完全齐平不给任何补偿"}
        ],
        "correctAnswer": "C",
        "explanation": "这是 CFS 的「唤醒补偿」机制。进程睡眠 300 秒后，其 vruntime 远远落后于当前的 min_vruntime。如果按 A 保持不变，它会在红黑树最左侧停留很长时间持续霸占 CPU 饿死其他进程。如果按 B 重置为 0 则更极端。CFS 的实际做法是取 max(自身 vruntime, min_vruntime - sched_latency_ns)，其中 sched_latency_ns 默认为 6ms。唤醒后的 vruntime 最多比当前最低水位低 6ms 的虚拟时间，进程获得一小段优先调度补偿窗口后迅速回归公平竞争。D 的「完全不给补偿」也不对——CFS 确实提供了 sched_latency 大小的补偿，让交互型进程（如用户操作后唤醒的进程）获得更快响应。"
    },
    {
        "id": "os-cfs-vruntime-calculation-1-q10",
        "question": "你怀疑一个延迟敏感服务的 P99 抖动是因为 CFS 调度延迟过高。以下哪组命令最适合确认这个假设？",
        "choices": [
            {"id": "A", "text": "top -H 查看线程级 CPU 使用率，找到占用最高的线程"},
            {"id": "B", "text": "strace -p PID 跟踪系统调用，分析每个 syscall 的耗时"},
            {"id": "C", "text": "perf sched record -- sleep 10 录制调度事件，再用 perf sched latency 查看各任务从就绪到运行的等待时间分布"},
            {"id": "D", "text": "vmstat 1 观察上下文切换频率，如果 cs 列数值很高就说明调度延迟大"}
        ],
        "correctAnswer": "C",
        "explanation": "perf sched 是 Linux 内核自带的调度分析工具。perf sched record 通过 tracepoint 采集所有调度事件（sched:sched_switch、sched:sched_wakeup 等），perf sched latency 汇总后展示每个任务从变为就绪（wakeup）到真正被调度上 CPU（switch-in）的等待时间统计，包括最大值、平均值和总等待时间。如果目标进程的 max wait 达到几十毫秒，就能确认调度延迟是 P99 抖动的原因。A 的 top 只能看 CPU 使用率快照，无法看到调度等待时间。B 的 strace 跟踪系统调用延迟而非调度延迟——进程在 runqueue 上等了 50ms 才被调度到，strace 看到的只是 syscall 执行时间。D 的 vmstat cs 列是全系统上下文切换总数，cs 高不等于调度延迟大——可能只是进程多切换频繁但每次等待很短。"
    }
]

pack = {
    "id": "os-cfs-vruntime-calculation",
    "name": "CFS vruntime 计算机制",
    "domain": "operating-system",
    "description": "CFS 调度器中 vruntime 的精确计算公式、nice-to-weight 权重映射表、红黑树调度选择与 min_vruntime 单调推进机制",
    "version": "1.0.0",
    "questions": [
        {
            "id": "os-cfs-vruntime-calculation-1",
            "domain": "operating-system",
            "type": "principle",
            "difficulty": 3,
            "tags": ["CFS", "vruntime", "scheduling", "weight", "red-black-tree", "nice"],
            "title": "CFS 中 vruntime 是怎么计算的，权重如何影响调度",
            "content": content,
            "answer": answer,
            "keyPoints": key_points,
            "quiz": quiz,
            "references": [
                "https://docs.kernel.org/scheduler/sched-design-CFS.html",
                "https://elixir.bootlin.com/linux/v6.1/source/kernel/sched/fair.c",
                "https://lwn.net/Articles/925371/",
                "https://www.kernel.org/doc/html/latest/admin-guide/cgroup-v2.html"
            ]
        }
    ]
}

output_path = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "public", "question-packs", "operating-system",
    "cfs-vruntime-calculation.json"
)

with open(output_path, "w", encoding="utf-8") as f:
    json.dump(pack, f, ensure_ascii=False, indent=2)

print(f"Written to: {output_path}")
print(f"File size: {os.path.getsize(output_path)} bytes")
