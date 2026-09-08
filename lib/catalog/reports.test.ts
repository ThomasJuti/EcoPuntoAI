import assert from "node:assert/strict";
import { test } from "node:test";
import { parseReportInput } from "./reports";

test("parses horario incorrecto with optional comment", () => {
  const parsed = parseReportInput({
    pointId: "pilas-kennedy",
    pointName: "Punto Pilas Kennedy",
    reason: "wrong_hours",
    comment: "Cierra a las 4",
  });
  assert.equal(parsed.reason, "wrong_hours");
  assert.equal(parsed.comment, "Cierra a las 4");
});

test("rejects unknown reason", () => {
  assert.throws(() =>
    parseReportInput({ pointId: "x", reason: "spam" }),
  );
});
