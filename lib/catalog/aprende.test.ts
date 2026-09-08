import assert from "node:assert/strict";
import { test } from "node:test";
import { APRENDE_SECTIONS } from "./aprende";

test("aprende covers RAEE, household trash, batteries, and damaged devices", () => {
  assert.deepEqual(
    APRENDE_SECTIONS.map((s) => s.id),
    ["raee", "trash", "batteries", "damaged"],
  );
  assert.ok(APRENDE_SECTIONS.every((s) => s.title && s.lede));
});
