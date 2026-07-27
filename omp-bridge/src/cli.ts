#!/usr/bin/env node
import { spawn } from "node:child_process";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const cmd = process.argv[2];

function run(rel: string) {
  const target = path.join(__dirname, rel);
  const child = spawn(process.execPath, [target, ...process.argv.slice(3)], {
    stdio: "inherit",
    env: process.env,
  });
  child.on("exit", (code) => process.exit(code ?? 0));
}

if (cmd === "relay") {
  run("relay/index.js");
} else if (cmd === "agent") {
  run("agent/index.js");
} else {
  console.log(`omp-bridge — Oh My Pi remote bridge

Usage:
  omp-bridge relay     Start cloud relay (+ optional web UI)
  omp-bridge agent     Start local agent (omp rpc / term / files)

Env (relay):
  OMP_BRIDGE_TOKEN     shared secret (required)
  OMP_BRIDGE_HOST      default 0.0.0.0
  OMP_BRIDGE_PORT      default 8787
  OMP_BRIDGE_STATIC    optional web-dist path

Env (agent):
  OMP_BRIDGE_TOKEN     shared secret (required)
  OMP_BRIDGE_URL       e.g. wss://vps.example.com:8787/ws
  OMP_BRIDGE_ROOM      default "default"
  OMP_BRIDGE_ROOT      file sandbox root (default cwd)
  OMP_BRIDGE_CWD       omp / shell cwd
  OMP_BIN              omp binary path (default "omp")
`);
  process.exit(cmd ? 1 : 0);
}
