import { useState, useEffect, useLayoutEffect, useCallback, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { SearchModal } from '../ui/SearchModal';
import { useProgressStore } from '../../stores/progressStore';
import { useResolvedTheme } from '../../hooks/useResolvedTheme';

function parseHexColor(color: string) {
  const normalized = color.trim().replace(/^#/, '');
  if (!/^[\da-f]{6}$/i.test(normalized)) return null;
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  };
}

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { settings } = useProgressStore();
  const resolvedTheme = useResolvedTheme();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const appearanceReady = useRef(false);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Scroll to top on route change
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  // Apply all appearance settings in one render pass so theme changes stay in sync.
  useLayoutEffect(() => {
    const root = document.documentElement;
    if (appearanceReady.current && !settings.reduceMotion) {
      root.classList.add('theme-transition');
    } else {
      appearanceReady.current = true;
    }

    root.setAttribute('data-theme', resolvedTheme);
    root.setAttribute('data-font-size', settings.fontSize);
    root.setAttribute('data-reduce-motion', String(settings.reduceMotion));

    const accent = settings.accentColor === 'default'
      ? null
      : parseHexColor(settings.accentColor);
    if (accent) {
      const { r, g, b } = accent;
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      root.style.setProperty('--color-notion-accent', `rgb(${r} ${g} ${b})`);
      root.style.setProperty('--color-notion-accent-light', `rgb(${r} ${g} ${b} / ${resolvedTheme === 'dark' ? 0.2 : 0.13})`);
      root.style.setProperty('--color-notion-on-accent', luminance > 0.62 ? '#2E3440' : '#FFFFFF');
    } else {
      root.style.removeProperty('--color-notion-accent');
      root.style.removeProperty('--color-notion-accent-light');
      root.style.removeProperty('--color-notion-on-accent');
    }

    const transitionTimer = window.setTimeout(() => {
      root.classList.remove('theme-transition');
    }, 350);
    return () => {
      window.clearTimeout(transitionTimer);
      root.classList.remove('theme-transition');
    };
  }, [resolvedTheme, settings.accentColor, settings.fontSize, settings.reduceMotion]);

  // Global Ctrl+K shortcut
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setSearchOpen((o) => !o);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <div className="flex h-[100dvh] min-h-[100dvh] overflow-hidden bg-[var(--color-notion-bg)] transition-colors duration-300">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <Header
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          onOpenSearch={openSearch}
        />

        <main ref={mainRef} className="flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mobile-nav-offset max-w-7xl mx-auto px-4 py-5 sm:px-8 sm:py-10 lg:pb-12">
            <div key={location.pathname}>
              <Outlet />
            </div>
          </div>
        </main>
      </div>

      <BottomNav hidden={sidebarOpen} />
      <SearchModal isOpen={searchOpen} onClose={closeSearch} />
    </div>
  );
}
