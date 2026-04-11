import type { QuestionType } from '../../types';
import { QUESTION_TYPE_LABELS, QUESTION_TYPE_CATEGORY } from '../../types';

interface TypeBadgeProps {
  type: QuestionType;
}

export function TypeBadge({ type }: TypeBadgeProps) {
  const category = QUESTION_TYPE_CATEGORY[type];
  const colorClass =
    category === 'fundamental'
      ? 'text-[var(--color-notion-accent)] bg-[var(--color-notion-accent-light)]'
      : 'text-[var(--color-notion-warning)] bg-[var(--color-notion-warning-light)]';

  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${colorClass}`}>
      {QUESTION_TYPE_LABELS[type]}
    </span>
  );
}
