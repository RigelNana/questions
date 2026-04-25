import { Link } from 'react-router-dom';
import type { QuestionEntry } from '../../types';
import { DOMAIN_LABELS } from '../../types';
import { DifficultyBadge } from '../filter/DifficultyBadge';
import { TypeBadge } from '../filter/TypeBadge';
import { Check, Circle, Star } from 'lucide-react';

interface QuestionCardProps {
  question: QuestionEntry;
  isCompleted?: boolean;
  isBookmarked?: boolean;
}

export function QuestionCard({ question, isCompleted, isBookmarked }: QuestionCardProps) {
  return (
    <Link
      to={`/domains/${question.domain}/${question.id}`}
      className="block px-4 sm:px-5 py-3.5 border-b border-[var(--color-notion-border)] hover:bg-[var(--color-notion-bg-secondary)] transition-all duration-200 no-underline group"
    >
      <div className="flex items-start gap-3">
        {/* Status indicator */}
        <div className="mt-0.5 flex-shrink-0">
          {isCompleted ? (
            <Check className="w-4 h-4 text-[var(--color-notion-correct)]" />
          ) : (
            <Circle className="w-4 h-4 text-[var(--color-notion-border)] group-hover:text-[var(--color-notion-accent)] transition-colors" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          {/* Title */}
          <div className="flex items-center gap-2 mb-1.5">
            <h4 className="text-sm font-medium text-[var(--color-notion-text)] truncate group-hover:text-[var(--color-notion-accent)] transition-colors">
              {question.title}
            </h4>
            {isBookmarked && <Star className="w-3 h-3 text-[var(--color-notion-warning)] fill-current flex-shrink-0" />}
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
    </Link>
  );
}
