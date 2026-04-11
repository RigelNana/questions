/** 主题域枚举 */
export type Domain =
  | 'go'
  | 'operating-system'
  | 'computer-network'
  | 'database'
  | 'redis'
  | 'kafka'
  | 'distributed-system'
  | 'linux'
  | 'docker'
  | 'kubernetes'
  | 'cicd'
  | 'monitoring'
  | 'troubleshooting';

/** 题目类型枚举 */
export type QuestionType =
  // 八股题
  | 'concept'
  | 'principle'
  | 'comparison'
  | 'trivia'
  // 情景题
  | 'env-config'
  | 'modification'
  | 'purpose'
  | 'open-ended'
  | 'debugging'
  | 'real-data'
  | 'requirement'
  | 'tuning'
  | 'practice'
  | 'project';

/** 题目大类 */
export type QuestionCategory = 'fundamental' | 'scenario';

/** 难度等级 1-4 */
export type Difficulty = 1 | 2 | 3 | 4;

/** 单个选择项 */
export interface QuizChoice {
  id: string;
  text: string;
}

/** 配套选择题 */
export interface QuizQuestion {
  id: string;
  question: string;
  choices: QuizChoice[];
  correctAnswer: string;
  explanation: string;
  relatedConcepts?: string[];
}

/** 主问题条目 */
export interface QuestionEntry {
  id: string;
  domain: Domain;
  type: QuestionType;
  difficulty: Difficulty;
  tags: string[];
  title: string;
  content: string;
  answer: string;
  keyPoints: string[];
  quiz: QuizQuestion[];
  references?: string[];
  relatedQuestions?: string[];
}

/** 题库包 — 可插拔的单元 */
export interface QuestionPack {
  id: string;
  name: string;
  domain: Domain;
  description: string;
  version: string;
  author?: string;
  questions: QuestionEntry[];
}

/** 题库注册表条目 */
export interface PackRegistryEntry {
  id: string;
  name: string;
  domain: Domain;
  file: string;
  questionCount: number;
  description: string;
}

/** 题库注册表 */
export interface PackRegistry {
  version: string;
  packs: PackRegistryEntry[];
}

// ── 辅助映射 ──

export const DOMAIN_LABELS: Record<Domain, string> = {
  'go': 'Go 语言',
  'operating-system': '操作系统',
  'computer-network': '计算机网络',
  'database': '数据库',
  'redis': 'Redis 缓存',
  'kafka': 'Kafka 消息队列',
  'distributed-system': '分布式系统',
  'linux': 'Linux 系统',
  'docker': 'Docker 容器',
  'kubernetes': 'Kubernetes',
  'cicd': 'CI/CD',
  'monitoring': '监控与日志',
  'troubleshooting': '排错与部署',
};

export const QUESTION_TYPE_LABELS: Record<QuestionType, string> = {
  'concept': '概念定义',
  'principle': '原理机制',
  'comparison': '对比辨析',
  'trivia': '细碎知识',
  'env-config': '系统环境',
  'modification': '修改变更',
  'purpose': '作用分析',
  'open-ended': '开放设计',
  'debugging': '排查定位',
  'real-data': '真实数据',
  'requirement': '需求分析',
  'tuning': '调优实践',
  'practice': '最佳实践',
  'project': '结合项目',
};

export const QUESTION_TYPE_CATEGORY: Record<QuestionType, QuestionCategory> = {
  'concept': 'fundamental',
  'principle': 'fundamental',
  'comparison': 'fundamental',
  'trivia': 'fundamental',
  'env-config': 'scenario',
  'modification': 'scenario',
  'purpose': 'scenario',
  'open-ended': 'scenario',
  'debugging': 'scenario',
  'real-data': 'scenario',
  'requirement': 'scenario',
  'tuning': 'scenario',
  'practice': 'scenario',
  'project': 'scenario',
};

export const DIFFICULTY_LABELS: Record<Difficulty, string> = {
  1: '基础',
  2: '进阶',
  3: '高级',
  4: '专家',
};

export const ALL_DOMAINS: Domain[] = [
  'go', 'operating-system', 'computer-network', 'database',
  'redis', 'kafka', 'distributed-system', 'linux',
  'docker', 'kubernetes', 'cicd', 'monitoring', 'troubleshooting',
];
