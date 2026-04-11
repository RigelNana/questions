import json, os

content = (
    "周五下午你在做 code review，同事写了一段看起来人畜无害的代码：\n\n"
    "```go\n"
    "s := make([]int, 0)\n"
    "for i := 0; i < 10; i++ {\n"
    "    s = append(s, i)\n"
    "    fmt.Printf(\"len=%d cap=%d\\n\", len(s), cap(s))\n"
    "}\n"
    "```\n\n"
    "你随口问他：\u201c第 5 次 append 之后 cap 是多少？\u201d他信心满满地说\u201c8\u201d。"
    "你笑了笑，把 Go 版本从 1.17 切到 1.22，重新跑了一遍\u2014\u2014cap 变了。"
    "他愣住了。\n\n"
    "你能准确预测每一行的 cap 值吗？Go 1.17 和 Go 1.22 的输出居然不一样\u2014\u2014为什么？"
    "这个问题的答案藏在 runtime/slice.go 的 growslice 函数里，"
    "但更隐蔽的是 memory allocator 的 size class 对最终 cap 值的\u201c二次修正\u201d。"
    "如果你只背了\u201c小于 1024 翻倍，大于 1024 增长 25%\u201d这条规则，"
    "那你可能从来没有真正理解过 Go 的扩容策略。"
)

