# 非线性动画与动效设计方案

> Material Design 3 Motion System | 状态: 设计中

## 设计原则

Material Design 3 的动效核心是 **有意义的运动 (Purposeful Motion)**：
1. **引导注意力** — 动画应帮助用户理解界面变化，而非分散注意力
2. **表达层级** — 重要元素用更醒目的动画，次要元素用更含蓄的过渡
3. **物理直觉** — 非线性缓动模拟真实物体的加减速，避免机械感
4. **一致节奏** — 全局统一的时间函数和持续时间体系

## MD3 缓动函数体系

| Token | 值 | 用途 |
|-------|-----|------|
| `--ease-emphasized` | `cubic-bezier(0.2, 0, 0, 1)` | 主缓动：大多数 UI 变化 |
| `--ease-emphasized-decel` | `cubic-bezier(0.05, 0.7, 0.1, 1)` | 入场：元素从屏幕外进入 |
| `--ease-emphasized-accel` | `cubic-bezier(0.3, 0, 0.8, 0.15)` | 退场：元素离开屏幕 |
| `--ease-standard` | `cubic-bezier(0.2, 0, 0, 1)` | 同 emphasized，面板内变化 |
| `--ease-standard-decel` | `cubic-bezier(0, 0, 0, 1)` | 面板内元素进入 |
| `--ease-standard-accel` | `cubic-bezier(0.3, 0, 1, 1)` | 面板内元素退出 |
| `--ease-spring` | `linear(0, 0.006, 0.025, 0.058, ...)` | 弹簧：按钮反馈、收藏等 |

## 持续时间体系

| Token | 值 | 场景 |
|-------|------|------|
| `--duration-short-1` | `50ms` | 涟漪开始 |
| `--duration-short-2` | `100ms` | 选中态颜色 |
| `--duration-short-3` | `150ms` | 按钮按下/释放、图标切换 |
| `--duration-short-4` | `200ms` | 选项 hover/focus |
| `--duration-medium-1` | `250ms` | 小面板展开 |
| `--duration-medium-2` | `300ms` | Tab 切换、卡片状态 |
| `--duration-medium-3` | `350ms` | 搜索弹窗、答案展开 |
| `--duration-medium-4` | `400ms` | 页面切换 |
| `--duration-long-1` | `450ms` | Sidebar 滑入 |
| `--duration-long-2` | `500ms` | 进度条动画 |

---

## 动画出现位置 (全部 25 处)

### 一、页面级过渡 (3 处)

| # | 位置 | 当前状态 | 设计方案 | 优先级 |
|---|------|---------|---------|--------|
| 1 | **路由切换** — 所有页面 | `fade-in` (opacity + translateY) | 保留 fade-in 但换用 `--ease-emphasized-decel`，duration 改为 400ms | P0 |
| 2 | **Tab 切换** — QuestionDetail 的 content/quiz | 无过渡，瞬间替换 | 添加 cross-fade：旧内容 fade-out (150ms accel) + 新内容 fade-in (250ms decel) | P1 |
| 3 | **分页切换** — QuestionList 翻页 | 无动画 | 列表区域 fade + 微 translateY (200ms emphasized) | P2 |

### 二、布局 / 导航 (5 处)

| # | 位置 | 当前状态 | 设计方案 | 优先级 |
|---|------|---------|---------|--------|
| 4 | **Sidebar 滑入/滑出** (移动端) | `transition-transform 250ms ease-out` | 换用 `--ease-emphasized`，入 450ms / 出 300ms，加 translateX 弹性 | P0 |
| 5 | **Sidebar 遮罩** (移动端 overlay) | 瞬间出现/消失 | fade-in 200ms decel / fade-out 150ms accel | P0 |
| 6 | **BottomNav 激活指示器** | 仅颜色 transition | 添加 active pill 背景滑动动画 (translate + width morph, 300ms emphasized) | P1 |
| 7 | **Header 搜索栏 hover** | `transition-all 200ms` | 微调为 `150ms --ease-standard`，border 颜色平滑过渡 | P2 |
| 8 | **Sidebar NavLink active** | 仅颜色过渡 | 添加背景色滑入 (background-color 250ms emphasized) | P2 |

### 三、Dashboard 入场 (4 处)

| # | 位置 | 当前状态 | 设计方案 | 优先级 |
|---|------|---------|---------|--------|
| 9 | **Stats 统计卡片** (4 张) | 同时 fade-in | **Stagger 入场**: 每张延迟 50ms, fade-in + scale(0.97→1) + translateY(8→0), 300ms emphasized-decel | P0 |
| 10 | **Domain 知识域卡片** (网格) | `animate-stagger`(实际无延迟) | **Stagger 入场**: 每张延迟 40ms, fade-in + translateY(12→0), 350ms emphasized-decel, 最多 stagger 6 张 | P0 |
| 11 | **"继续上次" 横幅** | 无动画 | slide-in-right (300ms emphasized-decel) + fade-in | P1 |
| 12 | **进度条增长** (DomainCard) | `transition-all 500ms ease-out` | 改为 `500ms --ease-emphasized` + 入场时从 0% 动画增长 | P1 |

