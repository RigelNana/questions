/**
 * DOM 工具：基于纯文本偏移在容器内实施划线批注。
 *
 * 设计原则：
 *  - 偏移量相对于 container 的 plain text（textContent）。
 *  - ReactMarkdown 每次渲染都重建 DOM，因此我们总是先 unwrap 再重新 wrap，
 *    保证状态与 store 一致。
 *  - 注入的 <mark> 带 data-hl-id 属性，便于识别与反向清理。
 */

export const HL_ATTR = 'data-hl-id';
export const HL_NOTE_ATTR = 'data-hl-note';
const HL_CLASS = 'hl';

export interface RangeOffsets {
  start: number;
  end: number;
  text: string;
}

export interface HighlightLike {
  id: string;
  start: number;
  end: number;
  color: string;
  note?: string;
}

/**
 * 计算 Range 在 container 中对应的纯文本起止偏移。
 * 若 Range 越出 container 或长度为 0 则返回 null。
 */
export function getRangeOffsets(
  container: HTMLElement,
  range: Range,
): RangeOffsets | null {
  if (
    !container.contains(range.startContainer) ||
    !container.contains(range.endContainer)
  ) {
    return null;
  }

  const probe = range.cloneRange();
  probe.selectNodeContents(container);
  probe.setEnd(range.startContainer, range.startOffset);
  const start = probe.toString().length;

  probe.setEnd(range.endContainer, range.endOffset);
  const end = probe.toString().length;

  const text = range.toString();
  if (end <= start) return null;
  if (text.trim().length === 0) return null;

  return { start, end, text };
}

/** 解包所有 data-hl-id 标注，使 container 恢复为纯内容状态。 */
export function unwrapHighlights(container: HTMLElement): void {
  const marks = container.querySelectorAll<HTMLElement>(`[${HL_ATTR}]`);
  marks.forEach((mark) => {
    const parent = mark.parentNode;
    if (!parent) return;
    while (mark.firstChild) {
      parent.insertBefore(mark.firstChild, mark);
    }
    parent.removeChild(mark);
  });
  // 合并相邻文本节点，避免偏移量计算出现碎片差异
  container.normalize();
}

/**
 * 按 highlights 列表的顺序（已按 start 升序）将对应范围包裹为 <mark>。
 * 重叠部分会形成嵌套 <mark>，由 CSS 处理层叠效果。
 */
export function applyHighlights(
  container: HTMLElement,
  highlights: HighlightLike[],
): void {
  unwrapHighlights(container);
  if (!highlights.length) return;

  const sorted = [...highlights].sort(
    (a, b) => a.start - b.start || a.end - b.end,
  );

  for (const h of sorted) {
    wrapRange(container, h);
  }
}

function wrapRange(container: HTMLElement, h: HighlightLike): void {
  if (h.end <= h.start) return;

  const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
  const targets: Array<{
    node: Text;
    localStart: number;
    localEnd: number;
  }> = [];

  let acc = 0;
  let cur = walker.nextNode() as Text | null;
  while (cur) {
    const len = cur.nodeValue?.length ?? 0;
    const nodeStart = acc;
    const nodeEnd = acc + len;
    acc = nodeEnd;

    if (nodeStart >= h.end) break;
    if (nodeEnd > h.start && nodeStart < h.end && len > 0) {
      const localStart = Math.max(0, h.start - nodeStart);
      const localEnd = Math.min(len, h.end - nodeStart);
      if (localEnd > localStart) {
        targets.push({ node: cur, localStart, localEnd });
      }
    }
    cur = walker.nextNode() as Text | null;
  }

  for (const { node, localStart, localEnd } of targets) {
    // 注意：splitText 会修改引用节点本身，但不会影响其他 targets 中的节点引用
    let target: Text = node;
    const nodeLen = target.nodeValue?.length ?? 0;
    if (localEnd < nodeLen) {
      target.splitText(localEnd);
    }
    if (localStart > 0) {
      target = target.splitText(localStart);
    }
    const parent = target.parentNode;
    if (!parent) continue;

    const mark = document.createElement('mark');
    mark.setAttribute(HL_ATTR, h.id);
    mark.className = `${HL_CLASS} hl-${h.color}`;
    if (h.note && h.note.trim().length > 0) {
      mark.setAttribute(HL_NOTE_ATTR, 'true');
    }
    parent.insertBefore(mark, target);
    mark.appendChild(target);
  }
}
