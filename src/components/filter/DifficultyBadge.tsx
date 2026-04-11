import type { Difficulty } from '../../types';
import { DIFFICULTY_LABELS } from '../../types';
import { Star } from 'lucide-react';

interface DifficultyBadgeProps {
  level: Difficulty;
}

const COLORS: Record<Difficulty, string> = {
  1: 'text-[var(--color-notion-correct)] bg-[var(--color-notion-correct-light)]',
  2: 'text-[var(--color-notion-accent)] bg-[var(--color-notion-accent-light)]',
  3: 'text-[var(--color-notion-warning)] bg-[var(--color-notion-warning-light)]',
  4: 'text-[var(--color-notion-error)] bg-[var(--color-notion-error-light)]',
};

export function DifficultyBadge({ level }: DifficultyBadgeProps) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs font-medium ${COLORS[level]}`}>
      {Array.from({ length: level }, (_, i) => (
        <Star key={i} className="w-3 h-3 fill-current" />
      ))}
      {DIFFICULTY_LABELS[level]}
    </span>
  );
}
