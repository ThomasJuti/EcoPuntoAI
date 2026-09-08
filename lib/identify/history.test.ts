import assert from "node:assert/strict";
import { test } from "node:test";
import { parseHistory, recordFromRow } from "./history";

test("recordFromRow maps supabase columns", () => {
  const parsed = recordFromRow({
    storage_path: "u/1",
    waste_kind: "phones",
    confidence: 0.92,
    created_at: "2026-09-08T18:00:00.000Z",
  });
  assert.equal(parsed?.path, "u/1");
  assert.equal(parsed?.kind, "phones");
  assert.equal(parsed?.at, "2026-09-08T18:00:00.000Z");
});

test("parseHistory drops junk and keeps catalog kinds", () => {
  const parsed = parseHistory([
    {
      path: "a/1",
      kind: "phones",
      confidence: 0.9,
      at: "2026-09-08T20:00:00.000Z",
    },
    { path: "a/2", kind: "not-a-kind", confidence: 1, at: "x" },
    { path: "", kind: "phones", confidence: 1, at: "x" },
    {
      storage_path: "a/3",
      waste_kind: "batteries",
      confidence: 0.8,
      created_at: "2026-09-08T21:00:00.000Z",
    },
  ]);
  assert.equal(parsed.length, 2);
  assert.equal(parsed[0]?.path, "a/1");
  assert.equal(parsed[1]?.kind, "batteries");
});
