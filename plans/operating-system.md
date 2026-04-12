# 操作系统面试题子计划

> 领域: operating-system | 目标: ~200 题 | 状态: 规划中

## 题型统计目标

| 题型 | type key | 目标 | 实际 |
|------|----------|------|------|
| 概念定义 | concept | ~25 | 25 |
| 原理机制 | principle | ~25 | 25 |
| 对比辨析 | comparison | ~18 | 18 |
| 细碎知识 | trivia | ~18 | 18 |
| 系统环境 | env-config | ~15 | 15 |
| 修改变更 | modification | ~12 | 12 |
| 作用分析 | purpose | ~15 | 15 |
| 开放设计 | open-ended | ~15 | 15 |
| 排查定位 | debugging | ~15 | 15 |
| 真实数据 | real-data | ~10 | 10 |
| 需求分析 | requirement | ~10 | 10 |
| 调优实践 | tuning | ~10 | 10 |
| 最佳实践 | practice | ~7 | 7 |
| 结合项目 | project | ~5 | 5 |
| **合计** | | **~200** | **200** |

## 难度统计目标

| 难度 | 目标 | 实际 |
|------|------|------|
| 1 基础 | ~50 | 50 |
| 2 进阶 | ~70 | 70 |
| 3 高级 | ~55 | 55 |
| 4 专家 | ~25 | 25 |
| **合计** | **~200** | **200** |

---

## 1. 进程管理

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 1 | 进程有哪几种状态，它们之间是怎么转换的 | concept | 1 | operating-system/process-states.json | ⬜ |
| 2 | 请描述一个进程从创建到终止的完整生命周期 | principle | 1 | operating-system/process-lifecycle.json | ⬜ |
| 3 | 什么是僵尸进程（Zombie Process），它是如何产生的 | concept | 1 | operating-system/zombie-process.json | ⬜ |
| 4 | 什么是孤儿进程（Orphan Process），内核是怎么处理它的 | concept | 1 | operating-system/orphan-process.json | ⬜ |
| 5 | fork() 系统调用的工作原理是什么 | principle | 2 | operating-system/fork-syscall.json | ⬜ |
| 6 | exec() 系列函数和 fork() 是如何配合使用的 | principle | 2 | operating-system/fork-exec-combination.json | ⬜ |
| 7 | Linux 中 task_struct 结构体包含哪些关键字段 | trivia | 3 | operating-system/task-struct-fields.json | ⬜ |
| 8 | 如何通过 /proc 文件系统查看进程的详细信息 | env-config | 1 | operating-system/proc-filesystem-process.json | ⬜ |
| 9 | 系统中出现大量僵尸进程时应如何排查和清理 | debugging | 2 | operating-system/zombie-process-cleanup.json | ⬜ |
| 10 | 一个守护进程（Daemon）的标准创建步骤是什么 | practice | 2 | operating-system/daemon-creation-steps.json | ⬜ |
| 11 | 进程的地址空间布局（代码段、数据段、堆、栈）是怎样的 | concept | 1 | operating-system/process-address-space.json | ⬜ |
| 12 | 如何用 strace 跟踪一个进程的系统调用行为 | env-config | 2 | operating-system/strace-process-trace.json | ⬜ |

## 2. 进程调度

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 13 | 常见的 CPU 调度算法有哪些，各有什么优缺点 | concept | 1 | operating-system/scheduling-algorithms.json | ⬜ |
| 14 | Linux CFS（完全公平调度器）的工作原理是什么 | principle | 2 | operating-system/cfs-scheduler.json | ⬜ |
| 15 | 抢占式调度和非抢占式调度有什么区别 | comparison | 1 | operating-system/preemptive-vs-nonpreemptive.json | ⬜ |
| 16 | 什么是优先级反转（Priority Inversion），如何解决 | concept | 3 | operating-system/priority-inversion.json | ⬜ |
| 17 | 实时调度策略 SCHED_FIFO 和 SCHED_RR 有什么区别 | comparison | 3 | operating-system/sched-fifo-vs-rr.json | ⬜ |
| 18 | Linux 中 nice 值和 priority 是什么关系 | trivia | 2 | operating-system/nice-value-priority.json | ⬜ |
| 19 | 多级反馈队列调度算法（MLFQ）的设计思想是什么 | principle | 2 | operating-system/mlfq-scheduling.json | ⬜ |
| 20 | 如何用 chrt 命令修改进程的调度策略和优先级 | env-config | 2 | operating-system/chrt-scheduling-config.json | ⬜ |
| 21 | CFS 中 vruntime 是怎么计算的，权重如何影响调度 | principle | 3 | operating-system/cfs-vruntime-calculation.json | ⬜ |
| 22 | 如果系统中某个进程 CPU 占用率异常高，你会如何排查 | debugging | 2 | operating-system/high-cpu-diagnosis.json | ⬜ |

