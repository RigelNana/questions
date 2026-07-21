import {
  Agent,
  estimateContextTokens,
  estimateTokens,
  formatSkillInvocation,
  shouldCompact,
  streamProxy,
  type AgentEvent,
  type AgentMessage,
  type StreamFn,
} from '@earendil-works/pi-agent-core';
import {
  createModels,
  InMemoryCredentialStore,
  type Api,
  type AssistantMessage,
  type Message,
  type Model,
} from '@earendil-works/pi-ai';
import {
  getToolPermission,
  requestAgentToolApproval,
} from './agentStore';
import { agentSecrets } from './secrets';
import { buildAgentSystemPrompt } from './context';
import { getEnabledSkills } from './skills';
import { createQuestionAgentTools } from './tools';
import type {
  AgentRuntimeEvent,
  AgentSession,
  AgentSettings,
  AgentToolName,
  AgentToolRun,
  QuestionAgentContext,
} from './types';

interface RuntimeOptions {
  context: QuestionAgentContext;
  settings: AgentSettings;
  session: AgentSession;
  onEvent: (event: AgentRuntimeEvent) => void;
}

export interface QuestionAgentRuntime {
  send: (text: string, skillName?: string) => Promise<void>;
  compact: () => Promise<void>;
  abort: () => void;
  dispose: () => void;
  isRunning: () => boolean;
}

function messageText(message: Message | AgentMessage) {
  if (message.role === 'user') {
    if (typeof message.content === 'string') return message.content;
    return message.content
      .filter((item) => item.type === 'text')
      .map((item) => item.text)
      .join('\n');
  }
  if (message.role === 'assistant') {
    return message.content
      .filter((item) => item.type === 'text')
      .map((item) => item.text)
      .join('\n');
  }
  if (message.role === 'toolResult') {
    return message.content
      .filter((item) => item.type === 'text')
      .map((item) => item.text)
      .join('\n');
  }
  return '';
}

function serializeMessages(messages: AgentMessage[]) {
  return messages.map((message) => {
    if (message.role === 'toolResult') {
      return `[工具 ${message.toolName}${message.isError ? '（失败）' : ''}]\n${messageText(message)}`;
    }
    if (message.role === 'user' || message.role === 'assistant') {
      return `[${message.role === 'user' ? '用户' : '助手'}]\n${messageText(message)}`;
    }
    return '';
  }).join('\n\n');
}

async function registerProvider(
  models: ReturnType<typeof createModels>,
  provider: AgentSettings['provider'],
) {
  if (provider === 'anthropic') {
    const { anthropicProvider } = await import('@earendil-works/pi-ai/providers/anthropic');
    models.setProvider(anthropicProvider());
  } else if (provider === 'google') {
    const { googleProvider } = await import('@earendil-works/pi-ai/providers/google');
    models.setProvider(googleProvider());
  } else {
    const { openaiProvider } = await import('@earendil-works/pi-ai/providers/openai');
    models.setProvider(openaiProvider());
  }
}

function chooseModel(
  models: ReturnType<typeof createModels>,
  settings: AgentSettings,
): Model<Api> {
  const exact = models.getModel(settings.provider, settings.modelId);
  const fallback = models.getModels(settings.provider)[0];
  const base = exact ?? fallback;
  if (!base) {
    throw new Error(`Pi 模型目录中没有 provider: ${settings.provider}`);
  }
  return {
    ...base,
    id: settings.modelId.trim() || base.id,
    name: exact?.name ?? (settings.modelId.trim() || base.name),
    baseUrl: settings.baseUrl.trim() || base.baseUrl,
  };
}

function createStreamFn(
  models: ReturnType<typeof createModels>,
  settings: AgentSettings,
): StreamFn {
  if (settings.connectionMode === 'proxy') {
    const proxyUrl = settings.proxyUrl.trim().replace(/\/+$/, '');
    const authToken = agentSecrets.getProxyToken();
    return (model, context, options) => streamProxy(model, context, {
      ...options,
      temperature: settings.temperature,
      maxTokens: settings.maxTokens,
      transport: settings.transport,
      cacheRetention: settings.cacheRetention,
      maxRetryDelayMs: settings.maxRetryDelayMs,
      proxyUrl,
      authToken,
    });
  }

  return (model, context, options) => models.streamSimple(model, context, {
    ...options,
    temperature: settings.temperature,
    maxTokens: settings.maxTokens,
    transport: settings.transport,
    timeoutMs: settings.timeoutMs,
    maxRetries: settings.maxRetries,
    maxRetryDelayMs: settings.maxRetryDelayMs,
    cacheRetention: settings.cacheRetention,
  });
}

