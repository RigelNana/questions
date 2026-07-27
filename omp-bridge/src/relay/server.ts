import { createServer, type IncomingMessage, type Server as HttpServer } from "node:http";
import { readFile } from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { WebSocketServer, WebSocket } from "ws";
import { tokensEqual } from "../shared/auth.js";
import {
  BRIDGE_VERSION,
  DEFAULT_ROOM,
  envelope,
  parseEnvelope,
  type Envelope,
  type HelloOkPayload,
  type HelloPayload,
  type PeerStatusPayload,
  type Role,
} from "../shared/protocol.js";

interface Peer {
  role: Role;
  ws: WebSocket;
  name?: string;
  room: string;
}

interface Room {
  agent?: Peer;
  client?: Peer;
}

export interface RelayOptions {
  host: string;
  port: number;
  token: string;
  staticDir?: string;
}

const MIME: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".svg": "image/svg+xml",
  ".json": "application/json",
  ".png": "image/png",
  ".woff2": "font/woff2",
  ".ico": "image/x-icon",
};

export class RelayServer {
  private http: HttpServer;
  private wss: WebSocketServer;
  private rooms = new Map<string, Room>();
  private token: string;
  private staticDir?: string;

  constructor(opts: RelayOptions) {
    this.token = opts.token;
    this.staticDir = opts.staticDir;
    this.http = createServer((req, res) => {
      void this.handleHttp(req, res);
    });
    this.wss = new WebSocketServer({ server: this.http, path: "/ws" });
    this.wss.on("connection", (ws) => this.onConnection(ws));
  }

  listen(host: string, port: number): Promise<void> {
    return new Promise((resolve) => {
      this.http.listen(port, host, () => resolve());
    });
  }