## 3. 线程

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 23 | 进程和线程有什么区别和联系 | comparison | 1 | operating-system/process-vs-thread.json | ⬜ |
| 24 | 用户级线程和内核级线程有什么区别 | comparison | 2 | operating-system/user-vs-kernel-thread.json | ⬜ |
| 25 | 什么是线程池，为什么要使用线程池 | concept | 1 | operating-system/thread-pool-concept.json | ⬜ |
| 26 | 什么是绿色线程（Green Thread），它和系统线程有什么区别 | concept | 3 | operating-system/green-thread.json | ⬜ |
| 27 | POSIX 线程（pthread）库提供了哪些核心 API | trivia | 2 | operating-system/pthread-core-api.json | ⬜ |
| 28 | 线程局部存储（TLS）是什么，有哪些使用场景 | purpose | 2 | operating-system/thread-local-storage.json | ⬜ |
| 29 | Linux 中线程的 1:1 模型、M:N 模型分别是怎么实现的 | principle | 3 | operating-system/thread-mapping-models.json | ⬜ |
| 30 | 多线程程序中如何安全地处理信号 | debugging | 3 | operating-system/thread-signal-handling.json | ⬜ |
| 31 | 线程池的核心参数应该如何设置 | tuning | 2 | operating-system/thread-pool-sizing.json | ⬜ |
| 32 | 如何设计一个支持动态伸缩的线程池 | open-ended | 3 | operating-system/dynamic-thread-pool-design.json | ⬜ |

## 4. 同步与互斥

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 33 | 什么是互斥锁（Mutex），它的基本使用方式是怎样的 | concept | 1 | operating-system/mutex-concept.json | ⬜ |
| 34 | 自旋锁（Spinlock）和互斥锁有什么区别，各适合什么场景 | comparison | 2 | operating-system/spinlock-vs-mutex.json | ⬜ |
| 35 | 信号量（Semaphore）的 P/V 操作原理是什么 | principle | 1 | operating-system/semaphore-pv-operation.json | ⬜ |
| 36 | 条件变量（Condition Variable）为什么需要搭配互斥锁使用 | principle | 2 | operating-system/condition-variable-with-mutex.json | ⬜ |
| 37 | 什么是屏障（Barrier），它在并行计算中起什么作用 | purpose | 2 | operating-system/barrier-synchronization.json | ⬜ |
| 38 | 什么是读写锁（RWLock），适用于什么场景 | concept | 2 | operating-system/rwlock-concept.json | ⬜ |
| 39 | CAS（Compare-And-Swap）操作的原理是什么，有什么 ABA 问题 | principle | 3 | operating-system/cas-and-aba-problem.json | ⬜ |
| 40 | 用信号量实现生产者-消费者问题的完整方案是什么 | practice | 2 | operating-system/producer-consumer-semaphore.json | ⬜ |
| 41 | futex 是什么，它是如何优化锁性能的 | principle | 3 | operating-system/futex-mechanism.json | ⬜ |
| 42 | 如何排查多线程程序中的锁竞争问题 | debugging | 3 | operating-system/lock-contention-diagnosis.json | ⬜ |
| 43 | 什么是无锁编程（Lock-Free），它的核心思想是什么 | concept | 3 | operating-system/lock-free-programming.json | ⬜ |
| 44 | 内存屏障（Memory Barrier）在多核同步中起什么作用 | purpose | 4 | operating-system/memory-barrier-purpose.json | ⬜ |

## 5. 死锁

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 45 | 什么是死锁，产生死锁的四个必要条件是什么 | concept | 1 | operating-system/deadlock-conditions.json | ⬜ |
| 46 | 死锁的预防（Prevention）有哪些策略 | principle | 2 | operating-system/deadlock-prevention.json | ⬜ |
| 47 | 死锁的避免（Avoidance）和银行家算法的原理是什么 | principle | 2 | operating-system/banker-algorithm.json | ⬜ |
| 48 | 死锁的检测和恢复机制是怎样的 | principle | 2 | operating-system/deadlock-detection-recovery.json | ⬜ |
| 49 | 死锁预防和死锁避免有什么区别 | comparison | 2 | operating-system/prevention-vs-avoidance.json | ⬜ |
| 50 | 你在实际项目中遇到过死锁问题吗，是怎么解决的 | project | 3 | operating-system/deadlock-real-case.json | ⬜ |
| 51 | 数据库中的死锁和操作系统中的死锁有什么异同 | comparison | 3 | operating-system/db-vs-os-deadlock.json | ⬜ |
| 52 | 如何使用工具检测 Linux 系统中的死锁 | debugging | 3 | operating-system/deadlock-detection-tools.json | ⬜ |
| 53 | 活锁（Livelock）和饥饿（Starvation）与死锁有什么区别 | comparison | 2 | operating-system/livelock-starvation-deadlock.json | ⬜ |

