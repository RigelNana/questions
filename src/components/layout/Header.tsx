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
        className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-notion-bg-hover)] text-[var(--color-notion-text-secondary)] mr-2 transition-colors"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-[18px] h-[18px]" />
      </button>

      {/* Search trigger */}
      <button
        onClick={onOpenSearch}
        className="flex-1 max-w-md flex items-center gap-2.5 px-3.5 py-2 rounded-lg bg-[var(--color-notion-bg-secondary)] text-[var(--color-notion-text-secondary)] text-sm cursor-pointer hover:bg-[var(--color-notion-bg-hover)] transition-all duration-200 border border-transparent hover:border-[var(--color-notion-border)]"
      >
        <Search className="w-3.5 h-3.5 flex-shrink-0 opacity-60" />
        <span className="truncate">搜索题目...</span>
        <span className="ml-auto text-xs opacity-40 hidden sm:inline font-mono">
          ⌘K
        </span>
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="ml-3 p-2 rounded-lg hover:bg-[var(--color-notion-bg-hover)] text-[var(--color-notion-text-secondary)] transition-all duration-200 active-press"
        aria-label="Toggle theme"
      >
        {isDark
          ? <Sun key="sun" className="w-[18px] h-[18px] animate-icon-rotate" />
          : <Moon key="moon" className="w-[18px] h-[18px] animate-icon-rotate" />
        }
      </button>
    </header>
  );
}