  close(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.wss.close((err) => {
        if (err) reject(err);
        else {
          this.http.close((e) => (e ? reject(e) : resolve()));
        }
      });
    });
  }

  private async handleHttp(req: IncomingMessage, res: import("node:http").ServerResponse) {
    if (req.url === "/healthz") {
      res.writeHead(200, { "content-type": "application/json" });
      res.end(JSON.stringify({ ok: true, version: BRIDGE_VERSION }));
      return;
    }

    if (!this.staticDir) {
      res.writeHead(404);
      res.end("not found");
      return;
    }

    try {
      const url = new URL(req.url ?? "/", `http://${req.headers.host ?? "localhost"}`);
      let rel = decodeURIComponent(url.pathname);
      if (rel === "/") rel = "/index.html";
      const filePath = path.normalize(path.join(this.staticDir, rel));
      if (!filePath.startsWith(this.staticDir) || !existsSync(filePath)) {
        // SPA fallback
        const index = path.join(this.staticDir, "index.html");
        if (existsSync(index)) {
          const body = await readFile(index);
          res.writeHead(200, { "content-type": "text/html; charset=utf-8" });
          res.end(body);
          return;
        }
        res.writeHead(404);
        res.end("not found");
        return;
      }
      const ext = path.extname(filePath);
      const body = await readFile(filePath);
      res.writeHead(200, { "content-type": MIME[ext] ?? "application/octet-stream" });
      res.end(body);
    } catch {
      res.writeHead(500);
      res.end("error");
    }
  }

  private onConnection(ws: WebSocket) {
    let peer: Peer | null = null;

    ws.on("message", (data, isBinary) => {
      if (isBinary) return;
      const text = data.toString("utf8");
      const msg = parseEnvelope(text);
      if (!msg) {
        this.send(ws, envelope("ctl", "error", { message: "invalid envelope", code: "bad_frame" }));
        return;
      }

      if (!peer) {
        if (msg.ch !== "ctl" || msg.type !== "hello") {
          this.send(ws, envelope("ctl", "error", { message: "hello required", code: "auth" }));
          ws.close(4001, "hello required");
          return;
        }
        peer = this.handleHello(ws, msg);
        return;
      }

      this.forward(peer, msg, text);
    });

    ws.on("close", () => {
      if (!peer) return;
      this.detach(peer);
    });

    ws.on("error", () => {
      /* close handler cleans up */
    });
  }

  private handleHello(ws: WebSocket, msg: Envelope): Peer | null {
    const payload = msg.payload as HelloPayload | undefined;
    if (!payload?.role || !payload.token || (payload.role !== "agent" && payload.role !== "client")) {
      this.send(ws, envelope("ctl", "error", { message: "invalid hello", code: "auth" }, msg.id));
      ws.close(4001, "invalid hello");
      return null;
    }
    if (!tokensEqual(payload.token, this.token)) {
      this.send(ws, envelope("ctl", "error", { message: "unauthorized", code: "auth" }, msg.id));
      ws.close(4003, "unauthorized");
      return null;
    }

    const roomName = payload.room?.trim() || DEFAULT_ROOM;
    let room = this.rooms.get(roomName);
    if (!room) {
      room = {};
      this.rooms.set(roomName, room);
    }

    const existing = room[payload.role];
    if (existing && existing.ws.readyState === WebSocket.OPEN) {
      existing.ws.close(4002, "replaced");
    }

    const peer: Peer = {
      role: payload.role,
      ws,
      name: payload.name,
      room: roomName,
    };
    room[payload.role] = peer;

    const otherRole: Role = payload.role === "agent" ? "client" : "agent";
    const other = room[otherRole];
    const peerOnline = !!(other && other.ws.readyState === WebSocket.OPEN);

    const ok: HelloOkPayload = {
      role: payload.role,
      room: roomName,
      peerOnline,
      serverTime: Date.now(),
    };
    this.send(ws, envelope("ctl", "hello_ok", ok, msg.id));

    if (other && other.ws.readyState === WebSocket.OPEN) {
      const status: PeerStatusPayload = { online: true, role: payload.role };
      this.send(other.ws, envelope("ctl", "peer_status", status));
    }

    return peer;
  }

  private forward(from: Peer, msg: Envelope, raw: string) {
    if (msg.ch === "ctl") {
      if (msg.type === "ping") {
        this.send(from.ws, envelope("ctl", "pong", { t: Date.now() }, msg.id));
      }
      return;
    }

    const room = this.rooms.get(from.room);
    if (!room) return;
    const otherRole: Role = from.role === "agent" ? "client" : "agent";
    const other = room[otherRole];
    if (!other || other.ws.readyState !== WebSocket.OPEN) {
      this.send(
        from.ws,
        envelope("ctl", "error", { message: `${otherRole} offline`, code: "peer_offline" }, msg.id),
      );
      return;
    }
    // Transparent forward of the original frame (bandwidth-efficient, no re-encode).
    other.ws.send(raw);
  }

  private detach(peer: Peer) {
    const room = this.rooms.get(peer.room);
    if (!room) return;
    if (room[peer.role] === peer) {
      delete room[peer.role];
    }
    const otherRole: Role = peer.role === "agent" ? "client" : "agent";
    const other = room[otherRole];
    if (other && other.ws.readyState === WebSocket.OPEN) {
      this.send(other.ws, envelope("ctl", "peer_status", { online: false, role: peer.role } satisfies PeerStatusPayload));
    }
    if (!room.agent && !room.client) {
      this.rooms.delete(peer.room);
    }
  }

  private send(ws: WebSocket, msg: Envelope) {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify(msg));
    }
  }
}

export function defaultStaticDir(): string | undefined {
  const here = path.dirname(fileURLToPath(import.meta.url));
  // dist/relay -> ../../web-dist  or src/relay -> ../../web-dist
  const candidates = [
    path.resolve(here, "../../web-dist"),
    path.resolve(here, "../../dist/web"),
    path.resolve(process.cwd(), "web-dist"),
  ];
  for (const c of candidates) {
    if (existsSync(path.join(c, "index.html"))) return c;
  }
  return undefined;
}

export { BRIDGE_VERSION };