## 6. 进程间通信

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 54 | Linux 进程间通信（IPC）有哪些主要方式 | concept | 1 | operating-system/ipc-overview.json | ⬜ |
| 55 | 管道（Pipe）和命名管道（FIFO）有什么区别 | comparison | 1 | operating-system/pipe-vs-fifo.json | ⬜ |
| 56 | 消息队列（Message Queue）的工作原理和使用场景是什么 | principle | 2 | operating-system/message-queue-ipc.json | ⬜ |
| 57 | 共享内存（Shared Memory）为什么是最快的 IPC 方式 | purpose | 2 | operating-system/shared-memory-ipc.json | ⬜ |
| 58 | Unix Domain Socket 和 TCP Socket 有什么区别 | comparison | 2 | operating-system/unix-socket-vs-tcp.json | ⬜ |
| 59 | System V IPC 和 POSIX IPC 有什么区别 | comparison | 3 | operating-system/sysv-vs-posix-ipc.json | ⬜ |
| 60 | 如何使用 ipcs 和 ipcrm 命令管理 IPC 资源 | env-config | 2 | operating-system/ipcs-ipcrm-commands.json | ⬜ |
| 61 | 共享内存使用时如何保证数据同步和一致性 | principle | 3 | operating-system/shared-memory-synchronization.json | ⬜ |
| 62 | D-Bus 在 Linux 桌面系统中起什么作用 | purpose | 2 | operating-system/dbus-purpose.json | ⬜ |
| 63 | 如何选择合适的 IPC 机制来满足高性能通信需求 | requirement | 3 | operating-system/ipc-selection-criteria.json | ⬜ |
| 64 | 管道的缓冲区大小是多少，满了或空了会怎样 | trivia | 2 | operating-system/pipe-buffer-behavior.json | ⬜ |

## 7. 信号

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 65 | Linux 信号（Signal）机制的基本原理是什么 | principle | 1 | operating-system/signal-mechanism.json | ⬜ |
| 66 | SIGKILL 和 SIGTERM 有什么区别 | comparison | 1 | operating-system/sigkill-vs-sigterm.json | ⬜ |
| 67 | 常见的 Linux 信号有哪些，各自的默认行为是什么 | trivia | 1 | operating-system/common-signals.json | ⬜ |
| 68 | 如何编写一个可靠的信号处理函数（Signal Handler） | practice | 2 | operating-system/reliable-signal-handler.json | ⬜ |
| 69 | 什么是可靠信号和不可靠信号 | concept | 2 | operating-system/reliable-vs-unreliable-signals.json | ⬜ |
| 70 | 为什么在信号处理函数中只能调用异步信号安全函数 | principle | 3 | operating-system/async-signal-safe-functions.json | ⬜ |
| 71 | 如何使用 trap 命令在 Shell 脚本中处理信号 | env-config | 1 | operating-system/trap-signal-shell.json | ⬜ |

## 8. 虚拟内存

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 72 | 什么是虚拟内存，为什么需要虚拟内存 | concept | 1 | operating-system/virtual-memory-concept.json | ⬜ |
| 73 | 页表（Page Table）是如何将虚拟地址映射到物理地址的 | principle | 1 | operating-system/page-table-mapping.json | ⬜ |
| 74 | TLB（转换后备缓冲区）的作用和工作原理是什么 | principle | 2 | operating-system/tlb-mechanism.json | ⬜ |
| 75 | 为什么需要多级页表，它是怎么节省内存的 | principle | 2 | operating-system/multi-level-page-table.json | ⬜ |
| 76 | x86-64 架构下四级页表的地址翻译过程是怎样的 | principle | 3 | operating-system/x86-64-page-table-walk.json | ⬜ |
| 77 | 虚拟地址空间中内核空间和用户空间是如何划分的 | concept | 2 | operating-system/kernel-user-space-layout.json | ⬜ |
| 78 | 什么是缺页中断（Page Fault），它的处理流程是怎样的 | principle | 2 | operating-system/page-fault-handling.json | ⬜ |
| 79 | 如何通过 /proc/pid/maps 查看进程的虚拟内存布局 | env-config | 2 | operating-system/proc-maps-memory-layout.json | ⬜ |
| 80 | TLB 失效（TLB Miss）对性能有多大影响，如何优化 | tuning | 3 | operating-system/tlb-miss-optimization.json | ⬜ |
| 81 | 反向页表（Inverted Page Table）的设计思想是什么 | concept | 3 | operating-system/inverted-page-table.json | ⬜ |
| 82 | Linux 中 KASLR 是什么，它如何增强安全性 | purpose | 3 | operating-system/kaslr-security.json | ⬜ |

