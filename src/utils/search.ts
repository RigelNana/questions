import type { QuestionEntry } from '../types';

export function searchQuestions(
  questions: QuestionEntry[],
  query: string,
): QuestionEntry[] {
  if (!query.trim()) return questions;

  const terms = query.toLowerCase().split(/\s+/).filter(Boolean);

  return questions.filter((q) => {
    const searchable = [
      q.title,
      q.content,
      ...q.tags,
      ...q.keyPoints,
    ]
      .join(' ')
      .toLowerCase();

    return terms.every((term) => searchable.includes(term));
  });
}
