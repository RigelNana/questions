import type { Domain } from '../types';
import type { LucideIcon } from 'lucide-react';
import {
  Code2,
  Cpu,
  Globe,
  Database,
  Zap,
  Mail,
  Network,
  Terminal,
  Container,
  Ship,
  RefreshCw,
  BarChart3,
  Wrench,
} from 'lucide-react';

export type { Domain, QuestionType, QuestionCategory, Difficulty, QuizChoice, QuizQuestion, QuestionEntry, QuestionSummary, QuestionPack, PackRegistryEntry, PackRegistry, QuestionIndex } from './question';
export { DOMAIN_LABELS, QUESTION_TYPE_LABELS, QUESTION_TYPE_CATEGORY, DIFFICULTY_LABELS, ALL_DOMAINS } from './question';
export type { QuizAttempt, QuestionProgress, UserSettings, UserProgress } from './progress';
export { DEFAULT_SETTINGS, DEFAULT_PROGRESS } from './progress';
export type { Highlight, HighlightColor, HighlightSection } from './highlight';
export { HIGHLIGHT_COLORS, HIGHLIGHT_COLOR_LABELS } from './highlight';

/** Lucide icon mapping for each domain */
export const DOMAIN_ICONS: Record<Domain, LucideIcon> = {
  'go': Code2,
  'operating-system': Cpu,
  'computer-network': Globe,
  'database': Database,
  'redis': Zap,
  'kafka': Mail,
  'distributed-system': Network,
  'linux': Terminal,
  'docker': Container,
  'kubernetes': Ship,
  'cicd': RefreshCw,
  'monitoring': BarChart3,
  'troubleshooting': Wrench,
};
