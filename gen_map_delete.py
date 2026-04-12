import json, pathlib

data = {
    "id": "go-map-delete-shrink",
    "name": "map delete 后内存不释放的问题",
    "domain": "go",
    "description": "深入解析 Go map 在 delete 大量 key 后内存不释放的根因、bucket 机制以及真正缩容的方法",
    "version": "1.0.0",
    "questions": [
        {
            "id": "go-map-delete-shrink-q1",
            "domain": "go",
            "type": "trivia",
            "difficulty": 3,
            "tags": ["map", "delete", "内存", "缩容", "GC"],
            "title": "delete 一个 map 的 key 之后内存会释放吗，怎么真正缩容",
            "content": (
                "Go 的 map 是日常开发中使用频率最高的数据结构之一，它底层由哈希表实现，支持 O(1) 的读写操作。"
                "在 Go 的 runtime 实现里，map 的核心结构体是 `runtime.hmap`，它管理着一组 bucket（桶），"
                "每个 bucket 可以存储 8 个键值对，当 bucket 满了会通过 overflow 指针链接溢出桶。"
                "map 的使用非常简单，通过 `make(map[K]V)` 创建、用 `m[key] = value` 写入、用 `delete(m, key)` 删除。\n\n"
                "面试中经常遇到一个陷阱题：你往一个 map 里塞了几百万个 key，然后又把它们全部 delete 掉，"
                "内存会回到初始水平吗？很多人凭直觉觉得\u201cGC 会回收啊\u201d，但真实情况并非如此。"
                "下面这段代码能直观说明问题：\n\n"
                "```go\npackage main\n\nimport (\n\t\"fmt\"\n\t\"runtime\"\n)\n\n"
                "func printMemStats(tag string) {\n"
                "\tvar m runtime.MemStats\n"
                "\truntime.ReadMemStats(&m)\n"
                "\tfmt.Printf(\"[%s] Alloc = %d MB, Sys = %d MB\\n\",\n"
                "\t\ttag, m.Alloc/1024/1024, m.Sys/1024/1024)\n"
                "}\n\n"
                "func main() {\n"
                "\tprintMemStats(\"初始状态\")\n\n"
                "\tm := make(map[int]int)\n"
                "\tfor i := 0; i < 2_000_000; i++ {\n"
                "\t\tm[i] = i\n"
                "\t}\n"
                "\truntime.GC()\n"
                "\tprintMemStats(\"写入 200 万 key 后\")\n\n"
                "\tfor i := 0; i < 2_000_000; i++ {\n"
                "\t\tdelete(m, i)\n"
                "\t}\n"
                "\truntime.GC()\n"
                "\tprintMemStats(\"delete 全部 key 后\")\n\n"
                "\tm = nil\n"
                "\truntime.GC()\n"
                "\tprintMemStats(\"m = nil 后\")\n"
                "}\n```\n\n"
                "典型输出如下：\n\n"
                "```\n"
                "[初始状态]          Alloc = 0 MB, Sys = 6 MB\n"
                "[写入 200 万 key 后] Alloc = 80 MB, Sys = 89 MB\n"
                "[delete 全部 key 后] Alloc = 80 MB, Sys = 89 MB\n"
                "[m = nil 后]        Alloc = 0 MB, Sys = 89 MB\n"
                "```\n\n"
                "写入 200 万个 key 后内存涨到 80 MB 左右，delete 全部 key 后内存纹丝不动——Alloc 依然是 80 MB。"
                "只有把 map 变量置为 nil 让 GC 把整个 hmap 回收，Alloc 才降回去。"
                "这个行为在生产环境中非常容易踩坑，尤其是那些用 map 做本地缓存、然后定时清理过期 key 的服务，"
                "内存会越来越高却找不到泄漏源。请解释这背后的原因，以及在生产环境中应该如何真正实现 map 的缩容。"
            ),
            "answer": (
                "## Go map 的基础结构与工作机制\n\n"
                "要理解 delete 后内存不释放的问题，必须先搞清楚 Go map 的底层实现。"
                "Go 的 map 在 runtime 层面对应的核心结构体是 `runtime.hmap`，定义在 `src/runtime/map.go` 里（Go 1.21 基准）。"
                "hmap 包含几个关键字段：`count` 记录当前键值对数量，`B` 决定 bucket 数组的大小（bucket 数量 = 2^B），"
                "`buckets` 指向当前正在使用的 bucket 数组，`oldbuckets` 在扩容过程中指向旧的 bucket 数组。\n\n"
                "每个 bucket 的结构是 `runtime.bmap`，固定存储 8 个键值对。"
                "bmap 的头部有一个 8 字节的 tophash 数组，存放每个 slot 对应的 key 的高 8 位哈希值，用来在 bucket 内快速定位。"
                "当一个 bucket 的 8 个 slot 都满了，新的键值对不会直接触发扩容，"
                "而是先分配一个 overflow bucket 挂到当前 bucket 的 overflow 指针上，形成链表。"
                "当溢出桶过多或负载因子超过 6.5（即平均每个 bucket 存了 6.5 个键值对）时，"
                "map 才会触发扩容，把 B 加一，也就是 bucket 数量翻倍，然后把旧数据渐进式地迁移到新 bucket 数组中。\n\n"
                "map 的基本操作很直接：写入时对 key 做哈希，低 B 位决定落入哪个 bucket，高 8 位存入 tophash 用于桶内查找；"
                "读取时同样流程定位到 bucket 和 slot；delete 时——问题就出在这里了。\n\n"
                "## delete 操作到底做了什么\n\n"
                "很多人以为 `delete(m, key)` 会把对应的键值对从内存中抹掉、把 slot 空间还给操作系统。"
                "实际上 delete 做的事情极其简单：它定位到 key 所在的 bucket 和 slot 之后，"
                "把那个 slot 的 tophash 标记值设成一个特殊常量 `emptyOne`（值为 1），"
                "然后把 key 和 value 的内存清零（如果 key 或 value 包含指针的话，清零是为了让 GC 不再追踪这些指针，"
                "从而允许 key/value 指向的对象被回收），最后把 hmap 的 count 减一。"
                "整个过程中，bucket 本身的内存、bucket 数组的大小、B 的值，全部没有任何变化。\n\n"
                "你可以把 bucket 想象成一个固定大小的收纳盒。"
                "往盒子里放东西会让盒子装满，但从盒子里拿走东西不会让盒子变小——盒子还在那里占着空间，只是里面空了。"
                "delete 就是这么一个操作：它只是把盒子里某个格子标记为\u201c空\u201d，但盒子本身不会被回收，也不会被缩小。\n\n"
                "从 runtime 的源码来看（`runtime/map.go` 里的 `mapdelete` 函数），"
                "delete 的核心逻辑在找到目标 slot 后就是清标记、清数据、减 count，"
                "没有任何判断\u201c当前 map 是否太空了需要缩容\u201d的逻辑。"
                "这是 Go runtime 的一个有意为之的设计决策，不是一个 bug。\n\n"
                "## 为什么 Go 不在 delete 时自动缩容\n\n"
                "这个问题在 Go 社区已经讨论了很多年。Go team 不做自动缩容主要有几个原因。\n\n"
                "第一个原因是缩容的成本很高。"
                "缩容意味着要分配一个更小的 bucket 数组，然后把所有存活的键值对重新哈希一遍迁移过去，最后释放旧的 bucket 数组。"
                "这个操作的时间复杂度是 O(n)，对于一个存有几百万个 key 的 map 来说，缩容可能会导致一次明显的延迟尖刺。"
                "Go 的设计哲学是尽量让操作的性能可预测，一个 delete 操作如果有时候 O(1) 有时候 O(n)，"
                "这对写低延迟服务的人来说很不友好。\n\n"
                "第二个原因是很多使用场景中，map 的大小是波动的。"
                "比如一个连接池 map，高峰期有 10 万个连接，低谷期只有 1000 个。"
                "如果 delete 时自动缩容，低谷期缩小了，高峰期又要扩容，来回折腾反而更浪费。"
                "Go 团队认为让用户自己控制缩容时机比自动缩容更合理。\n\n"
                "第三个原因是 Go 的 map 扩容是渐进式的（在每次读写操作时迁移一点旧数据），"
                "如果再加上渐进式缩容，两个渐进式操作可能叠加，让 map 操作的延迟变得更加不可预测。"
                "2022 年在 GitHub issue #20135 上有过一轮关于 map shrinking 的讨论，"
                "Go team 成员 Keith Randall 回复说他们尝试过自动缩容的 prototype，但在 benchmark 中发现性能回归太多，最终搁置了。\n\n"
                "## sameSizeGrow：只整理不缩容\n\n"
                "Go 的 map 在扩容时有两种模式，这一点很多人不知道。"
                "第一种是真正的翻倍扩容（`biggerSizeGrow`），当负载因子超过 6.5 时触发，B 加一，bucket 数量翻倍。"
                "第二种是等量扩容（`sameSizeGrow`），当溢出桶的数量过多（大致标准是溢出桶数量接近正常桶数量）"
                "但负载因子没有超标时触发。"
                "等量扩容不会增加 bucket 数量，它做的事情是分配一个同样大小的新 bucket 数组，"
                "然后把旧数据重新排列进去，消除碎片化。\n\n"
                "sameSizeGrow 的设计意图正是为了应对大量 delete 之后的情况。"
                "假设你有一个 B=10（1024 个 bucket）的 map，塞满了数据后又删除了 90% 的 key，"
                "剩下的 key 可能分散在各个 bucket 的 overflow 链上。"
                "sameSizeGrow 会在下一次触发时把这些分散的 key 重新紧凑排列到正常桶中，减少 overflow 桶的数量，让后续的查找更快。"
                "但关键是：sameSizeGrow 不会减少 B 的值，也就是说 bucket 数组的大小不会变小。"
                "1024 个 bucket 整理完之后还是 1024 个 bucket，只是 overflow 桶少了。内存占用基本不会下降。\n\n"
                "所以 sameSizeGrow 解决的是碎片化导致的查找性能问题，而不是内存回收问题。"
                "面试时把这两者混淆是一个常见的错误。\n\n"
                "## 生产环境中真正缩容的方法\n\n"
                "既然 Go 的 map 不会自动缩容，那在生产环境中如何处理\u201cmap 内存只涨不降\u201d的问题？"
                "核心思路就一个：创建新 map，把存活的 key 拷贝过去，让旧 map 被 GC 回收。\n\n"
                "最直接的做法是定期重建：\n\n"
                "```go\nfunc shrinkMap(old map[string]int) map[string]int {\n"
                "\tnewMap := make(map[string]int, len(old))\n"
                "\tfor k, v := range old {\n"
                "\t\tnewMap[k] = v\n"
                "\t}\n"
                "\treturn newMap\n"
                "}\n```\n\n"
                "这里有一个关键细节：`make(map[string]int, len(old))` 会根据当前存活的 key 数量来分配 bucket，"
                "而不是按照旧 map 的 bucket 数量。"
                "如果旧 map 有 2^17 个 bucket 但只剩 1000 个 key，新 map 只会分配大约 2^8 个 bucket，"
                "内存占用从几十 MB 降到几百 KB。\n\n"
                "但在并发环境下，直接替换 map 需要加锁。"
                "如果你用的是 `sync.Map`，情况更复杂一些，因为 `sync.Map` 没有暴露 Len 方法（Go 1.23 新增了），"
                "也没有清空重建的原子操作。"
                "常见的做法是用 `sync.RWMutex` 保护一个普通 map，在需要缩容时加写锁、替换为新 map、释放写锁。\n\n"
                "另一种做法是直接把 map 置为 nil 然后重新 make：\n\n"
                "```go\nmu.Lock()\n"
                "m = nil         // 让 GC 回收整个旧 hmap 及其 bucket 数组\n"
                "m = make(map[string]int)\n"
                "mu.Unlock()\n```\n\n"
                "如果你的业务场景允许短暂的空 map（比如缓存可以容忍 cache miss），这种方式最简单有效。"
                "Go 的 GC 会在下一个周期把旧 map 的所有 bucket 内存全部回收。\n\n"
                "还有一种在 Go 1.21 之后被推荐的方式是使用 `clear(m)` 内建函数。"
                "`clear` 会清空 map 中所有键值对并重置 count 为 0，"
                "但根据当前实现（Go 1.22），clear 同样不会释放 bucket 内存——"
                "它只是把所有 slot 的 tophash 标记为 empty。"
                "所以 `clear` 和逐个 delete 在内存回收层面效果一样，不能当缩容方案用。\n\n"
                "## 生产环境的最佳实践\n\n"
                "在实际项目中，处理 map 内存膨胀通常要根据使用场景来选择策略。"
                "如果 map 被用作本地缓存（比如存放热点数据），推荐使用带 TTL 和定期重建的方案："
                "每隔一段时间（比如 10 分钟）创建一个新 map，把未过期的 key 拷贝过去，然后原子替换旧 map。"
                "很多开源的本地缓存库比如 `github.com/patrickmn/go-cache` 和 `github.com/dgraph-io/ristretto` "
                "内部就是这么做的，用户不需要自己处理缩容。\n\n"
                "如果 map 的生命周期和请求绑定（每个请求创建一个 map，请求结束后丢弃），"
                "那完全不需要担心缩容问题，GC 会在 map 变成垃圾后回收所有内存。\n\n"
                "最容易踩坑的是全局长生命周期 map：在 init 或 main 里创建，进程运行期间一直存在，不断 add 和 delete。"
                "这种 map 如果经历过一次流量高峰（比如百万级 key），之后即使 key 数量降回几千，内存也不会降。"
                "应对策略是设置一个监控指标，当 map 的 count 远小于其容量的某个阈值时，触发重建。\n\n"
                "最后一个值得注意的点是 `runtime.ReadMemStats` 中 Alloc 和 Sys 的区别。"
                "Alloc 是 Go heap 当前活跃对象的内存，Sys 是 Go runtime 从操作系统申请的总内存。"
                "即使 Alloc 降下来了，Sys 也不一定立刻降，"
                "因为 Go runtime 默认使用 `MADV_FREE`（Linux 4.5+）或 `MADV_DONTNEED` 来告知操作系统哪些页面可以回收，"
                "但操作系统可能不会立刻回收。"
                "如果你在容器环境中被 OOMKill，需要关注的是 RSS 而不是 Go 的 Alloc。"
                "可以通过设置环境变量 `GODEBUG=madvdontneed=1`（Go 1.16 之前）或升级到 Go 1.16+（默认改回了 `MADV_DONTNEED`）"
                "来让操作系统更积极地回收物理页面。"
            ),
            "keyPoints": [
                "Go map 的 delete 操作只是将 bucket 中对应 slot 的 tophash 标记为 emptyOne 并清零键值数据，不会释放 bucket 本身的内存，也不会减少 bucket 数组的大小",
                "Go 的 map 只有扩容机制没有缩容机制，bucket 数量（2^B）一旦增长就不会自动缩小，这是 Go runtime 有意为之的设计决策而非 bug",
                "sameSizeGrow（等量扩容）是在溢出桶过多时触发的碎片整理机制，它会重新排列数据减少 overflow 桶，但不会减少 B 的值，因此不解决内存回收问题",
                "真正实现缩容的唯一方式是创建一个新 map 并拷贝存活的 key，让旧 map 被 GC 回收；make 新 map 时指定 len(old) 作为 hint 可以让 bucket 按实际数据量分配",
                "将 map 置为 nil 后触发 GC 可以回收整个 hmap 及其 bucket 数组的内存，这是最彻底的释放方式",
                "Go 1.21 引入的 clear 内建函数会清空所有键值对，但当前实现同样不释放 bucket 内存，不能作为缩容方案使用",
                "生产环境中长生命周期的全局 map 最容易踩坑，建议对经历过流量高峰的 map 实施定期重建策略，或使用成熟的本地缓存库来自动管理内存",
            ],
            "quiz": [
                {
                    "id": "go-map-delete-shrink-quiz-1",
                    "question": "对一个有 100 万个 key 的 map 执行 delete 删除所有 key 后，调用 runtime.GC()，以下哪个说法是正确的？",
                    "choices": [
                        {"id": "A", "text": "map 底层的 bucket 数组内存不会被释放，Alloc 基本不变"},
                        {"id": "B", "text": "GC 会回收所有 bucket 内存，Alloc 会降回初始水平"},
                        {"id": "C", "text": "bucket 内存会释放一半，因为 Go 采用渐进式回收"},
                        {"id": "D", "text": "内存是否释放取决于 GOGC 的设置值"},
                    ],
                    "correctAnswer": "A",
                    "explanation": "Go 的 map delete 只是把 slot 的 tophash 标记为空并清零键值数据，bucket 数组本身不会缩小也不会被回收。因为 hmap 变量仍然持有对整个 bucket 数组的引用，GC 不会回收仍被引用的内存。B 选项描述的行为只有在 map 变量被置为 nil 后才会发生。C 选项的\u201c渐进式回收\u201d说法完全是编造的，Go 的渐进式操作是扩容迁移，不是内存释放。D 选项中 GOGC 控制的是 GC 触发频率，不影响单个对象是否被回收的判断逻辑。",
                },
                {
                    "id": "go-map-delete-shrink-quiz-2",
                    "question": "Go map 底层结构 runtime.hmap 中，决定 bucket 数量的字段是什么？",
                    "choices": [
                        {"id": "A", "text": "count 字段，直接记录 bucket 的个数"},
                        {"id": "B", "text": "B 字段，bucket 数量等于 2^B"},
                        {"id": "C", "text": "bucketsize 字段，以字节为单位记录总大小"},
                        {"id": "D", "text": "hash0 字段，哈希种子同时编码了 bucket 数量信息"},
                    ],
                    "correctAnswer": "B",
                    "explanation": "hmap 的 B 字段是一个 uint8 类型，表示 bucket 数量的以 2 为底的对数。也就是说如果 B=10，那么 bucket 数量是 2^10=1024。A 选项中的 count 记录的是当前存活的键值对数量，不是 bucket 数量。C 选项中的 bucketsize 不存在于 hmap 结构中。D 选项中的 hash0 是哈希种子，用于每次创建 map 时随机化哈希函数，防止哈希碰撞攻击，和 bucket 数量完全无关。",
                },
                {
                    "id": "go-map-delete-shrink-quiz-3",
                    "question": "Go map 的 sameSizeGrow 机制是在什么条件下触发的？",
                    "choices": [
                        {"id": "A", "text": "当大量 key 被 delete 后 count 远小于 bucket 容量时自动触发"},
                        {"id": "B", "text": "当溢出桶数量过多（接近正常桶数量）但负载因子未超过 6.5 时触发"},
                        {"id": "C", "text": "当负载因子超过 6.5 时，作为翻倍扩容的替代方案触发"},
                        {"id": "D", "text": "由用户调用 runtime.GC() 时检测并触发"},
                    ],
                    "correctAnswer": "B",
                    "explanation": "sameSizeGrow 的触发条件是 overflow bucket 的数量过多但负载因子还没超标。这说明数据分布不均匀，很多 key 堆积在 overflow 链上，查找效率下降。sameSizeGrow 会分配一个同样大小的新 bucket 数组，重新哈希排列数据来消除碎片。A 选项的描述不正确，delete 操作后并不会触发任何自动缩容或重整逻辑，sameSizeGrow 是在后续的写入操作中检测到溢出桶过多时触发的。C 选项把 sameSizeGrow 和 biggerSizeGrow 的触发条件搞反了。D 选项完全错误，GC 不参与 map 的内部结构整理。",
                },
                {
                    "id": "go-map-delete-shrink-quiz-4",
                    "question": "delete 操作在 runtime 层面对 bucket slot 做了什么？",
                    "choices": [
                        {"id": "A", "text": "把 slot 对应的 tophash 设为 emptyOne，清零 key 和 value 的内存（如果包含指针），hmap.count 减一"},
                        {"id": "B", "text": "将 slot 的数据移到 overflow 桶中，然后压缩正常桶"},
                        {"id": "C", "text": "直接释放 slot 对应的内存块，调用 runtime.free"},
                        {"id": "D", "text": "将 slot 标记为可用后，立即检查是否需要触发缩容"},
                    ],
                    "correctAnswer": "A",
                    "explanation": "mapdelete 函数的核心逻辑是定位到目标 slot 后，将 tophash 设为 emptyOne（值为 1）表示该 slot 已被删除，然后清零 key 和 value 区域（特别是包含指针的类型，清零让 GC 不再追踪这些指针），最后将 hmap.count 减一。整个过程不涉及内存释放。B 选项描述的数据移动操作在 delete 中不存在。C 选项中 Go runtime 不使用 runtime.free 来释放 map 的 slot，bucket 内存是整块分配整块回收的。D 选项中 map 的 delete 不包含任何缩容检查逻辑。",
                },
                {
                    "id": "go-map-delete-shrink-quiz-5",
                    "question": "以下代码执行后，runtime.MemStats 中的 Alloc 值大约是多少？\n\n```go\nm := make(map[int]int)\nfor i := 0; i < 1_000_000; i++ { m[i] = i }\nfor i := 0; i < 1_000_000; i++ { delete(m, i) }\nruntime.GC()\n// 此时读取 MemStats\n```",
                    "choices": [
                        {"id": "A", "text": "接近 0 MB，因为所有数据都被删除了"},
                        {"id": "B", "text": "仍然在 40-50 MB 左右，和删除前基本一样"},
                        {"id": "C", "text": "大约 20 MB，释放了一半"},
                        {"id": "D", "text": "取决于 Go 版本，1.20 之后会降到接近 0"},
                    ],
                    "correctAnswer": "B",
                    "explanation": "删除 100 万个 key 后 bucket 数组不会缩小，所以 Alloc 和删除前基本一样。虽然 key 和 value 的数据被清零了，但这些数据是直接存储在 bucket 结构体内部的（内联存储），不是独立分配的堆对象，所以清零不代表内存被释放。A 选项的预期只有在 map 被置为 nil 后才成立。C 选项的\u201c释放一半\u201d没有任何依据。D 选项也不正确，截至 Go 1.23，map 仍然不支持自动缩容，这个行为在任何已发布版本中都没有改变。",
                },
                {
                    "id": "go-map-delete-shrink-quiz-6",
                    "question": "以下哪种方式不能有效释放 map 占用的 bucket 内存？",
                    "choices": [
                        {"id": "A", "text": "创建新 map 并拷贝存活的 key，丢弃旧 map"},
                        {"id": "B", "text": "将 map 变量设为 nil 后触发 GC"},
                        {"id": "C", "text": "使用 clear(m) 清空 map 中所有键值对"},
                        {"id": "D", "text": "让 map 变量离开作用域，不再被任何变量引用"},
                    ],
                    "correctAnswer": "C",
                    "explanation": "clear(m) 是 Go 1.21 引入的内建函数，它会遍历 map 清空所有键值对并把 count 重置为 0，但根据当前实现（Go 1.22/1.23），它不会释放底层的 bucket 数组——效果和逐个 delete 一样，tophash 标记为空但 bucket 内存不变。A 选项中创建新 map 时会根据传入的 hint（len(old)）重新分配更小的 bucket 数组，旧 map 被 GC 回收后内存就释放了。B 选项中 map 被置为 nil 后没有任何引用指向 hmap，GC 可以回收全部内存。D 选项同理，离开作用域后引用消失，GC 可以回收。",
                },
                {
                    "id": "go-map-delete-shrink-quiz-7",
                    "question": "sameSizeGrow 和 biggerSizeGrow 的核心区别是什么？",
                    "choices": [
                        {"id": "A", "text": "sameSizeGrow 保持 B 不变只做数据重排消除碎片，biggerSizeGrow 将 B 加一使 bucket 数量翻倍以降低负载因子"},
                        {"id": "B", "text": "sameSizeGrow 把 bucket 数量减半实现缩容，biggerSizeGrow 把 bucket 数量翻倍实现扩容"},
                        {"id": "C", "text": "两者都把 bucket 翻倍，区别在于 sameSizeGrow 是同步完成的而 biggerSizeGrow 是渐进式的"},
                        {"id": "D", "text": "sameSizeGrow 只处理 overflow 桶的回收，biggerSizeGrow 处理整个 bucket 数组的重建"},
                    ],
                    "correctAnswer": "A",
                    "explanation": "sameSizeGrow 的 same size 就体现在它不改变 B 的值——新 bucket 数组大小和旧的完全一样，只是把数据重新排列，让原本散落在 overflow 链上的 key 回到正常 bucket 中。biggerSizeGrow 则是把 B 加一，bucket 数量翻倍，目的是把负载因子降下来。B 选项的说法是一个非常常见的误解，sameSizeGrow 绝对不会减少 bucket 数量，Go map 没有任何缩容路径。C 选项不对，两种 grow 都是渐进式完成的，每次 map 操作迁移一到两个 bucket。D 选项也不准确，两种 grow 都涉及分配新 bucket 数组和迁移数据。",
                },
                {
                    "id": "go-map-delete-shrink-quiz-8",
                    "question": "线上一个 Go 服务用全局 map 做本地缓存，平时存 5 万个 key，但每天凌晨有一次批量导入会达到 500 万个 key，导入完成后通过 delete 清理回 5 万。运行一周后发现服务 RSS 内存持续在 2GB 不下降，最合理的解决方案是？",
                    "choices": [
                        {"id": "A", "text": "调大 GOGC 让 GC 更积极地回收 map 内存"},
                        {"id": "B", "text": "批量导入完成后不用 delete，而是创建一个新 map 拷贝需要保留的 5 万个 key，然后替换旧 map"},
                        {"id": "C", "text": "在 delete 循环之后调用 runtime.GC() 强制触发一次垃圾回收"},
                        {"id": "D", "text": "使用 sync.Map 替代普通 map，sync.Map 内置了缩容机制"},
                    ],
                    "correctAnswer": "B",
                    "explanation": "这就是 map 不缩容的典型生产场景。批量导入 500 万 key 时 map 的 B 值会涨到很大（bucket 数组可能几百 MB），delete 之后 B 不会变小，内存就锁在那个水位了。正确做法是创建新 map 拷贝存活的 5 万个 key，新 map 的 bucket 按 5 万的规模分配，旧 map 被 GC 回收。A 选项把因果搞反了，GOGC 调大反而降低 GC 频率，且 GC 本身就不会缩容 map bucket。C 选项中手动调 runtime.GC() 也没用，因为 bucket 仍然被 map 变量引用着，GC 不会回收有引用的对象。D 选项中 sync.Map 同样没有缩容机制，它底层用的也是 map 加上 read-only 快照，内存表现和普通 map 类似。",
                },
                {
                    "id": "go-map-delete-shrink-quiz-9",
                    "question": "在 Go 1.16+ 的 Linux 环境下，将一个大 map 置为 nil 并触发 GC 后，Go runtime 的 MemStats.Alloc 已经降下来了，但通过 /proc/self/status 看到的 VmRSS 仍然很高，最可能的原因是？",
                    "choices": [
                        {"id": "A", "text": "Go runtime 使用 MADV_FREE 归还内存，操作系统标记这些页面可回收但在内存压力不大时不会立即回收物理页面"},
                        {"id": "B", "text": "Go 的 GC 有 bug，没有真正释放内存"},
                        {"id": "C", "text": "map 的 bucket 内存被分配在栈上，不受 GC 管理"},
                        {"id": "D", "text": "需要调用 debug.FreeOSMemory() 才能把内存还给操作系统"},
                    ],
                    "correctAnswer": "A",
                    "explanation": "Go 1.16 在 Linux 上默认改回了 MADV_DONTNEED，但如果你用的是 Go 1.12-1.15，默认是 MADV_FREE。MADV_FREE 告诉内核这些页面可以回收，但内核只在内存紧张时才真正回收——所以 RSS 短时间内不会下降。即使在 Go 1.16+ 使用 MADV_DONTNEED 后，操作系统也不是瞬间回收，可能有延迟。B 选项不对，Alloc 已经降下来说明 GC 正常工作了。C 选项完全错误，map 的 bucket 始终分配在堆上。D 选项有一定道理，debug.FreeOSMemory() 确实可以加速归还内存，但题目问的是\u201c最可能的原因\u201d，MADV 行为是根本原因而不是\u201c缺少调用 FreeOSMemory\u201d。",
                },
                {
                    "id": "go-map-delete-shrink-quiz-10",
                    "question": "线上服务疑似 map 内存泄漏，你想确认某个 map 实际占用了多少 bucket 内存。以下哪种排查方式最准确？",
                    "choices": [
                        {"id": "A", "text": "用 pprof heap profile 查看 runtime.makeBucketArray 的 inuse_space，可以看到 map bucket 的实际分配量"},
                        {"id": "B", "text": "用 len(m) 乘以 key-value 大小来估算"},
                        {"id": "C", "text": "用 unsafe.Sizeof(m) 获取 map 的完整内存占用"},
                        {"id": "D", "text": "通过 runtime.ReadMemStats 中的 BuckHashSys 字段查看所有 map 的 bucket 内存总量"},
                    ],
                    "correctAnswer": "A",
                    "explanation": "pprof heap profile 会记录每个分配点的内存占用。map 的 bucket 数组通过 runtime.makeBucketArray 分配，在 inuse_space 模式下可以看到当前仍在使用的 bucket 内存总量，精确到分配调用栈。这是排查 map 内存占用最可靠的方法。B 选项只能估算数据量而不是实际内存占用，因为 bucket 数组大小是 2 的幂次，通常会有大量空闲 slot，加上 overflow 桶的开销，实际占用远大于 len(m) 的简单估算。C 选项中 unsafe.Sizeof(m) 返回的是 map 指针自身的大小（8 字节），不包含 hmap 结构体和 bucket 数组。D 选项中 BuckHashSys 是 profile bucket hash table 的系统内存，和 map 的 bucket 完全不是一回事。",
                },
            ],
            "references": [
                "https://go.dev/src/runtime/map.go",
                "https://github.com/golang/go/issues/20135",
                "https://go.dev/blog/maps",
                "https://go.dev/doc/gc-guide",
            ],
        }
    ],
}

import json, pathlib

out = pathlib.Path(r"C:\Users\RigelShrimp\questions\public\question-packs\go\map-delete-shrink.json")
out.write_text(json.dumps(data, ensure_ascii=False, indent=2), encoding="utf-8")
print(f"Written {out.stat().st_size} bytes")
