import assert from "node:assert/strict";
import { test } from "node:test";
import { parsePointCreate, parsePointPatch } from "./point-input";

const valid = {
  name: "Punto nuevo",
  address: "Calle 1",
  lat: 4.627,
  lng: -74.153,
  locality: "Kennedy",
  hours: "9-5",
  accepted: ["phones"],
};

test("create rejects coordinates outside Bogotá", () => {
  assert.throws(() =>
    parsePointCreate({ ...valid, lat: 4.86, lng: -74.03 }),
  );
});

test("create keeps a Bogotá point", () => {
  const point = parsePointCreate(valid);
  assert.equal(point.name, "Punto nuevo");
  assert.equal(point.isActive, true);
  assert.deepEqual(point.accepted, ["phones"]);
});

test("patch can deactivate without touching coords", () => {
  const patch = parsePointPatch({ isActive: false });
  assert.equal(patch.isActive, false);
  assert.equal(patch.lat, undefined);
});
