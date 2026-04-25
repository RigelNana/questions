import { create } from 'zustand';
import type {
  PackRegistry,
  PackRegistryEntry,
  QuestionEntry,
  QuestionIndex,
  QuestionPack,
  QuestionSummary,
  Domain,
} from '../types';
import { loadRegistry, loadQuestionIndex, loadQuestionPack } from '../utils/questionLoader';

interface QuestionState {
  registry: PackRegistry | null;
  indexes: Partial<Record<Domain, QuestionIndex>>;
  loadedPacks: Record<string, QuestionPack>;
  isLoadingRegistry: boolean;
  isLoadingIndex: Partial<Record<Domain, boolean>>;
  isLoadingPack: Record<string, boolean>;
  error: string | null;

  // Actions
  fetchRegistry: () => Promise<void>;
  fetchIndexForDomain: (domain: Domain) => Promise<QuestionIndex>;
  fetchPack: (entry: PackRegistryEntry) => Promise<QuestionPack>;
  fetchPackForQuestion: (domain: Domain, questionId: string) => Promise<QuestionEntry | undefined>;
  fetchPacksForDomain: (domain: Domain) => Promise<void>;
  getQuestionSummariesForDomain: (domain: Domain) => QuestionSummary[];
  getQuestionSummaryById: (id: string) => QuestionSummary | undefined;
  getQuestionsForDomain: (domain: Domain) => QuestionEntry[];
  getQuestionById: (id: string) => QuestionEntry | undefined;
  getAllQuestionSummaries: () => QuestionSummary[];
  getAllLoadedQuestions: () => QuestionEntry[];
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  registry: null,
  indexes: {},
  loadedPacks: {},
  isLoadingRegistry: false,
  isLoadingIndex: {},
  isLoadingPack: {},
  error: null,

  fetchRegistry: async () => {
    if (get().registry) return;
    set({ isLoadingRegistry: true, error: null });
    try {
      const registry = await loadRegistry();
      set({ registry, isLoadingRegistry: false });
    } catch (e) {
      set({
        error: e instanceof Error ? e.message : 'Failed to load registry',
        isLoadingRegistry: false,
      });
    }
  },

  fetchIndexForDomain: async (domain: Domain) => {
    const { indexes, isLoadingIndex } = get();
    if (indexes[domain]) return indexes[domain];
    if (isLoadingIndex[domain]) {
      return new Promise<QuestionIndex>((resolve, reject) => {
        const unsubscribe = useQuestionStore.subscribe((state) => {
          if (state.indexes[domain]) {
            unsubscribe();
            resolve(state.indexes[domain]!);
          } else if (!state.isLoadingIndex[domain] && state.error) {
            unsubscribe();
            reject(new Error(state.error));
          }
        });
      });
    }

    set((s) => ({ isLoadingIndex: { ...s.isLoadingIndex, [domain]: true }, error: null }));
    try {
      const index = await loadQuestionIndex(domain);
      set((s) => ({
        indexes: { ...s.indexes, [domain]: index },
        isLoadingIndex: { ...s.isLoadingIndex, [domain]: false },
      }));
      return index;
    } catch (e) {
      set((s) => ({
        error: e instanceof Error ? e.message : `Failed to load question index: ${domain}`,
        isLoadingIndex: { ...s.isLoadingIndex, [domain]: false },
      }));
      throw e;
    }
  },

  fetchPack: async (entry: PackRegistryEntry) => {
    const { loadedPacks, isLoadingPack } = get();
    if (loadedPacks[entry.id]) return loadedPacks[entry.id];
    if (isLoadingPack[entry.id]) {
      // Wait for existing load
      return new Promise<QuestionPack>((resolve) => {
        const unsubscribe = useQuestionStore.subscribe((state) => {
          if (state.loadedPacks[entry.id]) {
            unsubscribe();
            resolve(state.loadedPacks[entry.id]);
          }
        });
      });
    }

    set((s) => ({ isLoadingPack: { ...s.isLoadingPack, [entry.id]: true } }));
    try {
      const pack = await loadQuestionPack(entry.file);
      set((s) => ({
        loadedPacks: { ...s.loadedPacks, [entry.id]: pack },
        isLoadingPack: { ...s.isLoadingPack, [entry.id]: false },
      }));
      return pack;
    } catch (e) {
      set((s) => ({
        error: e instanceof Error ? e.message : `Failed to load pack: ${entry.id}`,
        isLoadingPack: { ...s.isLoadingPack, [entry.id]: false },
      }));
      throw e;
    }
  },

  fetchPackForQuestion: async (domain: Domain, questionId: string) => {
    const loaded = get().getQuestionById(questionId);
    if (loaded) return loaded;

    const summary =
      get().getQuestionSummaryById(questionId) ??
      (await get().fetchIndexForDomain(domain)).questions.find((q) => q.id === questionId);

    if (!summary) return undefined;

    const entry =
      get().registry?.packs.find((p) => p.id === summary.packId) ??
      {
        id: summary.packId,
        name: summary.title,
        domain: summary.domain,
        file: summary.packFile,
        questionCount: 0,
        description: '',
      };

    const pack = await get().fetchPack(entry);
    return pack.questions.find((q) => q.id === questionId);
  },

  fetchPacksForDomain: async (domain: Domain) => {
    const { registry } = get();
    if (!registry) return;

    const domainPacks = registry.packs.filter((p) => p.domain === domain);
    await Promise.all(domainPacks.map((entry) => get().fetchPack(entry)));
  },

  getQuestionSummariesForDomain: (domain: Domain) => {
    return get().indexes[domain]?.questions ?? [];
  },

  getQuestionSummaryById: (id: string) => {
    const { indexes } = get();
    for (const index of Object.values(indexes)) {
      const found = index?.questions.find((q) => q.id === id);
      if (found) return found;
    }
    return undefined;
  },

  getQuestionsForDomain: (domain: Domain) => {
    const { loadedPacks, registry } = get();
    if (!registry) return [];

    return registry.packs
      .filter((p) => p.domain === domain)
      .flatMap((p) => loadedPacks[p.id]?.questions ?? []);
  },

  getQuestionById: (id: string) => {
    const { loadedPacks } = get();
    for (const pack of Object.values(loadedPacks)) {
      const found = pack.questions.find((q) => q.id === id);
      if (found) return found;
    }
    return undefined;
  },

  getAllQuestionSummaries: () => {
    const { indexes } = get();
    return Object.values(indexes).flatMap((index) => index?.questions ?? []);
  },

  getAllLoadedQuestions: () => {
    const { loadedPacks } = get();
    return Object.values(loadedPacks).flatMap((p) => p.questions);
  },
}));
