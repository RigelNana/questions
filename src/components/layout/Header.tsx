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
    <header className="h-12 border-b border-[var(--color-notion-border)] flex items-center px-3 sm:px-4 bg-[var(--color-notion-bg)] sticky top-0 z-30 transition-colors duration-200">
      {/* Mobile menu button */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-1.5 rounded hover:bg-[var(--color-notion-bg-hover)] text-[var(--color-notion-text-secondary)] mr-2"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-[18px] h-[18px]" />
      </button>

      {/* Search trigger */}
      <button
        onClick={onOpenSearch}
        className="flex-1 max-w-md flex items-center gap-2 px-3 py-1.5 rounded bg-[var(--color-notion-bg-secondary)] text-[var(--color-notion-text-secondary)] text-sm cursor-pointer hover:bg-[var(--color-notion-bg-hover)] transition-colors border-none"
      >
        <Search className="w-3.5 h-3.5 flex-shrink-0" />
        <span className="truncate">搜索题目...</span>
        <span className="ml-auto text-xs text-[var(--color-notion-text-secondary)] opacity-50 hidden sm:inline">
          Ctrl+K
        </span>
      </button>

      {/* Theme toggle */}
      <button
        onClick={toggleTheme}
        className="ml-2 p-1.5 rounded hover:bg-[var(--color-notion-bg-hover)] text-[var(--color-notion-text-secondary)] transition-colors"
        aria-label="Toggle theme"
      >
        {isDark ? <Sun className="w-[18px] h-[18px]" /> : <Moon className="w-[18px] h-[18px]" />}
      </button>
    </header>
  );
}
