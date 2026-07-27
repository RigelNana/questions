import { useEffect, useMemo, useState } from "react";
import type { BridgeApi } from "../useBridge";
import { newId } from "../protocol";

interface ChatLine {
  id: string;
  role: "user" | "assistant" | "meta" | "tool";
  text: string;
}

function extractText(frame: unknown): ChatLine | null {
  if (!frame || typeof frame !== "object") return null;
  const f = frame as Record<string, unknown>;
  const type = String(f.type || "");

  if (type === "message_update" || type === "message_end") {
    const message = f.message as { role?: string; content?: unknown } | undefined;
    if (!message) return null;
    const role = message.role === "user" ? "user" : "assistant";
    const content = message.content;
    let text = "";
    if (typeof content === "string") text = content;
    else if (Array.isArray(content)) {
      text = content
        .map((c) => {
          if (typeof c === "string") return c;
          if (c && typeof c === "object" && "text" in c) return String((c as { text: unknown }).text);
          return "";
        })
        .join("");
    }
    if (!text) return null;
    return { id: newId("m"), role, text };
  }

  if (type === "tool_execution_start") {
    return {
      id: newId("t"),
      role: "tool",
      text: `▸ tool ${(f.toolName as string) || "unknown"}`,
    };
  }

  if (type === "response") {
    const cmd = f.command as string | undefined;
    if (f.success === false) {
      return { id: newId("e"), role: "meta", text: `error (${cmd}): ${f.error}` };
    }
    if (cmd === "get_state" || cmd === "get_available_models" || cmd === "set_model") {
      return {
        id: newId("s"),
        role: "meta",
        text: `${cmd}: ${JSON.stringify(f.data ?? {}, null, 0).slice(0, 500)}`,
      };
    }
  }

  if (type === "ready") {
    return { id: newId("r"), role: "meta", text: "omp rpc ready" };
  }

  if (type === "extension_ui_request") {
    return {
      id: newId("x"),
      role: "meta",
      text: `UI request [${f.method}]: ${f.title || f.message || ""}`,
    };
  }

  return null;
}

export function ChatPanel({ bridge }: { bridge: BridgeApi }) {
  const [input, setInput] = useState("");
  const [lines, setLines] = useState<ChatLine[]>([]);
  const [streaming, setStreaming] = useState(false);

  useEffect(() => {
    const last = bridge.rpcEvents[bridge.rpcEvents.length - 1];
    if (!last) return;
    const f = last as { type?: string };
    if (f.type === "agent_start") setStreaming(true);
    if (f.type === "agent_end") setStreaming(false);

    const line = extractText(last);
    if (!line) return;

    setLines((prev) => {
      // Collapse streaming assistant updates into last assistant bubble
      if (line.role === "assistant" && prev.length) {
        const lastLine = prev[prev.length - 1];
        if (lastLine.role === "assistant") {
          const copy = prev.slice();
          copy[copy.length - 1] = { ...lastLine, text: line.text };
          return copy;
        }
      }
      return [...prev, line];
    });
  }, [bridge.rpcEvents]);

  const canSend = bridge.conn === "online" && bridge.agentOnline && !!input.trim() && !streaming;

  const statusHint = useMemo(() => {
    if (bridge.conn !== "online") return "未连接到中继";
    if (!bridge.agentOnline) return "内网 agent 未在线";
    if (streaming) return "omp 正在响应…";
    return "就绪";
  }, [bridge.conn, bridge.agentOnline, streaming]);

  function sendPrompt() {
    const message = input.trim();
    if (!message) return;
    setLines((prev) => [...prev, { id: newId("u"), role: "user", text: message }]);
    bridge.sendRpc({ id: newId("p"), type: "prompt", message });
    setInput("");
  }

  function abort() {
    bridge.sendRpc({ id: newId("a"), type: "abort" });
  }

  function newSession() {
    bridge.sendRpc({ id: newId("n"), type: "new_session" });
    setLines((prev) => [...prev, { id: newId("m"), role: "meta", text: "new_session requested" }]);
  }

  return (
    <div className="panel">
      <div className="panel-hd">
        <h2>Oh My Pi</h2>
        <div className="row">
          <span className="muted">{statusHint}</span>
          <button className="ghost" onClick={newSession} disabled={bridge.conn !== "online"}>
            新会话
          </button>
          <button className="ghost" onClick={abort} disabled={!streaming}>
            中止
          </button>
        </div>
      </div>
      <div className="panel-bd">
        <div className="chat-log">
          {lines.length === 0 && (
            <div className="bubble meta">发送消息后将透传给本机 `omp --mode rpc`，事件原样回流。</div>
          )}
          {lines.map((l) => (
            <div key={l.id} className={`bubble ${l.role === "user" ? "user" : l.role === "assistant" ? "assistant" : "meta"}`}>
              {l.text}
            </div>
          ))}
        </div>
      </div>
      <div className="composer">
        <textarea
          value={input}
          placeholder="给 Oh My Pi 发送 prompt…"
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter" && (e.metaKey || e.ctrlKey)) {
              e.preventDefault();
              sendPrompt();
            }
          }}
        />
        <button className="primary" disabled={!canSend} onClick={sendPrompt}>
          发送
        </button>
      </div>
    </div>
  );
}
