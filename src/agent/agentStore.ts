import { create } from 'zustand';
import type { Message } from '@earendil-works/pi-ai';
import type {
  AgentSession,
  AgentSettings,
  AgentToolName,
  AgentToolRun,
  PendingToolApproval,
  QuestionAgentContext,
} from './types';
import { DEFAULT_AGENT_SETTINGS } from './types';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const STORAGE_KEY = 'sre-quiz-agent';

interface PersistedAgentState {
  settings: AgentSettings;
  sessions: Record<string, AgentSession>;
  activeSessionByQuestion: Record<string, string>;
}

type ApprovalDecision = 'allow-once' | 'allow-always' | 'deny';

interface AgentStoreState extends PersistedAgentState {
  panelOpen: boolean;
  pendingApproval: PendingToolApproval | null;
  setPanelOpen: (open: boolean) => void;
  updateSettings: (patch: Partial<AgentSettings>) => void;
  ensureSession: (context: QuestionAgentContext) => AgentSession;
  updateSession: (sessionId: string, patch: Partial<AgentSession>) => void;
  setSessionMessages: (sessionId: string, messages: Message[]) => void;
  upsertToolRun: (sessionId: string, run: AgentToolRun) => void;
  newSession: (context: QuestionAgentContext) => AgentSession;
  deleteSession: (sessionId: string) => void;
  clearSessions: () => void;
  resolveApproval: (decision: ApprovalDecision) => void;
}

let approvalResolver: ((allowed: boolean) => void) | null = null;

