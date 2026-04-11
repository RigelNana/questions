import type { PackRegistry, QuestionPack } from '../types';

const BASE = import.meta.env.BASE_URL;
const packCache = new Map<string, QuestionPack>();

export async function loadRegistry(): Promise<PackRegistry> {
  const res = await fetch(`${BASE}question-packs/registry.json`);
  if (!res.ok) throw new Error(`Failed to load registry: ${res.status}`);
  return res.json();
}

export async function loadQuestionPack(filePath: string): Promise<QuestionPack> {
  if (packCache.has(filePath)) {
    return packCache.get(filePath)!;
  }

  const res = await fetch(`${BASE}question-packs/${filePath}`);
  if (!res.ok) throw new Error(`Failed to load pack: ${filePath} (${res.status})`);

  const pack: QuestionPack = await res.json();
  packCache.set(filePath, pack);
  return pack;
}

export function clearPackCache(): void {
  packCache.clear();
}
