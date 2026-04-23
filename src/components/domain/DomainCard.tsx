import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import type { Domain } from '../../types';
import { DOMAIN_LABELS, DOMAIN_ICONS } from '../../types';

interface DomainCardProps {
  domain: Domain;
  totalQuestions: number;
  completedQuestions: number;
  correctRate: number;
}

export function DomainCard({
  domain,
  totalQuestions,
  completedQuestions,
  correctRate,
}: DomainCardProps) {
  const progress = totalQuestions > 0
    ? Math.round((completedQuestions / totalQuestions) * 100)
    : 0;

  // Animate progress bar from 0 to target on mount via back-ease transition.
  // We start at 0 and schedule a state flip on the next frame so the
  // transition actually plays (setting width directly in the initial render
  // would be instant).
  const [displayProgress, setDisplayProgress] = useState(0);
  useEffect(() => {
    const id = requestAnimationFrame(() => setDisplayProgress(progress));
    return () => cancelAnimationFrame(id);
  }, [progress]);

  const Icon = DOMAIN_ICONS[domain];

  return (
    <Link
      to={`/domains/${domain}`}
      className="relative block p-5 rounded-xl border border-[var(--color-notion-border)] hover:border-[var(--color-notion-accent)]/60 hover:shadow-lg hover:shadow-[var(--color-notion-accent)]/10 hover-lift no-underline group overflow-hidden"
    >
      {/* Accent glow on hover */}
      <div className="pointer-events-none absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-br from-[var(--color-notion-accent)]/[0.03] via-transparent to-transparent" />

      <div className="relative flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-[var(--color-notion-accent-light)] flex items-center justify-center transition-transform duration-500 ease-[cubic-bezier(0.34,1.32,0.64,1)] group-hover:scale-110 group-hover:-rotate-6">
          <Icon className="w-5 h-5 text-[var(--color-notion-accent)] transition-transform duration-500 ease-[cubic-bezier(0.34,1.32,0.64,1)] group-hover:rotate-6 group-hover:scale-110" />
        </div>
        {completedQuestions > 0 && (
          <span className="text-xs text-[var(--color-notion-text-secondary)] bg-[var(--color-notion-bg-secondary)] px-2 py-0.5 rounded-full tabular-nums animate-pop">
            {correctRate}% 正确
          </span>
        )}
      </div>

      <h3 className="relative text-[15px] font-semibold text-[var(--color-notion-text)] mb-1 transition-colors duration-200 group-hover:text-[var(--color-notion-accent)]">
        {DOMAIN_LABELS[domain]}
      </h3>

      <p className="relative text-sm text-[var(--color-notion-text-secondary)] mb-4 tabular-nums">
        {completedQuestions} / {totalQuestions} 题
      </p>

      {/* Progress bar — width animates from 0 to target with back-ease for a
          confident settle (slight overshoot feel). */}
      <div className="relative w-full h-1.5 bg-[var(--color-notion-bg-hover)] rounded-full overflow-hidden">
        <div
          className="progress-fill h-full bg-gradient-to-r from-[var(--color-notion-accent)] to-[var(--color-notion-accent)]/70 rounded-full"
          style={{ width: `${displayProgress}%` }}
        />
      </div>
    </Link>
  );
}
