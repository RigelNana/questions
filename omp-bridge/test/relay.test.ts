import { test } from "node:test";
import assert from "node:assert/strict";
import WebSocket from "ws";
import { RelayServer } from "../src/relay/server.ts";
import { envelope, parseEnvelope } from "../src/shared/protocol.ts";

async function waitOpen(ws: WebSocket) {
  if (ws.readyState === WebSocket.OPEN) return;
  await new Promise<void>((resolve, reject) => {
    ws.once("open", () => resolve());
    ws.once("error", reject);
  });
}

function onceMessage(ws: WebSocket) {
  return new Promise<ReturnType<typeof parseEnvelope>>((resolve, reject) => {
    const t = setTimeout(() => reject(new Error("timeout")), 3000);
    ws.once("message", (data) => {
      clearTimeout(t);
      resolve(parseEnvelope(data.toString("utf8")));
    });
  });
}

test("relay pairs agent and client and forwards rpc", async () => {
  const port = 18787 + Math.floor(Math.random() * 200);
  const token = "test-token-xyz";
  const server = new RelayServer({ host: "127.0.0.1", port, token });
  await server.listen("127.0.0.1", port);

  const agent = new WebSocket(`ws://127.0.0.1:${port}/ws`);
  const client = new WebSocket(`ws://127.0.0.1:${port}/ws`);
  await Promise.all([waitOpen(agent), waitOpen(client)]);

  agent.send(
    JSON.stringify(
      envelope("ctl", "hello", {
        role: "agent",
        token,
        room: "r1",
        version: "1.0.0",
      }),
    ),
  );
  const agentHello = await onceMessage(agent);
  assert.equal(agentHello?.type, "hello_ok");

  client.send(
    JSON.stringify(
      envelope("ctl", "hello", {
        role: "client",
        token,
        room: "r1",
        version: "1.0.0",
      }),
    ),
  );
  const clientHello = await onceMessage(client);
  assert.equal(clientHello?.type, "hello_ok");
  assert.equal((clientHello?.payload as { peerOnline: boolean }).peerOnline, true);

  // agent may also get peer_status
  // forward rpc client -> agent
  const agentNext = onceMessage(agent);
  client.send(JSON.stringify(envelope("rpc", "frame", { frame: { type: "prompt", message: "hi" } })));
  // drain peer_status if present
  let forwarded = await agentNext;
  if (forwarded?.type === "peer_status") {
    forwarded = await onceMessage(agent);
  }
  assert.equal(forwarded?.ch, "rpc");
  assert.deepEqual((forwarded?.payload as { frame: unknown }).frame, {
    type: "prompt",
    message: "hi",
  });

  agent.close();
  client.close();
  await server.close();
});

test("relay rejects bad token", async () => {
  const port = 18787 + Math.floor(Math.random() * 200);
  const server = new RelayServer({ host: "127.0.0.1", port, token: "secret" });
  await server.listen("127.0.0.1", port);

  const ws = new WebSocket(`ws://127.0.0.1:${port}/ws`);
  await waitOpen(ws);
  ws.send(
    JSON.stringify(
      envelope("ctl", "hello", { role: "client", token: "wrong", room: "r", version: "1" }),
    ),
  );
  const msg = await onceMessage(ws);
  assert.equal(msg?.type, "error");
  await server.close();
});
