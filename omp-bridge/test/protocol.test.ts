import { test } from "node:test";
import assert from "node:assert/strict";
import { envelope, parseEnvelope } from "../src/shared/protocol.ts";
import { tokensEqual } from "../src/shared/auth.ts";

test("envelope roundtrip", () => {
  const msg = envelope("rpc", "frame", { frame: { type: "prompt", message: "hi" } }, "id1");
  const parsed = parseEnvelope(JSON.stringify(msg));
  assert.ok(parsed);
  assert.equal(parsed!.ch, "rpc");
  assert.equal(parsed!.type, "frame");
  assert.equal(parsed!.id, "id1");
});

test("parseEnvelope rejects garbage", () => {
  assert.equal(parseEnvelope("{"), null);
  assert.equal(parseEnvelope(JSON.stringify({ v: 2, ch: "ctl", type: "x" })), null);
});

test("token compare", () => {
  assert.equal(tokensEqual("abc", "abc"), true);
  assert.equal(tokensEqual("abc", "abd"), false);
});
