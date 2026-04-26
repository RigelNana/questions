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

  const Icon = DOMAIN_ICONS[domain];

  return (
    <Link
      to={`/domains/${domain}`}
      className="block p-5 rounded-xl border border-[var(--color-notion-border)] hover:border-[var(--color-notion-accent)]/50 hover:shadow-lg hover:shadow-[var(--color-notion-accent)]/5 transition-all duration-300 no-underline group active-press"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="w-11 h-11 rounded-xl bg-[var(--color-notion-accent-light)] flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
          <Icon className="w-5 h-5 text-[var(--color-notion-accent)]" />
        </div>
        {completedQuestions > 0 && (
          <span className="text-xs text-[var(--color-notion-text-secondary)] bg-[var(--color-notion-bg-secondary)] px-2 py-0.5 rounded-full">
            {correctRate}% 正确
          </span>
        )}
      </div>

      <h3 className="text-[15px] font-semibold text-[var(--color-notion-text)] mb-1 group-hover:text-[var(--color-notion-accent)] transition-colors duration-200">
        {DOMAIN_LABELS[domain]}
      </h3>

      <p className="text-sm text-[var(--color-notion-text-secondary)] mb-4">
        {completedQuestions} / {totalQuestions} 题
      </p>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-[var(--color-notion-bg-hover)] rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-[var(--color-notion-accent)] to-[var(--color-notion-accent)]/70 rounded-full animate-progress"
          style={{ width: `${progress}%` }}
        />
      </div>
    </Link>
  );
}
