import { useProgressStore } from '../stores/progressStore';
import { runAppearanceTransition } from '../utils/appearanceTransition';
import { Link } from 'react-router-dom';
import { Toggle } from '../components/ui/Toggle';
import {
  Settings as SettingsIcon,
  AlertTriangle,
  Keyboard,
  Sun,
  Moon,
  Monitor,
  Palette,
  Type,
  Accessibility,
  Bot,
  ChevronRight,
} from 'lucide-react';

const ACCENT_OPTIONS = [
  { value: 'default', label: 'Nord', color: '#5E81AC' },
  { value: '#486FA8', label: '海蓝', color: '#486FA8' },
  { value: '#7C5CBF', label: '鸢紫', color: '#7C5CBF' },
  { value: '#16827B', label: '松绿', color: '#16827B' },
  { value: '#B64F70', label: '莓红', color: '#B64F70' },
  { value: '#B56B27', label: '暖橙', color: '#B56B27' },
] as const;

export function Settings() {
  const { settings, updateSettings, resetProgress } = useProgressStore();

  const themeOptions: { value: 'light' | 'dark' | 'system'; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: '浅色' },
    { value: 'dark', icon: Moon, label: '深色' },
    { value: 'system', icon: Monitor, label: '跟随系统' },
  ];
  const updateAppearance = (next: Parameters<typeof updateSettings>[0]) => {
    runAppearanceTransition(
      () => updateSettings(next),
      settings.reduceMotion,
    );
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-xl font-bold text-[var(--color-notion-text)] mb-2 flex items-center gap-2">
        <SettingsIcon className="w-5 h-5" /> 设置
      </h1>
      <p className="text-sm text-[var(--color-notion-text-secondary)] mb-6">
        个性化你的刷题体验
      </p>

      <div className="space-y-4 sm:space-y-6 animate-stagger">
        <Link
          to="/settings/agent"
          className="group flex items-center gap-4 rounded-xl border border-[var(--color-notion-accent)]/40 bg-[var(--color-notion-accent-light)] p-4 text-left no-underline transition-colors hover:border-[var(--color-notion-accent)] sm:p-5"
        >
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl bg-[var(--color-notion-accent)] text-[var(--color-notion-on-accent)]">
            <Bot className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="text-base font-semibold text-[var(--color-notion-text)]">Pi AI Agent</h3>
            <p className="mt-0.5 text-xs text-[var(--color-notion-text-secondary)]">
              Provider、模型、Skills、工具、Loop、上下文压缩与权限策略
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-[var(--color-notion-text-secondary)] transition-transform group-hover:translate-x-1" />
        </Link>

        {/* Theme settings */}
        <div className="p-4 sm:p-5 rounded-xl border border-[var(--color-notion-border)] hover:border-[var(--color-notion-accent)]/30 transition-colors duration-200">
          <h3 className="text-base font-semibold text-[var(--color-notion-text)] mb-4">外观</h3>
          <div className="grid grid-cols-3 gap-2 sm:gap-3">
            {themeOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => updateAppearance({ theme: value })}
                className={`flex-1 flex flex-col items-center gap-2.5 py-3.5 px-3 rounded-xl border-2 transition-all duration-200 active-press ${
                  settings.theme === value
                    ? 'border-[var(--color-notion-accent)] bg-[var(--color-notion-accent-light)] shadow-sm shadow-[var(--color-notion-accent)]/10'
                    : 'border-[var(--color-notion-border)] hover:border-[var(--color-notion-accent)]/50'
                }`}
              >
                <Icon className={`w-5 h-5 ${settings.theme === value ? 'text-[var(--color-notion-accent)]' : 'text-[var(--color-notion-text-secondary)]'}`} />
                <span className={`text-sm ${settings.theme === value ? 'text-[var(--color-notion-accent)] font-medium' : 'text-[var(--color-notion-text-secondary)]'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 border-t border-[var(--color-notion-border)] pt-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--color-notion-text)]">
              <Palette className="h-4 w-4" /> 页面主题色
            </div>
            <p className="mb-3 text-xs text-[var(--color-notion-text-secondary)]">
              同步调整强调色、页面背景、卡片和边框色调
            </p>
            <div className="flex flex-wrap items-center gap-2.5">
              {ACCENT_OPTIONS.map((option) => (
                <button
                  key={option.value}
                  onClick={() => updateAppearance({ accentColor: option.value })}
                  className={`group flex items-center gap-2 rounded-lg border px-2.5 py-2 text-xs transition-colors ${
                    settings.accentColor === option.value
                      ? 'border-[var(--color-notion-accent)] bg-[var(--color-notion-accent-light)] text-[var(--color-notion-text)]'
                      : 'border-[var(--color-notion-border)] text-[var(--color-notion-text-secondary)] hover:border-[var(--color-notion-accent)]'
                  }`}
                  aria-pressed={settings.accentColor === option.value}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-black/10 shadow-sm"
                    style={{ backgroundColor: option.color }}
                  />
                  {option.label}
                </button>
              ))}
              <label className="flex cursor-pointer items-center gap-2 rounded-lg border border-[var(--color-notion-border)] px-2.5 py-2 text-xs text-[var(--color-notion-text-secondary)] transition-colors hover:border-[var(--color-notion-accent)]">
                <input
                  type="color"
                  value={settings.accentColor === 'default' ? '#5E81AC' : settings.accentColor}
                  onChange={(event) => updateAppearance({ accentColor: event.target.value.toUpperCase() })}
                  className="compact-control h-4 w-4 cursor-pointer border-0 bg-transparent p-0"
                  aria-label="自定义主题色"
                />
                自定义
              </label>
            </div>
          </div>

          <div className="mt-5 border-t border-[var(--color-notion-border)] pt-5">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-[var(--color-notion-text)]">
              <Type className="h-4 w-4" /> 阅读字号
            </div>
            <div className="grid grid-cols-3 gap-2 rounded-xl bg-[var(--color-notion-bg-secondary)] p-1">
              {([
                ['small', '小'],
                ['medium', '标准'],
                ['large', '大'],
              ] as const).map(([value, label]) => (
                <button
                  key={value}
                  onClick={() => updateAppearance({ fontSize: value })}
                  className={`rounded-lg px-3 py-2 text-sm transition-colors ${
                    settings.fontSize === value
                      ? 'bg-[var(--color-notion-bg)] font-medium text-[var(--color-notion-accent)] shadow-sm'
                      : 'text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-text)]'
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between gap-4 border-t border-[var(--color-notion-border)] pt-5">
            <div className="min-w-0">
              <div className="flex items-center gap-2 text-sm text-[var(--color-notion-text)]">
                <Accessibility className="h-4 w-4" /> 减少界面动效
              </div>
              <div className="mt-0.5 text-xs text-[var(--color-notion-text-secondary)]">关闭页面入场、弹跳和主题过渡动画</div>
            </div>
            <Toggle
              checked={settings.reduceMotion}
              onChange={(value) => updateSettings({ reduceMotion: value })}
            />
          </div>
        </div>

        {/* Quiz settings */}
        <div className="p-4 sm:p-5 rounded-xl border border-[var(--color-notion-border)] hover:border-[var(--color-notion-accent)]/30 transition-colors duration-200">
          <h3 className="text-base font-semibold text-[var(--color-notion-text)] mb-4">答题设置</h3>

          <div className="flex items-center justify-between py-2.5 gap-4">
            <div className="min-w-0">
              <div className="text-sm text-[var(--color-notion-text)]">随机打乱选项顺序</div>
              <div className="text-xs text-[var(--color-notion-text-secondary)] mt-0.5">避免正确选项总在固定位置</div>
            </div>
            <Toggle
              checked={settings.shuffleChoices}
              onChange={(v) => updateSettings({ shuffleChoices: v })}
            />
          </div>

          <div className="flex items-center justify-between py-2.5 border-t border-[var(--color-notion-border)] gap-4">
            <div className="min-w-0">
              <div className="text-sm text-[var(--color-notion-text)]">默认打开答案</div>
              <div className="text-xs text-[var(--color-notion-text-secondary)] mt-0.5">进入题目详情时默认显示参考答案标签</div>
            </div>
            <Toggle
              checked={settings.autoExpandAnswer}
              onChange={(v) => updateSettings({ autoExpandAnswer: v })}
            />
          </div>

        </div>

        {/* Danger zone */}
        <div className="p-4 sm:p-5 rounded-xl border border-[var(--color-notion-error)]/40 hover:border-[var(--color-notion-error)] transition-colors duration-200">
          <h3 className="text-base font-semibold text-[var(--color-notion-error)] mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-4 h-4" /> 危险操作
          </h3>
          <p className="text-sm text-[var(--color-notion-text-secondary)] mb-4">
            重置所有学习进度、收藏和答题记录，此操作不可撤销。
          </p>
          <button
            onClick={() => {
              if (window.confirm('确定要重置所有进度吗？此操作不可撤销！')) {
                resetProgress();
              }
            }}
            className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-notion-error)] rounded-lg hover:opacity-90 transition-opacity active-press"
          >
            重置所有进度
          </button>
        </div>

        {/* Keyboard shortcuts */}
        <div className="p-4 sm:p-5 rounded-xl border border-[var(--color-notion-border)] hover:border-[var(--color-notion-accent)]/30 transition-colors duration-200">
          <h3 className="text-base font-semibold text-[var(--color-notion-text)] mb-4 flex items-center gap-1.5">
            <Keyboard className="w-4 h-4" /> 键盘快捷键
          </h3>
          <div className="space-y-2 text-sm">
            {[
              ['←/→', '选择题内切题，到边界后切换知识点'],
              ['1-9 / A-I', '选择当前选项'],
              ['Space', '切换题目 / 答案标签'],
              ['S', '收藏/取消收藏'],
              ['Ctrl+K', '搜索'],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center justify-between py-1.5">
                <span className="text-[var(--color-notion-text-secondary)]">{desc}</span>
                <kbd className="px-2.5 py-1 text-xs bg-[var(--color-notion-bg-secondary)] border border-[var(--color-notion-border)] rounded-md text-[var(--color-notion-text)] font-mono shadow-sm">
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
