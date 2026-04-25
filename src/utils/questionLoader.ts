import type { Domain, PackRegistry, QuestionIndex, QuestionPack, QuestionEntry, QuizQuestion } from '../types';

const BASE = import.meta.env.BASE_URL;
const packCache = new Map<string, QuestionPack>();
const indexCache = new Map<Domain, QuestionIndex>();

export async function loadRegistry(): Promise<PackRegistry> {
  const res = await fetch(`${BASE}question-packs/registry.json`);
  if (!res.ok) throw new Error(`Failed to load registry: ${res.status}`);
  return res.json();
}

// Normalize legacy format (question/options/label/answer) to current types
/* eslint-disable @typescript-eslint/no-explicit-any */
function normalizePack(raw: any): QuestionPack {
  return {
    ...raw,
    questions: (raw.questions ?? []).map((q: any): QuestionEntry => ({
      ...q,
      title: q.title ?? q.question ?? q.name ?? '',
      keyPoints: q.keyPoints ?? [],
      quiz: (q.quiz ?? []).map((qz: any): QuizQuestion => ({
        ...qz,
        correctAnswer: qz.correctAnswer ?? qz.answer ?? '',
        choices: qz.choices ?? (qz.options ?? []).map((o: any) => ({
          id: o.id ?? o.label ?? '',
          text: o.text ?? '',
        })),
      })),
    })),
  };
}
/* eslint-enable @typescript-eslint/no-explicit-any */

export async function loadQuestionPack(filePath: string): Promise<QuestionPack> {
  if (packCache.has(filePath)) {
    return packCache.get(filePath)!;
  }

  const res = await fetch(`${BASE}question-packs/${filePath}`);
  if (!res.ok) throw new Error(`Failed to load pack: ${filePath} (${res.status})`);

  const pack = normalizePack(await res.json());
  packCache.set(filePath, pack);
  return pack;
}

export async function loadQuestionIndex(domain: Domain): Promise<QuestionIndex> {
  if (indexCache.has(domain)) {
    return indexCache.get(domain)!;
  }

  const res = await fetch(`${BASE}question-index/${domain}.json`);
  if (!res.ok) throw new Error(`Failed to load question index: ${domain} (${res.status})`);

  const index = await res.json() as QuestionIndex;
  indexCache.set(domain, index);
  return index;
}

export function clearPackCache(): void {
  packCache.clear();
  indexCache.clear();
}
