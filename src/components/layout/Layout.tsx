import { useState, useEffect, useCallback, useRef } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { Sidebar } from './Sidebar';
import { Header } from './Header';
import { BottomNav } from './BottomNav';
import { SearchModal } from '../ui/SearchModal';
import { useProgressStore } from '../../stores/progressStore';

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { settings } = useProgressStore();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Scroll to top on route change
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  // Apply theme
  useEffect(() => {
    const apply = (theme: 'light' | 'dark') => {
      document.documentElement.setAttribute('data-theme', theme);
    };
    if (settings.theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      apply(mq.matches ? 'dark' : 'light');
      const handler = (e: MediaQueryListEvent) => apply(e.matches ? 'dark' : 'light');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    } else {
      apply(settings.theme);
    }
  }, [settings.theme]);

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