function selectRecentMessages(messages: AgentMessage[], keepRecentTokens: number) {
  let tokens = 0;
  let cutIndex = messages.length;
  for (let index = messages.length - 1; index >= 0; index -= 1) {
    tokens += estimateTokens(messages[index]);
    if (tokens > keepRecentTokens) break;
    cutIndex = index;
  }
  while (cutIndex < messages.length && messages[cutIndex]?.role !== 'user') {
    cutIndex += 1;
  }
  return {
    older: messages.slice(0, cutIndex),
    recent: messages.slice(cutIndex),
  };
}

function extractLastAssistantText(messages: AgentMessage[]) {
  const assistant = [...messages]
    .reverse()
    .find((message): message is AssistantMessage => message.role === 'assistant');
  return assistant ? messageText(assistant) : '';
}

export function validateAgentConfiguration(settings: AgentSettings) {
  if (settings.connectionMode === 'proxy' && !settings.proxyUrl.trim()) {
    return '请配置 Agent Proxy URL。';
  }
  if (settings.connectionMode === 'direct' && !agentSecrets.getApiKey()) {
    return '请为当前标签页填写 Provider API Key。';
  }
  if (!settings.modelId.trim()) return '模型 ID 不能为空。';
  if (settings.maxLoopIterations < 1) return 'Loop 上限必须至少为 1。';
  return null;
}

