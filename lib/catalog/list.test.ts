import assert from "node:assert/strict";
import { test } from "node:test";
import { listPoints } from "./list";
import type { CollectionPoint } from "./ranking";

const point: CollectionPoint = {
  id: "p1",
  name: "Pilas",
  address: "x",
  lat: 4.62,
  lng: -74.14,
  locality: "Kennedy",
  hours: "9-5",
  contact: null,
  accepted: ["batteries"],
  isActive: true,
  lastVerifiedAt: "2026-09-08",
};

test("listPoints ranks from Bogotá center without a network call", () => {
  const listed = listPoints([point], "batteries", { type: "default" });
  assert.equal("error" in listed, false);
  if ("error" in listed) return;
  assert.equal(listed.originLabel, "centro de Bogotá");
  assert.equal(listed.points[0]?.recommended, true);
});

test("unknown locality is an error", () => {
  const listed = listPoints([point], "batteries", {
    type: "locality",
    locality: "Chía",
  });
  assert.equal("error" in listed, true);
});
