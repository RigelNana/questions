/** Multiplexed bridge protocol over a single WebSocket. */

export type Role = "agent" | "client";

export type Channel = "ctl" | "rpc" | "term" | "fs";

export interface Envelope<T = unknown> {
  v: 1;
  ch: Channel;
  type: string;
  id?: string;
  payload?: T;
}

export interface HelloPayload {
  role: Role;
  token: string;
  room?: string;
  name?: string;
  version: string;
}

export interface HelloOkPayload {
  role: Role;
  room: string;
  peerOnline: boolean;
  serverTime: number;
}

export interface PeerStatusPayload {
  online: boolean;
  role: Role;
}

export interface ErrorPayload {
  message: string;
  code?: string;
}

/** Opaque Oh My Pi RPC JSON frame (command or event). */
export interface RpcFramePayload {
  frame: unknown;
}

export interface TermOpenPayload {
  cols: number;
  rows: number;
  cwd?: string;
  shell?: string;
}

export interface TermDataPayload {
  data: string; // base64
}

export interface TermResizePayload {
  cols: number;
  rows: number;
}

export interface TermExitPayload {
  code: number | null;
  signal: string | null;
}

export type FsOp =
  | { op: "list"; path: string }
  | { op: "stat"; path: string }
  | { op: "read"; path: string; offset?: number; length?: number }
  | { op: "write"; path: string; data: string; encoding?: "utf8" | "base64"; append?: boolean }
  | { op: "mkdir"; path: string }
  | { op: "delete"; path: string; recursive?: boolean }
  | { op: "rename"; from: string; to: string }
  | { op: "download"; path: string; offset?: number; length?: number }
  | { op: "upload"; path: string; data: string; offset?: number; eof?: boolean };

export interface FsEntry {
  name: string;
  path: string;
  type: "file" | "dir" | "symlink" | "other";
  size: number;
  mtime: number;
}

export interface FsResultPayload {
  ok: boolean;
  error?: string;
  entries?: FsEntry[];
  entry?: FsEntry;
  data?: string;
  encoding?: "utf8" | "base64";
  eof?: boolean;
  offset?: number;
  size?: number;
}

export const BRIDGE_VERSION = "1.0.0";
export const DEFAULT_ROOM = "default";
export const FILE_CHUNK_BYTES = 64 * 1024; // 64 KiB — friendly for ~3Mbps links

export function envelope<T>(
  ch: Channel,
  type: string,
  payload?: T,
  id?: string,
): Envelope<T> {
  return { v: 1, ch, type, id, payload };
}

export function parseEnvelope(raw: string): Envelope | null {
  try {
    const obj = JSON.parse(raw) as Envelope;
    if (obj?.v !== 1 || typeof obj.ch !== "string" || typeof obj.type !== "string") {
      return null;
    }
    return obj;
  } catch {
    return null;
  }
}
