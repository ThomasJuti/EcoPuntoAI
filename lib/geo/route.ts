import { haversineKm } from "@/lib/catalog/ranking";
import type { LatLng } from "@/lib/geo/bogota";

/** Walking route via the FOSSGIS OSRM (fair use, ~1 req/s per client). */
export function osrmFootUrl(from: LatLng, to: LatLng) {
  return `https://routing.openstreetmap.de/routed-foot/route/v1/foot/${from.lng},${from.lat};${to.lng},${to.lat}?overview=full&geometries=geojson`;
}

/** OSRM GeoJSON coords are [lng, lat]; anything unusable falls back to a straight line. */
export function routeOrStraight(
  data: unknown,
  from: LatLng,
  to: LatLng,
): LatLng[] {
  const coords = (data as { routes?: { geometry?: { coordinates?: unknown } }[] })
    ?.routes?.[0]?.geometry?.coordinates;
  if (Array.isArray(coords) && coords.length >= 2) {
    const path = coords
      .filter(
        (c): c is [number, number] =>
          Array.isArray(c) && Number.isFinite(c[0]) && Number.isFinite(c[1]),
      )
      .map(([lng, lat]) => ({ lat, lng }));
    if (path.length >= 2) return [from, ...path, to];
  }
  return [from, to];
}

/** Point at fraction t (0..1) of the path's length, plus the segment's direction. */
export function pointAlong(path: LatLng[], t: number) {
  const legs = path.slice(1).map((p, i) => haversineKm(path[i], p));
  const total = legs.reduce((a, b) => a + b, 0);
  let left = Math.min(Math.max(t, 0), 1) * total;
  for (let i = 0; i < legs.length; i++) {
    if (left <= legs[i] || i === legs.length - 1) {
      const f = legs[i] ? Math.min(left / legs[i], 1) : 1;
      const a = path[i];
      const b = path[i + 1];
      return {
        at: { lat: a.lat + (b.lat - a.lat) * f, lng: a.lng + (b.lng - a.lng) * f },
        index: i,
        eastward: b.lng >= a.lng,
      };
    }
    left -= legs[i];
  }
  return { at: path[0], index: 0, eastward: true };
}
