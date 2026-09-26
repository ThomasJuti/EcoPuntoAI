import assert from "node:assert/strict";
import { test } from "node:test";
import { parseDeliveryInput } from "./deliveries";

test("parses a hand-in with path and distance", () => {
  const parsed = parseDeliveryInput({
    pointId: "ecocomputo-centro-mayor",
    pointName: "EcoCómputo Centro Mayor",
    kind: "phones",
    path: "user/abc.jpg",
    km: 2.7,
  });
  assert.equal(parsed.kind, "phones");
  assert.equal(parsed.path, "user/abc.jpg");
  assert.equal(parsed.km, 2.7);
});

test("defaults name, path and km", () => {
  const parsed = parseDeliveryInput({ pointId: "x", kind: "cables", km: -1 });
  assert.equal(parsed.pointName, "x");
  assert.equal(parsed.path, null);
  assert.equal(parsed.km, null);
});

test("rejects unknown kind and missing point", () => {
  assert.throws(() => parseDeliveryInput({ pointId: "x", kind: "spam" }));
  assert.throws(() => parseDeliveryInput({ kind: "phones" }));
});
