import { useState } from "react";
import { useBridge } from "./useBridge";
import { ChatPanel } from "./panels/ChatPanel";
import { SettingsPanel } from "./panels/SettingsPanel";
import { TerminalPanel } from "./panels/TerminalPanel";
import { FilesPanel } from "./panels/FilesPanel";

type Tab = "chat" | "term" | "files" | "settings";

export function App() {
  const bridge = useBridge();
  const [tab, setTab] = useState<Tab>("settings");

  const connDot =
    bridge.conn === "online" ? "on" : bridge.conn === "connecting" ? "warn" : "off";
  const agentDot = bridge.agentOnline ? "on" : "off";

  return (
    <div className="app">
      <header className="topbar">
        <div className="brand">
          OMP <span>Bridge</span>
        </div>
        <div className="status">
          <span>
            <i className={`dot ${connDot}`} /> relay {bridge.conn}
          </span>
          <span>
            <i className={`dot ${agentDot}`} /> agent {bridge.agentOnline ? "online" : "offline"}
          </span>
        </div>
      </header>
      <div className="shell">
        <nav className="nav">
          {(
            [
              ["settings", "连接设置"],
              ["chat", "Oh My Pi"],
              ["term", "终端"],
              ["files", "文件"],
            ] as const
          ).map(([id, label]) => (
            <button key={id} className={tab === id ? "active" : ""} onClick={() => setTab(id)}>
              {label}
            </button>
          ))}
        </nav>
        <main className="main">
          {tab === "settings" && <SettingsPanel bridge={bridge} />}
          {tab === "chat" && <ChatPanel bridge={bridge} />}
          {tab === "term" && <TerminalPanel bridge={bridge} />}
          {tab === "files" && <FilesPanel bridge={bridge} />}
        </main>
      </div>
    </div>
  );
}
