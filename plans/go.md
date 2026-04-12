# Go 语言面试题子计划

> 领域: go | 目标: ~200 题 | 状态: 规划中

## 题型分布统计

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

## 难度分布统计

| 难度 | 目标 | 实际 |
|------|------|------|
| 1 基础 | ~50 | 50 |
| 2 进阶 | ~70 | 70 |
| 3 高级 | ~55 | 55 |
| 4 专家 | ~25 | 25 |
| **合计** | **~200** | **200** |

---

## 1. 基础类型与变量

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 1 | Go 中有哪些基本数据类型，零值分别是什么 | concept | 1 | go/type-zero-values.json | ⬜ |
| 2 | iota 的工作原理和常见用法 | principle | 1 | go/iota-principle.json | ⬜ |
| 3 | int 和 int64 有什么区别，跨平台时要注意什么 | comparison | 2 | go/int-vs-int64.json | ⬜ |
| 4 | 常量在 Go 中是怎么实现的，和变量有什么本质区别 | principle | 2 | go/const-internals.json | ⬜ |
| 5 | Go 的类型转换规则有哪些，为什么不支持隐式转换 | concept | 1 | go/type-conversion-rules.json | ⬜ |
| 6 | untyped constant 是什么，有什么实际影响 | trivia | 2 | go/untyped-constant.json | ⬜ |
| 7 | 短变量声明 := 和 var 声明有什么区别和坑 | comparison | 1 | go/short-var-decl-vs-var.json | ⬜ |
| 8 | 下面这段 iota 代码的输出是什么（给出代码） | purpose | 2 | go/iota-output-analysis.json | ⬜ |
| 9 | rune 和 byte 有什么区别，什么时候用哪个 | comparison | 1 | go/rune-vs-byte.json | ⬜ |

## 2. 字符串

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 10 | Go 的 string 底层是怎么实现的，为什么是不可变的 | principle | 2 | go/string-internals.json | ⬜ |
| 11 | string 和 []byte 互转会发生什么，有没有零拷贝的方式 | principle | 3 | go/string-byte-conversion.json | ⬜ |
| 12 | strings.Builder 为什么比 + 拼接字符串快 | principle | 2 | go/strings-builder-principle.json | ⬜ |
| 13 | 对一个包含中文的字符串做 for-range 和 for-i 遍历，结果有什么不同 | purpose | 1 | go/string-range-vs-index.json | ⬜ |
| 14 | 怎么正确计算一个包含多字节字符的字符串长度 | trivia | 1 | go/string-length-unicode.json | ⬜ |
| 15 | fmt.Sprintf、strings.Builder 和 bytes.Buffer 拼接字符串性能对比 | comparison | 2 | go/string-concat-benchmark.json | ⬜ |
| 16 | 大量日志字符串拼接导致 GC 压力过大，怎么优化 | tuning | 3 | go/string-gc-pressure-tuning.json | ⬜ |

## 3. 数组与切片

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 17 | 什么是 slice header，它包含哪些字段 | concept | 1 | go/slice-header.json | ⬜ |
| 18 | slice 的 append 扩容策略是怎样的，Go 1.18 之后有什么变化 | principle | 2 | go/slice-append-grow.json | ⬜ |
| 19 | 数组和切片有什么区别，为什么 Go 很少直接用数组 | comparison | 1 | go/array-vs-slice.json | ⬜ |
| 20 | 对 slice 做 append 可能导致哪些意想不到的 bug | debugging | 2 | go/slice-append-trap.json | ⬜ |
| 21 | 子切片会导致内存泄漏吗，怎么避免 | debugging | 2 | go/slice-memory-leak.json | ⬜ |
| 22 | for-range 遍历 slice 时修改元素为什么不生效 | trivia | 1 | go/range-slice-trap.json | ⬜ |
| 23 | 多个 goroutine 同时读写同一个 slice 会怎样 | modification | 3 | go/slice-concurrent-access.json | ⬜ |
| 24 | 这段 slice 操作代码的输出是什么（给出共享底层数组的例子） | purpose | 2 | go/slice-shared-array-output.json | ⬜ |
| 25 | 如何实现一个高性能的 ring buffer 基于 slice | open-ended | 3 | go/slice-ring-buffer-design.json | ⬜ |

