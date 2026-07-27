import { useEffect, useState } from "react";
import type { BridgeApi } from "../useBridge";
import { newId } from "../protocol";

interface ModelInfo {
  id?: string;
  provider?: string;
  name?: string;
}

export function SettingsPanel({ bridge }: { bridge: BridgeApi }) {
  const [url, setUrl] = useState(bridge.config.url);
  const [token, setToken] = useState(bridge.config.token);
  const [room, setRoom] = useState(bridge.config.room);
  const [models, setModels] = useState<ModelInfo[]>([]);
  const [provider, setProvider] = useState("");
  const [modelId, setModelId] = useState("");
  const [thinking, setThinking] = useState("off");
  const [stateDump, setStateDump] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    setUrl(bridge.config.url);
    setToken(bridge.config.token);
    setRoom(bridge.config.room);
  }, [bridge.config]);

  useEffect(() => {
    return bridge.subscribe((msg) => {
      if (msg.ch !== "rpc" || msg.type !== "frame") return;
      const frame = (msg.payload as { frame: Record<string, unknown> }).frame;
      if (!frame || frame.type !== "response") return;
      if (frame.command === "get_available_models" && frame.success) {
        const data = frame.data as { models?: ModelInfo[] };
        setModels(data?.models || []);
        setNote(`已加载 ${data?.models?.length ?? 0} 个模型`);
      }
      if (frame.command === "get_state" && frame.success) {
        setStateDump(JSON.stringify(frame.data, null, 2));
        const st = frame.data as { model?: ModelInfo; thinkingLevel?: string };
        if (st.model?.provider) setProvider(st.model.provider);
        if (st.model?.id) setModelId(st.model.id);
        if (st.thinkingLevel) setThinking(String(st.thinkingLevel));
      }
      if (frame.command === "set_model") {
        setNote(frame.success ? "模型已切换" : `切换失败: ${frame.error}`);
      }
      if (frame.command === "set_thinking_level") {
        setNote(frame.success ? "thinking 已更新" : `失败: ${frame.error}`);
      }
    });
  }, [bridge]);

  function connect() {
    bridge.connect({ url, token, room: room || "default" });
  }

  function refreshState() {
    bridge.sendRpc({ id: newId("gs"), type: "get_state" });
  }

  function refreshModels() {
    bridge.sendRpc({ id: newId("gm"), type: "get_available_models" });
  }

  function applyModel() {
    if (!provider || !modelId) return;
    bridge.sendRpc({ id: newId("sm"), type: "set_model", provider, modelId });
  }

  function applyThinking() {
    bridge.sendRpc({ id: newId("st"), type: "set_thinking_level", level: thinking });
  }

  function setFlag(type: string, enabled: boolean) {
    bridge.sendRpc({ id: newId("fl"), type, enabled });
    setNote(`${type} => ${enabled}`);
  }

  return (
    <div className="panel">
      <div className="panel-hd">
        <h2>连接与设置</h2>
      </div>
      <div className="panel-bd">
        <p className="settings-hint">
          云服务器跑 relay，内网主机跑 agent（主动连出，无需公网）。浏览器打开本页，用同一 token / room 接入。
          Oh My Pi 的设置通过 RPC 透传（模型、thinking、compaction 等）。
        </p>

        <div className="form-grid" style={{ marginTop: "1rem" }}>
          <label>
            Relay WebSocket URL
            <input value={url} onChange={(e) => setUrl(e.target.value)} placeholder="wss://your-vps:8787/ws" />
          </label>
          <label>
            Token
            <input value={token} onChange={(e) => setToken(e.target.value)} type="password" placeholder="OMP_BRIDGE_TOKEN" />
          </label>
          <label>
            Room
            <input value={room} onChange={(e) => setRoom(e.target.value)} placeholder="default" />
          </label>
          <div className="row">
            <button className="primary" onClick={connect}>
              连接
            </button>
            <button className="ghost" onClick={() => bridge.disconnect()}>
              断开
            </button>
            {bridge.lastError && <span className="err">{bridge.lastError}</span>}
          </div>
        </div>

        <hr style={{ border: 0, borderTop: "1px solid var(--line)", margin: "1.5rem 0" }} />

        <div className="form-grid">
          <div className="row">
            <button onClick={refreshState} disabled={bridge.conn !== "online"}>
              读取状态
            </button>
            <button onClick={refreshModels} disabled={bridge.conn !== "online"}>
              拉取模型列表
            </button>
            <button onClick={() => setFlag("set_auto_compaction", true)} disabled={bridge.conn !== "online"}>
              开 compaction
            </button>
            <button onClick={() => setFlag("set_auto_compaction", false)} disabled={bridge.conn !== "online"}>
              关 compaction
            </button>
            <button onClick={() => setFlag("set_auto_retry", true)} disabled={bridge.conn !== "online"}>
              开 retry
            </button>
            <button onClick={() => setFlag("set_auto_retry", false)} disabled={bridge.conn !== "online"}>
              关 retry
            </button>
          </div>

          <label>
            Provider
            <input value={provider} onChange={(e) => setProvider(e.target.value)} list="providers" />
            <datalist id="providers">
              {[...new Set(models.map((m) => m.provider).filter(Boolean))].map((p) => (
                <option key={p} value={p!} />
              ))}
            </datalist>
          </label>
          <label>
            Model ID
            <input value={modelId} onChange={(e) => setModelId(e.target.value)} list="models" />
            <datalist id="models">
              {models
                .filter((m) => !provider || m.provider === provider)
                .slice(0, 200)
                .map((m) => (
                  <option key={`${m.provider}/${m.id}`} value={m.id || ""}>
                    {m.name || m.id}
                  </option>
                ))}
            </datalist>
          </label>
          <div className="row">
            <button className="primary" onClick={applyModel} disabled={!provider || !modelId}>
              切换模型
            </button>
          </div>

          <label>
            Thinking level
            <select value={thinking} onChange={(e) => setThinking(e.target.value)}>
              {["off", "minimal", "low", "medium", "high", "xhigh"].map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </select>
          </label>
          <div className="row">
            <button onClick={applyThinking}>应用 thinking</button>
            {note && <span className="muted">{note}</span>}
          </div>

          {stateDump && (
            <label>
              Session state
              <textarea readOnly value={stateDump} style={{ minHeight: 180 }} />
            </label>
          )}
        </div>
      </div>
    </div>
  );
}
