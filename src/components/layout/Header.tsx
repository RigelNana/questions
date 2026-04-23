import { Search, Menu, Sun, Moon } from 'lucide-react';
import { useProgressStore } from '../../stores/progressStore';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
}

export function Header({ onToggleSidebar, onOpenSearch }: HeaderProps) {
  const { settings, updateSettings } = useProgressStore();

  const toggleTheme = () => {
    const next = settings.theme === 'dark' ? 'light' : 'dark';
    updateSettings({ theme: next });
  };

  const isDark = settings.theme === 'dark' || (settings.theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

  return (
    <header className="h-13 border-b border-[var(--color-notion-border)] flex items-center px-4 sm:px-5 glass-surface sticky top-0 z-30 transition-colors duration-300">
      {/* Mobile menu button */}
      <button
        onClick={onToggleSidebar}
        className="hover-press lg:hidden p-2 rounded-lg hover:bg-[var(--color-notion-bg-hover)] text-[var(--color-notion-text-secondary)] mr-2"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-[18px] h-[18px]" />
      </button>

      {/* Search trigger */}
      <button
        onClick={onOpenSearch}
        className="group flex-1 max-w-md flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[var(--color-notion-bg-secondary)] text-[var(--color-notion-text-secondary)] text-sm cursor-pointer hover:bg-[var(--color-notion-bg-hover)] transition-[background-color,border-color,color] duration-200 border border-transparent hover:border-[var(--color-notion-border)]"
      >
        <Search className="w-3.5 h-3.5 flex-shrink-0 opacity-60 transition-transform duration-300 ease-[cubic-bezier(0.34,1.32,0.64,1)] group-hover:scale-110 group-hover:opacity-90" />
        <span className="truncate">搜索题目...</span>
        <span className="ml-auto text-xs opacity-40 hidden sm:inline font-mono">
          ⌘K
        </span>
      </button>

      {/* Theme toggle — the icon swaps with a keyed remount so the replaced
          icon plays pop-in (scale + rotate-settle) instead of appearing
          instantly. Rotation comes from check-pop's counter-spin phase. */}
      <button
        onClick={toggleTheme}
        className="hover-press ml-3 p-2 rounded-lg hover:bg-[var(--color-notion-bg-hover)] text-[var(--color-notion-text-secondary)] overflow-hidden"
        aria-label="Toggle theme"
      >
        {isDark ? (
          <Sun key="sun" className="w-[18px] h-[18px] animate-check-pop" />
        ) : (
          <Moon key="moon" className="w-[18px] h-[18px] animate-check-pop" />
        )}
      </button>
    </header>
  );
}
