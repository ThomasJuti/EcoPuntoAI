import assert from "node:assert/strict";
import { test } from "node:test";
import { mapGeminiResult } from "./identify.ts";

test("low-confidence Gemini result maps to unknown with catalog label", () => {
  const result = mapGeminiResult({
    wasteKind: "quantum_toaster",
    label: "Quantum Toaster 9000",
    confidence: 0.41,
  });
  assert.equal(result.wasteKind, "unknown");
  assert.equal(result.label, "No sé qué es");
});

test("catalog id with high confidence keeps the catalog label", () => {
  const result = mapGeminiResult({
    wasteKind: "phones",
    label: "iPhone 16 Pro Max Titanium",
    confidence: 0.92,
  });
  assert.equal(result.wasteKind, "phones");
  assert.equal(result.label, "Celular");
});

test("unmapped high-confidence name does not invent a device", () => {
  const result = mapGeminiResult({
    wasteKind: "hoverboard",
    label: "Hoverboard X",
    confidence: 0.99,
  });
  assert.equal(result.wasteKind, "unknown");
  assert.equal(result.label, "No sé qué es");
});

test("smartphone alias maps to phones with catalog label", () => {
  const result = mapGeminiResult({
    wasteKind: "smartphone",
    label: "Galaxy S",
    confidence: 0.88,
  });
  assert.equal(result.wasteKind, "phones");
  assert.equal(result.label, "Celular");
});
