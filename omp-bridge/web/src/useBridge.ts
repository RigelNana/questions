import { useCallback, useEffect, useRef, useState } from "react";
import { envelope, newId, parseEnvelope, type Envelope } from "./protocol";

export type ConnState = "idle" | "connecting" | "online" | "error";

export interface BridgeConfig {
  url: string;
  token: string;
  room: string;
}

interface Pending {
  resolve: (msg: Envelope) => void;
  reject: (err: Error) => void;
  timer: ReturnType<typeof setTimeout>;
}

function defaultUrl() {
  const proto = location.protocol === "https:" ? "wss:" : "ws:";
  return `${proto}//${location.host}/ws`;
}

export function loadConfig(): BridgeConfig {
  try {
    const raw = localStorage.getItem("omp-bridge-config");
    if (raw) return JSON.parse(raw) as BridgeConfig;
  } catch {
    /* ignore */
  }
  return { url: defaultUrl(), token: "", room: "default" };
}

export function saveConfig(cfg: BridgeConfig) {
  localStorage.setItem("omp-bridge-config", JSON.stringify(cfg));
}

export function useBridge() {
  const [config, setConfig] = useState<BridgeConfig>(() => loadConfig());
  const [conn, setConn] = useState<ConnState>("idle");
  const [agentOnline, setAgentOnline] = useState(false);
  const [lastError, setLastError] = useState<string | null>(null);
  const [rpcEvents, setRpcEvents] = useState<unknown[]>([]);
  const wsRef = useRef<WebSocket | null>(null);
  const pendingRef = useRef<Map<string, Pending>>(new Map());
  const listenersRef = useRef(new Set<(msg: Envelope) => void>());

  const disconnect = useCallback(() => {
    wsRef.current?.close();
    wsRef.current = null;
    setConn("idle");
    setAgentOnline(false);
  }, []);

  const connect = useCallback(
    (cfg?: BridgeConfig) => {
      const next = cfg ?? config;
      if (cfg) {
        setConfig(cfg);
        saveConfig(cfg);
      }
      disconnect();
      setConn("connecting");
      setLastError(null);

      const ws = new WebSocket(next.url);
      wsRef.current = ws;

      ws.onopen = () => {
        ws.send(
          JSON.stringify(
            envelope("ctl", "hello", {
              role: "client",
              token: next.token,
              room: next.room || "default",
              name: "web",
              version: "1.0.0",
            }),
          ),
        );
      };

      ws.onmessage = (ev) => {
        const msg = parseEnvelope(String(ev.data));
        if (!msg) return;

        if (msg.id && pendingRef.current.has(msg.id)) {
          const p = pendingRef.current.get(msg.id)!;
          clearTimeout(p.timer);
          pendingRef.current.delete(msg.id);
          p.resolve(msg);
        }

        if (msg.ch === "ctl") {
          if (msg.type === "hello_ok") {
            setConn("online");
            const peerOnline = Boolean((msg.payload as { peerOnline?: boolean })?.peerOnline);
            setAgentOnline(peerOnline);
          }
          if (msg.type === "peer_status") {
            const p = msg.payload as { online?: boolean; role?: string };
            if (p.role === "agent") setAgentOnline(!!p.online);
          }
          if (msg.type === "error") {
            setLastError((msg.payload as { message?: string })?.message || "error");
          }
        }

        if (msg.ch === "rpc" && msg.type === "frame") {
          const frame = (msg.payload as { frame: unknown }).frame;
          setRpcEvents((prev) => [...prev.slice(-400), frame]);
        }

        for (const fn of listenersRef.current) fn(msg);
      };

      ws.onerror = () => {
        setLastError("WebSocket error");
        setConn("error");
      };

      ws.onclose = () => {
        setConn((c) => (c === "connecting" ? "error" : "idle"));
        setAgentOnline(false);
        wsRef.current = null;
      };
    },
    [config, disconnect],
  );

  const send = useCallback((msg: Envelope) => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(msg));
    }
  }, []);

  const request = useCallback(
    (msg: Envelope, timeoutMs = 60000): Promise<Envelope> => {
      const id = msg.id || newId();
      const framed = { ...msg, id };
      return new Promise((resolve, reject) => {
        const timer = setTimeout(() => {
          pendingRef.current.delete(id);
          reject(new Error("timeout"));
        }, timeoutMs);
        pendingRef.current.set(id, { resolve, reject, timer });
        send(framed);
      });
    },
    [send],
  );

  const sendRpc = useCallback(
    (frame: unknown) => {
      send(envelope("rpc", "frame", { frame }));
    },
    [send],
  );

  const subscribe = useCallback((fn: (msg: Envelope) => void) => {
    listenersRef.current.add(fn);
    return () => {
      listenersRef.current.delete(fn);
    };
  }, []);

  const clearEvents = useCallback(() => setRpcEvents([]), []);

  useEffect(() => {
    return () => disconnect();
  }, [disconnect]);

  return {
    config,
    setConfig,
    conn,
    agentOnline,
    lastError,
    rpcEvents,
    clearEvents,
    connect,
    disconnect,
    send,
    request,
    sendRpc,
    subscribe,
  };
}

export type BridgeApi = ReturnType<typeof useBridge>;