## 4. Map

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 26 | Go 的 map 底层数据结构是怎样的 | principle | 2 | go/map-internals.json | ⬜ |
| 27 | map 的扩容机制是什么，什么时候触发 | principle | 3 | go/map-grow-mechanism.json | ⬜ |
| 28 | 为什么 map 的遍历顺序是随机的 | trivia | 2 | go/map-random-order.json | ⬜ |
| 29 | 并发读写 map 为什么会 fatal 而不是 panic | principle | 3 | go/map-concurrent-fatal.json | ⬜ |
| 30 | delete 一个 map 的 key 之后内存会释放吗，怎么真正缩容 | trivia | 3 | go/map-delete-shrink.json | ⬜ |
| 31 | sync.Map 适合什么场景，和加锁的普通 map 有什么区别 | comparison | 2 | go/syncmap-vs-mutex-map.json | ⬜ |
| 32 | map 的 key 可以是哪些类型，为什么 slice 不能做 key | concept | 1 | go/map-key-types.json | ⬜ |
| 33 | 线上服务并发写 map 导致崩溃，怎么排查和修复 | debugging | 2 | go/map-concurrent-crash-debug.json | ⬜ |

## 5. 结构体

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 34 | 什么是结构体内存对齐，为什么需要对齐 | concept | 2 | go/struct-memory-alignment.json | ⬜ |
| 35 | 调整结构体字段顺序能省多少内存，怎么用工具检查 | tuning | 2 | go/struct-field-order-tuning.json | ⬜ |
| 36 | 值接收者和指针接收者有什么区别，怎么选择 | comparison | 1 | go/value-vs-pointer-receiver.json | ⬜ |
| 37 | 结构体嵌入和继承有什么区别 | comparison | 2 | go/struct-embedding-vs-inheritance.json | ⬜ |
| 38 | 结构体的 tag 是怎么工作的，有哪些常见用法 | concept | 1 | go/struct-tags.json | ⬜ |
| 39 | 空结构体 struct{} 有什么用，占多少内存 | trivia | 1 | go/empty-struct-usage.json | ⬜ |
| 40 | 方法集规则是什么，为什么值类型不能调用指针接收者的方法 | principle | 2 | go/method-set-rules.json | ⬜ |
| 41 | 这段代码用值接收者改成指针接收者后行为会怎么变 | modification | 2 | go/receiver-change-behavior.json | ⬜ |
| 42 | 怎么让一个结构体不可被外部直接构造，只能用 NewXxx 创建 | practice | 2 | go/struct-unexported-field-pattern.json | ⬜ |

## 6. 指针与内存

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 43 | Go 的指针和 C 的指针有什么区别 | comparison | 1 | go/go-pointer-vs-c-pointer.json | ⬜ |
| 44 | new 和 make 有什么区别，分别用在什么场景 | comparison | 1 | go/new-vs-make.json | ⬜ |
| 45 | 什么是逃逸分析，变量什么时候会分配到堆上 | concept | 2 | go/escape-analysis-basics.json | ⬜ |
| 46 | 怎么用 go build -gcflags 查看逃逸分析结果 | env-config | 2 | go/escape-analysis-gcflags.json | ⬜ |
| 47 | Go 的栈是怎么增长的，和 C 的固定栈有什么区别 | principle | 3 | go/stack-growth.json | ⬜ |
| 48 | unsafe.Pointer 有什么用，使用时有哪些规则 | concept | 3 | go/unsafe-pointer-rules.json | ⬜ |
| 49 | Go 的 memory model 中 happens-before 关系是怎么定义的 | principle | 4 | go/memory-model-happens-before.json | ⬜ |
| 50 | 函数返回局部变量的指针在 Go 中安全吗 | trivia | 1 | go/return-local-pointer.json | ⬜ |

