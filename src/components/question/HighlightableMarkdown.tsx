import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { createPortal } from 'react-dom';
import { MessageSquarePlus, Trash2, X, Check, Palette } from 'lucide-react';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import { useHighlightStore } from '../../stores/highlightStore';
import {
  applyHighlights,
  getRangeOffsets,
  HL_ATTR,
} from '../../utils/highlightDom';
import {
  HIGHLIGHT_COLORS,
  type Highlight,
  type HighlightColor,
  type HighlightSection,
} from '../../types';

interface HighlightableMarkdownProps {
  content: string;
  questionId: string;
  section: HighlightSection;
  className?: string;
}

type ToolbarState =
  | {
      kind: 'new';
      anchorRect: DOMRect;
      text: string;
      start: number;
      end: number;
    }
  | { kind: 'edit'; anchorRect: DOMRect; highlight: Highlight }
  | null;

export function HighlightableMarkdown({
  content,
  questionId,
  section,
  className,
}: HighlightableMarkdownProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const byKey = useHighlightStore((s) => s.byKey);
  const addHighlight = useHighlightStore((s) => s.addHighlight);
  const updateHighlight = useHighlightStore((s) => s.updateHighlight);
  const removeHighlight = useHighlightStore((s) => s.removeHighlight);

  const highlights = useMemo(
    () => byKey[`${questionId}::${section}`] ?? [],
    [byKey, questionId, section],
  );

  const [toolbar, setToolbar] = useState<ToolbarState>(null);
  const [noteDraft, setNoteDraft] = useState<string>('');
  const [noteMode, setNoteMode] = useState<boolean>(false);

  // 每次 highlights / content 变化，重新在 DOM 中铺设 <mark>。
  useLayoutEffect(() => {
    const c = containerRef.current;
    if (!c) return;
    applyHighlights(c, highlights);
  }, [content, highlights]);

  // 捕获文本选区（mouseup / touchend 后触发一次）
  const captureSelection = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const sel = window.getSelection();
    if (!sel || sel.isCollapsed || sel.rangeCount === 0) return;
    const range = sel.getRangeAt(0);
    const offs = getRangeOffsets(c, range);
    if (!offs) return;
    const rect = range.getBoundingClientRect();
    if (rect.width === 0 && rect.height === 0) return;

    setToolbar({
      kind: 'new',
      anchorRect: rect,
      text: offs.text,
      start: offs.start,
      end: offs.end,
    });
    setNoteMode(false);
    setNoteDraft('');
  }, []);

  const handleMouseUp = useCallback(() => {
    // 推迟一个 tick，确保浏览器完成选区更新
    setTimeout(captureSelection, 0);
  }, [captureSelection]);

  const handleTouchEnd = useCallback(() => {
    setTimeout(captureSelection, 50);
  }, [captureSelection]);

  // 点击已有 <mark> 打开编辑态
  const handleContainerClick = useCallback(
    (e: React.MouseEvent<HTMLDivElement>) => {
      const sel = window.getSelection();
      if (sel && !sel.isCollapsed) return; // 拖选时不触发
      const target = e.target as HTMLElement;
      const mark = target.closest(`[${HL_ATTR}]`) as HTMLElement | null;
      if (!mark) return;
      const id = mark.getAttribute(HL_ATTR);
      if (!id) return;
      const hl = highlights.find((h) => h.id === id);
      if (!hl) return;
      e.stopPropagation();
      setToolbar({
        kind: 'edit',
        anchorRect: mark.getBoundingClientRect(),
        highlight: hl,
      });
      setNoteDraft(hl.note ?? '');
      setNoteMode(!!hl.note);
    },
    [highlights],
  );

  // 全局交互：滚动 / 外部点击 / Esc 关闭
  useEffect(() => {
    if (!toolbar) return;
    const onScroll = () => setToolbar(null);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setToolbar(null);
    };
    const onPointerDown = (e: MouseEvent) => {
      const t = e.target as HTMLElement;
      if (t.closest('[data-hl-toolbar]')) return;
      if (t.closest(`[${HL_ATTR}]`)) return;
      // 在内容区拖选时，mousedown 会触发 onPointerDown。只在 new 模式下关闭
      // 才需要判断，edit 模式点击内容区以外即关闭。
      setToolbar(null);
    };
    window.addEventListener('scroll', onScroll, true);
    window.addEventListener('keydown', onKey);
    window.addEventListener('pointerdown', onPointerDown, true);
    return () => {
      window.removeEventListener('scroll', onScroll, true);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('pointerdown', onPointerDown, true);
    };
  }, [toolbar]);

  // ── Actions ──
  const createHighlight = useCallback(
    (color: HighlightColor, note?: string) => {
      if (toolbar?.kind !== 'new') return;
      addHighlight({
        questionId,
        section,
        text: toolbar.text.slice(0, 200),
        start: toolbar.start,
        end: toolbar.end,
        color,
        note: note?.trim() ? note.trim() : undefined,
      });
      window.getSelection()?.removeAllRanges();
      setToolbar(null);
      setNoteMode(false);
      setNoteDraft('');
    },
    [toolbar, addHighlight, questionId, section],
  );

  const changeColor = useCallback(
    (color: HighlightColor) => {
      if (toolbar?.kind !== 'edit') return;
      updateHighlight(toolbar.highlight.id, { color });
      setToolbar({
        ...toolbar,
        highlight: { ...toolbar.highlight, color },
      });
    },
    [toolbar, updateHighlight],
  );

  const saveNote = useCallback(() => {
    const text = noteDraft.trim();
    if (toolbar?.kind === 'new') {
      createHighlight('yellow', text || undefined);
    } else if (toolbar?.kind === 'edit') {
      updateHighlight(toolbar.highlight.id, {
        note: text || undefined,
      });
      setToolbar({
        ...toolbar,
        highlight: { ...toolbar.highlight, note: text || undefined },
      });
      setNoteMode(false);
    }
  }, [noteDraft, toolbar, createHighlight, updateHighlight]);

  const deleteHighlight = useCallback(() => {
    if (toolbar?.kind !== 'edit') return;
    removeHighlight(toolbar.highlight.id);
    setToolbar(null);
  }, [toolbar, removeHighlight]);

  return (
    <div className={className}>
      <div
        ref={containerRef}
        onMouseUp={handleMouseUp}
        onTouchEnd={handleTouchEnd}
        onClick={handleContainerClick}
      >
        <MarkdownRenderer content={content} />
      </div>
      {toolbar && (
        <HighlightToolbar
          state={toolbar}
          noteMode={noteMode}
          noteDraft={noteDraft}
          onNoteDraftChange={setNoteDraft}
          onRequestNote={() => setNoteMode(true)}
          onPickColor={(color) => {
            if (toolbar.kind === 'new') createHighlight(color);
            else changeColor(color);
          }}
          onSaveNote={saveNote}
          onCancelNote={() => {
            if (toolbar.kind === 'edit') {
              setNoteMode(false);
              setNoteDraft(toolbar.highlight.note ?? '');
            } else {
              setNoteMode(false);
              setNoteDraft('');
            }
          }}
          onDelete={toolbar.kind === 'edit' ? deleteHighlight : undefined}
          onClose={() => setToolbar(null)}
        />
      )}
    </div>
  );
}

