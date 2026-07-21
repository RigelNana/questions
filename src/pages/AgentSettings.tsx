import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Bot,
  Brain,
  Database,
  KeyRound,
  ListRestart,
  Network,
  RotateCcw,
  Save,
  ShieldCheck,
  Sparkles,
  Trash2,
  Wrench,
} from 'lucide-react';
import {
  useAgentStore,
} from '../agent/agentStore';
import { agentSecrets } from '../agent/secrets';
import { AGENT_SKILLS } from '../agent/skills';
import {
  AGENT_TOOL_LABELS,
  DEFAULT_AGENT_SETTINGS,
  type AgentPermission,
  type AgentProvider,
  type AgentToolName,
} from '../agent/types';
import { validateAgentConfiguration } from '../agent/runtime';

const INPUT_CLASS = 'w-full rounded-lg border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] px-3 py-2 text-sm text-[var(--color-notion-text)] outline-none transition-colors focus:border-[var(--color-notion-accent)]';

const MODEL_SUGGESTIONS: Record<AgentProvider, string[]> = {
  openai: ['gpt-5-mini', 'gpt-5.4', 'gpt-4.1-mini'],
  anthropic: ['claude-sonnet-4-6', 'claude-haiku-4-5', 'claude-opus-4-7'],
  google: ['gemini-2.5-flash', 'gemini-2.5-pro', 'gemini-3-flash-preview'],
};

