import { isInBogota, type LatLng } from "@/lib/geo/bogota";
import type { WasteKind } from "@/lib/catalog/kinds";

export type CollectionPoint = {
  id: string;
  name: string;
  address: string;
  lat: number;
  lng: number;
  locality: string;
  hours: string;
  contact: string | null;
  accepted: WasteKind[];
  isActive: boolean;
  lastVerifiedAt: string;
};

export type RankedPoint = CollectionPoint & {
  km: number;
  recommended: boolean;
};

const EARTH_KM = 6371;

export function haversineKm(a: LatLng, b: LatLng) {
  const toRad = (n: number) => (n * Math.PI) / 180;
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const s =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRad(a.lat)) * Math.cos(toRad(b.lat)) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_KM * Math.asin(Math.sqrt(s));
}

export function mapsUrl(point: Pick<CollectionPoint, "lat" | "lng" | "name">) {
  const dest = `${point.lat},${point.lng}`;
  return `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dest)}`;
}

export function acceptsKind(point: CollectionPoint, kind: WasteKind) {
  if (kind === "unknown") return true;
  return point.accepted.includes(kind);
}

export function rankPoints(
  points: CollectionPoint[],
  kind: WasteKind,
  origin: LatLng,
): RankedPoint[] {
  const matches = points.filter(
    (p) => p.isActive && isInBogota(p.lat, p.lng) && acceptsKind(p, kind),
  );
  const sorted = matches
    .map((p) => ({ ...p, km: haversineKm(origin, p), recommended: false }))
    .sort((a, b) => a.km - b.km || a.accepted.length - b.accepted.length);
  if (!sorted[0]) return sorted;
  return [{ ...sorted[0], recommended: true }, ...sorted.slice(1)];
}
