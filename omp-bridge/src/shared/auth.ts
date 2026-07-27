import { createHash, timingSafeEqual } from "node:crypto";

/** Constant-time token compare after hashing, so length leaks less. */
export function tokensEqual(a: string, b: string): boolean {
  const ha = createHash("sha256").update(a).digest();
  const hb = createHash("sha256").update(b).digest();
  return timingSafeEqual(ha, hb);
}

export function requireEnv(name: string, fallback?: string): string {
  const v = process.env[name] ?? fallback;
  if (!v) {
    throw new Error(`Missing required env: ${name}`);
  }
  return v;
}