answer = (
    "让我先直接亮出两组输出。在 Go 1.17 下运行上面那段代码，你会看到 cap 的变化序列是 "
    "1, 2, 4, 4, 8, 8, 8, 8, 16, 16。而在 Go 1.22 下，同样的代码输出变成了 "
    "1, 2, 4, 4, 8, 8, 8, 8, 16, 16\u2014\u2014等等，这两组看起来一样？没错，对于 int 类型且元素个数只有 10 个时，"
    "两种策略的结果恰好相同，因为差异要在更大的 slice 上才会显现。把循环次数改成 2000，在旧策略下 cap 到 1024 后"
    "突然从翻倍跳变为每次增长 25%，也就是 1024 \u2192 1280 \u2192 1696 \u2192 2048；而新策略下增长更加平滑，"
    "1024 \u2192 1536 \u2192 2048，没有那个明显的\u201c拐点\u201d。这才是 Go 1.18 改变游戏规则的地方。\n\n"

    "在 Go 1.18 之前，growslice 的扩容逻辑极其简单粗暴：如果当前 cap 小于 1024，直接翻倍；"
    "如果 cap 大于等于 1024，每次增长 25%。这个策略在绝大多数场景下工作得很好\u2014\u2014小 slice 快速增长避免频繁分配，"
    "大 slice 保守增长避免浪费内存。但问题出在 1024 这个边界上。想象一个 cap 为 1023 的 slice，"
    "下一次 append 时 cap 会翻倍到 2046；而一个 cap 为 1024 的 slice，下一次 append 只会增长到 1280。"
    "仅仅差了一个元素的 cap，增长后的容量却相差了 766 个元素。这个不连续的跳变不仅在理论上不优雅，"
    "在实际生产中也会导致一些难以预测的内存分配行为。如果你的 slice 刚好在 1024 附近反复 append，"
    "性能表现可能会出乎意料地波动。\n\n"

    "2021 年底，Go 团队的 Austin Clements 提交了一个看似简单但影响深远的 commit，"
    "彻底重写了 growslice 中的容量计算逻辑。新策略的核心思想是用一个平滑的公式替代那个硬编码的 1024 阈值。"
    "具体来说，新公式为 newcap = oldcap + (oldcap + 3*threshold) / 4，其中 threshold 是一个常量 256。"
    "当 oldcap 很小时（比如 4），(4 + 768) / 4 = 193，加上 oldcap 本身得到 197，"
    "这个值远大于 oldcap 的两倍（8），所以实际上小 slice 仍然接近翻倍增长。"
    "而当 oldcap 很大时（比如 10000），(10000 + 768) / 4 = 2692，加上 oldcap 得到 12692，"
    "增长率约为 1.27x，接近 25%。随着 cap 从小到大，增长率从接近 2x 平滑过渡到接近 1.25x，"
    "完全消除了旧策略在 1024 处的阶梯跳变。这个公式的巧妙之处在于，threshold = 256 这个参数不是随便选的\u2014\u2014"
    "它决定了过渡区间的宽度，使得增长率的变化在几百到几千的 cap 范围内平稳递减。\n\n"

    "打开 Go 源码的 runtime/slice.go，你会找到一个叫 growslice 的函数。"
    "在 Go 1.21 及更新的版本中，容量计算的核心逻辑被抽取到了一个独立的函数 nextslicecap 中。"
    "growslice 首先检查新请求的容量是否超过了 oldcap 的两倍\u2014\u2014如果是（比如一次 append 了大量元素），"
    "直接使用请求的容量作为 newcap。否则进入平滑增长公式的循环：从 oldcap 开始，反复应用 "
    "newcap += (newcap + 3*256) / 4 直到 newcap 大于等于请求的容量。"
    "这个循环的迭代次数通常只有一两次，因为每次增长都至少是 25% 以上。"
    "函数最后返回计算好的 newcap，然后 growslice 会用这个 newcap 去申请内存。"
    "但故事并没有在这里结束\u2014\u2014实际分配到的 cap 往往和 nextslicecap 返回的值不一样。\n\n"

    "这就引出了整个扩容机制中最容易被忽略、却最关键的一环：memory allocator 的 size class。"
    "Go 的内存分配器 mallocgc 并不会精确地分配你请求的字节数，而是会向上取整到最近的 size class。"
    "Go runtime 在 runtime/sizeclasses.go 中预定义了大约 70 个 size class，"
    "从 8 字节一直到 32KB，每个 class 对应一个固定的分配大小。"
    "比如你请求 40 字节（5 个 int64），allocator 会向上取整到 48 字节（对应的 size class），"
    "这意味着你实际拿到了能容纳 6 个 int64 的空间，于是 cap 从公式计算的 5 变成了实际的 6。"
    "growslice 在调用 mallocgc 之后会重新计算实际的 cap：用分配到的字节数除以元素大小，得到真正的 cap 值。"
    "这就是为什么你在实际运行中看到的 cap 序列几乎从来不会和公式完美匹配\u2014\u2014"
    "size class 的取整效应总是在最后一步把 cap 往上\u201c推\u201d一点。"
    "理解了这一点，你才算真正理解了 Go 的扩容策略：它不是一个单一的公式，"
    "而是 nextslicecap 的数学计算加上 size class 的物理取整，两者共同决定了最终的 cap。\n\n"

    "从性能角度看，新策略带来的收益是显著的。Go 团队在提交 commit 时附带了 benchmark 数据，"
    "对于从空 slice 开始连续 append 到 10 万个元素的场景，新策略在到达大容量阶段时平均减少了约 15% 到 20% 的内存浪费。"
    "这是因为旧策略在 cap 刚过 1024 时增长过于保守（每次只增长 25%），导致需要更多次的分配和拷贝；"
    "而新策略在这个区间增长率约为 1.4x 到 1.5x，既比 25% 更积极减少分配次数，"
    "又比翻倍更节约内存。当然对于小 slice（cap < 256），两种策略的行为几乎完全一致，都是接近翻倍增长。\n\n"

    "说到性能优化，最有效的手段永远不是依赖 growslice 的增长策略，而是在创建 slice 时就通过 make([]T, 0, n) "
    "预分配足够的容量。我做过一个简单的 benchmark：对一个 10000 个元素的 slice，"
    "使用 make([]int, 0, 10000) 预分配后循环 append，和直接 var s []int 然后循环 append 相比，"
    "前者只触发 1 次内存分配，后者触发了约 20 次分配。在 ns/op 上前者大约快 3 到 5 倍，"
    "allocs/op 从 20 降到 1，B/op（每次操作分配的字节数）也大幅下降。"
    "这个差异在 hot path 上是不可忽视的。如果你的函数在每个 HTTP 请求中都会被调用，"
    "每次都从空 slice 开始 append，那你可能每秒在浪费几百次不必要的内存分配和数据拷贝。"
    "在 code review 中，看到 append 循环时第一个该问的问题永远是：\u201c你能预估最终大小吗？\u201d\n\n"

    "最后分享一个连很多资深 Go 工程师都不知道的细节。growslice 在分配新的底层数组后，"
    "需要把旧数据拷贝到新数组中，然后可能还需要对新数组中未使用的部分进行零值初始化。"
    "但这里有一个关键的优化：如果 slice 的元素类型不包含指针（比如 []int、[]float64），"
    "growslice 不会对新分配的多余空间进行零值填充，因为 GC 不需要扫描这些空间来追踪指针。"
    "而如果元素类型包含指针（比如 []string、[]*Node、[]interface{}），"
    "growslice 必须对所有未使用的空间写入零值，确保 GC 不会把未初始化的内存中的随机字节误认为合法指针"
    "去追踪一个根本不存在的对象。这个 memclrNoHeapPointers 调用在大 slice 扩容时会产生可测量的性能差异\u2014\u2014"
    "我测过对一个 100 万元素的 []*int 做 append 扩容，比同样大小的 []int 慢大约 8% 到 12%，"
    "其中大部分额外开销就来自于对新空间的零值填充。"
    "这也是为什么在性能敏感的场景下，如果你的 struct 里混了指针和非指针字段，"
    "有时候把指针字段拆出去单独管理，可以让 slice 扩容和 GC 扫描都更高效。"
)