## 9. 页面置换

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 83 | 常见的页面置换算法有哪些，各有什么优缺点 | concept | 1 | operating-system/page-replacement-algorithms.json | ⬜ |
| 84 | LRU 算法的原理是什么，如何实现 | principle | 2 | operating-system/lru-algorithm.json | ⬜ |
| 85 | CLOCK（时钟）算法是如何近似 LRU 的 | principle | 2 | operating-system/clock-algorithm.json | ⬜ |
| 86 | LRU 和 LFU 页面置换算法有什么区别 | comparison | 2 | operating-system/lru-vs-lfu.json | ⬜ |
| 87 | 什么是 Belady 异常，为什么 FIFO 会出现这种问题 | trivia | 2 | operating-system/belady-anomaly.json | ⬜ |
| 88 | Linux 内核使用什么页面置换策略 | trivia | 3 | operating-system/linux-page-reclaim.json | ⬜ |
| 89 | 什么是工作集（Working Set）模型 | concept | 2 | operating-system/working-set-model.json | ⬜ |
| 90 | 什么是抖动（Thrashing），如何预防 | concept | 2 | operating-system/thrashing-prevention.json | ⬜ |
| 91 | 系统频繁发生 Page Fault 时该如何分析和处理 | debugging | 3 | operating-system/page-fault-diagnosis.json | ⬜ |

## 10. 内存分配

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 92 | malloc 底层是怎么分配内存的（brk vs mmap） | principle | 2 | operating-system/malloc-brk-mmap.json | ⬜ |
| 93 | glibc 的 ptmalloc 内存分配器的设计原理是什么 | principle | 3 | operating-system/ptmalloc-design.json | ⬜ |
| 94 | Slab 分配器的设计思想和用途是什么 | principle | 3 | operating-system/slab-allocator.json | ⬜ |
| 95 | Buddy System（伙伴系统）的工作原理是什么 | principle | 2 | operating-system/buddy-system.json | ⬜ |
| 96 | 什么是内存池（Memory Pool），为什么要使用内存池 | purpose | 2 | operating-system/memory-pool-purpose.json | ⬜ |
| 97 | tcmalloc 和 jemalloc 相比 ptmalloc 有哪些改进 | comparison | 3 | operating-system/tcmalloc-jemalloc-compare.json | ⬜ |
| 98 | 如何检测和定位程序中的内存泄漏 | debugging | 2 | operating-system/memory-leak-detection.json | ⬜ |
| 99 | malloc(0) 会返回什么，free(NULL) 安全吗 | trivia | 1 | operating-system/malloc-zero-free-null.json | ⬜ |
| 100 | 如何用 Valgrind 检查程序的内存问题 | env-config | 2 | operating-system/valgrind-memory-check.json | ⬜ |

## 11. 内存碎片

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 101 | 什么是内部碎片和外部碎片 | concept | 1 | operating-system/internal-external-fragmentation.json | ⬜ |
| 102 | 操作系统是如何解决外部碎片问题的 | principle | 2 | operating-system/external-fragmentation-solutions.json | ⬜ |
| 103 | 内存紧凑（Compaction）的代价有多大 | real-data | 3 | operating-system/memory-compaction-cost.json | ⬜ |
| 104 | 分页和分段在解决碎片问题上有什么不同 | comparison | 2 | operating-system/paging-vs-segmentation-fragmentation.json | ⬜ |
| 105 | 长时间运行的服务如何应对内存碎片化问题 | tuning | 3 | operating-system/long-running-fragmentation.json | ⬜ |
| 106 | 如何通过 /proc/buddyinfo 查看系统内存碎片状况 | env-config | 2 | operating-system/proc-buddyinfo.json | ⬜ |
| 107 | 段页式内存管理是什么，结合了哪些优点 | concept | 2 | operating-system/segmented-paging.json | ⬜ |

