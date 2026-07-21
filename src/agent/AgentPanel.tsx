import {
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from 'react';
import { Link } from 'react-router-dom';
import type { Message } from '@earendil-works/pi-ai';
import {
  Bot,
  Brain,
  CircleStop,
  LoaderCircle,
  Minimize2,
  Plus,
  Send,
  Settings,
  ShieldAlert,
  Sparkles,
  Trash2,
  Wrench,
  X,
} from 'lucide-react';
import { MarkdownRenderer } from '../components/ui/MarkdownRenderer';
import {
  useAgentStore,
} from './agentStore';
import {
  createQuestionAgentRuntime,
  validateAgentConfiguration,
  type QuestionAgentRuntime,
} from './runtime';
import { AGENT_SKILLS } from './skills';
import {
  AGENT_TOOL_LABELS,
  type AgentRuntimeStatus,
  type QuestionAgentContext,
} from './types';

interface AgentPanelProps {
  open: boolean;
  context: QuestionAgentContext;
  promptRequest?: {
    id: number;
    text: string;
  };
  onClose: () => void;
}

interface RuntimeView {
  key: string;
  status: AgentRuntimeStatus;
  error?: string;
  streamingText: string;
  thinking: string;
}

function extractText(message: Message) {
  if (message.role === 'user') {
    const text = typeof message.content === 'string'
      ? message.content
      : message.content
        .filter((item) => item.type === 'text')
        .map((item) => item.text)
        .join('\n');
    if (text.startsWith('<skill ')) {
      const end = text.indexOf('</skill>');
      return end >= 0 ? text.slice(end + '</skill>'.length).trim() : text;
    }
    return text;
  }
  return message.content
    .filter((item) => item.type === 'text')
    .map((item) => item.text)
    .join('\n');
}

function extractThinking(message: Message) {
  if (message.role !== 'assistant') return '';
  return message.content
    .filter((item) => item.type === 'thinking')
    .map((item) => item.thinking)
    .join('\n');
}

const STATUS_LABELS: Record<AgentRuntimeStatus, string> = {
  initializing: '初始化',
  idle: '就绪',
  running: '思考中',
  compacting: '压缩上下文',
  error: '需要处理',
};

export function AgentPanel({
  open,
  context,
  promptRequest,
  onClose,
}: AgentPanelProps) {
  const {
    settings,
    sessions,
    activeSessionByQuestion,
    pendingApproval,
    ensureSession,
    newSession,
    deleteSession,
    setSessionMessages,
    updateSession,
    upsertToolRun,
    resolveApproval,
  } = useAgentStore();
  const activeSessionId = activeSessionByQuestion[context.question.id];
  const session = activeSessionId ? sessions[activeSessionId] : undefined;
  const runtimeRef = useRef<QuestionAgentRuntime | null>(null);
  const contextRef = useRef(context);
  contextRef.current = context;
  const sessionRef = useRef(session);
  sessionRef.current = session;
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [runtimeView, setRuntimeView] = useState<RuntimeView>({
    key: '',
    status: 'initializing',
    streamingText: '',
    thinking: '',
  });
  const [draftState, setDraftState] = useState({
    requestId: -1,
    value: '',
  });
  const [selectedSkill, setSelectedSkill] = useState('');

  const requestId = promptRequest?.id ?? 0;
  const draft = draftState.requestId === requestId
    ? draftState.value
    : promptRequest?.text ?? '';
  const contextVersion = [
    context.activeSection,
    context.highlights.map((highlight) => highlight.updatedAt).join(','),
    context.progress?.quizAttempts.length ?? 0,
  ].join(':');
  const runtimeKey = session
    ? `${session.id}:${contextVersion}:${JSON.stringify(settings)}`
    : '';
  const view = runtimeView.key === runtimeKey
    ? runtimeView
    : {
      key: runtimeKey,
      status: 'initializing' as const,
      streamingText: '',
      thinking: '',
    };
  const configError = validateAgentConfiguration(settings);

  useEffect(() => {
    if (open && !session) ensureSession(contextRef.current);
  }, [open, session, context.question.id, ensureSession]);

  useEffect(() => {
    const initialSession = sessionRef.current;
    if (!open || !initialSession || configError) return;
    let cancelled = false;
    let runtime: QuestionAgentRuntime | null = null;

    createQuestionAgentRuntime({
      context: contextRef.current,
      settings,
      session: initialSession,
      onEvent: (event) => {
        if (cancelled) return;
        if (event.type === 'status') {
          setRuntimeView((current) => ({
            ...current,
            key: runtimeKey,
            status: event.status,
            error: event.error,
          }));
        } else if (event.type === 'stream') {
          setRuntimeView((current) => ({
            ...current,
            key: runtimeKey,
            streamingText: event.text,
            thinking: event.thinking,
          }));
        } else if (event.type === 'messages') {
          setSessionMessages(initialSession.id, event.messages);
        } else if (event.type === 'tool') {
          upsertToolRun(initialSession.id, event.run);
        } else if (event.type === 'compacted') {
          const latest = useAgentStore.getState().sessions[initialSession.id];
          updateSession(initialSession.id, {
            messages: event.messages,
            compactedSummary: event.summary,
            compactionCount: (latest?.compactionCount ?? 0) + 1,
          });
        }
      },
    }).then((created) => {
      if (cancelled) created.dispose();
      else {
        runtime = created;
        runtimeRef.current = created;
      }
    }).catch((error) => {
      if (cancelled) return;
      setRuntimeView({
        key: runtimeKey,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
        streamingText: '',
        thinking: '',
      });
    });

    return () => {
      cancelled = true;
      runtime?.dispose();
      if (runtimeRef.current === runtime) runtimeRef.current = null;
    };
  }, [
    open,
    session?.id,
    runtimeKey,
    configError,
    contextVersion,
    settings,
    setSessionMessages,
    upsertToolRun,
    updateSession,
  ]);

  const visibleMessages = (session?.messages ?? []).filter(
    (message) => message.role !== 'toolResult',
  );

  useEffect(() => {
    if (!open) return;
    const frame = requestAnimationFrame(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    });
    return () => cancelAnimationFrame(frame);
  }, [
    open,
    visibleMessages.length,
    view.streamingText,
    session?.toolRuns.length,
  ]);

  if (!open) return null;

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    if (!draft.trim() || !runtimeRef.current) return;
    const text = draft;
    setDraftState({ requestId, value: '' });
    await runtimeRef.current.send(text, selectedSkill || undefined);
  };

  const createFreshSession = () => {
    runtimeRef.current?.dispose();
    newSession(contextRef.current);
  };

  const removeCurrentSession = () => {
    if (!session) return;
    if (window.confirm('确认删除当前 Agent 会话？')) {
      runtimeRef.current?.dispose();
      deleteSession(session.id);
    }
  };

  const runCompaction = async () => {
    try {
      await runtimeRef.current?.compact();
    } catch (error) {
      setRuntimeView((current) => ({
        ...current,
        key: runtimeKey,
        status: 'error',
        error: error instanceof Error ? error.message : String(error),
      }));
    }
  };

  return (
    <div className="fixed inset-0 z-[70] flex justify-end">
      <button
        className="absolute inset-0 bg-black/35 backdrop-blur-[2px]"
        onClick={onClose}
        aria-label="关闭 AI Agent"
      />
      <aside className="relative flex h-full w-full flex-col border-l border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] shadow-2xl sm:max-w-[480px] animate-slide-in-right">
        <header className="flex items-center gap-3 border-b border-[var(--color-notion-border)] px-4 py-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[var(--color-notion-accent-light)] text-[var(--color-notion-accent)]">
            <Bot className="h-5 w-5" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2">
              <h2 className="truncate text-sm font-semibold text-[var(--color-notion-text)]">Pi AI Agent</h2>
              <span className={`rounded-full px-2 py-0.5 text-[10px] ${
                view.status === 'error'
                  ? 'bg-[var(--color-notion-error-light)] text-[var(--color-notion-error)]'
                  : 'bg-[var(--color-notion-accent-light)] text-[var(--color-notion-accent)]'
              }`}>
                {STATUS_LABELS[view.status]}
              </span>
            </div>
            <p className="truncate text-xs text-[var(--color-notion-text-secondary)]">{context.question.title}</p>
          </div>
          <button
            onClick={createFreshSession}
            className="compact-control rounded-lg p-2 text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-bg-hover)]"
            title="新会话"
          >
            <Plus className="h-4 w-4" />
          </button>
          <button
            onClick={runCompaction}
            disabled={!runtimeRef.current || view.status !== 'idle'}
            className="compact-control rounded-lg p-2 text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-bg-hover)] disabled:opacity-30"
            title="手动压缩上下文"
          >
            <Minimize2 className="h-4 w-4" />
          </button>
          <Link
            to="/settings/agent"
            onClick={onClose}
            className="compact-control rounded-lg p-2 text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-bg-hover)]"
            title="Agent 设置"
          >
            <Settings className="h-4 w-4" />
          </Link>
          <button
            onClick={onClose}
            className="compact-control rounded-lg p-2 text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-bg-hover)]"
            aria-label="关闭 Agent 面板"
          >
            <X className="h-4 w-4" />
          </button>
        </header>

        <div className="flex-1 overflow-y-auto px-4 py-4">
          {configError ? (
            <div className="rounded-xl border border-[var(--color-notion-warning)]/50 bg-[var(--color-notion-warning-light)] p-4">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--color-notion-text)]">
                <ShieldAlert className="h-4 w-4 text-[var(--color-notion-warning)]" /> Agent 尚未完成配置
              </div>
              <p className="mb-3 text-sm text-[var(--color-notion-text-secondary)]">{configError}</p>
              <Link to="/settings/agent" onClick={onClose} className="text-sm font-medium text-[var(--color-notion-accent)] hover:underline">
                打开详细配置
              </Link>
            </div>
          ) : visibleMessages.length === 0 && !view.streamingText ? (
            <div className="py-8">
              <Sparkles className="mx-auto mb-3 h-8 w-8 text-[var(--color-notion-accent)]" />
              <h3 className="text-center text-sm font-semibold text-[var(--color-notion-text)]">围绕当前题目继续追问</h3>
              <p className="mx-auto mt-1 max-w-sm text-center text-xs text-[var(--color-notion-text-secondary)]">
                Agent 会根据设置加载题目、答案、学习进度、Skills 和只读工具。
              </p>
              <div className="mt-5 grid gap-2">
                {[
                  '用直观例子解释这道题的核心机制',
                  '参考答案有哪些容易遗漏的边界条件？',
                  '作为面试官，针对这道题追问我',
                ].map((prompt) => (
                  <button
                    key={prompt}
                    onClick={() => setDraftState({ requestId, value: prompt })}
                    className="rounded-lg border border-[var(--color-notion-border)] px-3 py-2 text-left text-xs text-[var(--color-notion-text-secondary)] hover:border-[var(--color-notion-accent)] hover:bg-[var(--color-notion-accent-light)]"
                  >
                    {prompt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {visibleMessages.map((message, index) => {
                const content = extractText(message);
                const thinking = extractThinking(message);
                const assistant = message.role === 'assistant';
                return (
                  <div
                    key={`${message.timestamp}-${index}`}
                    className={assistant ? 'pr-5' : 'pl-8'}
                  >
                    <div className={`rounded-xl px-3.5 py-3 ${
                      assistant
                        ? 'border border-[var(--color-notion-border)] bg-[var(--color-notion-bg-secondary)]'
                        : 'bg-[var(--color-notion-accent)] text-[var(--color-notion-on-accent)]'
                    }`}>
                      {thinking && settings.showThinking && (
                        <details className="mb-2 text-xs opacity-75">
                          <summary className="cursor-pointer">思考过程</summary>
                          <pre className="mt-2 whitespace-pre-wrap text-xs">{thinking}</pre>
                        </details>
                      )}
                      {assistant
                        ? <MarkdownRenderer content={content || '…'} allowRawHtml={false} className="text-sm" />
                        : <div className="whitespace-pre-wrap text-sm">{content}</div>}
                    </div>
                  </div>
                );
              })}

              {session?.toolRuns.map((run) => (
                <details
                  key={run.id}
                  className="rounded-lg border border-[var(--color-notion-border)] bg-[var(--color-notion-bg-secondary)] px-3 py-2 text-xs"
                >
                  <summary className="flex cursor-pointer list-none items-center gap-2 text-[var(--color-notion-text-secondary)]">
                    {run.status === 'running'
                      ? <LoaderCircle className="h-3.5 w-3.5 animate-spin text-[var(--color-notion-accent)]" />
                      : <Wrench className="h-3.5 w-3.5 text-[var(--color-notion-accent)]" />}
                    <span>{AGENT_TOOL_LABELS[run.toolName as keyof typeof AGENT_TOOL_LABELS] ?? run.toolName}</span>
                    <span className="ml-auto opacity-60">{run.status}</span>
                  </summary>
                  <pre className="mt-2 overflow-x-auto whitespace-pre-wrap text-[11px] text-[var(--color-notion-text-secondary)]">
                    {JSON.stringify(run.args, null, 2)}
                    {run.result ? `\n\n${run.result}` : ''}
                  </pre>
                </details>
              ))}

              {(view.streamingText || view.thinking) && (
                <div className="pr-5">
                  <div className="rounded-xl border border-[var(--color-notion-accent)]/40 bg-[var(--color-notion-bg-secondary)] px-3.5 py-3">
                    {settings.showThinking && view.thinking && (
                      <div className="mb-2 flex items-start gap-2 text-xs text-[var(--color-notion-text-secondary)]">
                        <Brain className="mt-0.5 h-3.5 w-3.5 flex-shrink-0" />
                        <span className="whitespace-pre-wrap">{view.thinking}</span>
                      </div>
                    )}
                    <MarkdownRenderer content={view.streamingText || '…'} allowRawHtml={false} className="text-sm" />
                  </div>
                </div>
              )}
            </div>
          )}

          {view.error && (
            <div className="mt-4 rounded-lg border border-[var(--color-notion-error)]/40 bg-[var(--color-notion-error-light)] px-3 py-2 text-xs text-[var(--color-notion-error)]">
              {view.error}
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form
          onSubmit={handleSubmit}
          className="border-t border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] p-3 pb-[calc(0.75rem+env(safe-area-inset-bottom))]"
        >
          <div className="mb-2 flex items-center gap-2">
            <select
              value={selectedSkill}
              onChange={(event) => setSelectedSkill(event.target.value)}
              className="min-w-0 flex-1 rounded-lg border border-[var(--color-notion-border)] bg-[var(--color-notion-bg-secondary)] px-2.5 py-1.5 text-xs text-[var(--color-notion-text)]"
            >
              <option value="">自动选择 Skill</option>
              {AGENT_SKILLS
                .filter((skill) => settings.enabledSkills.includes(skill.name))
                .map((skill) => (
                  <option key={skill.name} value={skill.name}>{skill.name}</option>
                ))}
            </select>
            {session && (
              <button
                type="button"
                onClick={removeCurrentSession}
                className="compact-control rounded-lg p-2 text-[var(--color-notion-text-secondary)] hover:bg-[var(--color-notion-error-light)] hover:text-[var(--color-notion-error)]"
                title="删除会话"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="flex items-end gap-2 rounded-xl border border-[var(--color-notion-border)] bg-[var(--color-notion-bg-secondary)] p-2 focus-within:border-[var(--color-notion-accent)]">
            <textarea
              value={draft}
              onChange={(event) => setDraftState({
                requestId,
                value: event.target.value,
              })}
              onKeyDown={(event) => {
                event.stopPropagation();
                if (event.key === 'Enter' && !event.shiftKey) {
                  event.preventDefault();
                  event.currentTarget.form?.requestSubmit();
                }
              }}
              rows={2}
              placeholder={configError ? '请先完成 Agent 配置' : '继续追问… Enter 发送，Shift+Enter 换行'}
              disabled={!!configError}
              className="max-h-32 min-h-11 flex-1 resize-none bg-transparent px-1.5 py-1 text-sm text-[var(--color-notion-text)] outline-none placeholder:text-[var(--color-notion-text-secondary)]"
            />
            {view.status === 'running' ? (
              <button
                type="button"
                onClick={() => runtimeRef.current?.abort()}
                className="compact-control flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-notion-error)] text-white"
                aria-label="停止 Agent"
              >
                <CircleStop className="h-4 w-4" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!draft.trim() || !runtimeRef.current || !!configError}
                className="compact-control flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--color-notion-accent)] text-[var(--color-notion-on-accent)] disabled:opacity-30"
                aria-label="发送消息"
              >
                <Send className="h-4 w-4" />
              </button>
            )}
          </div>
          <p className="mt-1.5 text-center text-[10px] text-[var(--color-notion-text-secondary)]">
            Pi Agent 可调用工具。ask 权限会在执行前请求确认。
          </p>
        </form>

        {pendingApproval && pendingApproval.sessionId === session?.id && (
          <div className="absolute inset-0 z-20 flex items-center justify-center bg-black/45 p-5 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-xl border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] p-4 shadow-2xl">
              <div className="mb-2 flex items-center gap-2 text-sm font-semibold text-[var(--color-notion-text)]">
                <ShieldAlert className="h-4 w-4 text-[var(--color-notion-warning)]" />
                允许工具调用？
              </div>
              <p className="text-sm text-[var(--color-notion-text-secondary)]">
                {AGENT_TOOL_LABELS[pendingApproval.toolName]}
              </p>
              <pre className="my-3 max-h-40 overflow-auto rounded-lg bg-[var(--color-notion-bg-secondary)] p-3 text-xs text-[var(--color-notion-text-secondary)]">
                {JSON.stringify(pendingApproval.args, null, 2)}
              </pre>
              <div className="flex flex-col gap-2 sm:flex-row">
                <button
                  onClick={() => resolveApproval('deny')}
                  className="flex-1 rounded-lg border border-[var(--color-notion-border)] px-3 py-2 text-sm text-[var(--color-notion-text-secondary)]"
                >
                  拒绝
                </button>
                <button
                  onClick={() => resolveApproval('allow-once')}
                  className="flex-1 rounded-lg border border-[var(--color-notion-accent)] px-3 py-2 text-sm text-[var(--color-notion-accent)]"
                >
                  本次允许
                </button>
                <button
                  onClick={() => resolveApproval('allow-always')}
                  className="flex-1 rounded-lg bg-[var(--color-notion-accent)] px-3 py-2 text-sm text-[var(--color-notion-on-accent)]"
                >
                  始终允许
                </button>
              </div>
            </div>
          </div>
        )}
      </aside>
    </div>
  );
}
