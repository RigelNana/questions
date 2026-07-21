import { Type } from '@earendil-works/pi-ai';
import type { AgentTool, Skill } from '@earendil-works/pi-agent-core';
import type {
  AgentSettings,
  QuestionAgentContext,
} from './types';

function textResult(text: string, details: Record<string, unknown> = {}) {
  return {
    content: [{ type: 'text' as const, text }],
    details,
  };
}

function capText(value: string, maxChars: number) {
  if (value.length <= maxChars) return value;
  return `${value.slice(0, maxChars)}\n\n[内容已按上下文上限截断]`;
}

function buildQuestionSection(
  context: QuestionAgentContext,
  section: string,
) {
  const { question } = context;
  switch (section) {
    case 'question':
      return `# ${question.title}\n\n${question.content}`;
    case 'answer':
      return `# 参考答案\n\n${question.answer}`;
    case 'key-points':
      return `# 核心要点\n\n${question.keyPoints.map((point) => `- ${point}`).join('\n')}`;
    case 'quiz':
      return `# 配套选择题\n\n${question.quiz.map((quiz, index) => (
        `${index + 1}. ${quiz.question}\n${quiz.choices.map((choice) => `   ${choice.id}. ${choice.text}`).join('\n')}`
      )).join('\n\n')}`;
    case 'all':
    default:
      return [
        `# ${question.title}`,
        question.content,
        '# 参考答案',
        question.answer,
        '# 核心要点',
        question.keyPoints.map((point) => `- ${point}`).join('\n'),
      ].join('\n\n');
  }
}

export function createQuestionAgentTools(
  context: QuestionAgentContext,
  settings: AgentSettings,
  skills: Skill[],
): AgentTool[] {
  const questionContextParameters = Type.Object({
    section: Type.Union([
      Type.Literal('question'),
      Type.Literal('answer'),
      Type.Literal('key-points'),
      Type.Literal('quiz'),
      Type.Literal('all'),
    ], { description: '需要读取的题目区块' }),
  });
  const searchParameters = Type.Object({
    query: Type.String({
      minLength: 1,
      maxLength: 200,
      description: '一个或多个搜索关键词',
    }),
    limit: Type.Optional(Type.Integer({
      minimum: 1,
      maximum: 12,
      description: '最多返回的片段数',
    })),
  });
  const progressParameters = Type.Object({});
  const skillParameters = Type.Object({
    name: Type.String({
      minLength: 1,
      description: '系统提示中列出的 Skill 名称',
    }),
  });

  const getQuestionContext: AgentTool<typeof questionContextParameters> = {
    name: 'get_question_context',
    label: '读取当前题目',
    description: '读取当前题目的题干、参考答案、核心要点或配套选择题。需要准确引用原文时使用。',
    parameters: questionContextParameters,
    async execute(_toolCallId, params, signal) {
      signal?.throwIfAborted();
      const content = buildQuestionSection(
        context,
        String(params.section),
      );
      return textResult(capText(content, settings.maxContextChars), {
        section: params.section,
        questionId: context.question.id,
      });
    },
  };

  const searchCurrentMaterial: AgentTool<typeof searchParameters> = {
    name: 'search_current_material',
    label: '搜索题目与答案',
    description: '按关键词搜索当前题目、答案和核心要点，返回最相关的原文片段。',
    parameters: searchParameters,
    async execute(_toolCallId, params, signal) {
      signal?.throwIfAborted();
      const terms = String(params.query)
        .toLocaleLowerCase()
        .split(/\s+/)
        .filter(Boolean);
      const source = [
        context.question.title,
        context.question.content,
        context.question.answer,
        ...context.question.keyPoints,
      ];
      const matches = source
        .flatMap((block) => block.split(/\n+/))
        .map((line) => line.trim())
        .filter(Boolean)
        .map((line) => ({
          line,
          score: terms.reduce(
            (score, term) => score + (line.toLocaleLowerCase().includes(term) ? 1 : 0),
            0,
          ),
        }))
        .filter((item) => item.score > 0)
        .sort((left, right) => right.score - left.score)
        .slice(0, Number(params.limit ?? 6));
      return textResult(
        matches.length
          ? matches.map((item, index) => `${index + 1}. ${item.line}`).join('\n')
          : '当前题目和答案中没有找到匹配片段。',
        { query: params.query, matchCount: matches.length },
      );
    },
  };

  const getLearningProgress: AgentTool<typeof progressParameters> = {
    name: 'get_learning_progress',
    label: '读取学习进度',
    description: '读取当前题目的查看状态、选择题作答结果和用户划线批注。',
    parameters: progressParameters,
    async execute(_toolCallId, _params, signal) {
      signal?.throwIfAborted();
      const attempts = context.progress?.quizAttempts ?? [];
      const payload = {
        answerViewed: context.progress?.viewedAnswer ?? false,
        completedAt: context.progress?.completedAt ?? null,
        attempts: attempts.map((attempt) => ({
          quizId: attempt.quizId,
          selectedAnswer: attempt.selectedAnswer,
          isCorrect: attempt.isCorrect,
          attemptedAt: attempt.attemptedAt,
        })),
        highlights: context.highlights.map((highlight) => ({
          section: highlight.section,
          text: highlight.text,
          note: highlight.note ?? null,
        })),
      };
      return textResult(JSON.stringify(payload, null, 2), {
        attemptCount: attempts.length,
        highlightCount: context.highlights.length,
      });
    },
  };

  const loadSkill: AgentTool<typeof skillParameters> = {
    name: 'load_skill',
    label: '加载 Skill',
    description: '按名称加载一个已启用 Skill 的完整工作流程说明。',
    parameters: skillParameters,
    async execute(_toolCallId, params, signal) {
      signal?.throwIfAborted();
      const skill = skills.find((item) => item.name === params.name);
      if (!skill) {
        throw new Error(`Skill 未启用或不存在: ${params.name}`);
      }
      return textResult(skill.content, {
        name: skill.name,
        filePath: skill.filePath,
      });
    },
  };

  return [
    getQuestionContext,
    searchCurrentMaterial,
    getLearningProgress,
    loadSkill,
  ];
}