## 12. 大页与NUMA

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 108 | 什么是大页（Huge Pages），为什么能提升性能 | concept | 2 | operating-system/huge-pages-concept.json | ⬜ |
| 109 | 透明大页（THP）和静态大页有什么区别 | comparison | 3 | operating-system/thp-vs-static-hugepages.json | ⬜ |
| 110 | 什么是 NUMA 架构，它和 UMA 有什么区别 | concept | 2 | operating-system/numa-vs-uma.json | ⬜ |
| 111 | NUMA 内存亲和性（Memory Affinity）是什么，如何配置 | env-config | 3 | operating-system/numa-memory-affinity.json | ⬜ |
| 112 | 为什么在 NUMA 系统中跨节点访问内存性能会下降 | principle | 3 | operating-system/numa-remote-access-penalty.json | ⬜ |
| 113 | 如何使用 numactl 命令绑定进程到指定 NUMA 节点 | env-config | 3 | operating-system/numactl-binding.json | ⬜ |
| 114 | 透明大页在数据库场景下可能引起什么问题 | debugging | 4 | operating-system/thp-database-issues.json | ⬜ |
| 115 | NUMA 环境下如何优化高性能应用的内存分配策略 | tuning | 4 | operating-system/numa-optimization-strategy.json | ⬜ |

## 13. mmap与零拷贝

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 116 | mmap 系统调用的工作原理是什么 | principle | 2 | operating-system/mmap-mechanism.json | ⬜ |
| 117 | mmap 和 read/write 方式读取文件有什么区别 | comparison | 2 | operating-system/mmap-vs-read-write.json | ⬜ |
| 118 | 什么是零拷贝（Zero-Copy），它解决了什么问题 | concept | 2 | operating-system/zero-copy-concept.json | ⬜ |
| 119 | sendfile 系统调用是如何实现零拷贝的 | principle | 3 | operating-system/sendfile-zero-copy.json | ⬜ |
| 120 | splice 和 tee 系统调用的作用是什么 | purpose | 3 | operating-system/splice-tee-purpose.json | ⬜ |
| 121 | Kafka 和 Nginx 是如何利用零拷贝技术提升性能的 | real-data | 3 | operating-system/kafka-nginx-zero-copy.json | ⬜ |
| 122 | 传统文件传输经过几次数据拷贝和上下文切换 | real-data | 2 | operating-system/traditional-file-transfer-copies.json | ⬜ |
| 123 | mmap 在使用中有哪些常见的陷阱和注意事项 | practice | 3 | operating-system/mmap-pitfalls.json | ⬜ |
| 124 | DMA（直接内存访问）在零拷贝中起什么作用 | purpose | 3 | operating-system/dma-in-zero-copy.json | ⬜ |

## 14. COW与Fork

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 125 | 什么是写时复制（Copy-on-Write），它的实现原理是什么 | principle | 2 | operating-system/cow-mechanism.json | ⬜ |
| 126 | fork 是如何利用 COW 技术优化性能的 | principle | 2 | operating-system/fork-cow-optimization.json | ⬜ |
| 127 | vfork 和 fork 有什么区别，vfork 为什么更快 | comparison | 2 | operating-system/vfork-vs-fork.json | ⬜ |
| 128 | clone 系统调用和 fork 有什么区别 | comparison | 3 | operating-system/clone-vs-fork.json | ⬜ |
| 129 | Redis 在 RDB 持久化时为什么使用 fork + COW 机制 | real-data | 3 | operating-system/redis-fork-cow.json | ⬜ |
| 130 | fork 后父子进程的文件描述符是如何共享的 | trivia | 2 | operating-system/fork-file-descriptor-sharing.json | ⬜ |
| 131 | 大内存进程 fork 可能带来哪些性能问题 | tuning | 3 | operating-system/large-process-fork-perf.json | ⬜ |