function createId(prefix: string) {
  const id = typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${id}`;
}

function mergeSettings(saved?: Partial<AgentSettings>): AgentSettings {
  return {
    ...DEFAULT_AGENT_SETTINGS,
    ...saved,
    enabledTools: saved?.enabledTools ?? DEFAULT_AGENT_SETTINGS.enabledTools,
    enabledSkills: saved?.enabledSkills ?? DEFAULT_AGENT_SETTINGS.enabledSkills,
    customSkills: saved?.customSkills ?? DEFAULT_AGENT_SETTINGS.customSkills,
    permissions: {
      ...DEFAULT_AGENT_SETTINGS.permissions,
      ...saved?.permissions,
    },
    thinkingBudgets: {
      ...DEFAULT_AGENT_SETTINGS.thinkingBudgets,
      ...saved?.thinkingBudgets,
    },
  };
}

function trimSessions(
  sessions: Record<string, AgentSession>,
  maxStoredSessions: number,
) {
  return Object.fromEntries(
    Object.entries(sessions)
      .sort(([, left], [, right]) => right.updatedAt.localeCompare(left.updatedAt))
      .slice(0, Math.max(1, maxStoredSessions)),
  );
}

const loaded = loadFromStorage<Partial<PersistedAgentState>>(STORAGE_KEY, {});
const initialSettings = mergeSettings(loaded.settings);

export const useAgentStore = create<AgentStoreState>((set, get) => {
  const persist = () => {
    const { settings, sessions, activeSessionByQuestion } = get();
    saveToStorage<PersistedAgentState>(STORAGE_KEY, {
      settings,
      sessions: settings.persistSessions
        ? trimSessions(sessions, settings.maxStoredSessions)
        : {},
      activeSessionByQuestion: settings.persistSessions
        ? activeSessionByQuestion
        : {},
    });
  };

  const createSession = (context: QuestionAgentContext): AgentSession => {
    const now = new Date().toISOString();
    return {
      id: createId('agent'),
      questionId: context.question.id,
      domain: context.question.domain,
      title: context.question.title,
      messages: [],
      toolRuns: [],
      compactionCount: 0,
      createdAt: now,
      updatedAt: now,
    };
  };

  return {
    settings: initialSettings,
    sessions: loaded.sessions ?? {},
    activeSessionByQuestion: loaded.activeSessionByQuestion ?? {},
    panelOpen: false,
    pendingApproval: null,

    setPanelOpen: (panelOpen) => set({ panelOpen }),

    updateSettings: (patch) => {
      set((state) => ({
        settings: mergeSettings({
          ...state.settings,
          ...patch,
          permissions: patch.permissions
            ? { ...state.settings.permissions, ...patch.permissions }
            : state.settings.permissions,
        }),
      }));
      persist();
    },

    ensureSession: (context) => {
      const state = get();
      const activeId = state.activeSessionByQuestion[context.question.id];
      const active = activeId ? state.sessions[activeId] : undefined;
      if (active) return active;

      const existing = Object.values(state.sessions)
        .filter((session) => session.questionId === context.question.id)
        .sort((left, right) => right.updatedAt.localeCompare(left.updatedAt))[0];
      if (existing) {
        set((current) => ({
          activeSessionByQuestion: {
            ...current.activeSessionByQuestion,
            [context.question.id]: existing.id,
          },
        }));
        persist();
        return existing;
      }

      const session = createSession(context);
      set((current) => ({
        sessions: { ...current.sessions, [session.id]: session },
        activeSessionByQuestion: {
          ...current.activeSessionByQuestion,
          [context.question.id]: session.id,
        },
      }));
      persist();
      return session;
    },

    newSession: (context) => {
      const session = createSession(context);
      set((state) => ({
        sessions: { ...state.sessions, [session.id]: session },
        activeSessionByQuestion: {
          ...state.activeSessionByQuestion,
          [context.question.id]: session.id,
        },
      }));
      persist();
      return session;
    },

    updateSession: (sessionId, patch) => {
      set((state) => {
        const current = state.sessions[sessionId];
        if (!current) return state;
        return {
          sessions: {
            ...state.sessions,
            [sessionId]: {
              ...current,
              ...patch,
              updatedAt: new Date().toISOString(),
            },
          },
        };
      });
      persist();
    },

    setSessionMessages: (sessionId, messages) => {
      get().updateSession(sessionId, { messages });
    },

    upsertToolRun: (sessionId, run) => {
      const session = get().sessions[sessionId];
      if (!session) return;
      const existingIndex = session.toolRuns.findIndex(
        (item) => item.toolCallId === run.toolCallId,
      );
      const toolRuns = [...session.toolRuns];
      if (existingIndex >= 0) toolRuns[existingIndex] = run;
      else toolRuns.push(run);
      get().updateSession(sessionId, { toolRuns: toolRuns.slice(-100) });
    },

    deleteSession: (sessionId) => {
      set((state) => {
        const sessions = { ...state.sessions };
        delete sessions[sessionId];
        const activeSessionByQuestion = Object.fromEntries(
          Object.entries(state.activeSessionByQuestion)
            .filter(([, id]) => id !== sessionId),
        );
        return { sessions, activeSessionByQuestion };
      });
      persist();
    },

    clearSessions: () => {
      set({ sessions: {}, activeSessionByQuestion: {} });
      persist();
    },

    resolveApproval: (decision) => {
      const pending = get().pendingApproval;
      if (!pending) return;
      if (decision === 'allow-always') {
        get().updateSettings({
          permissions: {
            ...get().settings.permissions,
            [pending.toolName]: 'allow',
          },
        });
      }
      set({ pendingApproval: null });
      approvalResolver?.(decision !== 'deny');
      approvalResolver = null;
    },
  };
});

export function requestAgentToolApproval(
  request: Omit<PendingToolApproval, 'id'>,
): Promise<boolean> {
  if (approvalResolver) approvalResolver(false);
  useAgentStore.setState({
    pendingApproval: {
      ...request,
      id: createId('approval'),
    },
  });
  return new Promise<boolean>((resolve) => {
    approvalResolver = resolve;
  });
}

export function getToolPermission(toolName: string) {
  const { settings } = useAgentStore.getState();
  return settings.permissions[toolName as AgentToolName]
    ?? settings.defaultPermission;
}
