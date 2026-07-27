import { test } from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, writeFile, readFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { FileService } from "../src/agent/files.ts";

test("FileService list/read/write and path sandbox", async () => {
  const root = await mkdtemp(path.join(tmpdir(), "omp-bridge-"));
  await writeFile(path.join(root, "a.txt"), "hello");
  const fs = new FileService(root);

  const listed = await fs.handle({ op: "list", path: "." });
  assert.equal(listed.ok, true);
  assert.ok(listed.entries?.some((e) => e.name === "a.txt"));

  const read = await fs.handle({ op: "read", path: "a.txt" });
  assert.equal(read.ok, true);
  assert.equal(Buffer.from(read.data!, "base64").toString("utf8"), "hello");

  const written = await fs.handle({
    op: "write",
    path: "sub/b.txt",
    data: "world",
    encoding: "utf8",
  });
  assert.equal(written.ok, true);
  assert.equal(await readFile(path.join(root, "sub/b.txt"), "utf8"), "world");

  const escape = await fs.handle({ op: "read", path: "../outside.txt" });
  assert.equal(escape.ok, false);
  assert.match(escape.error || "", /escapes root/);
});
