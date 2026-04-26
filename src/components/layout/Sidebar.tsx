import { NavLink } from "react-router-dom";
import { ALL_DOMAINS, DOMAIN_LABELS, DOMAIN_ICONS } from "../../types";
import {
  Target,
  LayoutDashboard,
  XCircle,
  X,
  TrendingUp,
  Settings,
} from "lucide-react";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export function Sidebar({ isOpen, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay — always mounted, animated via opacity */}
      <div
        className={`fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden transition-opacity ${
          isOpen
            ? "opacity-100 pointer-events-auto"
            : "opacity-0 pointer-events-none"
        }`}
        style={{ transitionDuration: 'var(--duration-medium-2)', transitionTimingFunction: 'var(--ease-standard)' }}
        onClick={onClose}
      />

      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-[var(--color-notion-bg-secondary)]
          border-r border-[var(--color-notion-border)] flex flex-col
          lg:translate-x-0 lg:static lg:z-auto
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
        style={{
          transition: 'translate var(--duration-long-1) var(--ease-emphasized), transform var(--duration-long-1) var(--ease-emphasized), background-color 0.3s ease, border-color 0.3s ease',
        }}
      >
        {/* Logo + Close */}
        <div className="px-5 py-5 border-b border-[var(--color-notion-border)] flex items-center justify-between" style={{ paddingTop: 'calc(1.25rem + env(safe-area-inset-top, 0px))' }}>
          <NavLink
            to="/"
            className="flex items-center gap-2.5 no-underline"
            onClick={onClose}
          >
            <div className="w-7 h-7 rounded-lg bg-[var(--color-notion-accent)] flex items-center justify-center">
              <Target className="w-4 h-4 text-white" />
            </div>
            <span className="font-semibold text-[var(--color-notion-text)] text-[15px] tracking-tight">
              刷题
            </span>
          </NavLink>
          <button
            onClick={onClose}
            className="lg:hidden p-1.5 rounded-lg hover:bg-[var(--color-notion-bg-hover)] text-[var(--color-notion-text-secondary)] transition-colors active-press"
            aria-label="Close sidebar"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          <div className="px-3 py-1">
            <NavLink
              to="/"
              end
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm no-underline transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--color-notion-accent-light)] text-[var(--color-notion-accent)] font-medium"
                    : "text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-bg-hover)] hover:text-[var(--color-notion-text)]"
                }`
              }
            >
              <LayoutDashboard className="w-4 h-4" />
              总览
            </NavLink>
          </div>

          <div className="px-3 pt-5 pb-2">
            <span className="text-[11px] font-semibold text-[var(--color-notion-text-secondary)] uppercase tracking-widest px-3">
              知识域
            </span>
          </div>

          <div className="space-y-0.5">
            {ALL_DOMAINS.map((domain) => {
              const Icon = DOMAIN_ICONS[domain];
              return (
                <div key={domain} className="px-3">
                  <NavLink
                    to={`/domains/${domain}`}
                    onClick={onClose}
                    className={({ isActive }) =>
                      `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm no-underline transition-all duration-200 ${
                        isActive
                          ? "bg-[var(--color-notion-accent-light)] text-[var(--color-notion-accent)] font-medium"
                          : "text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-bg-hover)] hover:text-[var(--color-notion-text)]"
                      }`
                    }
                  >
                    <Icon className="w-4 h-4" />
                    <span>{DOMAIN_LABELS[domain]}</span>
                  </NavLink>
                </div>
              );
            })}
          </div>

          <div className="px-3 pt-5 pb-2">
            <span className="text-[11px] font-semibold text-[var(--color-notion-text-secondary)] uppercase tracking-widest px-3">
              工具
            </span>
          </div>

          <div className="space-y-0.5 px-3">
            <NavLink
              to="/review"
              onClick={onClose}
              className={({ isActive }) =>
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm no-underline transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--color-notion-accent-light)] text-[var(--color-notion-accent)] font-medium"
                    : "text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-bg-hover)] hover:text-[var(--color-notion-text)]"
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
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm no-underline transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--color-notion-accent-light)] text-[var(--color-notion-accent)] font-medium"
                    : "text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-bg-hover)] hover:text-[var(--color-notion-text)]"
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
                `flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm no-underline transition-all duration-200 ${
                  isActive
                    ? "bg-[var(--color-notion-accent-light)] text-[var(--color-notion-accent)] font-medium"
                    : "text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-bg-hover)] hover:text-[var(--color-notion-text)]"
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
