#!/usr/bin/env node
import path from "node:path";
import { requireEnv } from "../shared/auth.js";
import {
  BRIDGE_VERSION,
  envelope,
  type Envelope,
  type FsOp,
  type TermDataPayload,
  type TermOpenPayload,
  type TermResizePayload,
} from "../shared/protocol.js";
import { BridgeClient } from "./bridge-client.js";
import { FileService } from "./files.js";
import { OmpRpcBridge } from "./omp-rpc.js";
import { TerminalSession } from "./terminal.js";

async function main() {
  const url = requireEnv("OMP_BRIDGE_URL", "ws://127.0.0.1:8787/ws");
  const token = requireEnv("OMP_BRIDGE_TOKEN");
  const room = process.env.OMP_BRIDGE_ROOM || "default";
  const root = path.resolve(process.env.OMP_BRIDGE_ROOT || process.cwd());
  const cwd = process.env.OMP_BRIDGE_CWD || root;

  const files = new FileService(root);
  const term = new TerminalSession();
  const omp = new OmpRpcBridge({ cwd });
  const client = new BridgeClient({
    url,
    token,
    role: "agent",
    room,
    name: process.env.HOSTNAME || "omp-agent",
  });

  console.log(`[omp-bridge agent] v${BRIDGE_VERSION}`);
  console.log(`[omp-bridge agent] root=${root}`);
  console.log(`[omp-bridge agent] connecting ${url} room=${room}`);

  omp.on("frame", (frame) => {
    client.send(envelope("rpc", "frame", { frame }));
  });
  omp.on("stderr", (text: string) => {
    const line = text.trim();
    if (line) console.error(`[omp stderr] ${line}`);
  });
  omp.on("exit", ({ code, signal }) => {
    console.error(`[omp] exited code=${code} signal=${signal}`);
    client.send(envelope("ctl", "omp_exit", { code, signal }));
  });
  omp.on("error", (err: Error) => {
    console.error(`[omp] ${err.message}`);
    client.send(envelope("ctl", "error", { message: err.message, code: "omp_spawn" }));
  });

  term.on("data", (buf: Buffer) => {
    const payload: TermDataPayload = { data: buf.toString("base64") };
    client.send(envelope("term", "data", payload));
  });
  term.on("exit", (info) => {
    client.send(envelope("term", "exit", info));
  });

  client.on("ready", (info) => {
    console.log(`[omp-bridge agent] hello_ok`, info);
    if (!omp.isReady) {
      console.log(`[omp-bridge agent] starting omp --mode rpc`);
      omp.start();
    }
  });

  client.on("peer", (status) => {
    console.log(`[omp-bridge agent] peer`, status);
  });

  client.on("message", async (msg: Envelope) => {
    try {
      await handleMessage(msg);
    } catch (err) {
      client.send(
        envelope("ctl", "error", {
          message: err instanceof Error ? err.message : String(err),
        }, msg.id),
      );
    }
  });

  client.on("error", (err: Error) => {
    console.error(`[ws] ${err.message}`);
  });

  client.on("close", () => {
    console.log(`[omp-bridge agent] disconnected, reconnecting…`);
  });

  async function handleMessage(msg: Envelope) {
    if (msg.ch === "rpc" && msg.type === "frame") {
      const frame = (msg.payload as { frame: unknown })?.frame;
      if (frame !== undefined) {
        if (!omp.isReady) omp.start();
        omp.send(frame);
      }
      return;
    }

    if (msg.ch === "rpc" && msg.type === "restart") {
      omp.stop();
      omp.start();
      return;
    }

    if (msg.ch === "term") {
      if (msg.type === "open") {
        const p = msg.payload as TermOpenPayload;
        term.start({
          cols: p.cols || 80,
          rows: p.rows || 24,
          cwd: p.cwd || cwd,
          shell: p.shell,
        });
        client.send(envelope("term", "opened", { cols: p.cols, rows: p.rows }, msg.id));
        return;
      }
      if (msg.type === "data") {
        const p = msg.payload as TermDataPayload;
        term.write(Buffer.from(p.data, "base64"));
        return;
      }
      if (msg.type === "resize") {
        const p = msg.payload as TermResizePayload;
        term.resize(p.cols, p.rows);
        return;
      }
      if (msg.type === "close") {
        term.stop();
        return;
      }
    }

    if (msg.ch === "fs" && msg.type === "op") {
      const op = msg.payload as FsOp;
      const result = await files.handle(op);
      client.send(envelope("fs", "result", result, msg.id));
    }
  }

  client.connect();

  const shutdown = () => {
    term.stop();
    omp.stop();
    client.close();
    process.exit(0);
  };
  process.on("SIGINT", shutdown);
  process.on("SIGTERM", shutdown);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
