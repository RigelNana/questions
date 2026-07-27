#!/usr/bin/env node
import { requireEnv } from "../shared/auth.js";
import { BRIDGE_VERSION, defaultStaticDir, RelayServer } from "./server.js";

async function main() {
  const host = process.env.OMP_BRIDGE_HOST ?? "0.0.0.0";
  const port = Number(process.env.OMP_BRIDGE_PORT ?? "8787");
  const token = requireEnv("OMP_BRIDGE_TOKEN");
  const staticDir = process.env.OMP_BRIDGE_STATIC || defaultStaticDir();

  const server = new RelayServer({ host, port, token, staticDir });
  await server.listen(host, port);

  console.log(`[omp-bridge relay] v${BRIDGE_VERSION}`);
  console.log(`[omp-bridge relay] listening ws://${host}:${port}/ws`);
  if (staticDir) {
    console.log(`[omp-bridge relay] serving UI from ${staticDir}`);
  } else {
    console.log(`[omp-bridge relay] no web UI found (run npm run build:web)`);
  }
  console.log(`[omp-bridge relay] set the same OMP_BRIDGE_TOKEN on agent + browser`);

  const shutdown = async () => {
    await server.close();
    process.exit(0);
  };
  process.on("SIGINT", () => void shutdown());
  process.on("SIGTERM", () => void shutdown());
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
