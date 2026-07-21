import { useState, useMemo, useEffect, useCallback, type FormEvent } from 'react';
import type { QuizQuestion as QuizQuestionType, QuizAttempt } from '../../types';
import { MarkdownRenderer } from '../ui/MarkdownRenderer';
import { CheckCircle, XCircle, ChevronLeft, ChevronRight } from 'lucide-react';
import { useProgressStore } from '../../stores/progressStore';

interface QuizPanelProps {
  quizzes: QuizQuestionType[];
  existingAttempts: QuizAttempt[];
  onAttempt: (attempt: QuizAttempt) => void;
  onBoundaryNavigate?: (direction: -1 | 1) => void;
  hasPreviousQuestion?: boolean;
  hasNextQuestion?: boolean;
}

export function QuizPanel({
  quizzes,
  existingAttempts,
  onAttempt,
  onBoundaryNavigate,
  hasPreviousQuestion = false,
  hasNextQuestion = false,
}: QuizPanelProps) {
  const shuffleChoices = useProgressStore((state) => state.settings.shuffleChoices);
  // Start from first unanswered question
  const firstUnanswered = useMemo(() => {
    const answeredIds = new Set(existingAttempts.map((a) => a.quizId));
    const idx = quizzes.findIndex((q) => !answeredIds.has(q.id));
    return idx >= 0 ? idx : 0;
  }, [quizzes, existingAttempts]);

  const [currentIndex, setCurrentIndex] = useState(firstUnanswered);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [jumpInput, setJumpInput] = useState(String(firstUnanswered + 1));

  const orderedChoices = useMemo(() => quizzes.map((quiz) => {
    if (!shuffleChoices) return quiz.choices;
    const choices = [...quiz.choices];
    for (let index = choices.length - 1; index > 0; index -= 1) {
      const swapIndex = Math.floor(Math.random() * (index + 1));
      [choices[index], choices[swapIndex]] = [choices[swapIndex], choices[index]];
    }
    return choices;
  }), [quizzes, shuffleChoices]);

  const currentQuiz = quizzes[currentIndex];
  const currentChoices = orderedChoices[currentIndex] ?? [];
  const existingAttempt = currentQuiz
    ? existingAttempts.find((a) => a.quizId === currentQuiz.id)
    : undefined;
  const isAnswered = !!existingAttempt || showExplanation;
  const correctCount = existingAttempts.filter((a) => a.isCorrect).length;

  const handleSubmit = useCallback(() => {
    if (!selectedAnswer || !currentQuiz) return;

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
    } else {
      onBoundaryNavigate?.(1);
    }
  }, [currentIndex, quizzes.length, onBoundaryNavigate]);

  const handlePrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
      setSelectedAnswer(null);
      setShowExplanation(false);
    } else {
      onBoundaryNavigate?.(-1);
    }
  }, [currentIndex, onBoundaryNavigate]);

  const jumpTo = useCallback((index: number) => {
    setCurrentIndex(index);
    setSelectedAnswer(null);
    setShowExplanation(false);
  }, []);

  useEffect(() => {
    setJumpInput(String(currentIndex + 1));
  }, [currentIndex]);

  const handleJump = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const requested = Number.parseInt(jumpInput, 10);
    if (Number.isNaN(requested)) {
      setJumpInput(String(currentIndex + 1));
      return;
    }
    jumpTo(Math.min(quizzes.length, Math.max(1, requested)) - 1);
  };

  // Arrow keys move through quizzes and continue to adjacent knowledge points at boundaries.
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement
        || e.target instanceof HTMLTextAreaElement
        || e.target instanceof HTMLSelectElement
      ) return;
      if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
        e.preventDefault();
        e.stopImmediatePropagation();
        if (e.key === 'ArrowLeft') handlePrev();
        else handleNext();
        return;
      }

      if (isAnswered && e.key === 'Enter') {
        e.preventDefault();
        handleNext();
        return;
      }

      const numericIndex = /^[1-9]$/.test(e.key) ? Number(e.key) - 1 : -1;
      const letterIndex = /^[a-i]$/i.test(e.key) ? e.key.toUpperCase().charCodeAt(0) - 65 : -1;
      const choiceIndex = numericIndex >= 0 ? numericIndex : letterIndex;
      if (!isAnswered && currentChoices[choiceIndex]) {
        e.preventDefault();
        setSelectedAnswer(currentChoices[choiceIndex].id);
      } else if (!isAnswered && e.key === 'Enter' && selectedAnswer) {
        e.preventDefault();
        handleSubmit();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [isAnswered, selectedAnswer, currentChoices, handleSubmit, handleNext, handlePrev]);

  const displayAnswer = existingAttempt?.selectedAnswer ?? selectedAnswer;
  const isCorrect = currentQuiz
    ? existingAttempt?.isCorrect ?? (showExplanation ? displayAnswer === currentQuiz.correctAnswer : undefined)
    : undefined;
  const correctChoiceIndex = currentChoices.findIndex((choice) => choice.id === currentQuiz?.correctAnswer);
  const correctChoiceLabel = correctChoiceIndex >= 0
    ? String.fromCharCode(65 + correctChoiceIndex)
    : currentQuiz?.correctAnswer;

  if (!currentQuiz) return null;

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
      <div className="flex flex-wrap items-center gap-1.5 border-b border-[var(--color-notion-border)] bg-[var(--color-notion-bg-secondary)] px-4 py-2.5">
        <div className="flex flex-1 flex-wrap items-center gap-1.5">
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
                className={`compact-control group flex h-7 w-7 items-center justify-center rounded-full transition-all duration-200 ${
                  isCurrent
                    ? 'bg-[var(--color-notion-accent-light)]'
                    : 'hover:bg-[var(--color-notion-bg-hover)]'
                }`}
                title={`Q${i + 1}`}
                aria-label={`跳转到第 ${i + 1} 题`}
              >
                <span
                  className={`block h-2.5 w-2.5 rounded-full transition-transform duration-200 ${dotColor} ${
                    isCurrent ? 'scale-150' : 'group-hover:scale-125'
                  } ${isCurrent && !attempt ? 'animate-dot-breathe' : ''}`}
                />
              </button>
            );
          })}
        </div>
        <form onSubmit={handleJump} className="ml-auto flex items-center gap-1.5">
          <span className="text-xs text-[var(--color-notion-text-secondary)]">跳至</span>
          <input
            type="number"
            min={1}
            max={quizzes.length}
            value={jumpInput}
            onChange={(event) => setJumpInput(event.target.value)}
            onBlur={() => {
              if (!jumpInput) setJumpInput(String(currentIndex + 1));
            }}
            className="search-control compact-control h-7 w-12 rounded-md border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] px-1 text-center text-xs text-[var(--color-notion-text)]"
            aria-label={`跳转选择题，范围 1 到 ${quizzes.length}`}
          />
          <button
            type="submit"
            className="compact-control h-7 rounded-md border border-[var(--color-notion-border)] px-2 text-xs text-[var(--color-notion-text-secondary)] hover:border-[var(--color-notion-accent)] hover:text-[var(--color-notion-accent)]"
          >
            前往
          </button>
        </form>
      </div>

      {/* Question */}
      <div className="p-4 sm:p-5">
        <div className="text-xs text-[var(--color-notion-accent)] font-medium mb-2">
          Q{currentIndex + 1}
        </div>
        <MarkdownRenderer content={currentQuiz.question} className="mb-4" />

        {/* Choices */}
        <div className="space-y-2">
          {currentChoices.map((choice, choiceIdx) => {
            const isSelected = displayAnswer === choice.id;
            const isCorrectChoice = choice.id === currentQuiz.correctAnswer;
            const displayLabel = String.fromCharCode(65 + choiceIdx);

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
                  isAnswered ? 'cursor-default' : 'cursor-pointer active-press'
                } ${
                  isAnswered && isCorrectChoice ? 'animate-success-pulse' : ''
                } ${
                  isAnswered && isSelected && !isCorrectChoice ? 'animate-shake' : ''
                }`}
              >
                <span className={`text-sm font-medium flex-shrink-0 mt-0.5 ${isSelected && !isAnswered ? 'text-[var(--color-notion-accent)]' : 'text-[var(--color-notion-text-secondary)]'}`}>
                  {displayLabel}.
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
          <div className="mt-4 flex flex-col gap-2.5 sm:flex-row sm:items-center">
            <button
              onClick={handleSubmit}
              disabled={!selectedAnswer}
              className="w-full rounded-lg bg-[var(--color-notion-accent)] px-5 py-2.5 text-sm font-medium text-[var(--color-notion-on-accent)] transition-all duration-200 hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-30 sm:w-auto active-press"
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
                正确答案: <span className="font-semibold text-[var(--color-notion-correct)]">{correctChoiceLabel}</span>
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between mt-5 pt-4 border-t border-[var(--color-notion-border)]">
          <button
            onClick={handlePrev}
            disabled={currentIndex === 0 && !hasPreviousQuestion}
            className="flex items-center gap-1 text-sm text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-accent)] disabled:opacity-30 transition-all duration-200"
          >
            <ChevronLeft className="w-4 h-4" /> {currentIndex === 0 ? '上一知识点' : '上一小题'}
          </button>
          <span className="text-xs text-[var(--color-notion-text-secondary)] font-mono">
            {currentIndex + 1} / {quizzes.length}
          </span>
          <button
            onClick={handleNext}
            disabled={currentIndex === quizzes.length - 1 && !hasNextQuestion}
            className="flex items-center gap-1 text-sm text-[var(--color-notion-text-secondary)] hover:text-[var(--color-notion-accent)] disabled:opacity-30 transition-all duration-200"
          >
            {currentIndex === quizzes.length - 1 ? '下一知识点' : '下一小题'} <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
