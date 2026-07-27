export type Channel = "ctl" | "rpc" | "term" | "fs";

export interface Envelope<T = unknown> {
  v: 1;
  ch: Channel;
  type: string;
  id?: string;
  payload?: T;
}

export function envelope<T>(ch: Channel, type: string, payload?: T, id?: string): Envelope<T> {
  return { v: 1, ch, type, id, payload };
}

export function parseEnvelope(raw: string): Envelope | null {
  try {
    const obj = JSON.parse(raw) as Envelope;
    if (obj?.v !== 1 || typeof obj.ch !== "string" || typeof obj.type !== "string") return null;
    return obj;
  } catch {
    return null;
  }
}

export const FILE_CHUNK_BYTES = 64 * 1024;

export function newId(prefix = "c"): string {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
}
