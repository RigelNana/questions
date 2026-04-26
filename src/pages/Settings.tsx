import { useProgressStore } from '../stores/progressStore';
import { Settings as SettingsIcon, AlertTriangle, Keyboard, Sun, Moon, Monitor } from 'lucide-react';

export function Settings() {
  const { settings, updateSettings, resetProgress } = useProgressStore();

  const themeOptions: { value: 'light' | 'dark' | 'system'; icon: typeof Sun; label: string }[] = [
    { value: 'light', icon: Sun, label: '浅色' },
    { value: 'dark', icon: Moon, label: '深色' },
    { value: 'system', icon: Monitor, label: '跟随系统' },
  ];

  return (
    <div className="animate-fade-in">
      <h1 className="text-xl font-bold text-[var(--color-notion-text)] mb-2 flex items-center gap-2">
        <SettingsIcon className="w-5 h-5" /> 设置
      </h1>
      <p className="text-sm text-[var(--color-notion-text-secondary)] mb-6">
        个性化你的刷题体验
      </p>

      <div className="space-y-4 sm:space-y-6 animate-stagger">
        {/* Theme settings */}
        <div className="p-4 sm:p-5 rounded-lg border border-[var(--color-notion-border)]">
          <h3 className="text-base font-semibold text-[var(--color-notion-text)] mb-4">外观</h3>
          <div className="flex gap-3">
            {themeOptions.map(({ value, icon: Icon, label }) => (
              <button
                key={value}
                onClick={() => updateSettings({ theme: value })}
                className={`flex-1 flex flex-col items-center gap-2 py-3 px-3 rounded-lg border-2 transition-all active-press ${
                  settings.theme === value
                    ? 'border-[var(--color-notion-accent)] bg-[var(--color-notion-accent-light)]'
                    : 'border-[var(--color-notion-border)] hover:border-[var(--color-notion-accent)]'
                }`}
              >
                <Icon className={`w-5 h-5 ${settings.theme === value ? 'text-[var(--color-notion-accent)]' : 'text-[var(--color-notion-text-secondary)]'}`} />
                <span className={`text-sm ${settings.theme === value ? 'text-[var(--color-notion-accent)] font-medium' : 'text-[var(--color-notion-text-secondary)]'}`}>
                  {label}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Quiz settings */}
        <div className="p-4 sm:p-5 rounded-lg border border-[var(--color-notion-border)]">
          <h3 className="text-base font-semibold text-[var(--color-notion-text)] mb-4">答题设置</h3>

          <label className="flex items-center justify-between py-2 gap-4">
            <div className="min-w-0">
              <div className="text-sm text-[var(--color-notion-text)]">随机打乱选项顺序</div>
              <div className="text-xs text-[var(--color-notion-text-secondary)]">每次作答时选项顺序不同</div>
            </div>
            <input
              type="checkbox"
              checked={settings.shuffleChoices}
              onChange={(e) => updateSettings({ shuffleChoices: e.target.checked })}
              className="w-4 h-4 accent-[var(--color-notion-accent)]"
            />
          </label>

          <label className="flex items-center justify-between py-2 border-t border-[var(--color-notion-border)] gap-4">
            <div className="min-w-0">
              <div className="text-sm text-[var(--color-notion-text)]">自动展开答案</div>
              <div className="text-xs text-[var(--color-notion-text-secondary)]">进入题目详情时默认展开参考答案</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoExpandAnswer}
              onChange={(e) => updateSettings({ autoExpandAnswer: e.target.checked })}
              className="w-4 h-4 accent-[var(--color-notion-accent)]"
            />
          </label>
        </div>

        {/* Danger zone */}
        <div className="p-4 sm:p-5 rounded-lg border border-[var(--color-notion-error)]">
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
            className="px-4 py-2 text-sm font-medium text-white bg-[var(--color-notion-error)] rounded hover:opacity-90 transition-opacity"
          >
            重置所有进度
          </button>
        </div>

        {/* Keyboard shortcuts */}
        <div className="p-4 sm:p-5 rounded-lg border border-[var(--color-notion-border)]">
          <h3 className="text-base font-semibold text-[var(--color-notion-text)] mb-4 flex items-center gap-1.5">
            <Keyboard className="w-4 h-4" /> 键盘快捷键
          </h3>
          <div className="space-y-2 text-sm">
            {[
              ['←/→', '上一题 / 下一题'],
              ['Space', '展开/收起答案'],
              ['S', '收藏/取消收藏'],
              ['Ctrl+K', '搜索'],
            ].map(([key, desc]) => (
              <div key={key} className="flex items-center justify-between py-1">
                <span className="text-[var(--color-notion-text-secondary)]">{desc}</span>
                <kbd className="px-2 py-0.5 text-xs bg-[var(--color-notion-bg-secondary)] border border-[var(--color-notion-border)] rounded text-[var(--color-notion-text)]">
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
