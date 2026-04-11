/** 单道选择题的作答记录 */
export interface QuizAttempt {
  quizId: string;
  selectedAnswer: string;
  isCorrect: boolean;
  attemptedAt: string;
}

/** 单个主问题的完成记录 */
export interface QuestionProgress {
  questionId: string;
  viewedAnswer: boolean;
  completedAt?: string;
  quizAttempts: QuizAttempt[];
}

/** 用户设置 */
export interface UserSettings {
  shuffleChoices: boolean;
  autoExpandAnswer: boolean;
  enabledPacks: string[];
  theme: 'light' | 'dark' | 'system';
}

/** 用户总进度 */
export interface UserProgress {
  questions: Record<string, QuestionProgress>;
  bookmarks: string[];
  settings: UserSettings;
  lastVisited?: {
    domain: string;
    questionId: string;
    timestamp: string;
  };
}

export const DEFAULT_SETTINGS: UserSettings = {
  shuffleChoices: true,
  autoExpandAnswer: false,
  enabledPacks: [],
  theme: 'light',
};

export const DEFAULT_PROGRESS: UserProgress = {
  questions: {},
  bookmarks: [],
  settings: DEFAULT_SETTINGS,
};