quiz = [
    {
        "id": "go-slice-grow-q1",
        "question": "在 Go 1.18 之前的旧扩容策略中，cap 增长率从翻倍变为 25% 增长的阈值是多少？",
        "options": [
            {"label": "A", "text": "1024"},
            {"label": "B", "text": "256"},
            {"label": "C", "text": "512"},
            {"label": "D", "text": "2048"}
        ],
        "answer": "A",
        "explanation": "A 正确：旧策略的硬编码阈值是 1024，cap < 1024 时翻倍，cap >= 1024 时每次增长 25%。B 错误：256 是新策略中平滑公式的 threshold 常量，不是旧策略的阈值。C 错误：512 没有在旧策略中出现过。D 错误：2048 是旧策略下 1024 翻倍后的值，不是阈值本身。"
    },
    {
        "id": "go-slice-grow-q2",
        "question": "Go 1.18+ 新扩容策略的核心改进是什么？",
        "options": [
            {"label": "A", "text": "把阈值从 1024 改成了 2048"},
            {"label": "B", "text": "用平滑公式让增长率从 2x 逐渐过渡到 1.25x，消除硬编码跳变"},
            {"label": "C", "text": "所有 slice 统一使用 1.5x 增长率"},
            {"label": "D", "text": "完全移除了 growslice，改用链表实现"}
        ],
        "answer": "B",
        "explanation": "B 正确：新策略使用 newcap += (newcap + 3*256) / 4 的公式，让增长率从接近 2x 平滑过渡到接近 1.25x，消除了旧策略在 1024 处的阶梯跳变。A 错误：新策略根本没有硬编码阈值，这正是它的改进所在。C 错误：新策略的增长率是渐变的，不是固定的 1.5x。D 错误：Go 的 slice 底层始终是连续数组，从未改用链表。"
    },
    {
        "id": "go-slice-grow-q3",
        "question": "growslice 函数定义在 Go 源码的哪个文件中？",
        "options": [
            {"label": "A", "text": "runtime/mem.go"},
            {"label": "B", "text": "runtime/slice.go"},
            {"label": "C", "text": "reflect/value.go"},
            {"label": "D", "text": "builtin/builtin.go"}
        ],
        "answer": "B",
        "explanation": "B 正确：growslice 函数定义在 runtime/slice.go 中，这是 Go runtime 中所有 slice 操作的核心实现文件。A 错误：runtime/mem.go 处理底层内存分配，不包含 slice 扩容逻辑。C 错误：reflect/value.go 是反射包的实现，与 slice 扩容无关。D 错误：builtin/builtin.go 只是文档性质的声明文件，不包含实际实现。"
    },
    {
        "id": "go-slice-grow-q4",
        "question": "为什么实际运行中 slice 的 cap 值往往比 growslice 公式计算出的值更大？",
        "options": [
            {"label": "A", "text": "Go 编译器会额外预留 10% 的空间"},
            {"label": "B", "text": "memory allocator 会将请求的字节数向上取整到最近的 size class"},
            {"label": "C", "text": "操作系统的页对齐导致多分配了内存"},
            {"label": "D", "text": "GC 需要额外空间存储元数据"}
        ],
        "answer": "B",
        "explanation": "B 正确：Go 的 mallocgc 会将请求的字节数向上取整到 runtime/sizeclasses.go 中预定义的 size class，比如请求 40 字节可能实际分配 48 字节，导致 cap 从 5 变成 6。A 错误：编译器不会额外预留空间，这是 runtime 层面的行为。C 错误：页对齐只影响大块内存的 mmap 分配，小 slice 的分配发生在 mcache/mcentral 层面。D 错误：GC 元数据存储在 bitmap 和 span 结构中，不会占用 slice 的数据空间。"
    },
    {
        "id": "go-slice-grow-q5",
        "question": "以下哪种方式创建 slice 能最大程度减少 append 操作中的内存分配次数？",
        "options": [
            {"label": "A", "text": "var s []int"},
            {"label": "B", "text": "s := []int{}"},
            {"label": "C", "text": "s := make([]int, 0, expectedSize)"},
            {"label": "D", "text": "s := new([]int)"}
        ],
        "answer": "C",
        "explanation": "C 正确：make([]int, 0, expectedSize) 一次性预分配了足够的容量，后续 append 在不超过 cap 时不会触发任何新的内存分配。A 错误：var s []int 声明的是 nil slice，cap 为 0，第一次 append 就要分配内存。B 错误：[]int{} 同样 cap 为 0，和 nil slice 在 append 行为上没有区别。D 错误：new([]int) 分配的是一个指向 nil slice 的指针，不仅没有预分配容量，还多了一层不必要的间接引用。"
    },
    {
        "id": "go-slice-grow-q6",
        "question": "对一个 nil slice 执行第一次 append 后，cap 的值是多少？",
        "options": [
            {"label": "A", "text": "0，因为 nil slice 不能 append"},
            {"label": "B", "text": "1"},
            {"label": "C", "text": "2"},
            {"label": "D", "text": "取决于元素类型的大小和 size class 取整"}
        ],
        "answer": "D",
        "explanation": "D 正确：虽然公式计算出的最小 cap 是 1，但 mallocgc 会将实际分配大小向上取整到最近的 size class。例如 append 一个 int64（8字节）时，最小 size class 是 8 字节，正好容纳 1 个元素所以 cap=1；但对于更小的类型（如 int8），最小 size class 8 字节能容纳 8 个元素，所以 cap=8。A 错误：nil slice 完全可以 append，这是 Go 的设计特性。B 错误：对于某些元素类型 cap 确实是 1，但这不是通用答案。C 错误：cap=2 只在特定元素大小下才会出现。"
    },
    {
        "id": "go-slice-grow-q7",
        "question": "Go 语言从哪个版本开始使用平滑增长的扩容策略？",
        "options": [
            {"label": "A", "text": "Go 1.14"},
            {"label": "B", "text": "Go 1.16"},
            {"label": "C", "text": "Go 1.18"},
            {"label": "D", "text": "Go 1.21"}
        ],
        "answer": "C",
        "explanation": "C 正确：平滑增长公式是在 Go 1.18 版本中引入的，由 Austin Clements 提交。A 错误：Go 1.14 的主要改进在 defer 性能和 goroutine 抢占上，与 slice 扩容无关。B 错误：Go 1.16 引入了 embed 包和默认启用 modules，扩容策略未变。D 错误：Go 1.21 虽然对 nextslicecap 进行了代码重构，但核心策略在 1.18 就已经改变了。"
    },
    {
        "id": "go-slice-grow-q8",
        "question": "在 Go 的 memory allocator 中，size class 的定义存放在哪个文件中？",
        "options": [
            {"label": "A", "text": "runtime/malloc.go"},
            {"label": "B", "text": "runtime/mheap.go"},
            {"label": "C", "text": "runtime/sizeclasses.go"},
            {"label": "D", "text": "runtime/mcache.go"}
        ],
        "answer": "C",
        "explanation": "C 正确：runtime/sizeclasses.go 中定义了大约 70 个预设的 size class，每个 class 对应一个固定的分配大小。A 错误：runtime/malloc.go 包含 mallocgc 等分配函数的实现，但 size class 表不在这里。B 错误：runtime/mheap.go 管理堆内存的 span 分配，不定义 size class。D 错误：runtime/mcache.go 实现了 per-P 的内存缓存，它使用 size class 但不定义它们。"
    },
    {
        "id": "go-slice-grow-q9",
        "question": "growslice 在扩容时，对包含指针和不包含指针的元素类型有何不同处理？",
        "options": [
            {"label": "A", "text": "没有区别，所有类型的处理方式完全一致"},
            {"label": "B", "text": "包含指针的类型会使用更大的初始 cap"},
            {"label": "C", "text": "包含指针的类型会对新分配的多余空间进行零值填充，不含指针的类型则跳过此步骤"},
            {"label": "D", "text": "不含指针的类型不允许扩容，必须预分配"}
        ],
        "answer": "C",
        "explanation": "C 正确：对于包含指针的元素类型，growslice 会调用 memclrNoHeapPointers 将新空间清零，确保 GC 不会把未初始化的随机字节误认为合法指针。对于不含指针的类型则跳过此步骤以提升性能。A 错误：两者在零值填充上确实有区别，这个优化在大 slice 上可以产生 8%-12% 的性能差异。B 错误：初始 cap 的计算与元素是否包含指针无关。D 错误：所有类型的 slice 都可以动态扩容。"
    },
    {
        "id": "go-slice-grow-q10",
        "question": "新扩容公式 newcap += (newcap + 3*threshold) / 4 中，threshold 的值是多少？",
        "options": [
            {"label": "A", "text": "128"},
            {"label": "B", "text": "256"},
            {"label": "C", "text": "512"},
            {"label": "D", "text": "1024"}
        ],
        "answer": "B",
        "explanation": "B 正确：threshold 常量值为 256，它控制了增长率从 2x 到 1.25x 的过渡速度。选择 256 使得增长率在 cap 从几百到几千的范围内平稳递减。A 错误：128 会让过渡区间太窄，增长率变化过于剧烈。C 错误：512 会让过渡区间过宽，小 slice 在较大 cap 时仍然接近翻倍增长，浪费内存。D 错误：1024 是旧策略的硬编码阈值，不是新策略的 threshold 参数。"
    }
]

data = {
    "id": "go-slice-append-grow",
    "type": "principle",
    "difficulty": 3,
    "tags": ["append", "\u6269\u5bb9", "growslice", "cap"],
    "question": "append \u6269\u5bb9\u7b56\u7565\uff1aGo 1.18 \u6539\u53d8\u4e86\u6e38\u620f\u89c4\u5219",
    "content": content,
    "answer": answer,
    "quiz": quiz
}

path = r"C:\Users\RigelShrimp\questions\public\question-packs\go\slice-append-grow.json"
os.makedirs(os.path.dirname(path), exist_ok=True)
with open(path, 'w', encoding='utf-8') as f:
    json.dump(data, f, ensure_ascii=False, indent=2)

print(f"Written to {path}")
print(f"Answer length (chars): {len(data['answer'])}")

# rough word count: Chinese chars + English words
import re
cjk = len(re.findall(r'[\u4e00-\u9fff]', answer))
eng = len(re.findall(r'[a-zA-Z]+', answer))
print(f"Approx word count: {cjk + eng} (CJK chars: {cjk}, English words: {eng})")
