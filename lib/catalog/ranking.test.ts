import assert from "node:assert/strict";
import { test } from "node:test";
import { embedMapUrl, mapsUrl, rankPoints, type CollectionPoint } from "./ranking";
import type { WasteKind } from "./kinds";

function point(
  id: string,
  accepted: WasteKind[],
  lat: number,
  lng: number,
): CollectionPoint {
  return {
    id,
    name: id,
    address: "x",
    lat,
    lng,
    locality: "Kennedy",
    hours: "9-5",
    contact: null,
    accepted,
    isActive: true,
    lastVerifiedAt: "2026-09-08",
  };
}

const ORIGIN = { lat: 4.627, lng: -74.153 };

test("ranking never returns a point that does not accept the waste kind", () => {
  const ecolecta = point("ecolecta", ["phones", "cables"], 4.618, -74.136);
  const pilas = point("pilas", ["batteries", "cells"], 4.62, -74.14);
  const ranked = rankPoints([ecolecta, pilas], "batteries", ORIGIN);
  assert.equal(ranked.some((p) => p.id === "ecolecta"), false);
  assert.equal(ranked.length, 1);
  assert.equal(ranked[0]?.id, "pilas");
  assert.equal(ranked[0]?.recommended, true);
});

test("inactive and out-of-city points are dropped", () => {
  const dead = { ...point("dead", ["batteries"], 4.62, -74.14), isActive: false };
  const chia = point("chia", ["batteries"], 4.86, -74.05);
  const ranked = rankPoints([dead, chia], "batteries", ORIGIN);
  assert.equal(ranked.length, 0);
});

test("embedMapUrl pins the point inside a local bbox", () => {
  const url = embedMapUrl({ lat: 4.6948, lng: -74.0864 });
  assert.match(url, /^https:\/\/www\.openstreetmap\.org\/export\/embed\.html/);
  assert.match(url, /marker=4\.6948%2C-74\.0864/);
  assert.equal(
    mapsUrl({ lat: 4.69, lng: -74.08, name: "x" }).includes("google.com/maps/dir"),
    true,
  );
});

test("unknown lists every active Bogotá point", () => {
  const a = point("a", ["phones"], 4.62, -74.14);
  const b = point("b", ["batteries"], 4.63, -74.15);
  const ranked = rankPoints([a, b], "unknown", ORIGIN);
  assert.equal(ranked.length, 2);
});