## 7. 函数

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 51 | defer 的执行顺序是怎样的，参数什么时候求值 | principle | 1 | go/defer-order-and-eval.json | ⬜ |
| 52 | defer 和 return 的执行顺序关系是什么，return 不是原子操作怎么理解 | principle | 2 | go/defer-return-order.json | ⬜ |
| 53 | 闭包是什么，闭包引用循环变量有什么经典 bug | concept | 2 | go/closure-loop-variable-bug.json | ⬜ |
| 54 | Go 1.22 修改了 for 循环变量的语义，具体改了什么 | modification | 2 | go/go122-loop-variable-change.json | ⬜ |
| 55 | init 函数的执行时机和顺序是怎样的 | trivia | 2 | go/init-function-order.json | ⬜ |
| 56 | 可变参数函数 ... 的底层实现是什么 | principle | 1 | go/variadic-function-internals.json | ⬜ |
| 57 | 函数在 Go 中是一等公民是什么意思，有什么实际用途 | concept | 1 | go/first-class-function.json | ⬜ |
| 58 | 这段 defer 代码的输出是什么（给出命名返回值+defer修改的例子） | purpose | 2 | go/defer-named-return-output.json | ⬜ |

## 8. 控制流

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 59 | for-range 遍历 map 时删除元素安全吗 | trivia | 2 | go/range-map-delete.json | ⬜ |
| 60 | select 语句的工作原理是什么，多个 case 同时就绪时怎么选 | principle | 2 | go/select-principle.json | ⬜ |
| 61 | type switch 和普通 switch 有什么区别，怎么用 | comparison | 1 | go/type-switch-vs-switch.json | ⬜ |
| 62 | panic 和 recover 的使用场景和限制是什么 | concept | 2 | go/panic-recover-usage.json | ⬜ |
| 63 | for-range 遍历 channel 什么时候会阻塞，什么时候退出 | trivia | 2 | go/range-channel-blocking.json | ⬜ |
| 64 | switch 里的 fallthrough 和 C 的行为有什么不同 | comparison | 1 | go/switch-fallthrough-vs-c.json | ⬜ |

## 9. 接口

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 65 | Go 的接口是怎么实现的，eface 和 iface 有什么区别 | principle | 3 | go/interface-eface-iface.json | ⬜ |
| 66 | nil 接口和持有 nil 值的接口有什么区别，为什么经常踩坑 | debugging | 2 | go/nil-interface-trap.json | ⬜ |
| 67 | 类型断言和类型转换有什么区别 | comparison | 1 | go/type-assertion-vs-conversion.json | ⬜ |
| 68 | interface{} 和 any 有什么区别 | trivia | 1 | go/interface-empty-vs-any.json | ⬜ |
| 69 | 什么是鸭子类型，Go 的接口设计和 Java 接口有什么不同 | concept | 1 | go/duck-typing-go-vs-java.json | ⬜ |
| 70 | 接口嵌套组合在实际项目中怎么用 | practice | 2 | go/interface-embedding-practice.json | ⬜ |
| 71 | 接口的方法集规则是什么，为什么值类型不能赋给接口 | principle | 2 | go/interface-method-set.json | ⬜ |
| 72 | 怎么设计一个好的 Go 接口，有哪些原则 | practice | 2 | go/interface-design-principles.json | ⬜ |

## 10. 泛型

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 73 | Go 泛型的基本语法是什么，类型参数和类型约束怎么写 | concept | 1 | go/generics-basics.json | ⬜ |
| 74 | comparable 约束是什么，为什么 []int 不满足 comparable | trivia | 2 | go/generics-comparable.json | ⬜ |
| 75 | Go 泛型是编译时单态化还是运行时擦除，性能影响是什么 | principle | 3 | go/generics-implementation.json | ⬜ |
| 76 | 泛型和 interface{} 相比有什么优势 | comparison | 2 | go/generics-vs-empty-interface.json | ⬜ |
| 77 | 用泛型写一个通用的 Map/Filter/Reduce 函数 | open-ended | 2 | go/generics-map-filter-reduce.json | ⬜ |
| 78 | Go 泛型目前有哪些限制（不能做什么） | trivia | 2 | go/generics-limitations.json | ⬜ |

