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

type RgbColor = NonNullable<ReturnType<typeof parseHexColor>>;

function mixColor(foreground: RgbColor, background: RgbColor, amount: number): RgbColor {
  return {
    r: Math.round(foreground.r * amount + background.r * (1 - amount)),
    g: Math.round(foreground.g * amount + background.g * (1 - amount)),
    b: Math.round(foreground.b * amount + background.b * (1 - amount)),
  };
}

function toRgb(color: RgbColor) {
  return `rgb(${color.r} ${color.g} ${color.b})`;
}

const THEME_SURFACE_PROPERTIES = [
  '--color-notion-bg',
  '--color-notion-bg-secondary',
  '--color-notion-bg-hover',
  '--color-notion-border',
  '--color-notion-code-bg',
  '--color-notion-text-secondary',
  '--color-notion-glass',
] as const;

export function Layout() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { settings } = useProgressStore();
  const resolvedTheme = useResolvedTheme();
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);

  const openSearch = useCallback(() => setSearchOpen(true), []);
  const closeSearch = useCallback(() => setSearchOpen(false), []);

  // Scroll to top on route change
  useEffect(() => {
    mainRef.current?.scrollTo(0, 0);
  }, [location.pathname]);

  // Apply all appearance settings in one render pass so theme changes stay in sync.
  useLayoutEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', resolvedTheme);
    root.setAttribute('data-font-size', settings.fontSize);
    root.setAttribute('data-reduce-motion', String(settings.reduceMotion));

    const accent = settings.accentColor === 'default'
      ? null
      : parseHexColor(settings.accentColor);
    if (accent) {
      const { r, g, b } = accent;
      const luminance = (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
      const dark = resolvedTheme === 'dark';
      const background = mixColor(
        accent,
        dark ? { r: 28, g: 31, b: 39 } : { r: 248, g: 249, b: 251 },
        dark ? 0.14 : 0.08,
      );
      const secondary = mixColor(
        accent,
        dark ? { r: 40, g: 45, b: 56 } : { r: 241, g: 244, b: 248 },
        dark ? 0.22 : 0.14,
      );
      const hover = mixColor(
        accent,
        dark ? { r: 48, g: 55, b: 68 } : { r: 232, g: 237, b: 243 },
        dark ? 0.28 : 0.2,
      );
      const border = mixColor(
        accent,
        dark ? { r: 53, g: 61, b: 74 } : { r: 221, g: 227, b: 234 },
        dark ? 0.3 : 0.22,
      );
      const codeBackground = mixColor(
        accent,
        dark ? { r: 22, g: 25, b: 32 } : { r: 235, g: 239, b: 244 },
        dark ? 0.11 : 0.1,
      );
      const secondaryText = mixColor(
        accent,
        dark ? { r: 211, g: 217, b: 226 } : { r: 58, g: 65, b: 77 },
        dark ? 0.42 : 0.32,
      );

      root.style.setProperty('--color-notion-accent', `rgb(${r} ${g} ${b})`);
      root.style.setProperty('--color-notion-accent-light', `rgb(${r} ${g} ${b} / ${dark ? 0.2 : 0.13})`);
      root.style.setProperty('--color-notion-on-accent', luminance > 0.62 ? '#2E3440' : '#FFFFFF');
      root.style.setProperty('--color-notion-bg', toRgb(background));
      root.style.setProperty('--color-notion-bg-secondary', toRgb(secondary));
      root.style.setProperty('--color-notion-bg-hover', toRgb(hover));
      root.style.setProperty('--color-notion-border', toRgb(border));
      root.style.setProperty('--color-notion-code-bg', toRgb(codeBackground));
      root.style.setProperty('--color-notion-text-secondary', toRgb(secondaryText));
      root.style.setProperty('--color-notion-glass', `rgb(${background.r} ${background.g} ${background.b} / 0.88)`);
    } else {
      root.style.removeProperty('--color-notion-accent');
      root.style.removeProperty('--color-notion-accent-light');
      root.style.removeProperty('--color-notion-on-accent');
      THEME_SURFACE_PROPERTIES.forEach((property) => root.style.removeProperty(property));
    }
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
