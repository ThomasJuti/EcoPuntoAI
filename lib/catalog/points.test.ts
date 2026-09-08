import assert from "node:assert/strict";
import { test } from "node:test";
import { loadSeedPoints } from "./points";
import { rankPoints } from "./ranking";
import { isInBogota } from "../geo/bogota";

test("seed has at least two battery-accepting points", () => {
  const origin = { lat: 4.627, lng: -74.153 };
  const ranked = rankPoints(loadSeedPoints(), "batteries", origin);
  assert.ok(ranked.length >= 2);
  assert.ok(ranked.every((p) => p.accepted.includes("batteries")));
  assert.equal(ranked.filter((p) => p.recommended).length, 1);
});

test("every seed point is inside Bogotá with a unique id", () => {
  const points = loadSeedPoints();
  const ids = new Set(points.map((p) => p.id));
  assert.equal(ids.size, points.length);
  assert.ok(points.length >= 30);
  for (const point of points) {
    assert.equal(isInBogota(point.lat, point.lng), true, point.id);
    assert.ok(point.accepted.length > 0, point.id);
  }
});