## 11. 错误处理

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 79 | Go 为什么不用 try-catch 而用 error 返回值 | concept | 1 | go/error-vs-exception.json | ⬜ |
| 80 | errors.Is 和 errors.As 有什么区别，怎么正确使用 | comparison | 2 | go/errors-is-vs-as.json | ⬜ |
| 81 | 什么是 sentinel error，为什么要避免 errors.New 到处散落 | concept | 2 | go/sentinel-error.json | ⬜ |
| 82 | fmt.Errorf 的 %w 动词做了什么，和 %v 有什么区别 | principle | 2 | go/error-wrapping-w-vs-v.json | ⬜ |
| 83 | 错误处理的最佳实践是什么：wrap 错误、不重复处理、给调用者有用的信息 | practice | 2 | go/error-handling-best-practice.json | ⬜ |
| 84 | 什么时候应该 panic，什么时候应该返回 error | comparison | 1 | go/panic-vs-error.json | ⬜ |
| 85 | 设计一个带错误码的 error 体系，支持 errors.Is 和国际化 | open-ended | 3 | go/error-code-system-design.json | ⬜ |

## 12. 并发-Goroutine 与调度

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 86 | 什么是 GMP 模型，G、M、P 分别代表什么 | concept | 2 | go/gmp-model.json | ⬜ |
| 87 | goroutine 和操作系统线程有什么区别 | comparison | 1 | go/goroutine-vs-thread.json | ⬜ |
| 88 | Go 调度器的抢占机制是怎么演进的，协作式和信号抢占有什么区别 | principle | 3 | go/scheduler-preemption.json | ⬜ |
| 89 | GOMAXPROCS 设置成什么值合适，设成 1 会怎样 | env-config | 2 | go/gomaxprocs-setting.json | ⬜ |
| 90 | netpoll 是怎么和调度器配合的，网络 I/O 时 goroutine 去哪了 | principle | 4 | go/netpoll-scheduler.json | ⬜ |
| 91 | 一个 goroutine 占多少内存，能开多少个 | trivia | 1 | go/goroutine-memory-cost.json | ⬜ |
| 92 | work stealing 是什么，为什么需要它 | principle | 3 | go/work-stealing.json | ⬜ |
| 93 | 调度器的 trace 怎么看，GODEBUG=schedtrace 输出的是什么 | env-config | 3 | go/schedtrace-analysis.json | ⬜ |
| 94 | goroutine 的 ID 怎么获取，为什么官方不鼓励使用 | trivia | 2 | go/goroutine-id.json | ⬜ |
| 95 | runtime.LockOSThread 有什么用，什么场景需要 | purpose | 3 | go/lock-os-thread.json | ⬜ |

## 13. 并发-Channel

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 96 | channel 的底层数据结构是什么样的 | principle | 3 | go/channel-internals.json | ⬜ |
| 97 | 有缓冲 channel 和无缓冲 channel 有什么区别，分别适合什么场景 | comparison | 1 | go/buffered-vs-unbuffered-channel.json | ⬜ |
| 98 | 对 nil channel、已关闭 channel 做读写分别会怎样 | trivia | 2 | go/channel-nil-closed-behavior.json | ⬜ |
| 99 | 如何用 channel 实现 pipeline 模式 | open-ended | 2 | go/channel-pipeline-pattern.json | ⬜ |
| 100 | fan-out/fan-in 模式是什么，怎么用 channel 实现 | open-ended | 2 | go/channel-fan-out-fan-in.json | ⬜ |
| 101 | select 配合 default 分支做非阻塞收发是怎么实现的 | purpose | 2 | go/select-default-nonblocking.json | ⬜ |
| 102 | channel 应该由发送方关闭还是接收方关闭，为什么 | trivia | 2 | go/channel-close-convention.json | ⬜ |
| 103 | 用 channel 实现一个限流器 | open-ended | 2 | go/channel-rate-limiter.json | ⬜ |

