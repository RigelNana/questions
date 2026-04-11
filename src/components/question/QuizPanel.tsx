import { useState, useMemo, useEffect, useCallback } from 'react';
import type { QuizQuestion as QuizQuestionType, QuizAttempt } from '../../types';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';

interface QuizPanelProps {
  quizzes: QuizQuestionType[];
  existingAttempts: QuizAttempt[];
  onAttempt: (attempt: QuizAttempt) => void;
}

export function QuizPanel({
  quizzes,
  existingAttempts,
  onAttempt,
}: QuizPanelProps) {
  // Start from first unanswered question
  const firstUnanswered = useMemo(() => {
    const answeredIds = new Set(existingAttempts.map((a) => a.quizId));
    const idx = quizzes.findIndex((q) => !answeredIds.has(q.id));
    return idx >= 0 ? idx : 0;
  }, [quizzes, existingAttempts]);

  const [currentIndex, setCurrentIndex] = useState(firstUnanswered);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);

  const currentQuiz = quizzes[currentIndex];
  if (!currentQuiz) return null;

  const existingAttempt = existingAttempts.find(
    (a) => a.quizId === currentQuiz.id,
  );
  const isAnswered = !!existingAttempt || showExplanation;
  const correctCount = existingAttempts.filter((a) => a.isCorrect).length;

  const handleSubmit = useCallback(() => {
    if (!selectedAnswer) return;

    const isCorrect = selectedAnswer === currentQuiz.correctAnswer;
    const attempt: QuizAttempt = {
      quizId: currentQuiz.id,
      selectedAnswer,
      isCorrect,
      attemptedAt: new Date().toISOString(),
    };

    onAttempt(attempt);
    setShowExplanation(true);
  }, [selectedAnswer, currentQuiz, onAttempt]);

  const handleNext = useCallback(() => {
    if (currentIndex < quizzes.length - 1) {
      setCurrentIndex((i) => i + 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [currentIndex, quizzes.length]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    }
  }, [currentIndex]);

  const jumpTo = (index: number) => {
    setCurrentIndex(index);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  // Keyboard shortcuts: 1-4 or A-D to select, Enter to submit
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      if (isAnswered) {
        if (e.key === 'Enter' || e.key === 'ArrowRight') {
          e.preventDefault();
          handleNext();
        }
        return;
      }
      const choiceMap: Record<string, string> = { '1': 'A', '2': 'B', '3': 'C', '4': 'D', 'a': 'A', 'b': 'B', 'c': 'C', 'd': 'D' };
      if (choiceMap[e.key]) {
        e.preventDefault();
        setSelectedAnswer(choiceMap[e.key]);
      } else if (e.key === 'Enter' && selectedAnswer) {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isAnswered, selectedAnswer, handleSubmit, handleNext]);

  const displayAnswer = existingAttempt?.selectedAnswer ?? selectedAnswer;
  const isCorrect = existingAttempt?.isCorrect ?? (showExplanation ? displayAnswer === currentQuiz.correctAnswer : undefined);

  return (
    <div className="border border-[var(--color-notion-border)] rounded-xl overflow-hidden">
      {/* Header */}
      <div className="px-4 py-3 bg-[var(--color-notion-bg-secondary)] border-b border-[var(--color-notion-border)] flex items-center justify-between">
        <span className="text-sm font-semibold text-[var(--color-notion-text)]">
          配套选择题
        </span>
        <div className="flex items-center gap-3 text-xs text-[var(--color-notion-text-secondary)]">
          <span>{Math.min(existingAttempts.length + (showExplanation ? 1 : 0), quizzes.length)}/{quizzes.length}</span>
          <span className="text-[var(--color-notion-correct)]">✓ {correctCount + (isCorrect === true && !existingAttempt ? 1 : 0)}</span>
        </div>
      </div>

      {/* Dot navigation */}
      <div className="px-4 py-2.5 bg-[var(--color-notion-bg-secondary)] border-b border-[var(--color-notion-border)] flex items-center gap-1.5 flex-wrap">
        {quizzes.map((q, i) => {
          const attempt = existingAttempts.find((a) => a.quizId === q.id);
          const isCurrent = i === currentIndex;
          let dotColor = 'bg-[var(--color-notion-border)]';
          if (attempt) {
            dotColor = attempt.isCorrect
              ? 'bg-[var(--color-notion-correct)]'
              : 'bg-[var(--color-notion-error)]';
          } else if (isCurrent) {
            dotColor = 'bg-[var(--color-notion-accent)]';
          }
          return (
            <button
              key={q.id}
              onClick={() => jumpTo(i)}
              className={`w-2.5 h-2.5 rounded-full transition-all duration-200 ${dotColor} ${
                isCurrent ? 'scale-150 ring-2 ring-[var(--color-notion-accent)]/40 ring-offset-1' : 'hover:scale-125'
              }`}
              title={`Q${i + 1}`}
            />
          );
        })}
      </div>

      {/* Question */}
      <div className="p-4 sm:p-5">
        <div className="text-xs text-[var(--color-notion-accent)] font-medium mb-2">
          Q{currentIndex + 1}
        </div>
        <MarkdownRenderer content={currentQuiz.question} className="mb-4" />

        {/* Choices */}
        <div className="space-y-2">
          {currentQuiz.choices.map((choice, choiceIdx) => {
            const isSelected = displayAnswer === choice.id;
            const isCorrectChoice = choice.id === currentQuiz.correctAnswer;

            let choiceStyle = 'border-[var(--color-notion-border)] hover:border-[var(--color-notion-accent)]/60 hover:bg-[var(--color-notion-bg-secondary)]';
            if (isAnswered) {
              if (isCorrectChoice) {
                choiceStyle = 'border-[var(--color-notion-correct)]/60 bg-[var(--color-notion-correct-light)]';
              } else if (isSelected && !isCorrectChoice) {
                choiceStyle = 'border-[var(--color-notion-error)]/60 bg-[var(--color-notion-error-light)]';
              } else {
                choiceStyle = 'border-[var(--color-notion-border)] opacity-60';
              }
            } else if (isSelected) {
              choiceStyle = 'border-[var(--color-notion-accent)] bg-[var(--color-notion-accent-light)] shadow-sm shadow-[var(--color-notion-accent)]/10';
            }

            return (
              <button
                key={choice.id}
                onClick={() => !isAnswered && setSelectedAnswer(choice.id)}
                disabled={isAnswered}
                className={`w-full text-left px-3.5 sm:px-4 py-2.5 sm:py-3 rounded-lg border transition-all duration-200 flex items-start gap-2.5 sm:gap-3 ${choiceStyle} ${
                  isAnswered ? 'cursor-default' : 'cursor-pointer'
                }`}
              >
                <span className={`text-sm font-medium flex-shrink-0 mt-0.5 ${isSelected && !isAnswered ? 'text-[var(--color-notion-accent)]' : 'text-[var(--color-notion-text-secondary)]'}`}>
                  {choice.id}.
                </span>
                <MarkdownRenderer content={choice.text} className="text-sm flex-1" />
                {!isAnswered && (
                  <kbd className="text-[10px] text-[var(--color-notion-text-secondary)] opacity-30 flex-shrink-0 mt-1 hidden sm:inline font-mono">
                    {choiceIdx + 1}
                  </kbd>
                )}
              </button>
            );
          })}
        </div>

        {/* Submit button */}
        {!isAnswered && (
          <div className="flex items-center gap-3 mt-4">
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="px-5 py-2.5 bg-[var(--color-notion-accent)] text-white rounded-lg text-sm font-medium hover:opacity-90 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200"
            >
              提交答案
            </button>
            <span className="text-[10px] text-[var(--color-notion-text-secondary)] opacity-40 hidden sm:inline">
              Enter ↵
            </span>
          </div>
        )}

        {/* Explanation */}
        {isAnswered && (
          <div
            className={`mt-4 p-3.5 sm:p-4 rounded-xl border animate-slide-up ${
              isCorrect
                ? 'border-[var(--color-notion-correct)]/40 bg-[var(--color-notion-correct-light)]'
                : 'border-[var(--color-notion-error)]/40 bg-[var(--color-notion-error-light)]'
            }`}
          >
            <div className="flex items-center gap-2 mb-2.5">
              <span className={`text-sm font-semibold flex items-center gap-1.5 ${isCorrect ? 'text-[var(--color-notion-correct)]' : 'text-[var(--color-notion-error)]'}`}>
                {isCorrect ? <><CheckCircle className="w-4 h-4" /> 回答正确</> : <><XCircle className="w-4 h-4" /> 回答错误</>}
              </span>
            </div>
            <MarkdownRenderer content={currentQuiz.explanation} className="text-sm" />
            {!isCorrect && (
              <div className="mt-2.5 pt-2 border-t border-[var(--color-notion-border)] text-xs text-[var(--color-notion-text-secondary)]">
                正确答案: <span className="font-semibold text-[var(--color-notion-correct)]">{currentQuiz.correctAnswer}</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-[var(--color-notion-border)]">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0}
            className="flex items-center gap-1 text-sm text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-accent)] disabled:opacity-30 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" /> 上一题
          </button>
          <span className="text-xs text-[var(--color-notion-text-secondary)] font-mono">
            {currentIndex + 1} / {quizzes.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex === quizzes.length - 1}
            className="flex items-center gap-1 text-sm text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-accent)] disabled:opacity-30 transition-all duration-200"
          >
            下一题 <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
