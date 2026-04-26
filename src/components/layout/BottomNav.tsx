import { NavLink } from 'react-router-dom';
import { LayoutDashboard, XCircle, TrendingUp, Settings } from 'lucide-react';

interface BottomNavProps {
  hidden?: boolean;
}

export function BottomNav({ hidden }: BottomNavProps) {
  const items = [
    { to: '/', icon: LayoutDashboard, label: '总览', end: true },
    { to: '/review', icon: XCircle, label: '错题' },
    { to: '/progress', icon: TrendingUp, label: '进度' },
    { to: '/settings', icon: Settings, label: '设置' },
  ];

  return (
    <nav
      className={`bottom-nav lg:hidden fixed inset-x-0 bottom-0 z-40 glass-surface border-t border-[var(--color-notion-border)] ${
        hidden ? 'translate-y-full opacity-0 pointer-events-none' : 'translate-y-0 opacity-100'
      }`}
      style={{ transition: 'translate 300ms var(--ease-emphasized), opacity 300ms var(--ease-emphasized)' }}
    >
      <div className="bottom-nav-grid mx-auto grid max-w-lg grid-cols-4 gap-1 px-2">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `touch-target flex min-w-0 flex-col items-center justify-center gap-1.5 px-2 py-1.5 no-underline transition-colors duration-200 ${
                isActive
                  ? 'text-[var(--color-notion-accent)]'
                  : 'text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-text)]'
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span className="relative flex items-center justify-center">
                  <span
                    className={`absolute inset-y-[-4px] inset-x-[-14px] rounded-full transition-all duration-200 ${
                      isActive ? 'bg-[var(--color-notion-accent-light)] scale-100' : 'bg-transparent scale-75'
                    }`}
                  />
                  <Icon className="relative w-[18px] h-[18px]" />
                </span>
                <span className="truncate text-[10px] leading-none font-medium">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
