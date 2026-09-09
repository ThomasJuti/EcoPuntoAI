import assert from "node:assert/strict";
import { test } from "node:test";
import { APRENDE_SECTIONS, aprendeSections } from "./aprende";

test("aprende covers RAEE, household trash, batteries, and damaged devices", () => {
  assert.deepEqual(
    APRENDE_SECTIONS.map((s) => s.id),
    ["raee", "trash", "batteries", "damaged"],
  );
  assert.ok(APRENDE_SECTIONS.every((s) => s.title && s.lede));
});

test("aprende names Bogotá posconsumo circuits", () => {
  const blob = JSON.stringify(APRENDE_SECTIONS);
  for (const name of ["Ecolecta", "EcoCómputo", "Pilas con el Ambiente", "Red Verde"]) {
    assert.ok(blob.includes(name), `missing ${name}`);
  }
});

test("English aprende keeps the same section ids", () => {
  assert.deepEqual(
    aprendeSections("en").map((s) => s.id),
    ["raee", "trash", "batteries", "damaged"],
  );
});

test("English RAEE items keep the arrow delimiter the page splits on", () => {
  const raee = aprendeSections("en").find((s) => s.id === "raee");
  assert.ok(raee);
  assert.ok(raee.items.some((item) => item.text.includes(" → ")));
});