function Toggle({
  checked,
  onChange,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-6 w-11 flex-shrink-0 rounded-full transition-colors ${
        checked ? 'bg-[var(--color-notion-accent)]' : 'bg-[var(--color-notion-border)]'
      }`}
    >
      <span className={`absolute left-0 top-[3px] h-[18px] w-[18px] rounded-full bg-white shadow transition-transform ${
        checked ? 'translate-x-[22px]' : 'translate-x-[3px]'
      }`} />
    </button>
  );
}

function SettingRow({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-3 border-t border-[var(--color-notion-border)] py-4 first:border-t-0 first:pt-0 sm:flex-row sm:items-center sm:justify-between">
      <div className="min-w-0">
        <div className="text-sm font-medium text-[var(--color-notion-text)]">{title}</div>
        {description && <div className="mt-0.5 text-xs text-[var(--color-notion-text-secondary)]">{description}</div>}
      </div>
      <div className="flex-shrink-0 sm:max-w-[58%]">{children}</div>
    </div>
  );
}

function Section({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: typeof Bot;
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] p-4 sm:p-5">
      <div className="mb-4 flex items-start gap-2.5">
        <Icon className="mt-0.5 h-4 w-4 text-[var(--color-notion-accent)]" />
        <div>
          <h2 className="text-base font-semibold text-[var(--color-notion-text)]">{title}</h2>
          {description && <p className="mt-0.5 text-xs text-[var(--color-notion-text-secondary)]">{description}</p>}
        </div>
      </div>
      {children}
    </section>
  );
}

export function AgentSettings() {
  const {
    settings,
    sessions,
    updateSettings,
    clearSessions,
  } = useAgentStore();
  const [apiKey, setApiKey] = useState(agentSecrets.getApiKey);
  const [proxyToken, setProxyToken] = useState(agentSecrets.getProxyToken);
  const [secretSaved, setSecretSaved] = useState(false);
  const validationError = validateAgentConfiguration(settings);

  const saveSecrets = () => {
    agentSecrets.setApiKey(apiKey);
    agentSecrets.setProxyToken(proxyToken);
    setSecretSaved(true);
    window.setTimeout(() => setSecretSaved(false), 1800);
  };

  const toggleTool = (toolName: AgentToolName) => {
    const enabled = settings.enabledTools.includes(toolName);
    updateSettings({
      enabledTools: enabled
        ? settings.enabledTools.filter((name) => name !== toolName)
        : [...settings.enabledTools, toolName],
    });
  };

  const toggleSkill = (name: string) => {
    const enabled = settings.enabledSkills.includes(name);
    updateSettings({
      enabledSkills: enabled
        ? settings.enabledSkills.filter((skill) => skill !== name)
        : [...settings.enabledSkills, name],
    });
  };

  const setPermission = (
    toolName: AgentToolName,
    permission: AgentPermission,
  ) => {
    updateSettings({
      permissions: {
        ...settings.permissions,
        [toolName]: permission,
      },
    });
  };

  return (
    <div className="animate-fade-in">
      <div className="mb-6">
        <Link
          to="/settings"
          className="mb-4 inline-flex items-center gap-1 text-sm text-[var(--color-notion-text-secondary)] no-underline hover:text-[var(--color-notion-accent)]"
        >
          <ArrowLeft className="h-4 w-4" /> 返回设置
        </Link>
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-notion-accent-light)] text-[var(--color-notion-accent)]">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-[var(--color-notion-text)]">Pi AI Agent 配置</h1>
            <p className="text-sm text-[var(--color-notion-text-secondary)]">
              @earendil-works/pi-agent-core 0.80.10 · 浏览器 Agent runtime
            </p>
          </div>
        </div>
      </div>

      <div className={`mb-5 rounded-xl border px-4 py-3 text-sm ${
        validationError
          ? 'border-[var(--color-notion-warning)]/50 bg-[var(--color-notion-warning-light)] text-[var(--color-notion-text)]'
          : 'border-[var(--color-notion-correct)]/50 bg-[var(--color-notion-correct-light)] text-[var(--color-notion-correct)]'
      }`}>
        {validationError ?? 'Agent 配置完整，可以在题目页面开始会话。'}
      </div>

      <div className="space-y-5">
        <Section
          icon={Network}
          title="运行方式与认证"
          description="静态 GitHub Pages 无法安全保存站点密钥；推荐使用独立 Proxy。"
        >
          <SettingRow title="启用 AI Agent" description="关闭后隐藏题目页面的 Agent 入口。">
            <Toggle checked={settings.enabled} onChange={(enabled) => updateSettings({ enabled })} />
          </SettingRow>

          <div className="grid grid-cols-2 gap-2 border-t border-[var(--color-notion-border)] py-4">
            {([
              ['proxy', '安全代理', '密钥和模型白名单由服务端管理'],
              ['direct', '浏览器直连', 'BYOK，仅保存于当前标签页'],
            ] as const).map(([value, label, description]) => (
              <button
                key={value}
                onClick={() => updateSettings({ connectionMode: value })}
                className={`rounded-xl border p-3 text-left ${
                  settings.connectionMode === value
                    ? 'border-[var(--color-notion-accent)] bg-[var(--color-notion-accent-light)]'
                    : 'border-[var(--color-notion-border)]'
                }`}
              >
                <div className="text-sm font-medium text-[var(--color-notion-text)]">{label}</div>
                <div className="mt-1 text-xs text-[var(--color-notion-text-secondary)]">{description}</div>
              </button>
            ))}
          </div>

          {settings.connectionMode === 'proxy' ? (
            <>
              <SettingRow title="Proxy URL" description="Pi streamProxy 会请求 {proxyUrl}/api/stream。">
                <input
                  value={settings.proxyUrl}
                  onChange={(event) => updateSettings({ proxyUrl: event.target.value })}
                  placeholder="https://agent-api.example.com"
                  className={INPUT_CLASS}
                />
              </SettingRow>
              <SettingRow title="短期访问令牌" description="仅写入 sessionStorage，关闭标签页后清除。">
                <input
                  type="password"
                  value={proxyToken}
                  onChange={(event) => setProxyToken(event.target.value)}
                  placeholder="Proxy bearer token"
                  autoComplete="off"
                  className={INPUT_CLASS}
                />
              </SettingRow>
            </>
          ) : (
            <SettingRow title="Provider API Key" description="浏览器脚本可访问该值；只应使用个人、限额密钥。">
              <input
                type="password"
                value={apiKey}
                onChange={(event) => setApiKey(event.target.value)}
                placeholder="仅当前标签页"
                autoComplete="off"
                className={INPUT_CLASS}
              />
            </SettingRow>
          )}

          <div className="border-t border-[var(--color-notion-border)] pt-4">
            <button
              onClick={saveSecrets}
              className="inline-flex items-center gap-2 rounded-lg bg-[var(--color-notion-accent)] px-4 py-2 text-sm font-medium text-[var(--color-notion-on-accent)]"
            >
              <Save className="h-4 w-4" /> {secretSaved ? '已保存到当前标签页' : '保存会话凭据'}
            </button>
          </div>
        </Section>

        <Section icon={Sparkles} title="Provider 与模型" description="对应 pi-ai 的 Provider、Model 和请求参数。">
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="text-sm text-[var(--color-notion-text)]">
              Provider
              <select
                value={settings.provider}
                onChange={(event) => {
                  const provider = event.target.value as AgentProvider;
                  updateSettings({
                    provider,
                    modelId: MODEL_SUGGESTIONS[provider][0],
                  });
                }}
                className={`${INPUT_CLASS} mt-1`}
              >
                <option value="openai">OpenAI</option>
                <option value="anthropic">Anthropic</option>
                <option value="google">Google Gemini</option>
              </select>
            </label>
            <label className="text-sm text-[var(--color-notion-text)]">
              Model ID
              <input
                value={settings.modelId}
                onChange={(event) => updateSettings({ modelId: event.target.value })}
                list={`agent-models-${settings.provider}`}
                className={`${INPUT_CLASS} mt-1`}
              />
              <datalist id={`agent-models-${settings.provider}`}>
                {MODEL_SUGGESTIONS[settings.provider].map((model) => (
                  <option key={model} value={model} />
                ))}
              </datalist>
            </label>
          </div>
          <SettingRow title="自定义 Base URL" description="留空使用 Pi provider 默认地址；可用于兼容端点。">
            <input
              value={settings.baseUrl}
              onChange={(event) => updateSettings({ baseUrl: event.target.value })}
              placeholder="留空使用默认"
              className={INPUT_CLASS}
            />
          </SettingRow>
        </Section>

        <Section icon={Brain} title="推理与 Agent Loop" description="映射 AgentState、SimpleStreamOptions 和循环队列策略。">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="text-sm text-[var(--color-notion-text)]">
              Thinking level
              <select
                value={settings.thinkingLevel}
                onChange={(event) => updateSettings({
                  thinkingLevel: event.target.value as typeof settings.thinkingLevel,
                })}
                className={`${INPUT_CLASS} mt-1`}
              >
                {['off', 'minimal', 'low', 'medium', 'high', 'xhigh', 'max'].map((level) => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </label>
            <label className="text-sm text-[var(--color-notion-text)]">
              Temperature
              <input
                type="number"
                min={0}
                max={2}
                step={0.1}
                value={settings.temperature}
                onChange={(event) => updateSettings({ temperature: Number(event.target.value) })}
                className={`${INPUT_CLASS} mt-1`}
              />
            </label>
            <label className="text-sm text-[var(--color-notion-text)]">
              Max output tokens
              <input
                type="number"
                min={16}
                max={128000}
                value={settings.maxTokens}
                onChange={(event) => updateSettings({ maxTokens: Number(event.target.value) })}
                className={`${INPUT_CLASS} mt-1`}
              />
            </label>
            <label className="text-sm text-[var(--color-notion-text)]">
              Loop 最大轮数
              <input
                type="number"
                min={1}
                max={50}
                value={settings.maxLoopIterations}
                onChange={(event) => updateSettings({ maxLoopIterations: Number(event.target.value) })}
                className={`${INPUT_CLASS} mt-1`}
              />
            </label>
            <label className="text-sm text-[var(--color-notion-text)]">
              Tool execution
              <select
                value={settings.toolExecution}
                onChange={(event) => updateSettings({
                  toolExecution: event.target.value as typeof settings.toolExecution,
                })}
                className={`${INPUT_CLASS} mt-1`}
              >
                <option value="sequential">sequential</option>
                <option value="parallel">parallel</option>
              </select>
            </label>
            <label className="text-sm text-[var(--color-notion-text)]">
              Transport
              <select
                value={settings.transport}
                onChange={(event) => updateSettings({
                  transport: event.target.value as typeof settings.transport,
                })}
                className={`${INPUT_CLASS} mt-1`}
              >
                <option value="auto">auto</option>
                <option value="sse">sse</option>
                <option value="websocket">websocket</option>
                <option value="websocket-cached">websocket-cached</option>
              </select>
            </label>
          </div>

          <details className="mt-4 rounded-lg border border-[var(--color-notion-border)] p-3">
            <summary className="cursor-pointer text-sm font-medium text-[var(--color-notion-text)]">高级请求与队列参数</summary>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {([
                ['timeoutMs', 'Timeout (ms)', settings.timeoutMs],
                ['maxRetries', 'Max retries', settings.maxRetries],
                ['maxRetryDelayMs', 'Max retry delay (ms)', settings.maxRetryDelayMs],
              ] as const).map(([key, label, value]) => (
                <label key={key} className="text-sm text-[var(--color-notion-text)]">
                  {label}
                  <input
                    type="number"
                    min={0}
                    value={value}
                    onChange={(event) => updateSettings({ [key]: Number(event.target.value) })}
                    className={`${INPUT_CLASS} mt-1`}
                  />
                </label>
              ))}
              <label className="text-sm text-[var(--color-notion-text)]">
                Cache retention
                <select
                  value={settings.cacheRetention}
                  onChange={(event) => updateSettings({
                    cacheRetention: event.target.value as typeof settings.cacheRetention,
                  })}
                  className={`${INPUT_CLASS} mt-1`}
                >
                  <option value="none">none</option>
                  <option value="short">short</option>
                  <option value="long">long</option>
                </select>
              </label>
              <label className="text-sm text-[var(--color-notion-text)]">
                Steering mode
                <select
                  value={settings.steeringMode}
                  onChange={(event) => updateSettings({
                    steeringMode: event.target.value as typeof settings.steeringMode,
                  })}
                  className={`${INPUT_CLASS} mt-1`}
                >
                  <option value="one-at-a-time">one-at-a-time</option>
                  <option value="all">all</option>
                </select>
              </label>
              <label className="text-sm text-[var(--color-notion-text)]">
                Follow-up mode
                <select
                  value={settings.followUpMode}
                  onChange={(event) => updateSettings({
                    followUpMode: event.target.value as typeof settings.followUpMode,
                  })}
                  className={`${INPUT_CLASS} mt-1`}
                >
                  <option value="one-at-a-time">one-at-a-time</option>
                  <option value="all">all</option>
                </select>
              </label>
            </div>
            <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {([
                ['minimal', settings.thinkingBudgets.minimal],
                ['low', settings.thinkingBudgets.low],
                ['medium', settings.thinkingBudgets.medium],
                ['high', settings.thinkingBudgets.high],
              ] as const).map(([level, value]) => (
                <label key={level} className="text-xs text-[var(--color-notion-text-secondary)]">
                  {level} budget
                  <input
                    type="number"
                    min={0}
                    value={value}
                    onChange={(event) => updateSettings({
                      thinkingBudgets: {
                        ...settings.thinkingBudgets,
                        [level]: Number(event.target.value),
                      },
                    })}
                    className={`${INPUT_CLASS} mt-1`}
                  />
                </label>
              ))}
            </div>
          </details>
        </Section>

        <Section icon={Database} title="上下文与压缩" description="控制题目注入范围，以及基于 Pi token 估算的自动压缩。">
          <SettingRow title="上下文模式" description="focused 只注入当前标签；full 加入要点、测验、批注与进度。">
            <select
              value={settings.contextMode}
              onChange={(event) => updateSettings({
                contextMode: event.target.value as typeof settings.contextMode,
              })}
              className={INPUT_CLASS}
            >
              <option value="focused">focused</option>
              <option value="question-answer">question-answer</option>
              <option value="full">full</option>
            </select>
          </SettingRow>
          {([
            ['includeHighlights', '包含划线批注', settings.includeHighlights],
            ['includeProgress', '包含学习进度', settings.includeProgress],
            ['includeQuiz', '包含选择题摘要', settings.includeQuiz],
            ['showThinking', '在界面显示 thinking', settings.showThinking],
          ] as const).map(([key, title, checked]) => (
            <SettingRow key={key} title={title}>
              <Toggle checked={checked} onChange={(value) => updateSettings({ [key]: value })} />
            </SettingRow>
          ))}
          <SettingRow title="题目上下文字符上限" description="超出后 Agent 可通过工具按区块读取。">
            <input
              type="number"
              min={4000}
              max={200000}
              value={settings.maxContextChars}
              onChange={(event) => updateSettings({ maxContextChars: Number(event.target.value) })}
              className={INPUT_CLASS}
            />
          </SettingRow>
          <SettingRow title="自动上下文压缩" description="接近模型窗口时生成摘要并保留最近对话。">
            <Toggle checked={settings.autoCompaction} onChange={(autoCompaction) => updateSettings({ autoCompaction })} />
          </SettingRow>
          <div className="grid gap-4 border-t border-[var(--color-notion-border)] pt-4 sm:grid-cols-3">
            <label className="text-sm text-[var(--color-notion-text)]">
              触发阈值 %
              <input
                type="number"
                min={30}
                max={95}
                value={settings.compactionThresholdPercent}
                onChange={(event) => updateSettings({ compactionThresholdPercent: Number(event.target.value) })}
                className={`${INPUT_CLASS} mt-1`}
              />
            </label>
            <label className="text-sm text-[var(--color-notion-text)]">
              Reserve tokens
              <input
                type="number"
                min={512}
                value={settings.reserveTokens}
                onChange={(event) => updateSettings({ reserveTokens: Number(event.target.value) })}
                className={`${INPUT_CLASS} mt-1`}
              />
            </label>
            <label className="text-sm text-[var(--color-notion-text)]">
              Keep recent tokens
              <input
                type="number"
                min={512}
                value={settings.keepRecentTokens}
                onChange={(event) => updateSettings({ keepRecentTokens: Number(event.target.value) })}
                className={`${INPUT_CLASS} mt-1`}
              />
            </label>
          </div>
          <label className="mt-4 block text-sm text-[var(--color-notion-text)]">
            压缩指令
            <textarea
              rows={3}
              value={settings.compactionInstructions}
              onChange={(event) => updateSettings({ compactionInstructions: event.target.value })}
              className={`${INPUT_CLASS} mt-1 resize-y`}
            />
          </label>
        </Section>

        <Section icon={Wrench} title="工具与权限" description="Pi beforeToolCall 会执行 deny → ask → allow 策略；未知工具使用默认策略。">
          <SettingRow title="未知工具默认权限">
            <select
              value={settings.defaultPermission}
              onChange={(event) => updateSettings({
                defaultPermission: event.target.value as AgentPermission,
              })}
              className={INPUT_CLASS}
            >
              <option value="deny">deny</option>
              <option value="ask">ask</option>
              <option value="allow">allow</option>
            </select>
          </SettingRow>
          <div className="space-y-2 border-t border-[var(--color-notion-border)] pt-4">
            {(Object.keys(AGENT_TOOL_LABELS) as AgentToolName[]).map((toolName) => (
              <div key={toolName} className="flex flex-col gap-2 rounded-lg bg-[var(--color-notion-bg-secondary)] p-3 sm:flex-row sm:items-center">
                <label className="flex min-w-0 flex-1 items-center gap-3">
                  <input
                    type="checkbox"
                    checked={settings.enabledTools.includes(toolName)}
                    onChange={() => toggleTool(toolName)}
                    className="h-4 w-4 accent-[var(--color-notion-accent)]"
                  />
                  <span>
                    <span className="block text-sm text-[var(--color-notion-text)]">{AGENT_TOOL_LABELS[toolName]}</span>
                    <code className="text-[10px] text-[var(--color-notion-text-secondary)]">{toolName}</code>
                  </span>
                </label>
                <select
                  value={settings.permissions[toolName]}
                  onChange={(event) => setPermission(toolName, event.target.value as AgentPermission)}
                  disabled={!settings.enabledTools.includes(toolName)}
                  className="rounded-lg border border-[var(--color-notion-border)] bg-[var(--color-notion-bg)] px-2.5 py-1.5 text-xs text-[var(--color-notion-text)] disabled:opacity-40"
                >
                  <option value="allow">allow</option>
                  <option value="ask">ask</option>
                  <option value="deny">deny</option>
                </select>
              </div>
            ))}
          </div>
        </Section>

        <Section icon={Sparkles} title="Skills" description="Skills 遵循渐进披露：系统提示只列出元数据，需要时通过 load_skill 读取完整流程。">
          <div className="grid gap-3 sm:grid-cols-2">
            {AGENT_SKILLS.map((skill) => (
              <label
                key={skill.name}
                className={`flex cursor-pointer items-start gap-3 rounded-xl border p-3 ${
                  settings.enabledSkills.includes(skill.name)
                    ? 'border-[var(--color-notion-accent)] bg-[var(--color-notion-accent-light)]'
                    : 'border-[var(--color-notion-border)]'
                }`}
              >
                <input
                  type="checkbox"
                  checked={settings.enabledSkills.includes(skill.name)}
                  onChange={() => toggleSkill(skill.name)}
                  className="mt-1 h-4 w-4 accent-[var(--color-notion-accent)]"
                />
                <span>
                  <span className="block text-sm font-medium text-[var(--color-notion-text)]">{skill.name}</span>
                  <span className="mt-1 block text-xs text-[var(--color-notion-text-secondary)]">{skill.description}</span>
                </span>
              </label>
            ))}
          </div>
        </Section>

        <Section icon={ShieldCheck} title="系统提示与安全" description="参考题目会放入 <reference> 区块并明确按不可信数据处理。">
          <textarea
            rows={6}
            value={settings.systemPrompt}
            onChange={(event) => updateSettings({ systemPrompt: event.target.value })}
            className={`${INPUT_CLASS} resize-y`}
          />
          <div className="mt-3 rounded-lg bg-[var(--color-notion-warning-light)] p-3 text-xs text-[var(--color-notion-text-secondary)]">
            浏览器权限弹窗只能约束本页工具，不能替代服务器鉴权或 OS 沙箱。Proxy 必须重新校验模型、工具、参数和用户权限。
          </div>
        </Section>

        <Section icon={ListRestart} title="会话存储" description="会话保存在 localStorage；Provider 密钥与 Proxy token 不会写入该存储。">
          <SettingRow title="持久化 Agent 会话">
            <Toggle checked={settings.persistSessions} onChange={(persistSessions) => updateSettings({ persistSessions })} />
          </SettingRow>
          <SettingRow title="最多保存会话数">
            <input
              type="number"
              min={1}
              max={100}
              value={settings.maxStoredSessions}
              onChange={(event) => updateSettings({ maxStoredSessions: Number(event.target.value) })}
              className={INPUT_CLASS}
            />
          </SettingRow>
          <div className="flex flex-wrap gap-2 border-t border-[var(--color-notion-border)] pt-4">
            <button
              onClick={() => {
                if (window.confirm(`确认清除 ${Object.keys(sessions).length} 个 Agent 会话？`)) clearSessions();
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-notion-error)] px-3 py-2 text-sm text-[var(--color-notion-error)]"
            >
              <Trash2 className="h-4 w-4" /> 清除全部会话
            </button>
            <button
              onClick={() => {
                if (window.confirm('确认恢复全部 Agent 默认设置？')) {
                  updateSettings(DEFAULT_AGENT_SETTINGS);
                  agentSecrets.clear();
                  setApiKey('');
                  setProxyToken('');
                }
              }}
              className="inline-flex items-center gap-2 rounded-lg border border-[var(--color-notion-border)] px-3 py-2 text-sm text-[var(--color-notion-text-secondary)]"
            >
              <RotateCcw className="h-4 w-4" /> 恢复默认配置
            </button>
          </div>
        </Section>
      </div>

      <div className="mt-5 flex items-center gap-2 text-xs text-[var(--color-notion-text-secondary)]">
        <KeyRound className="h-3.5 w-3.5" />
        API Key 与 Proxy token 只保留在当前标签页的 sessionStorage。
      </div>
    </div>
  );
}
