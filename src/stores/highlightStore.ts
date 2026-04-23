import { create } from 'zustand';
import type { Highlight, HighlightSection } from '../types';
import { loadFromStorage, saveToStorage } from '../utils/storage';

const STORAGE_KEY = 'sre-quiz-highlights';

/** `${questionId}::${section}` → Highlight[] */
type HighlightMap = Record<string, Highlight[]>;

interface HighlightState {
  byKey: HighlightMap;
  getHighlights: (questionId: string, section: HighlightSection) => Highlight[];
  getHighlightsByQuestion: (questionId: string) => Highlight[];
  addHighlight: (
    input: Omit<Highlight, 'id' | 'createdAt' | 'updatedAt'>,
  ) => Highlight;
  updateHighlight: (
    id: string,
    patch: Partial<Pick<Highlight, 'color' | 'note'>>,
  ) => void;
  removeHighlight: (id: string) => void;
  clearForQuestion: (questionId: string) => void;
  clearAll: () => void;
}

function keyOf(qid: string, section: HighlightSection) {
  return `${qid}::${section}`;
}

function genId() {
  return `hl_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

export const useHighlightStore = create<HighlightState>((set, get) => {
  const initial = loadFromStorage<HighlightMap>(STORAGE_KEY, {});

  const persist = () => {
    saveToStorage(STORAGE_KEY, get().byKey);
  };

  return {
    byKey: initial,

    getHighlights: (qid, section) => get().byKey[keyOf(qid, section)] ?? [],

    getHighlightsByQuestion: (qid) => {
      const { byKey } = get();
      const prefix = `${qid}::`;
      return Object.entries(byKey)
        .filter(([k]) => k.startsWith(prefix))
        .flatMap(([, list]) => list);
    },

    addHighlight: (input) => {
      const now = new Date().toISOString();
      const full: Highlight = {
        ...input,
        id: genId(),
        createdAt: now,
        updatedAt: now,
      };
      const k = keyOf(input.questionId, input.section);
      set((s) => ({
        byKey: {
          ...s.byKey,
          [k]: [...(s.byKey[k] ?? []), full],
        },
      }));
      persist();
      return full;
    },

    updateHighlight: (id, patch) => {
      const now = new Date().toISOString();
      set((s) => {
        const next: HighlightMap = {};
        for (const [k, list] of Object.entries(s.byKey)) {
          next[k] = list.map((h) =>
            h.id === id ? { ...h, ...patch, updatedAt: now } : h,
          );
        }
        return { byKey: next };
      });
      persist();
    },

    removeHighlight: (id) => {
      set((s) => {
        const next: HighlightMap = {};
        for (const [k, list] of Object.entries(s.byKey)) {
          const filtered = list.filter((h) => h.id !== id);
          if (filtered.length > 0) next[k] = filtered;
        }
        return { byKey: next };
      });
      persist();
    },

    clearForQuestion: (qid) => {
      const prefix = `${qid}::`;
      set((s) => {
        const next: HighlightMap = {};
        for (const [k, list] of Object.entries(s.byKey)) {
          if (!k.startsWith(prefix)) next[k] = list;
        }
        return { byKey: next };
      });
      persist();
    },

    clearAll: () => {
      set({ byKey: {} });
      persist();
    },
  };
});

