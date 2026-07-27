import { useEffect, useRef } from "react";
import { Terminal } from "@xterm/xterm";
import { FitAddon } from "@xterm/addon-fit";
import "@xterm/xterm/css/xterm.css";
import type { BridgeApi } from "../useBridge";
import { envelope } from "../protocol";

export function TerminalPanel({ bridge }: { bridge: BridgeApi }) {
  const hostRef = useRef<HTMLDivElement>(null);
  const termRef = useRef<Terminal | null>(null);
  const fitRef = useRef<FitAddon | null>(null);
  const openedRef = useRef(false);

  useEffect(() => {
    if (!hostRef.current || termRef.current) return;
    const term = new Terminal({
      cursorBlink: true,
      fontFamily: '"IBM Plex Mono", ui-monospace, monospace',
      fontSize: 13,
      theme: {
        background: "#0a0f0d",
        foreground: "#e7f0ea",
        cursor: "#d4a017",
        selectionBackground: "#2d4037",
      },
    });
    const fit = new FitAddon();
    term.loadAddon(fit);
    term.open(hostRef.current);
    fit.fit();
    termRef.current = term;
    fitRef.current = fit;

    term.onData((data) => {
      const bytes = new TextEncoder().encode(data);
      let bin = "";
      for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]!);
      bridge.send(envelope("term", "data", { data: btoa(bin) }));
    });

    const onResize = () => {
      fit.fit();
      bridge.send(
        envelope("term", "resize", {
          cols: term.cols,
          rows: term.rows,
        }),
      );
    };
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      bridge.send(envelope("term", "close", {}));
      term.dispose();
      termRef.current = null;
      openedRef.current = false;
    };
  }, [bridge]);

  useEffect(() => {
    return bridge.subscribe((msg) => {
      if (msg.ch !== "term") return;
      const term = termRef.current;
      if (!term) return;
      if (msg.type === "data") {
        const b64 = (msg.payload as { data: string }).data;
        const bin = atob(b64);
        const bytes = new Uint8Array(bin.length);
        for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
        term.write(bytes);
      }
      if (msg.type === "exit") {
        term.writeln("\r\n[session ended]");
        openedRef.current = false;
      }
      if (msg.type === "opened") {
        openedRef.current = true;
      }
    });
  }, [bridge]);

  useEffect(() => {
    if (bridge.conn === "online" && bridge.agentOnline && termRef.current && !openedRef.current) {
      const term = termRef.current;
      fitRef.current?.fit();
      bridge.send(
        envelope("term", "open", {
          cols: term.cols,
          rows: term.rows,
        }),
      );
      openedRef.current = true;
    }
  }, [bridge.conn, bridge.agentOnline, bridge]);

  function reopen() {
    const term = termRef.current;
    if (!term) return;
    fitRef.current?.fit();
    bridge.send(envelope("term", "close", {}));
    bridge.send(
      envelope("term", "open", {
        cols: term.cols,
        rows: term.rows,
      }),
    );
    openedRef.current = true;
  }

  return (
    <div className="panel">
      <div className="panel-hd">
        <h2>终端</h2>
        <div className="row">
          <span className="muted">PTY via agent</span>
          <button onClick={reopen} disabled={bridge.conn !== "online" || !bridge.agentOnline}>
            重开
          </button>
        </div>
      </div>
      <div className="term-wrap" ref={hostRef} />
    </div>
  );
}
