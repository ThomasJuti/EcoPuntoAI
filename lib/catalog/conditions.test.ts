import assert from "node:assert/strict";
import { test } from "node:test";
import { formatAnsweredConditions, parseAnswers } from "./conditions";

test("parseAnswers keeps only known boolean keys", () => {
  assert.deepEqual(
    parseAnswers({
      powersOn: true,
      broken: false,
      junk: true,
      swollenBattery: "yes",
    }),
    { powersOn: true, broken: false },
  );
});

test("parseAnswers rejects arrays and null", () => {
  assert.deepEqual(parseAnswers(null), {});
  assert.deepEqual(parseAnswers([{ powersOn: true }]), {});
});

test("formatAnsweredConditions skips unanswered keys", () => {
  assert.deepEqual(formatAnsweredConditions({ powersOn: true, waterExposed: false }), [
    { label: "¿Enciende?", value: "Sí" },
    { label: "¿Se mojó?", value: "No" },
  ]);
});