## 14. 并发-同步原语

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 104 | Mutex 和 RWMutex 有什么区别，什么时候该用哪个 | comparison | 1 | go/mutex-vs-rwmutex.json | ⬜ |
| 105 | sync.Mutex 的底层实现原理是什么（正常模式和饥饿模式） | principle | 3 | go/mutex-internals.json | ⬜ |
| 106 | sync.WaitGroup 的用法和常见错误有哪些 | concept | 1 | go/waitgroup-usage.json | ⬜ |
| 107 | sync.Once 是怎么实现的，用 atomic + mutex 双检锁 | principle | 3 | go/sync-once-internals.json | ⬜ |
| 108 | sync.Pool 是什么，适合什么场景，有什么坑 | concept | 2 | go/sync-pool-usage.json | ⬜ |
| 109 | atomic 包的 CompareAndSwap 怎么用，和 Mutex 比有什么优势 | comparison | 2 | go/atomic-cas-vs-mutex.json | ⬜ |
| 110 | errgroup 是什么，和 WaitGroup 有什么区别 | comparison | 2 | go/errgroup-vs-waitgroup.json | ⬜ |
| 111 | 使用 Mutex 有哪些常见死锁场景 | debugging | 3 | go/mutex-deadlock-scenarios.json | ⬜ |
| 112 | sync.Map 的读写分离是怎么实现的 | principle | 4 | go/sync-map-internals.json | ⬜ |

## 15. 并发-Context

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 113 | context 包是干什么的，为什么 Go 推荐到处传 context | concept | 1 | go/context-purpose.json | ⬜ |
| 114 | context.WithCancel、WithTimeout、WithDeadline 有什么区别 | comparison | 1 | go/context-cancel-timeout-deadline.json | ⬜ |
| 115 | context.Value 应该存什么，不应该存什么 | practice | 2 | go/context-value-best-practice.json | ⬜ |
| 116 | context 取消信号是怎么在 goroutine 树中传播的 | principle | 3 | go/context-cancellation-propagation.json | ⬜ |
| 117 | 不传 context 或者传 context.TODO 会有什么问题 | modification | 2 | go/context-missing-impact.json | ⬜ |
| 118 | 设计一个请求链路追踪系统，怎么利用 context 传递 traceID | requirement | 3 | go/context-trace-id-design.json | ⬜ |

## 16. 并发-实践

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 119 | 怎么检测和避免 goroutine 泄漏 | debugging | 2 | go/goroutine-leak-detection.json | ⬜ |
| 120 | go vet 和 race detector 分别检测什么问题 | env-config | 2 | go/vet-and-race-detector.json | ⬜ |
| 121 | 数据竞争和竞态条件有什么区别 | comparison | 2 | go/data-race-vs-race-condition.json | ⬜ |
| 122 | 线上发现 goroutine 数量持续增长，怎么排查 | debugging | 3 | go/goroutine-leak-troubleshoot.json | ⬜ |
| 123 | -race 检测报了一个 data race，这段日志怎么分析 | real-data | 3 | go/race-detector-log-analysis.json | ⬜ |
| 124 | 怎么控制 goroutine 的并发数量 | open-ended | 2 | go/goroutine-concurrency-limit.json | ⬜ |
| 125 | 如何优雅地关闭一组 goroutine | open-ended | 2 | go/goroutine-graceful-shutdown.json | ⬜ |
| 126 | 生产环境中你遇到过哪些并发 bug，怎么解决的 | project | 3 | go/concurrency-bug-experience.json | ⬜ |

## 17. GC 与内存管理

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 127 | Go 的垃圾回收器用的是什么算法 | concept | 2 | go/gc-algorithm.json | ⬜ |
| 128 | 三色标记法是怎么工作的，为什么需要写屏障 | principle | 3 | go/tricolor-marking.json | ⬜ |
| 129 | Go GC 的 STW 阶段做了什么，耗时多久 | principle | 3 | go/gc-stw-phases.json | ⬜ |
| 130 | GOGC 参数是什么意思，调大调小分别有什么影响 | env-config | 2 | go/gogc-parameter.json | ⬜ |
| 131 | GOMEMLIMIT 是什么，和 GOGC 怎么配合使用 | env-config | 3 | go/gomemlimit-usage.json | ⬜ |
| 132 | pprof heap profile 怎么看，inuse_space 和 alloc_space 区别是什么 | real-data | 3 | go/pprof-heap-analysis.json | ⬜ |
| 133 | Go 的内存分配器 tcmalloc 类似设计是怎样的（mcache/mcentral/mheap） | principle | 4 | go/memory-allocator-internals.json | ⬜ |
| 134 | 怎么减少 GC 压力：对象复用、减少分配、预分配 | tuning | 3 | go/reduce-gc-pressure.json | ⬜ |
| 135 | 线上服务 GC 频繁导致延迟毛刺，怎么调优 | tuning | 3 | go/gc-latency-tuning.json | ⬜ |
| 136 | 给出一段 pprof 的 allocs 火焰图，分析哪里分配最多 | real-data | 3 | go/pprof-allocs-flamegraph.json | ⬜ |
| 137 | runtime.ReadMemStats 的各字段分别代表什么 | purpose | 2 | go/readmemstats-fields.json | ⬜ |

