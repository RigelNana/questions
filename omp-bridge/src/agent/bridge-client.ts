import WebSocket from "ws";
import { EventEmitter } from "node:events";
import {
  BRIDGE_VERSION,
  DEFAULT_ROOM,
  envelope,
  parseEnvelope,
  type Envelope,
  type HelloPayload,
} from "../shared/protocol.js";

export interface BridgeClientOptions {
  url: string;
  token: string;
  role: "agent" | "client";
  room?: string;
  name?: string;
  reconnectMs?: number;
}

export class BridgeClient extends EventEmitter {
  private ws: WebSocket | null = null;
  private closed = false;
  private readonly opts: BridgeClientOptions;
  private pingTimer: NodeJS.Timeout | null = null;

  constructor(opts: BridgeClientOptions) {
    super();
    this.opts = opts;
  }

  connect() {
    this.closed = false;
    this.open();
  }

  private open() {
    if (this.closed) return;
    const ws = new WebSocket(this.opts.url);
    this.ws = ws;

    ws.on("open", () => {
      const hello: HelloPayload = {
        role: this.opts.role,
        token: this.opts.token,
        room: this.opts.room || DEFAULT_ROOM,
        name: this.opts.name,
        version: BRIDGE_VERSION,
      };
      this.send(envelope("ctl", "hello", hello));
      this.startPing();
    });

    ws.on("message", (data, isBinary) => {
      if (isBinary) return;
      const msg = parseEnvelope(data.toString("utf8"));
      if (!msg) return;
      this.emit("message", msg);
      if (msg.ch === "ctl" && msg.type === "hello_ok") {
        this.emit("ready", msg.payload);
      }
      if (msg.ch === "ctl" && msg.type === "peer_status") {
        this.emit("peer", msg.payload);
      }
    });

    ws.on("close", () => {
      this.stopPing();
      this.ws = null;
      this.emit("close");
      if (!this.closed) {
        const delay = this.opts.reconnectMs ?? 2000;
        setTimeout(() => this.open(), delay);
      }
    });

    ws.on("error", (err) => {
      this.emit("error", err);
    });
  }

  send(msg: Envelope) {
    if (this.ws?.readyState === WebSocket.OPEN) {
      this.ws.send(JSON.stringify(msg));
    }
  }

  private startPing() {
    this.stopPing();
    this.pingTimer = setInterval(() => {
      this.send(envelope("ctl", "ping", { t: Date.now() }));
    }, 25000);
  }

  private stopPing() {
    if (this.pingTimer) {
      clearInterval(this.pingTimer);
      this.pingTimer = null;
    }
  }

  close() {
    this.closed = true;
    this.stopPing();
    this.ws?.close();
    this.ws = null;
  }
}