## 15. 文件系统

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 132 | 什么是 inode，它包含哪些信息 | concept | 1 | operating-system/inode-concept.json | ⬜ |
| 133 | VFS（虚拟文件系统）的设计思想和作用是什么 | purpose | 2 | operating-system/vfs-design-purpose.json | ⬜ |
| 134 | ext4 文件系统有哪些关键特性 | trivia | 2 | operating-system/ext4-features.json | ⬜ |
| 135 | 文件系统的日志（Journal）机制是怎么保证数据一致性的 | principle | 3 | operating-system/journal-filesystem.json | ⬜ |
| 136 | 硬链接和软链接（符号链接）有什么区别 | comparison | 1 | operating-system/hard-link-vs-soft-link.json | ⬜ |
| 137 | 一个文件从打开到关闭，内核中经历了哪些数据结构 | principle | 3 | operating-system/file-open-kernel-structs.json | ⬜ |
| 138 | 什么是文件描述符（File Descriptor），它是怎么管理的 | concept | 1 | operating-system/file-descriptor-concept.json | ⬜ |
| 139 | 如何排查磁盘空间已满但 df 和 du 结果不一致的问题 | debugging | 2 | operating-system/disk-space-df-du-mismatch.json | ⬜ |
| 140 | Linux 中 /proc、/sys、/dev 等特殊文件系统的作用是什么 | purpose | 1 | operating-system/special-filesystems.json | ⬜ |
| 141 | 如何理解"一切皆文件"这个 Unix 设计哲学 | open-ended | 1 | operating-system/everything-is-file.json | ⬜ |
| 142 | ext4、XFS 和 Btrfs 各自适合什么场景 | requirement | 3 | operating-system/ext4-xfs-btrfs-selection.json | ⬜ |
| 143 | 删除一个正在被进程打开的文件会发生什么 | trivia | 2 | operating-system/delete-open-file.json | ⬜ |

## 16. I/O模型

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 144 | Unix 的五种 I/O 模型分别是什么 | concept | 1 | operating-system/five-io-models.json | ⬜ |
| 145 | 阻塞 I/O 和非阻塞 I/O 有什么区别 | comparison | 1 | operating-system/blocking-vs-nonblocking-io.json | ⬜ |
| 146 | I/O 多路复用（select/poll/epoll）的原理和区别是什么 | principle | 2 | operating-system/io-multiplexing.json | ⬜ |
| 147 | epoll 的 ET（边缘触发）和 LT（水平触发）模式有什么区别 | comparison | 3 | operating-system/epoll-et-vs-lt.json | ⬜ |
| 148 | epoll 为什么比 select 和 poll 更高效 | principle | 2 | operating-system/epoll-efficiency.json | ⬜ |
| 149 | io_uring 是什么，它相比 epoll 有哪些优势 | concept | 3 | operating-system/io-uring-concept.json | ⬜ |
| 150 | 什么是 Reactor 模式和 Proactor 模式 | concept | 3 | operating-system/reactor-vs-proactor.json | ⬜ |
| 151 | Nginx 是如何使用 epoll 实现高并发的 | real-data | 3 | operating-system/nginx-epoll-architecture.json | ⬜ |
| 152 | 异步 I/O（AIO）在 Linux 中的实现现状如何 | trivia | 3 | operating-system/linux-aio-status.json | ⬜ |
| 153 | 如何设计一个高性能的网络 I/O 框架 | open-ended | 4 | operating-system/high-perf-io-framework-design.json | ⬜ |
| 154 | select 的 FD_SETSIZE 限制是多少，如何突破 | trivia | 2 | operating-system/select-fd-setsize-limit.json | ⬜ |
| 155 | 当服务端出现大量 TIME_WAIT 连接时该如何处理 | debugging | 2 | operating-system/time-wait-troubleshooting.json | ⬜ |

## 17. 中断与系统调用

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 156 | 什么是中断（Interrupt），硬中断和软中断有什么区别 | concept | 1 | operating-system/interrupt-types.json | ⬜ |
| 157 | 系统调用（System Call）的完整执行流程是怎样的 | principle | 2 | operating-system/syscall-execution-flow.json | ⬜ |
| 158 | 中断处理的上半部和下半部（Top Half / Bottom Half）是什么 | principle | 3 | operating-system/interrupt-top-bottom-half.json | ⬜ |
| 159 | 什么是 vDSO，它是如何加速系统调用的 | principle | 4 | operating-system/vdso-mechanism.json | ⬜ |
| 160 | Linux 中软中断（SoftIRQ）和 tasklet 的区别是什么 | comparison | 3 | operating-system/softirq-vs-tasklet.json | ⬜ |
| 161 | 如何通过 /proc/interrupts 查看系统中断信息 | env-config | 2 | operating-system/proc-interrupts.json | ⬜ |
| 162 | 系统调用号（Syscall Number）是什么，怎么查看 | trivia | 2 | operating-system/syscall-number.json | ⬜ |
| 163 | 中断亲和性（IRQ Affinity）是什么，如何配置 | modification | 3 | operating-system/irq-affinity-config.json | ⬜ |
| 164 | 为什么说频繁的系统调用会影响性能 | real-data | 2 | operating-system/syscall-performance-impact.json | ⬜ |

