/** 划线批注的颜色 */
export type HighlightColor = 'yellow' | 'green' | 'pink' | 'purple';

/** 批注所属的段落区域 */
export type HighlightSection = 'content' | 'answer';

/** 一条划线批注记录 */
export interface Highlight {
  id: string;
  questionId: string;
  section: HighlightSection;
  /** 被划线的文本（预览/兜底用） */
  text: string;
  /** 在 section 纯文本内容中的起始字符偏移（含） */
  start: number;
  /** 结束字符偏移（不含） */
  end: number;
  color: HighlightColor;
  /** 可选批注文字 */
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export const HIGHLIGHT_COLORS: HighlightColor[] = ['yellow', 'green', 'pink', 'purple'];

export const HIGHLIGHT_COLOR_LABELS: Record<HighlightColor, string> = {
  yellow: '黄',
  green: '绿',
  pink: '粉',
  purple: '紫',
};