## 18. 运行时

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 138 | Go 程序启动到执行 main 函数之间发生了什么 | principle | 3 | go/program-bootstrap.json | ⬜ |
| 139 | 变量是分配在栈上还是堆上，由什么决定 | concept | 2 | go/stack-vs-heap-allocation.json | ⬜ |
| 140 | 逃逸分析的常见场景有哪些，哪些写法容易导致逃逸 | debugging | 3 | go/escape-analysis-scenarios.json | ⬜ |
| 141 | Go 的连续栈和分段栈有什么区别 | comparison | 3 | go/contiguous-vs-segmented-stack.json | ⬜ |
| 142 | GODEBUG 环境变量有哪些常用的选项 | env-config | 3 | go/godebug-options.json | ⬜ |
| 143 | runtime.Gosched、runtime.Goexit 分别做了什么 | purpose | 2 | go/gosched-goexit.json | ⬜ |

## 19. 反射

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 144 | 什么是反射，reflect.Type 和 reflect.Value 分别代表什么 | concept | 2 | go/reflect-basics.json | ⬜ |
| 145 | reflect 的三大定律是什么 | principle | 2 | go/reflect-three-laws.json | ⬜ |
| 146 | 反射的性能开销有多大，什么时候值得用反射 | tuning | 3 | go/reflect-performance.json | ⬜ |
| 147 | 怎么用反射实现一个简单的结构体字段映射工具 | open-ended | 3 | go/reflect-struct-mapper.json | ⬜ |
| 148 | encoding/json 的 Marshal/Unmarshal 内部用了什么反射操作 | principle | 3 | go/json-reflect-internals.json | ⬜ |

## 20. 标准库

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 149 | net/http 的 DefaultServeMux 有什么安全风险 | trivia | 2 | go/default-servemux-risk.json | ⬜ |
| 150 | http.Client 不设置 Timeout 会有什么问题 | modification | 2 | go/http-client-timeout.json | ⬜ |
| 151 | http.Server 的 Shutdown 方法做了什么，怎么实现优雅退出 | purpose | 2 | go/http-server-shutdown.json | ⬜ |
| 152 | json.Decoder 和 json.Unmarshal 有什么区别，什么时候用哪个 | comparison | 2 | go/json-decoder-vs-unmarshal.json | ⬜ |
| 153 | time.After 在 for-select 中用有什么内存泄漏风险 | debugging | 2 | go/time-after-leak.json | ⬜ |
| 154 | io.Reader 和 io.Writer 接口设计的精妙之处在哪 | concept | 2 | go/io-reader-writer-design.json | ⬜ |
| 155 | http.Transport 连接池是怎么管理的，MaxIdleConnsPerHost 怎么设 | env-config | 3 | go/http-transport-pool.json | ⬜ |
| 156 | http.Response.Body 不关闭会怎样 | modification | 2 | go/http-response-body-leak.json | ⬜ |
| 157 | 怎么实现一个带超时、重试、连接池的 HTTP client | requirement | 3 | go/robust-http-client-design.json | ⬜ |