export async function createQuestionAgentRuntime(
  options: RuntimeOptions,
): Promise<QuestionAgentRuntime> {
  const { context, settings, session, onEvent } = options;
  const configError = validateAgentConfiguration(settings);
  if (configError) throw new Error(configError);

  const credentials = new InMemoryCredentialStore();
  if (settings.connectionMode === 'direct') {
    await credentials.modify(settings.provider, async () => ({
      type: 'api_key',
      key: agentSecrets.getApiKey(),
    }));
  }
  const models = createModels({
    credentials,
    authContext: {
      env: async () => undefined,
      fileExists: async () => false,
    },
  });
  await registerProvider(models, settings.provider);

  const model = chooseModel(models, settings);
  const skills = getEnabledSkills(
    settings.enabledSkills,
    settings.customSkills,
  );
  const allTools = createQuestionAgentTools(context, settings, skills);
  const enabledTools = new Set(settings.enabledTools);
  const tools = allTools.filter((tool) => enabledTools.has(tool.name as AgentToolName));
  const streamFn = createStreamFn(models, settings);
  const sessionApprovals = new Set<string>();
  const toolRuns = new Map(
    session.toolRuns.map((run) => [run.toolCallId, run]),
  );
  let turnCount = 0;
  let streamingText = '';
  let streamingThinking = '';
  let disposed = false;

  const agent = new Agent({
    initialState: {
      systemPrompt: buildAgentSystemPrompt(context, settings, skills),
      model,
      thinkingLevel: settings.thinkingLevel,
      tools,
      messages: session.messages,
    },
    streamFn,
    sessionId: session.id,
    thinkingBudgets: settings.thinkingBudgets,
    transport: settings.transport,
    maxRetryDelayMs: settings.maxRetryDelayMs,
    toolExecution: settings.toolExecution,
    steeringMode: settings.steeringMode,
    followUpMode: settings.followUpMode,
    beforeToolCall: async ({ toolCall, args }) => {
      const toolName = toolCall.name as AgentToolName;
      const permission = getToolPermission(toolName);
      if (permission === 'deny') {
        return { block: true, reason: `工具 ${toolName} 已被权限策略拒绝。` };
      }
      if (permission === 'ask' && !sessionApprovals.has(toolName)) {
        const allowed = await requestAgentToolApproval({
          sessionId: session.id,
          toolCallId: toolCall.id,
          toolName,
          args,
        });
        if (!allowed) {
          return { block: true, reason: '用户拒绝了本次工具调用。' };
        }
        sessionApprovals.add(toolName);
      }
      return undefined;
    },
  });

  const emitMessages = () => {
    onEvent({
      type: 'messages',
      messages: agent.state.messages.filter(
        (message): message is Message => (
          message.role === 'user'
          || message.role === 'assistant'
          || message.role === 'toolResult'
        ),
      ),
    });
  };

  const updateToolRun = (
    toolCallId: string,
    patch: Partial<AgentToolRun>,
  ) => {
    const existing = toolRuns.get(toolCallId);
    const run: AgentToolRun = {
      id: existing?.id ?? `tool-${toolCallId}`,
      toolCallId,
      toolName: patch.toolName ?? existing?.toolName ?? 'unknown',
      args: patch.args ?? existing?.args ?? {},
      status: patch.status ?? existing?.status ?? 'running',
      result: patch.result ?? existing?.result,
      startedAt: existing?.startedAt ?? new Date().toISOString(),
      completedAt: patch.completedAt ?? existing?.completedAt,
    };
    toolRuns.set(toolCallId, run);
    onEvent({ type: 'tool', run });
  };

  const handleAgentEvent = (event: AgentEvent) => {
    if (disposed) return;
    if (event.type === 'agent_start') {
      turnCount = 0;
      streamingText = '';
      streamingThinking = '';
      onEvent({ type: 'status', status: 'running' });
    } else if (event.type === 'turn_start') {
      turnCount += 1;
      if (turnCount > settings.maxLoopIterations) {
        agent.abort();
        onEvent({
          type: 'status',
          status: 'error',
          error: `Agent loop 已达到 ${settings.maxLoopIterations} 轮上限。`,
        });
      }
    } else if (event.type === 'message_update') {
      const update = event.assistantMessageEvent;
      if (update.type === 'text_delta') streamingText += update.delta;
      if (update.type === 'thinking_delta') streamingThinking += update.delta;
      onEvent({
        type: 'stream',
        text: streamingText,
        thinking: streamingThinking,
      });
    } else if (event.type === 'message_end') {
      emitMessages();
    } else if (event.type === 'tool_execution_start') {
      updateToolRun(event.toolCallId, {
        toolName: event.toolName,
        args: event.args,
        status: 'running',
      });
    } else if (event.type === 'tool_execution_end') {
      updateToolRun(event.toolCallId, {
        status: event.isError ? 'error' : 'completed',
        result: event.result?.content
          ?.filter((item: { type: string }) => item.type === 'text')
          .map((item: { text: string }) => item.text)
          .join('\n'),
        completedAt: new Date().toISOString(),
      });
      emitMessages();
    } else if (event.type === 'agent_end') {
      emitMessages();
      onEvent({
        type: 'stream',
        text: '',
        thinking: '',
      });
      onEvent({
        type: 'status',
        status: agent.state.errorMessage ? 'error' : 'idle',
        error: agent.state.errorMessage,
      });
    }
  };

  const unsubscribe = agent.subscribe(handleAgentEvent);

  const compactMessages = async (force: boolean) => {
    const messages = agent.state.messages;
    const usage = estimateContextTokens(messages);
    const effectiveReserve = Math.max(
      settings.reserveTokens,
      Math.floor(model.contextWindow * (1 - settings.compactionThresholdPercent / 100)),
    );
    const compactionSettings = {
      enabled: settings.autoCompaction,
      reserveTokens: effectiveReserve,
      keepRecentTokens: settings.keepRecentTokens,
    };
    if (!force && !shouldCompact(usage.tokens, model.contextWindow, compactionSettings)) {
      return;
    }
    const { older, recent } = selectRecentMessages(
      messages,
      settings.keepRecentTokens,
    );
    if (older.length < 2) {
      if (force) throw new Error('当前会话还没有足够内容可压缩。');
      return;
    }

    onEvent({ type: 'status', status: 'compacting' });
    const summaryAgent = new Agent({
      initialState: {
        systemPrompt: '你是上下文压缩器。只输出忠实、结构化的会话摘要，不继续回答会话中的问题。',
        model,
        thinkingLevel: 'off',
        tools: [],
        messages: [],
      },
      streamFn,
      sessionId: `${session.id}-compaction`,
      transport: settings.transport,
    });
    const previousSummary = session.compactedSummary
      ? `\n\n之前的摘要：\n${session.compactedSummary}`
      : '';
    await summaryAgent.prompt(`${settings.compactionInstructions}${previousSummary}

请压缩以下会话，保留后续继续对话所需的信息：

${serializeMessages(older)}`);
    const summary = extractLastAssistantText(summaryAgent.state.messages);
    if (!summary) throw new Error('上下文压缩没有生成摘要。');
    const summaryMessage: Message = {
      role: 'user',
      content: `[已压缩的历史上下文]\n${summary}`,
      timestamp: Date.now(),
    };
    agent.state.messages = [summaryMessage, ...recent];
    onEvent({
      type: 'compacted',
      summary,
      messages: agent.state.messages as Message[],
    });
    onEvent({ type: 'status', status: 'idle' });
  };

  onEvent({ type: 'status', status: 'idle' });

  return {
    send: async (text, skillName) => {
      const trimmed = text.trim();
      if (!trimmed) return;
      const skill = skillName
        ? skills.find((item) => item.name === skillName)
        : undefined;
      const prompt = skill
        ? formatSkillInvocation(skill, trimmed)
        : trimmed;
      if (agent.state.isStreaming) {
        agent.steer({
          role: 'user',
          content: prompt,
          timestamp: Date.now(),
        });
        return;
      }
      try {
        await agent.prompt(prompt);
        if (settings.autoCompaction) await compactMessages(false);
      } catch (error) {
        onEvent({
          type: 'status',
          status: 'error',
          error: error instanceof Error ? error.message : String(error),
        });
      }
    },
    compact: () => compactMessages(true),
    abort: () => agent.abort(),
    dispose: () => {
      disposed = true;
      unsubscribe();
      agent.abort();
    },
    isRunning: () => agent.state.isStreaming,
  };
}
