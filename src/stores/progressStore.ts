import { create } from 'zustand';
import type { UserProgress, QuizAttempt } from '../types';
import { DEFAULT_PROGRESS } from '../types';
import { loadProgress, saveProgress } from '../utils/storage';

interface ProgressState extends UserProgress {
  // Actions
  recordQuizAttempt: (questionId: string, attempt: QuizAttempt) => void;
  markAnswerViewed: (questionId: string) => void;
  toggleBookmark: (questionId: string) => void;
  isBookmarked: (questionId: string) => boolean;
  getQuestionProgress: (questionId: string) => UserProgress['questions'][string] | undefined;
  getCorrectRate: (domain?: string) => number;
  getCompletedCount: (domain?: string, allQuestionIds?: string[]) => number;
  setLastVisited: (domain: string, questionId: string) => void;
  resetProgress: () => void;
  updateSettings: (settings: Partial<UserProgress['settings']>) => void;
}

export const useProgressStore = create<ProgressState>((set, get) => {
  const saved = loadProgress<UserProgress>(DEFAULT_PROGRESS);

  const persist = () => {
    const { questions, bookmarks, settings, lastVisited } = get();
    saveProgress({ questions, bookmarks, settings, lastVisited });
  };

  return {
    ...saved,

    recordQuizAttempt: (questionId, attempt) => {
      set((s) => {
        const existing = s.questions[questionId] ?? {
          questionId,
          viewedAnswer: false,
          quizAttempts: [],
        };
        return {
          questions: {
            ...s.questions,
            [questionId]: {
              ...existing,
              quizAttempts: [...existing.quizAttempts, attempt],
              completedAt: new Date().toISOString(),
            },
          },
        };
      });
      persist();
    },

    markAnswerViewed: (questionId) => {
      set((s) => {
        const existing = s.questions[questionId] ?? {
          questionId,
          viewedAnswer: false,
          quizAttempts: [],
        };
        return {
          questions: {
            ...s.questions,
            [questionId]: { ...existing, viewedAnswer: true },
          },
        };
      });
      persist();
    },

    toggleBookmark: (questionId) => {
      set((s) => {
        const isBookmarked = s.bookmarks.includes(questionId);
        return {
          bookmarks: isBookmarked
            ? s.bookmarks.filter((id) => id !== questionId)
            : [...s.bookmarks, questionId],
        };
      });
      persist();
    },

    isBookmarked: (questionId) => get().bookmarks.includes(questionId),

    getQuestionProgress: (questionId) => get().questions[questionId],

    getCorrectRate: () => {
      const { questions } = get();
      const allAttempts = Object.values(questions).flatMap(
        (q) => q.quizAttempts,
      );
      if (allAttempts.length === 0) return 0;
      const correct = allAttempts.filter((a) => a.isCorrect).length;
      return Math.round((correct / allAttempts.length) * 100);
    },

    getCompletedCount: (_domain, allQuestionIds) => {
      const { questions } = get();
      if (!allQuestionIds) return Object.keys(questions).length;
      return allQuestionIds.filter((id) => questions[id]?.completedAt).length;
    },

    setLastVisited: (domain, questionId) => {
      set({
        lastVisited: {
          domain,
          questionId,
          timestamp: new Date().toISOString(),
        },
      });
      persist();
    },

    resetProgress: () => {
      set(DEFAULT_PROGRESS);
      persist();
    },

    updateSettings: (newSettings) => {
      set((s) => ({
        settings: { ...s.settings, ...newSettings },
      }));
      persist();
    },
  };
});
