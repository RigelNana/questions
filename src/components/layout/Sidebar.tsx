import { NavLink } from "react-router-dom";
import { ALL_DOMAINS, DOMAIN_LABELS, DOMAIN_ICONS } from "../../types";
import {
  Target,
  LayoutDashboard,
  XCircle,
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
      {/* Mobile overlay — explicit fade-in avoids the backdrop flashing. */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40 lg:hidden animate-fade-in"
          onClick={onClose}
        />
      )}

      {/*
        Mobile slide-in uses back-ease so the panel feels like it catches itself
        at the edge instead of smacking flat against the gutter.
        Duration is ~420ms: long enough to see the overshoot settle, short
        enough to feel responsive.
      */}
      <aside
        className={`
          fixed top-0 left-0 z-50 h-full w-64 bg-[var(--color-notion-bg-secondary)]
          border-r border-[var(--color-notion-border)] flex flex-col
          transition-transform duration-[420ms] ease-[cubic-bezier(0.34,1.32,0.64,1)]
          lg:translate-x-0 lg:static lg:z-auto lg:transition-none
          ${isOpen ? "translate-x-0" : "-translate-x-full"}
        `}
      >
        {/* Logo */}
        <div className="px-5 py-5 border-b border-[var(--color-notion-border)]">
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
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto py-3">
          <div className="px-3 py-1">
            <NavLink
              to="/"
              end
              onClick={onClose}
              className={({ isActive }) =>
                `group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm no-underline transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.34,1.32,0.64,1)] hover:translate-x-0.5 ${
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
                      `group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm no-underline transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.34,1.32,0.64,1)] hover:translate-x-0.5 ${
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
                `group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm no-underline transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.34,1.32,0.64,1)] hover:translate-x-0.5 ${
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
                `group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm no-underline transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.34,1.32,0.64,1)] hover:translate-x-0.5 ${
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
                `group flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm no-underline transition-[background-color,color,transform] duration-300 ease-[cubic-bezier(0.34,1.32,0.64,1)] hover:translate-x-0.5 ${
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
