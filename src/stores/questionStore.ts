import { create } from 'zustand';
import type {
  PackRegistry,
  PackRegistryEntry,
  QuestionEntry,
  QuestionPack,
  Domain,
} from '../types';
import { loadRegistry, loadQuestionPack } from '../utils/questionLoader';

interface QuestionState {
  registry: PackRegistry | null;
  loadedPacks: Record<string, QuestionPack>;
  isLoadingRegistry: boolean;
  isLoadingPack: Record<string, boolean>;
  error: string | null;

  // Actions
  fetchRegistry: () => Promise<void>;
  fetchPack: (entry: PackRegistryEntry) => Promise<QuestionPack>;
  fetchPacksForDomain: (domain: Domain) => Promise<void>;
  getQuestionsForDomain: (domain: Domain) => QuestionEntry[];
  getQuestionById: (id: string) => QuestionEntry | undefined;
  getAllLoadedQuestions: () => QuestionEntry[];
}

export const useQuestionStore = create<QuestionState>((set, get) => ({
  registry: null,
  loadedPacks: {},
  isLoadingRegistry: false,
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

  fetchPacksForDomain: async (domain: Domain) => {
    const { registry } = get();
    if (!registry) return;

    const domainPacks = registry.packs.filter((p) => p.domain === domain);
    await Promise.all(domainPacks.map((entry) => get().fetchPack(entry)));
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

  getAllLoadedQuestions: () => {
    const { loadedPacks } = get();
    return Object.values(loadedPacks).flatMap((p) => p.questions);
  },
}));