// ────────────────────────────────────────────────────────────────────────────
// Floating toolbar (Portal → document.body)
// ────────────────────────────────────────────────────────────────────────────

interface HighlightToolbarProps {
  state: NonNullable<ToolbarState>;
  noteMode: boolean;
  noteDraft: string;
  onNoteDraftChange: (v: string) => void;
  onRequestNote: () => void;
  onPickColor: (color: HighlightColor) => void;
  onSaveNote: () => void;
  onCancelNote: () => void;
  onDelete?: () => void;
  onClose: () => void;
}

const COLOR_DOT_CLASS: Record<HighlightColor, string> = {
  yellow: 'hl-swatch hl-swatch-yellow',
  green: 'hl-swatch hl-swatch-green',
  pink: 'hl-swatch hl-swatch-pink',
  purple: 'hl-swatch hl-swatch-purple',
};

function HighlightToolbar({
  state,
  noteMode,
  noteDraft,
  onNoteDraftChange,
  onRequestNote,
  onPickColor,
  onSaveNote,
  onCancelNote,
  onDelete,
  onClose,
}: HighlightToolbarProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

  const activeColor =
    state.kind === 'edit' ? state.highlight.color : undefined;

  // 测量自身宽高，计算定位（视口坐标）
  useLayoutEffect(() => {
    if (!ref.current) return;
    const el = ref.current;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    const anchor = state.anchorRect;
    const margin = 8;
    const preferAbove = anchor.top >= h + margin + 4;
    const top = preferAbove
      ? anchor.top - h - margin
      : Math.min(
          anchor.bottom + margin,
          window.innerHeight - h - margin,
        );
    let left = anchor.left + anchor.width / 2 - w / 2;
    left = Math.max(margin, Math.min(left, window.innerWidth - w - margin));
    setPos({ top, left });
  }, [state, noteMode]);

  const hasNote =
    state.kind === 'edit' && !!state.highlight.note && !noteMode;

  return createPortal(
    <div
      ref={ref}
      data-hl-toolbar
      style={{
        position: 'fixed',
        top: pos?.top ?? -9999,
        left: pos?.left ?? -9999,
        zIndex: 60,
        opacity: pos ? 1 : 0,
        transition: 'opacity 0.12s ease',
      }}
      className="animate-scale-in rounded-xl border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] shadow-lg shadow-black/5 dark:shadow-black/40"
      onMouseDown={(e) => e.preventDefault()}
    >
      {noteMode ? (
        <div className="flex w-[min(20rem,calc(100vw-2rem))] flex-col gap-2 p-2.5">
          {state.kind === 'edit' && state.highlight.text && (
            <div className="text-[11px] text-[var(--color-notion-text-secondary)] line-clamp-2 border-l-2 border-[var(--color-notion-accent)]/50 pl-2">
              “{state.highlight.text}”
            </div>
          )}
          <textarea
            value={noteDraft}
            onChange={(e) => onNoteDraftChange(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) {
                e.preventDefault();
                onSaveNote();
              } else if (e.key === 'Escape') {
                e.preventDefault();
                onCancelNote();
              }
            }}
            placeholder="写点想法… (Ctrl/⌘ + Enter 保存)"
            autoFocus
            rows={3}
            className="w-full resize-y rounded-md border border-[var(--color-notion-border)] bg-[var(--color-notion-bg-secondary)] px-2 py-1.5 text-sm text-[var(--color-notion-text)] outline-none focus:border-[var(--color-notion-accent)] focus:ring-1 focus:ring-[var(--color-notion-accent)]/40"
          />
          <div className="flex items-center justify-between gap-2">
            <button
              onClick={onCancelNote}
              className="text-xs text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-text)] transition-colors"
            >
              取消
            </button>
            <button
              onClick={onSaveNote}
              className="inline-flex items-center gap-1 rounded-md bg-[var(--color-notion-accent)] px-2.5 py-1 text-xs font-medium text-white hover:opacity-90"
            >
              <Check className="w-3.5 h-3.5" /> 保存
            </button>
          </div>
        </div>
      ) : (
        <div className="flex flex-col">
          <div className="flex items-center gap-1 px-2 py-1.5">
            <div className="flex items-center gap-1 pr-1">
              {HIGHLIGHT_COLORS.map((c) => (
                <button
                  key={c}
                  onClick={() => onPickColor(c)}
                  className={`${COLOR_DOT_CLASS[c]} ${
                    activeColor === c ? 'hl-swatch-active' : ''
                  }`}
                  aria-label={`选择 ${c} 色`}
                  title={c}
                />
              ))}
            </div>
            <span className="mx-0.5 h-4 w-px bg-[var(--color-notion-border)]" />
            <button
              onClick={onRequestNote}
              className="flex h-7 items-center gap-1 rounded-md px-1.5 text-xs text-[var(--color-notion-text)] hover:bg-[var(--color-notion-bg-hover)]"
              title="添加批注"
            >
              <MessageSquarePlus className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">批注</span>
            </button>
            {onDelete && (
              <button
                onClick={onDelete}
                className="flex h-7 items-center gap-1 rounded-md px-1.5 text-xs text-[var(--color-notion-error)] hover:bg-[var(--color-notion-error-light)]"
                title="删除"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
            <button
              onClick={onClose}
              className="flex h-7 w-7 items-center justify-center rounded-md text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-bg-hover)] hover:text-[var(--color-notion-text)]"
              aria-label="关闭"
              title="关闭"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
          {hasNote && state.kind === 'edit' && (
            <div className="max-w-[min(22rem,calc(100vw-2rem))] border-t border-[var(--color-notion-border)] px-3 py-2">
              <div className="mb-1.5 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-[var(--color-notion-text-secondary)]">
                <Palette className="w-3 h-3" /> 批注
              </div>
              <p className="whitespace-pre-wrap text-xs leading-relaxed text-[var(--color-notion-text)]">
                {state.highlight.note}
              </p>
              <button
                onClick={onRequestNote}
                className="mt-1.5 text-[11px] text-[var(--color-notion-accent)] hover:underline"
              >
                编辑
              </button>
            </div>
          )}
        </div>
      )}
    </div>,
    document.body,
  );
}
