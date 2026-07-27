import {
  mkdir,
  readdir,
  readFile,
  rename,
  rm,
  stat,
  writeFile,
  appendFile,
  lstat,
} from "node:fs/promises";
import path from "node:path";
import type { FsEntry, FsOp, FsResultPayload } from "../shared/protocol.js";
import { FILE_CHUNK_BYTES } from "../shared/protocol.js";

export class FileService {
  private root: string;

  constructor(root: string) {
    this.root = path.resolve(root);
  }

  private resolveSafe(p: string): string {
    const abs = path.resolve(this.root, p.startsWith("/") ? `.${p}` : p);
    if (abs !== this.root && !abs.startsWith(this.root + path.sep)) {
      throw new Error("path escapes root");
    }
    return abs;
  }

  private async toEntry(abs: string): Promise<FsEntry> {
    const st = await lstat(abs);
    let type: FsEntry["type"] = "other";
    if (st.isDirectory()) type = "dir";
    else if (st.isFile()) type = "file";
    else if (st.isSymbolicLink()) type = "symlink";
    return {
      name: path.basename(abs) || abs,
      path: path.relative(this.root, abs) || ".",
      type,
      size: st.size,
      mtime: st.mtimeMs,
    };
  }

  async handle(op: FsOp): Promise<FsResultPayload> {
    try {
      switch (op.op) {
        case "list": {
          const abs = this.resolveSafe(op.path || ".");
          const names = await readdir(abs);
          const entries: FsEntry[] = [];
          for (const name of names) {
            try {
              entries.push(await this.toEntry(path.join(abs, name)));
            } catch {
              /* skip unreadable */
            }
          }
          entries.sort((a, b) => {
            if (a.type === "dir" && b.type !== "dir") return -1;
            if (a.type !== "dir" && b.type === "dir") return 1;
            return a.name.localeCompare(b.name);
          });
          return { ok: true, entries };
        }
        case "stat": {
          const abs = this.resolveSafe(op.path);
          return { ok: true, entry: await this.toEntry(abs) };
        }
        case "read":
        case "download": {
          const abs = this.resolveSafe(op.path);
          const st = await stat(abs);
          const offset = op.offset ?? 0;
          const length = Math.min(op.length ?? FILE_CHUNK_BYTES, FILE_CHUNK_BYTES);
          const fh = await readFile(abs);
          const slice = fh.subarray(offset, offset + length);
          const eof = offset + slice.length >= st.size;
          return {
            ok: true,
            data: slice.toString("base64"),
            encoding: "base64",
            offset,
            size: st.size,
            eof,
            entry: await this.toEntry(abs),
          };
        }
        case "write": {
          const abs = this.resolveSafe(op.path);
          await mkdir(path.dirname(abs), { recursive: true });
          const buf =
            op.encoding === "base64"
              ? Buffer.from(op.data, "base64")
              : Buffer.from(op.data, "utf8");
          if (op.append) await appendFile(abs, buf);
          else await writeFile(abs, buf);
          return { ok: true, entry: await this.toEntry(abs) };
        }
        case "upload": {
          const abs = this.resolveSafe(op.path);
          await mkdir(path.dirname(abs), { recursive: true });
          const buf = Buffer.from(op.data, "base64");
          if ((op.offset ?? 0) === 0) await writeFile(abs, buf);
          else await appendFile(abs, buf);
          return {
            ok: true,
            offset: (op.offset ?? 0) + buf.length,
            eof: !!op.eof,
            entry: await this.toEntry(abs),
          };
        }
        case "mkdir": {
          const abs = this.resolveSafe(op.path);
          await mkdir(abs, { recursive: true });
          return { ok: true, entry: await this.toEntry(abs) };
        }
        case "delete": {
          const abs = this.resolveSafe(op.path);
          await rm(abs, { recursive: !!op.recursive, force: false });
          return { ok: true };
        }
        case "rename": {
          const from = this.resolveSafe(op.from);
          const to = this.resolveSafe(op.to);
          await mkdir(path.dirname(to), { recursive: true });
          await rename(from, to);
          return { ok: true, entry: await this.toEntry(to) };
        }
        default:
          return { ok: false, error: "unknown op" };
      }
    } catch (err) {
      return { ok: false, error: err instanceof Error ? err.message : String(err) };
    }
  }
}
