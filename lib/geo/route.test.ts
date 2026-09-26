import assert from "node:assert/strict";
import { test } from "node:test";
import { pointAlong, routeOrStraight } from "./route";

const from = { lat: 4.6, lng: -74.1 };
const to = { lat: 4.6, lng: -74.0 };

test("uses OSRM geometry framed by origin and destination", () => {
  const path = routeOrStraight(
    { routes: [{ geometry: { coordinates: [[-74.1, 4.6], [-74.05, 4.61], [-74.0, 4.6]] } }] },
    from,
    to,
  );
  assert.equal(path.length, 5);
  assert.deepEqual(path[2], { lat: 4.61, lng: -74.05 });
});

test("falls back to a straight line on bad data", () => {
  assert.deepEqual(routeOrStraight(null, from, to), [from, to]);
  assert.deepEqual(routeOrStraight({ routes: [] }, from, to), [from, to]);
});

test("pointAlong walks the path by distance", () => {
  const mid = pointAlong([from, to], 0.5);
  assert.ok(Math.abs(mid.at.lng - -74.05) < 1e-9);
  assert.equal(mid.eastward, true);
  assert.deepEqual(pointAlong([from, to], 1).at, to);
});
