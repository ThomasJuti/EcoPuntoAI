import assert from "node:assert/strict";
import { test } from "node:test";
import { geocodeLocality, isInBogota } from "./bogota";

test("Plaza de Bolívar is inside Bogotá", () => {
  assert.equal(isInBogota(4.5981, -74.0758), true);
});

test("Chía is outside Bogotá D.C.", () => {
  assert.equal(isInBogota(4.86, -74.05), false);
});

test("Kennedy locality geocode returns Bogotá coordinates", () => {
  const hit = geocodeLocality("Kennedy");
  assert.ok(hit);
  assert.equal(hit.name, "Kennedy");
  assert.equal(isInBogota(hit.lat, hit.lng), true);
});

test("a city outside the district does not geocode", () => {
  assert.equal(geocodeLocality("Medellín"), null);
});
