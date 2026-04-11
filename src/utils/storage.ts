const STORAGE_KEY = 'sre-quiz-progress';

export function loadFromStorage<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

export function saveToStorage<T>(key: string, data: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (e) {
    console.warn('Failed to save to localStorage:', e);
  }
}

export function loadProgress<T>(fallback: T): T {
  return loadFromStorage(STORAGE_KEY, fallback);
}

export function saveProgress<T>(data: T): void {
  saveToStorage(STORAGE_KEY, data);
}