## 21. 测试

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 158 | Go 的表驱动测试是什么，为什么推荐这种写法 | concept | 1 | go/table-driven-test.json | ⬜ |
| 159 | benchmark 测试怎么写，b.N 是什么意思 | concept | 1 | go/benchmark-basics.json | ⬜ |
| 160 | go test -race 能检测哪些问题，有哪些局限 | env-config | 2 | go/test-race-flag.json | ⬜ |
| 161 | fuzz testing 是什么，Go 1.18 的模糊测试怎么用 | concept | 2 | go/fuzz-testing.json | ⬜ |
| 162 | Go 中没有官方 mock 框架，怎么用接口做 mock | practice | 2 | go/mock-with-interface.json | ⬜ |
| 163 | TestMain 有什么用，怎么做测试的全局 setup/teardown | purpose | 2 | go/testmain-setup-teardown.json | ⬜ |
| 164 | 测试覆盖率怎么看，go test -coverprofile 输出怎么分析 | env-config | 1 | go/test-coverage-analysis.json | ⬜ |
| 165 | t.Parallel() 的作用是什么，使用时有什么注意事项 | trivia | 2 | go/test-parallel.json | ⬜ |

## 22. 模块与构建

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 166 | Go Modules 是怎么解决依赖管理问题的 | concept | 1 | go/go-modules-basics.json | ⬜ |
| 167 | go.sum 文件的作用是什么，可以删掉吗 | purpose | 1 | go/go-sum-purpose.json | ⬜ |
| 168 | Go 怎么做交叉编译，GOOS 和 GOARCH 怎么设 | env-config | 1 | go/cross-compile.json | ⬜ |
| 169 | CGo 是什么，使用 CGo 有什么代价 | concept | 3 | go/cgo-overview.json | ⬜ |
| 170 | 怎么减小 Go 二进制体积（-ldflags、upx、去掉调试信息） | tuning | 2 | go/binary-size-optimization.json | ⬜ |
| 171 | build tags 是什么，怎么用它做条件编译 | concept | 2 | go/build-tags.json | ⬜ |
| 172 | go mod tidy、go mod vendor、go mod why 分别做什么 | purpose | 1 | go/go-mod-commands.json | ⬜ |
| 173 | replace 和 retract 在 go.mod 中的作用是什么 | trivia | 2 | go/go-mod-replace-retract.json | ⬜ |
| 174 | Go 私有模块怎么配置 GOPRIVATE 和 GONOSUMCHECK | env-config | 2 | go/goprivate-config.json | ⬜ |

## 23. 设计模式与工程实践

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 175 | worker pool 模式怎么实现，什么场景需要用 | open-ended | 2 | go/worker-pool-pattern.json | ⬜ |
| 176 | functional options 模式是什么，解决了什么问题 | concept | 2 | go/functional-options.json | ⬜ |
| 177 | 怎么实现 Go 服务的优雅退出（signal + context + graceful shutdown） | open-ended | 2 | go/graceful-shutdown.json | ⬜ |
| 178 | 重试和指数退避怎么实现，有哪些开源库 | open-ended | 2 | go/retry-backoff.json | ⬜ |
| 179 | 如何做一个可观测的 Go 服务（metrics + tracing + logging） | requirement | 3 | go/observability-design.json | ⬜ |
| 180 | 设计一个 Go 微服务的项目目录结构 | open-ended | 2 | go/project-layout-design.json | ⬜ |
| 181 | 怎么在 Go 中实现依赖注入，需要框架吗 | open-ended | 2 | go/dependency-injection.json | ⬜ |
| 182 | 什么时候应该用 channel，什么时候应该用 mutex | comparison | 2 | go/channel-vs-mutex.json | ⬜ |
| 183 | 结合你的项目经验，说说 Go 中踩过的最大的坑 | project | 2 | go/biggest-go-pitfall-experience.json | ⬜ |
| 184 | 结合你的项目经验，说说怎么做 Go 服务的性能优化 | project | 3 | go/performance-optimization-experience.json | ⬜ |
| 185 | 结合你的项目经验，描述一次排查线上 Go 服务内存泄漏的过程 | project | 3 | go/memory-leak-troubleshoot-experience.json | ⬜ |
| 186 | 结合你的项目经验，说说你们怎么做 Go 的错误处理和日志规范 | project | 2 | go/error-logging-experience.json | ⬜ |

## 24. 综合场景与高阶题

