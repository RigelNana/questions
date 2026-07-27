import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createInterface } from "node:readline";
import { EventEmitter } from "node:events";

export interface OmpRpcOptions {
  command?: string;
  args?: string[];
  cwd?: string;
  env?: NodeJS.ProcessEnv;
}

/**
 * Spawns `omp --mode rpc` and exposes bidirectional NDJSON frames.
 * Transparent pass-through — full Oh My Pi RPC surface is forwarded as-is.
 */
export class OmpRpcBridge extends EventEmitter {
  private proc: ChildProcessWithoutNullStreams | null = null;
  private ready = false;
  private readonly opts: OmpRpcOptions;

  constructor(opts: OmpRpcOptions = {}) {
    super();
    this.opts = opts;
  }

  get isReady() {
    return this.ready;
  }

  start() {
    if (this.proc) return;
    const command = this.opts.command ?? process.env.OMP_BIN ?? "omp";
    const args = this.opts.args ?? ["--mode", "rpc"];
    this.proc = spawn(command, args, {
      cwd: this.opts.cwd ?? process.cwd(),
      env: { ...process.env, ...this.opts.env, PI_NOTIFICATIONS: "off" },
      stdio: ["pipe", "pipe", "pipe"],
    });

    const rl = createInterface({ input: this.proc.stdout });
    rl.on("line", (line) => {
      if (!line.trim()) return;
      let frame: unknown;
      try {
        frame = JSON.parse(line);
      } catch {
        this.emit("stderr", `non-json stdout: ${line.slice(0, 200)}`);
        return;
      }
      if ((frame as { type?: string }).type === "ready") {
        this.ready = true;
        this.emit("ready", frame);
      }
      this.emit("frame", frame);
    });

    this.proc.stderr.on("data", (buf: Buffer) => {
      this.emit("stderr", buf.toString("utf8"));
    });

    this.proc.on("exit", (code, signal) => {
      this.ready = false;
      this.proc = null;
      this.emit("exit", { code, signal });
    });

    this.proc.on("error", (err) => {
      this.emit("error", err);
    });
  }

  send(frame: unknown) {
    if (!this.proc?.stdin.writable) {
      throw new Error("omp rpc process not running");
    }
    this.proc.stdin.write(`${JSON.stringify(frame)}\n`);
  }

  stop() {
    if (!this.proc) return;
    try {
      this.proc.stdin.end();
    } catch {
      /* ignore */
    }
    this.proc.kill("SIGTERM");
    this.proc = null;
    this.ready = false;
  }
}
