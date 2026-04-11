import { NavLink } from 'react-router-dom';
import { ALL_DOMAINS, DOMAIN_LABELS, DOMAIN_ICONS } from '../../types';
import {
  Target,
  LayoutDashboard,
  XCircle,
  TrendingUp,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-[var(--color-notion-bg-secondary)]
          border-r border-[var(--color-notion-border)] flex flex-col
          transition-transform duration-200 ease-in-out
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        {/* Logo */}
        <div className="px-4 py-5 border-b border-[var(--color-notion-border)]">
          <NavLink to="/" className="flex items-center gap-2 no-underline" onClick={onClose}>
            <Target className="w-5 h-5 text-[var(--color-notion-accent)]" />
            <span className="font-semibold text-[var(--color-notion-text)] text-[15px]">
              SRE 刷题
            </span>
          </NavLink>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-2">
          <div className="px-3 py-2">
            <NavLink
              to="/"
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-1.5 rounded text-sm no-underline transition-colors ${
                  isActive
                    ? 'bg-[var(--color-notion-accent-light)] text-[var(--color-notion-accent)]'
                    : 'text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-bg-hover)]'
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              总览
            </NavLink>
          </div>

          <div className="px-3 pt-4 pb-1">
            <span className="text-xs font-medium text-[var(--color-notion-text-secondary)] uppercase tracking-wider px-2">
              知识域
            </span>
          </div>

          {ALL_DOMAINS.map((domain) => {
            const Icon = DOMAIN_ICONS[domain];
            return (
              <div key={domain} className="px-3">
                <NavLink
                  to={`/domains/${domain}`}
                  onClick={onClose}
                  className={({ isActive }) =>
                    `flex items-center gap-2 px-2 py-1.5 rounded text-sm no-underline transition-colors ${
                      isActive
                        ? 'bg-[var(--color-notion-accent-light)] text-[var(--color-notion-accent)]'
                        : 'text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-bg-hover)]'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{DOMAIN_LABELS[domain]}</span>
                </NavLink>
              </div>
            );
          })}

          <div className="px-3 pt-4 pb-1">
            <span className="text-xs font-medium text-[var(--color-notion-text-secondary)] uppercase tracking-wider px-2">
              工具
            </span>
          </div>

          <div className="px-3">
            <NavLink
              to="/review"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-1.5 rounded text-sm no-underline transition-colors ${
                  isActive
                    ? 'bg-[var(--color-notion-accent-light)] text-[var(--color-notion-accent)]'
                    : 'text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-bg-hover)]'
                }`
              }
            >
              <XCircle className="w-4 h-4" />
              错题回顾
            </NavLink>
            <NavLink
              to="/progress"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-1.5 rounded text-sm no-underline transition-colors ${
                  isActive
                    ? 'bg-[var(--color-notion-accent-light)] text-[var(--color-notion-accent)]'
                    : 'text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-bg-hover)]'
                }`
              }
            >
              <TrendingUp className="w-4 h-4" />
              学习进度
            </NavLink>
            <NavLink
              to="/settings"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2 px-2 py-1.5 rounded text-sm no-underline transition-colors ${
                  isActive
                    ? 'bg-[var(--color-notion-accent-light)] text-[var(--color-notion-accent)]'
                    : 'text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-bg-hover)]'
                }`
              }
            >
              <Settings className="w-4 h-4" />
              设置
            </NavLink>
          </div>
        </nav>
      </aside>
    </>
  );
}