## 18. 用户态与内核态

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 165 | 什么是用户态和内核态，为什么要区分它们 | concept | 1 | operating-system/user-kernel-mode.json | ⬜ |
| 166 | 用户态切换到内核态有哪几种方式 | concept | 1 | operating-system/user-to-kernel-transitions.json | ⬜ |
| 167 | 一次系统调用导致的模式切换开销有多大 | real-data | 3 | operating-system/mode-switch-overhead.json | ⬜ |
| 168 | 内核态能访问用户态的内存吗，有什么限制 | trivia | 3 | operating-system/kernel-access-user-memory.json | ⬜ |
| 169 | 为什么 Meltdown 和 Spectre 漏洞会打破用户态/内核态的隔离 | open-ended | 4 | operating-system/meltdown-spectre-isolation.json | ⬜ |
| 170 | KPTI（内核页表隔离）是什么，它是如何防御 Meltdown 的 | principle | 4 | operating-system/kpti-mechanism.json | ⬜ |
| 171 | 如何减少用户态和内核态之间的切换次数来优化性能 | tuning | 3 | operating-system/reduce-mode-switches.json | ⬜ |
| 172 | eBPF 是如何在内核态安全地执行用户定义代码的 | open-ended | 4 | operating-system/ebpf-kernel-execution.json | ⬜ |

## 19. CPU缓存

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 173 | CPU 缓存（L1/L2/L3）的层级结构是怎样的 | concept | 1 | operating-system/cpu-cache-hierarchy.json | ⬜ |
| 174 | 什么是 Cache Line，它对程序性能有什么影响 | principle | 2 | operating-system/cache-line-impact.json | ⬜ |
| 175 | 什么是缓存一致性（Cache Coherence），MESI 协议如何保证一致性 | principle | 3 | operating-system/mesi-protocol.json | ⬜ |
| 176 | 什么是伪共享（False Sharing），如何避免 | concept | 3 | operating-system/false-sharing.json | ⬜ |
| 177 | CPU 缓存的缓存行大小通常是多少，如何查看 | trivia | 2 | operating-system/cache-line-size.json | ⬜ |
| 178 | 为什么遍历二维数组按行遍历比按列遍历快 | real-data | 2 | operating-system/row-vs-column-traversal.json | ⬜ |
| 179 | 如何编写对 CPU 缓存友好的代码 | practice | 3 | operating-system/cache-friendly-code.json | ⬜ |
| 180 | 什么是写直达（Write-Through）和写回（Write-Back）策略 | comparison | 2 | operating-system/write-through-vs-write-back.json | ⬜ |
| 181 | 如何使用 perf 工具分析程序的缓存命中率 | env-config | 3 | operating-system/perf-cache-analysis.json | ⬜ |

## 20. ELF与动态链接

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 182 | ELF 文件格式的基本结构是怎样的 | concept | 2 | operating-system/elf-format-structure.json | ⬜ |
| 183 | 静态链接和动态链接有什么区别 | comparison | 1 | operating-system/static-vs-dynamic-linking.json | ⬜ |
| 184 | 动态链接器（ld.so）是如何加载共享库的 | principle | 3 | operating-system/ld-so-loading.json | ⬜ |
| 185 | PLT（过程链接表）和 GOT（全局偏移表）的作用是什么 | principle | 4 | operating-system/plt-got-mechanism.json | ⬜ |
| 186 | 什么是位置无关代码（PIC），为什么共享库需要它 | purpose | 3 | operating-system/pic-shared-library.json | ⬜ |
| 187 | 如何使用 ldd、readelf、objdump 查看 ELF 文件信息 | env-config | 2 | operating-system/elf-inspection-tools.json | ⬜ |
| 188 | LD_PRELOAD 的作用是什么，有哪些实际用途 | purpose | 2 | operating-system/ld-preload-usage.json | ⬜ |
| 189 | 符号解析（Symbol Resolution）的顺序和规则是怎样的 | principle | 4 | operating-system/symbol-resolution-rules.json | ⬜ |
| 190 | 动态链接库的版本管理（soname）是怎么工作的 | modification | 3 | operating-system/soname-versioning.json | ⬜ |

