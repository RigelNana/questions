import { useCallback, useEffect, useState } from "react";
import type { BridgeApi } from "../useBridge";
import { envelope, FILE_CHUNK_BYTES, newId } from "../protocol";

interface FsEntry {
  name: string;
  path: string;
  type: "file" | "dir" | "symlink" | "other";
  size: number;
  mtime: number;
}

export function FilesPanel({ bridge }: { bridge: BridgeApi }) {
  const [cwd, setCwd] = useState(".");
  const [entries, setEntries] = useState<FsEntry[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const list = useCallback(
    async (path: string) => {
      setBusy(true);
      setError(null);
      try {
        const res = await bridge.request(
          envelope("fs", "op", { op: "list", path }, newId("fs")),
          20000,
        );
        const payload = res.payload as { ok: boolean; error?: string; entries?: FsEntry[] };
        if (!payload?.ok) throw new Error(payload?.error || "list failed");
        setCwd(path);
        setEntries(payload.entries || []);
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      } finally {
        setBusy(false);
      }
    },
    [bridge],
  );

  useEffect(() => {
    if (bridge.conn === "online" && bridge.agentOnline) {
      void list(cwd);
    }
  }, [bridge.conn, bridge.agentOnline]); // eslint-disable-line react-hooks/exhaustive-deps

  async function download(entry: FsEntry) {
    setBusy(true);
    setError(null);
    try {
      const chunks: Uint8Array[] = [];
      let offset = 0;
      let size = Infinity;
      while (offset < size) {
        const res = await bridge.request(
          envelope(
            "fs",
            "op",
            { op: "download", path: entry.path, offset, length: FILE_CHUNK_BYTES },
            newId("dl"),
          ),
          60000,
        );
        const payload = res.payload as {
          ok: boolean;
          error?: string;
          data?: string;
          size?: number;
          eof?: boolean;
        };
        if (!payload?.ok) throw new Error(payload?.error || "download failed");
        size = payload.size ?? size;
        const bin = atob(payload.data || "");
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        chunks.push(bytes);
        offset += bytes.length;
        if (payload.eof || bytes.length === 0) break;
      }
      const blob = new Blob(chunks as BlobPart[]);
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = entry.name;
      a.click();
      URL.revokeObjectURL(a.href);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  async function upload(file: File) {
    setBusy(true);
    setError(null);
    try {
      const buf = new Uint8Array(await file.arrayBuffer());
      const dest = cwd === "." ? file.name : `${cwd.replace(/\/$/, "")}/${file.name}`;
      let offset = 0;
      while (offset < buf.length) {
        const slice = buf.subarray(offset, offset + FILE_CHUNK_BYTES);
        let bin = "";
        slice.forEach((c) => {
          bin += String.fromCharCode(c);
        });
        const eof = offset + slice.length >= buf.length;
        const res = await bridge.request(
          envelope(
            "fs",
            "op",
            {
              op: "upload",
              path: dest,
              data: btoa(bin),
              offset,
              eof,
            },
            newId("up"),
          ),
          60000,
        );
        const payload = res.payload as { ok: boolean; error?: string };
        if (!payload?.ok) throw new Error(payload?.error || "upload failed");
        offset += slice.length;
      }
      await list(cwd);
    } catch (err) {
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setBusy(false);
    }
  }

  function parentPath(p: string) {
    if (!p || p === ".") return ".";
    const parts = p.replace(/\\/g, "/").split("/").filter(Boolean);
    parts.pop();
    return parts.length ? parts.join("/") : ".";
  }

  return (
    <div className="panel">
      <div className="panel-hd">
        <h2>文件</h2>
        <div className="row">
          <span className="muted">{cwd}</span>
          <button disabled={busy || bridge.conn !== "online"} onClick={() => void list(cwd)}>
            刷新
          </button>
          <button disabled={busy} onClick={() => void list(parentPath(cwd))}>
            上级
          </button>
          <label style={{ margin: 0 }}>
            <span className="muted" style={{ marginRight: 8 }}>
              上传
            </span>
            <input
              type="file"
              disabled={busy || bridge.conn !== "online" || !bridge.agentOnline}
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void upload(f);
                e.target.value = "";
              }}
            />
          </label>
        </div>
      </div>
      <div className="panel-bd">
        {error && <p className="err">{error}</p>}
        {!bridge.agentOnline && <p className="muted">等待 agent 上线…</p>}
        <div className="file-list">
          {entries.map((e) => (
            <div key={e.path} className="file-item">
              <button
                className="ghost"
                style={{ textAlign: "left", border: "none" }}
                onClick={() => {
                  if (e.type === "dir") void list(e.path);
                }}
              >
                {e.type === "dir" ? "[dir]" : "[file]"} {e.name}
                <span className="muted" style={{ marginLeft: 8 }}>
                  {e.type === "file" ? `${e.size} B` : ""}
                </span>
              </button>
              {e.type === "file" && (
                <button disabled={busy} onClick={() => void download(e)}>
                  下载
                </button>
              )}
              <span />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
