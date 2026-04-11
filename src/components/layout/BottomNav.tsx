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
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 glass-surface border-t border-[var(--color-notion-border)] safe-bottom">
      <div className="flex items-center justify-around h-16">
        {items.map(({ to, icon: Icon, label, end }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-4 py-2 rounded-xl no-underline transition-all duration-200 ${
                isActive
                  ? 'text-[var(--color-notion-accent)] bg-[var(--color-notion-accent-light)]'
                  : 'text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-text)]'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            <span className="text-[10px] font-medium">{label}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
