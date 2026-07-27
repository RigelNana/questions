import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { EventEmitter } from "node:events";
import { existsSync } from "node:fs";

export interface TerminalOptions {
  cols: number;
  rows: number;
  cwd?: string;
  shell?: string;
}

/**
 * Lightweight PTY via `script` (util-linux) — no native node-pty dependency.
 * Falls back to a plain shell pipe if `script` is unavailable.
 */
export class TerminalSession extends EventEmitter {
  private proc: ChildProcessWithoutNullStreams | null = null;

  start(opts: TerminalOptions) {
    this.stop();
    const shell = opts.shell || process.env.SHELL || "/bin/bash";
    const cwd = opts.cwd || process.cwd();
    const cols = Math.max(20, opts.cols | 0);
    const rows = Math.max(5, opts.rows | 0);

    const scriptBin = ["/usr/bin/script", "/bin/script"].find((p) => existsSync(p));
    if (scriptBin) {
      // script -qfc creates a real PTY; resize uses SIGWINCH best-effort (no native ioctl).
      this.proc = spawn(
        scriptBin,
        ["-qfc", `stty cols ${cols} rows ${rows}; exec ${shell} -l`, "/dev/null"],
        {
          cwd,
          env: {
            ...process.env,
            TERM: process.env.TERM || "xterm-256color",
            COLUMNS: String(cols),
            LINES: String(rows),
          },
          stdio: ["pipe", "pipe", "pipe"],
        },
      );
    } else {
      this.proc = spawn(shell, ["-l"], {
        cwd,
        env: {
          ...process.env,
          TERM: process.env.TERM || "xterm-256color",
          COLUMNS: String(cols),
          LINES: String(rows),
        },
        stdio: ["pipe", "pipe", "pipe"],
      });
    }

    this.proc.stdout.on("data", (buf: Buffer) => this.emit("data", buf));
    this.proc.stderr.on("data", (buf: Buffer) => this.emit("data", buf));
    this.proc.on("exit", (code, signal) => {
      this.proc = null;
      this.emit("exit", { code, signal: signal ?? null });
    });
    this.proc.on("error", (err) => this.emit("error", err));
  }

  write(data: Buffer | string) {
    if (!this.proc?.stdin.writable) return;
    this.proc.stdin.write(data);
  }

  resize(cols: number, rows: number) {
    if (!this.proc?.pid) return;
    // Best-effort without native ioctl: signal the child; many TUI apps re-query size.
    process.env.COLUMNS = String(Math.max(20, cols | 0));
    process.env.LINES = String(Math.max(5, rows | 0));
    try {
      this.proc.kill("SIGWINCH");
    } catch {
      /* ignore */
    }
  }

  stop() {
    if (!this.proc) return;
    try {
      this.proc.kill("SIGHUP");
    } catch {
      /* ignore */
    }
    this.proc = null;
  }

  get running() {
    return !!this.proc;
  }
}