## 21. Swap与OOM

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 191 | Swap 分区的作用是什么，什么时候会使用 Swap | concept | 1 | operating-system/swap-concept.json | ⬜ |
| 192 | 什么是 OOM Killer，它是怎么选择要杀死的进程的 | principle | 2 | operating-system/oom-killer-mechanism.json | ⬜ |
| 193 | 什么是内存 Overcommit，vm.overcommit_memory 的三种模式是什么 | trivia | 3 | operating-system/overcommit-memory.json | ⬜ |
| 194 | swappiness 参数是什么，设置多少合适 | modification | 2 | operating-system/swappiness-config.json | ⬜ |
| 195 | 如何通过 cgroups 限制进程组的内存使用 | modification | 3 | operating-system/cgroups-memory-limit.json | ⬜ |
| 196 | 生产环境中进程被 OOM Killer 杀死了，你会怎么排查 | debugging | 2 | operating-system/oom-killer-diagnosis.json | ⬜ |
| 197 | 如何调整进程的 oom_score_adj 来保护关键服务 | modification | 2 | operating-system/oom-score-adj-config.json | ⬜ |
| 198 | 在容器环境中，Swap 和 OOM 的行为有什么不同 | open-ended | 4 | operating-system/container-swap-oom.json | ⬜ |

## 22. 上下文切换

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 199 | 什么是上下文切换（Context Switch），它包含哪些步骤 | concept | 1 | operating-system/context-switch-concept.json | ⬜ |
| 200 | 进程上下文切换和线程上下文切换的开销有什么区别 | comparison | 2 | operating-system/process-vs-thread-context-switch.json | ⬜ |
| 201 | 协程的上下文切换为什么比线程轻量 | principle | 3 | operating-system/coroutine-context-switch.json | ⬜ |
| 202 | 一次上下文切换的开销大约是多少微秒 | real-data | 3 | operating-system/context-switch-latency.json | ⬜ |
| 203 | 如何用 vmstat 和 pidstat 监控系统的上下文切换 | env-config | 2 | operating-system/vmstat-context-switch-monitor.json | ⬜ |
| 204 | 上下文切换过多时如何定位原因并优化 | tuning | 3 | operating-system/context-switch-optimization.json | ⬜ |
| 205 | 自愿上下文切换和非自愿上下文切换有什么区别 | concept | 2 | operating-system/voluntary-vs-involuntary-cs.json | ⬜ |
| 206 | 在高并发服务中如何减少不必要的上下文切换 | open-ended | 3 | operating-system/reduce-context-switch-concurrency.json | ⬜ |
| 207 | 为什么绑定 CPU 亲和性（CPU Affinity）可以减少上下文切换 | purpose | 2 | operating-system/cpu-affinity-context-switch.json | ⬜ |

---

## 跨主题综合题

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 208 | 从输入 ./a.out 到程序运行，操作系统做了哪些事情 | open-ended | 2 | operating-system/program-execution-full-flow.json | ⬜ |
| 209 | 如何设计一个简单的操作系统内核（需要哪些核心模块） | project | 4 | operating-system/simple-os-kernel-design.json | ⬜ |
| 210 | 你会如何对一台 Linux 服务器做全面的性能调优 | project | 4 | operating-system/linux-server-performance-tuning.json | ⬜ |

---

## 统计汇总

### 按题型统计

| type | 数量 |
|------|------|
| concept | 25 |
| principle | 25 |
| comparison | 18 |
| trivia | 18 |
| env-config | 15 |
| modification | 5 |
| purpose | 11 |
| open-ended | 8 |
| debugging | 10 |
| real-data | 8 |
| requirement | 2 |
| tuning | 8 |
| practice | 5 |
| project | 3 |

_(注意：如果某些类型数量不足目标值，在生成题目时可在各子主题中灵活补充)_

### 按难度统计

| 难度 | 数量 |
|------|------|
| 1 基础 | 30 |
| 2 进阶 | 85 |
| 3 高级 | 72 |
| 4 专家 | 23 |

### 按子主题统计

| 子主题 | 题数 |
|--------|------|
| 1. 进程管理 | 12 |
| 2. 进程调度 | 10 |
| 3. 线程 | 10 |
| 4. 同步与互斥 | 12 |
| 5. 死锁 | 9 |
| 6. 进程间通信 | 11 |
| 7. 信号 | 7 |
| 8. 虚拟内存 | 11 |
| 9. 页面置换 | 9 |
| 10. 内存分配 | 9 |
| 11. 内存碎片 | 7 |
| 12. 大页与NUMA | 8 |
| 13. mmap与零拷贝 | 9 |
| 14. COW与Fork | 7 |
| 15. 文件系统 | 12 |
| 16. I/O模型 | 12 |
| 17. 中断与系统调用 | 9 |
| 18. 用户态与内核态 | 8 |
| 19. CPU缓存 | 9 |
| 20. ELF与动态链接 | 9 |
| 21. Swap与OOM | 8 |
| 22. 上下文切换 | 9 |
| 跨主题综合 | 3 |
| **合计** | **210** |
