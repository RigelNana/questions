import { Search, Menu, Sun, Moon, ChevronLeft } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useProgressStore } from '../../stores/progressStore';
import { WindowControls } from './WindowControls';
import { useResolvedTheme } from '../../hooks/useResolvedTheme';
import { isElectronEnv } from '../../utils/platform';
import { runAppearanceTransition } from '../../utils/appearanceTransition';

interface HeaderProps {
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
}

const TOP_LEVEL_PATHS = ['/', '/bookmarks', '/review', '/progress', '/settings'];
const electron = isElectronEnv();

export function Header({ onToggleSidebar, onOpenSearch }: HeaderProps) {
  const { settings, updateSettings } = useProgressStore();
  const resolvedTheme = useResolvedTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const toggleTheme = () => {
    const next = resolvedTheme === 'dark' ? 'light' : 'dark';
    runAppearanceTransition(
      () => updateSettings({ theme: next }),
      settings.reduceMotion,
    );
  };

  const isDark = resolvedTheme === 'dark';
  const isSubPage = !TOP_LEVEL_PATHS.includes(location.pathname);

  return (
    <header
      className="border-b border-[var(--color-notion-border)] flex items-center px-4 sm:px-5 glass-surface sticky top-0 z-30"
      style={{
        height: 'calc(3.25rem + env(safe-area-inset-top, 0px))',
        paddingTop: 'env(safe-area-inset-top, 0px)',
        ...(electron ? { WebkitAppRegion: 'drag' } as React.CSSProperties : {}),
      }}
    >
      {/* Back button — visible on sub-pages */}
      {isSubPage && (
        <button
          onClick={() => navigate(-1)}
          className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-notion-bg-hover)] text-[var(--color-notion-text-secondary)] transition-colors active-press [-webkit-app-region:no-drag] animate-fade-in"
          aria-label="Go back"
        >
          <ChevronLeft className="w-[18px] h-[18px]" />
        </button>
      )}

      {/* Sidebar toggle — always visible on mobile */}
      <button
        onClick={onToggleSidebar}
        className="lg:hidden p-2 rounded-lg hover:bg-[var(--color-notion-bg-hover)] text-[var(--color-notion-text-secondary)] mr-2 transition-colors [-webkit-app-region:no-drag]"
        aria-label="Toggle sidebar"
      >
        <Menu className="w-[18px] h-[18px]" />
      </button>

      {/* Search trigger */}
      <button
        onClick={onOpenSearch}
        className="search-control box-border flex flex-1 max-w-md items-center gap-2.5 rounded-lg border border-[var(--color-notion-border)] bg-[var(--color-notion-bg-secondary)] px-4 py-2 text-sm text-[var(--color-notion-text-secondary)] transition-colors duration-200 hover:bg-[var(--color-notion-bg-hover)] [-webkit-app-region:no-drag]"
        aria-label="搜索题目"
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
        className="ml-3 p-2 rounded-lg hover:bg-[var(--color-notion-bg-hover)] text-[var(--color-notion-text-secondary)] transition-all duration-200 active-press [-webkit-app-region:no-drag]"
        aria-label={isDark ? '切换到浅色模式' : '切换到深色模式'}
        title={settings.theme === 'system' ? '当前跟随系统，点击切换为手动模式' : undefined}
      >
        {isDark
          ? <Sun key="sun" className="w-[18px] h-[18px] animate-icon-rotate" />
          : <Moon key="moon" className="w-[18px] h-[18px] animate-icon-rotate" />
        }
      </button>

      {/* Electron window controls (Windows/Linux only) */}
      <WindowControls />
    </header>
  );
}