### 四、QuestionList 列表页 (3 处)

| # | 位置 | 当前状态 | 设计方案 | 优先级 |
|---|------|---------|---------|--------|
| 13 | **QuestionCard hover** | `bg-secondary + transition-all 200ms` | 添加微 translateX(2px)，border-left accent 色滑入 | P1 |
| 14 | **筛选器面板** | 静态 | 首次入场 fade + translateY (200ms), 筛选变化时列表 fade 过渡 | P2 |
| 15 | **"没有匹配" 空态** | 静态 | scale-in (0.95→1) + fade-in, 300ms emphasized-decel | P2 |

### 五、QuestionDetail 题目详情 (5 处)

| # | 位置 | 当前状态 | 设计方案 | 优先级 |
|---|------|---------|---------|--------|
| 16 | **答案展开/收起** | `animate-slide-up` (展开) / 瞬间消失 (收起) | 展开: translateY(16→0) + fade-in + height 动画 (350ms emphasized-decel)；收起: fade-out + translateY(0→8) (200ms emphasized-accel) | P0 |
| 17 | **收藏星标切换** | 仅颜色过渡 | **弹簧 pop**: scale(1→1.3→1) + rotate(0→-15°→0), 300ms spring easing | P0 |
| 18 | **题目导航 prev/next** | 无切换动画 | 内容区 fade 交叉 (out 150ms → in 250ms) | P1 |
| 19 | **Badge / Tag** (type, difficulty) | 静态 | 微 scale-in (0.9→1, 150ms) 入场 | P2 |
| 20 | **Key Points 列表** | 静态 | 答案展开后 stagger fade-in，每条延迟 30ms | P2 |

### 六、Quiz 选择题面板 (3 处)

| # | 位置 | 当前状态 | 设计方案 | 优先级 |
|---|------|---------|---------|--------|
| 21 | **选项选中态** | border + bg 颜色过渡 | 添加 scale(1→1.01→1) 微弹 + box-shadow 扩散 (200ms emphasized) | P1 |
| 22 | **答题正确反馈** | `animate-slide-up` 展示解释 | 解释面板 slide-up + 正确时选项短暂 pulse(绿光), 350ms | P0 |
| 23 | **答题错误反馈** | 同上 | 解释面板 slide-up + 错误选项 shake (translateX 来回 3 次, 400ms) | P0 |

### 七、SearchModal 搜索弹窗 (2 处)

| # | 位置 | 当前状态 | 设计方案 | 优先级 |
|---|------|---------|---------|--------|
| 24 | **弹窗打开** | `animate-scale-in` (0.975→1) | 增强为 scale(0.92→1) + translateY(16→0) + backdrop fade, 350ms emphasized-decel | P0 |
| 25 | **弹窗关闭** | 瞬间消失 | 添加退出动画: scale(1→0.95) + fade-out, 200ms emphasized-accel | P0 |

---

## 微交互细节补充

### 按钮按下 (Active State)
所有可点击元素 `:active` 添加 `scale(0.97)` 反馈，50ms duration，立即回弹。

### 主题切换图标
Header 中的 Sun/Moon 图标切换时 rotate(180°) + fade cross (300ms emphasized)。

### Progress Bar 入场
所有进度条 (Dashboard、Progress 页) 在 mount 后从 width:0 动画到目标值 (500ms emphasized, 延迟 200ms)。

### Skeleton → 真实内容
骨架屏消失时可用 fade-out (100ms) + 真实内容 fade-in (300ms emphasized-decel)。

### Quiz Dot 当前题
QuizPanel 的圆点导航中，当前题目的 dot 添加 `pulse-soft` 慢呼吸 (2s, 仅在未作答时)。

---

## 实现策略

### Phase 1 — CSS 基础设施 (index.css)
1. 定义 MD3 easing / duration CSS 变量
2. 新增 keyframes: `md-fade-in`, `md-fade-out`, `md-slide-up`, `md-scale-in`, `md-scale-out`, `spring-pop`, `shake`, `progress-grow`
3. 新增 utility classes: `.animate-md-*`, `.stagger-children`, `.active-press`

### Phase 2 — 全局应用 (P0 项)
4. 替换所有页面入场动画为 MD3 版本
5. Sidebar 动画优化
6. 答案展开/收起
7. 收藏弹簧动画
8. Quiz 正确/错误反馈
9. SearchModal 入/出

### Phase 3 — 增强细节 (P1 项)
10. Dashboard stagger 入场
11. Tab 切换 cross-fade
12. BottomNav indicator 滑动
13. QuestionCard hover
14. 题目导航过渡

### Phase 4 — 润色 (P2 项)
15. 剩余细节项

---

## 尊重用户偏好

所有动画必须在 `@media (prefers-reduced-motion: reduce)` 下禁用（已有此规则，确保新动画也受控）。
