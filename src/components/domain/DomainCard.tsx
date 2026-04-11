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
      className="block p-4 sm:p-5 rounded-lg border border-[var(--color-notion-border)] hover:border-[var(--color-notion-accent)] hover:shadow-sm transition-all no-underline group"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="w-10 h-10 rounded-lg bg-[var(--color-notion-accent-light)] flex items-center justify-center">
          <Icon className="w-5 h-5 text-[var(--color-notion-accent)]" />
        </div>
        {completedQuestions > 0 && (
          <span className="text-xs text-[var(--color-notion-text-secondary)]">
            正确率 {correctRate}%
          </span>
        )}
      </div>

      <h3 className="text-base font-semibold text-[var(--color-notion-text)] mb-1 group-hover:text-[var(--color-notion-accent)] transition-colors">
        {DOMAIN_LABELS[domain]}
      </h3>

      <p className="text-sm text-[var(--color-notion-text-secondary)] mb-3">
        {completedQuestions} / {totalQuestions} 题
      </p>

      {/* Progress bar */}
      <div className="w-full h-1.5 bg-[var(--color-notion-bg-secondary)] rounded-full overflow-hidden">
        <div
          className="h-full bg-[var(--color-notion-accent)] rounded-full transition-all duration-300"
          style={{ width: `${progress}%` }}
        />
      </div>
    </Link>
  );
}