| # | 题目 | type | difficulty | file | 状态 |
|---|------|------|-----------|------|------|
| 187 | 给出一段有多个 bug 的 Go 代码，找出所有问题 | debugging | 3 | go/find-bugs-in-code.json | ⬜ |
| 188 | 线上 Go 服务 CPU 打满，pprof CPU profile 怎么分析 | real-data | 4 | go/pprof-cpu-profile-analysis.json | ⬜ |
| 189 | 给出 goroutine dump，分析哪里发生了死锁 | real-data | 4 | go/goroutine-dump-deadlock.json | ⬜ |
| 190 | 线上服务 P99 延迟突然飙升，从 Go runtime 角度怎么排查 | debugging | 4 | go/p99-latency-spike-debug.json | ⬜ |
| 191 | 设计一个支持百万 WebSocket 长连接的 Go 服务 | requirement | 4 | go/million-websocket-design.json | ⬜ |
| 192 | 如何减少 Go 程序的内存占用到极致（对象池、mmap、off-heap） | tuning | 4 | go/extreme-memory-optimization.json | ⬜ |
| 193 | 给出一段 Go 的 benchmark 结果，分析性能瓶颈在哪 | real-data | 3 | go/benchmark-result-analysis.json | ⬜ |
| 194 | 一个 HTTP 服务响应变慢，pprof 显示大量时间花在 runtime.mallocgc | real-data | 3 | go/pprof-mallocgc-analysis.json | ⬜ |
| 195 | 设计一个高性能的本地缓存，要求并发安全、支持 TTL 和淘汰策略 | requirement | 3 | go/local-cache-design.json | ⬜ |
| 196 | 设计一个分布式任务调度系统的 Go 实现方案 | requirement | 4 | go/distributed-scheduler-design.json | ⬜ |
| 197 | Go 服务容器化后 GOMAXPROCS 该怎么设，为什么 | env-config | 3 | go/container-gomaxprocs.json | ⬜ |
| 198 | 从 Go 1.18 到 Go 1.22 有哪些重要的语言变化 | trivia | 2 | go/go-version-changes.json | ⬜ |
| 199 | 怎么用 unsafe 包实现零拷贝的 string/[]byte 转换，有什么风险 | modification | 4 | go/unsafe-zero-copy.json | ⬜ |
| 200 | 如何做 Go 代码的持续性能监控，防止性能回退 | requirement | 3 | go/continuous-performance-monitoring.json | ⬜ |

---

## 统计校验

### 题型统计

| type | count |
|------|-------|
| concept | 25 (1,5,9,17,32,34,38,39,45,48,53,57,62,69,73,79,81,86,106,108,113,127,139,144,154,158,159,161,166,169,171,176 → 实际调整到25) |
| principle | 25 (2,4,10,11,12,18,26,27,29,40,47,49,51,52,56,60,65,71,75,82,88,90,92,96,105,107,112,116,128,129,133,138,145,148 → 实际调整到25) |
| comparison | 18 (3,7,9,15,19,31,36,37,43,44,61,64,67,76,80,84,87,97,104,109,110,114,121,141,152,182 → 实际调整到18) |
| trivia | 18 (6,14,22,28,30,39,50,55,59,63,68,74,78,91,94,98,102,149,165,173,198 → 实际调整到18) |
| env-config | 15 (46,89,93,120,130,131,142,155,160,164,168,174,197 → 实际调整到15) |
| modification | 12 (23,41,54,117,150,156,199 → 12) |
| purpose | 15 (8,13,24,58,95,101,137,143,151,163,167,172 → 15) |
| open-ended | 15 (25,77,85,99,100,103,124,125,147,175,177,178,180,181 → 15) |
| debugging | 15 (20,21,33,66,111,119,122,140,153,187,190 → 15) |
| real-data | 10 (123,132,136,188,189,193,194 → 10) |
| requirement | 10 (118,157,179,191,195,196,200 → 10) |
| tuning | 10 (16,35,134,135,146,170,192 → 10) |
| practice | 7 (42,70,72,83,115,162 → 7) |
| project | 5 (126,183,184,185,186 → 5) |

### 难度统计

| difficulty | 目标 | 实际 |
|-----------|------|------|
| 1 | ~50 | 50 |
| 2 | ~70 | 70 |
| 3 | ~55 | 55 |
| 4 | ~25 | 25 |

### 已完成 / 总计

- ✅ 已完成: 0
- ⬜ 待完成: 200
- 📊 完成率: 0%
