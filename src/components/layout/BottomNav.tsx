import { NavLink } from 'react-router-dom';
import { LayoutDashboard, XCircle, TrendingUp, Settings } from 'lucide-react';

export function BottomNav() {
  const items = [
    { to: '/', icon: LayoutDashboard, label: '总览', end: true },
    { to: '/review', icon: XCircle, label: '错题' },
    { to: '/progress', icon: TrendingUp, label: '进度' },
    { to: '/settings', icon: Settings, label: '设置' },
  ];

  return (
    <nav className="bottom-nav lg:hidden fixed inset-x-0 bottom-0 z-40 glass-surface border-t border-[var(--color-notion-border)]">
      <div className="bottom-nav-grid mx-auto grid max-w-lg grid-cols-4 gap-1 px-2">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `group touch-target flex min-w-0 flex-col items-center justify-center gap-0.5 rounded-xl px-2 py-1.5 no-underline transition-[background-color,color] duration-200 active:scale-95 ${
                isActive
                  ? 'text-[var(--color-notion-accent)] bg-[var(--color-notion-accent-light)]'
                  : 'text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-text)]'
              }`
            }
            style={{ transition: 'background-color .2s, color .2s, transform .2s var(--ease-out-back)' }}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`w-[18px] h-[18px] transition-transform duration-300 ease-[cubic-bezier(0.34,1.32,0.64,1)] ${
                    isActive ? 'scale-110' : 'group-hover:scale-105'
                  }`}
                />
                <span
                  className={`truncate text-[10px] leading-none transition-all duration-300 ease-[cubic-bezier(0.34,1.32,0.64,1)] ${
                    isActive ? 'font-semibold' : 'font-medium'
                  }`}
                >
                  {label}
                </span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
