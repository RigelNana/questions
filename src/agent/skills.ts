import type { Skill } from '@earendil-works/pi-agent-core';
import type { AgentCustomSkill } from './types';

export const AGENT_SKILLS: Skill[] = [
  {
    name: 'socratic-tutor',
    description: '通过逐步追问、提示和反例帮助学习者自己推导结论，而不是直接给出答案。',
    filePath: '/virtual-skills/socratic-tutor/SKILL.md',
    content: `# Socratic Tutor

1. 先确认学习者卡住的具体位置和已有理解。
2. 每次只提出一个关键问题或给出一个最小提示。
3. 学习者回答后，指出正确部分与需要修正的部分。
4. 用当前题目的例子、边界条件和反例推进推理。
5. 最后让学习者用自己的话总结，并给出简短的标准结论。`,
  },
  {
    name: 'answer-critic',
    description: '审查参考答案的完整性、准确性、结构和面试表达，指出遗漏与可改进之处。',
    filePath: '/virtual-skills/answer-critic/SKILL.md',
    content: `# Answer Critic

按以下顺序审查答案：
1. 核对核心结论是否直接回答题目。
2. 区分事实错误、缺少前提、过度概括和表达问题。
3. 检查是否包含机制、取舍、边界条件和实践示例。
4. 给出“保留 / 修正 / 补充”清单。
5. 输出一版更适合技术面试口述的精炼答案。

不要仅因为参考答案存在就假定它完全正确。`,
  },
  {
    name: 'mock-interviewer',
    description: '围绕当前知识点进行递进式技术面试，包含追问、评分和反馈。',
    filePath: '/virtual-skills/mock-interviewer/SKILL.md',
    content: `# Mock Interviewer

1. 一次只提出一个问题，等待候选人回答。
2. 从概念题开始，逐步进入机制、边界条件、故障场景和系统设计。
3. 不提前泄露参考答案。
4. 每轮给出 1-5 分评分、一个优点和一个改进点。
5. 如果回答含糊，先追问证据或具体示例。
6. 用户结束后输出总评与复习建议。`,
  },
  {
    name: 'study-planner',
    description: '根据当前题目、作答记录和薄弱点制定可执行的复习计划。',
    filePath: '/virtual-skills/study-planner/SKILL.md',
    content: `# Study Planner

1. 根据当前题目难度、作答记录、错题与批注识别薄弱点。
2. 将复习任务拆成“理解、复述、练习、验证”四类。
3. 每个任务给出完成标准，而不只给出时间安排。
4. 优先处理会阻塞后续知识的基础概念。
5. 输出精简、可勾选的计划，并附一个自测问题。`,
  },
];

export function getAvailableSkills(customSkills: AgentCustomSkill[] = []) {
  const custom = customSkills.map((skill) => ({
    ...skill,
    filePath: `/custom-skills/${skill.name}/SKILL.md`,
  }));
  const customNames = new Set(custom.map((skill) => skill.name));
  return [
    ...AGENT_SKILLS.filter((skill) => !customNames.has(skill.name)),
    ...custom,
  ];
}

export function getEnabledSkills(
  enabledNames: string[],
  customSkills: AgentCustomSkill[] = [],
) {
  const enabled = new Set(enabledNames);
  return getAvailableSkills(customSkills)
    .filter((skill) => enabled.has(skill.name));
}
