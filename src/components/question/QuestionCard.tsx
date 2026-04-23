import { Link } from 'react-router-dom';
import type { QuestionEntry } from '../../types';
import { DOMAIN_LABELS } from '../../types';
import { DifficultyBadge } from '../filter/DifficultyBadge';
import { TypeBadge } from '../filter/TypeBadge';
import { Check, Circle, Star, ChevronRight } from 'lucide-react';

interface QuestionCardProps {
  question: QuestionEntry;
  isCompleted?: boolean;
  isBookmarked?: boolean;
}

export function QuestionCard({ question, isCompleted, isBookmarked }: QuestionCardProps) {
  return (
    <Link
      to={`/domains/${question.domain}/${question.id}`}
      className="block px-4 sm:px-5 py-3.5 border-b border-[var(--color-notion-border)] hover:bg-[var(--color-notion-bg-secondary)] transition-[background-color,color] duration-200 no-underline group relative overflow-hidden"
    >
      <div className="flex items-start gap-3 transition-transform duration-300 ease-[cubic-bezier(0.34,1.32,0.64,1)] group-hover:translate-x-1">
        {/* Status indicator */}
        <div className="mt-0.5 flex-shrink-0">
          {isCompleted ? (
            // Keyed on `completed` so a freshly-completed question plays the
            // check-pop the next time the card mounts.
            <Check
              key="done"
              className="w-4 h-4 text-[var(--color-notion-correct)] animate-check-pop"
            />
          ) : (
            <Circle className="w-4 h-4 text-[var(--color-notion-border)] transition-colors duration-200 group-hover:text-[var(--color-notion-accent)]" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-1.5">
            <h4 className="text-sm font-medium text-[var(--color-notion-text)] truncate transition-colors duration-200 group-hover:text-[var(--color-notion-accent)]">
              {question.title}
            </h4>
            {isBookmarked && (
              <Star className="w-3 h-3 text-[var(--color-notion-warning)] fill-current flex-shrink-0 animate-pop" />
            )}
          </div>

          {/* Tags */}
          <div className="flex items-center gap-2 flex-wrap">
            <TypeBadge type={question.type} />
            <DifficultyBadge level={question.difficulty} />
            {question.tags.slice(0, 2).map((tag) => (
              <span
                key={tag}
                className="text-xs text-[var(--color-notion-text-secondary)] bg-[var(--color-notion-bg-secondary)] px-2 py-0.5 rounded-md hidden sm:inline"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Domain label (for search results) */}
        <span className="text-xs text-[var(--color-notion-text-secondary)] flex-shrink-0 hidden sm:block opacity-60">
          {DOMAIN_LABELS[question.domain]}
        </span>
      </div>

      {/* Chevron that slides in from the right on hover — provides spatial
          cue that the row is actionable. Uses back-ease so it settles. */}
      <ChevronRight
        className="pointer-events-none absolute right-3 sm:right-4 top-1/2 -translate-y-1/2 w-4 h-4 text-[var(--color-notion-accent)] opacity-0 -translate-x-2 transition-all duration-300 ease-[cubic-bezier(0.34,1.32,0.64,1)] group-hover:opacity-100 group-hover:translate-x-0"
        aria-hidden="true"
      />
    </Link>
  );
}
