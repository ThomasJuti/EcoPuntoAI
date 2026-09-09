import { isWasteKind, type WasteKind } from "@/lib/catalog/kinds";
import { rankPoints, type CollectionPoint, type RankedPoint } from "@/lib/catalog/ranking";
import { BOGOTA_CENTER, geocodeLocality, isInBogota } from "@/lib/geo/bogota";
import type { Locale } from "@/lib/i18n/locale";

export type PointsOrigin =
  | { type: "gps"; lat: number; lng: number }
  | { type: "locality"; locality: string }
  | { type: "default" };

export type PointsList = {
  originLabel: string;
  points: RankedPoint[];
};

export function originFromParams(params: {
  lat?: string | null;
  lng?: string | null;
  locality?: string | null;
}): PointsOrigin {
  const lat = params.lat ? Number(params.lat) : Number.NaN;
  const lng = params.lng ? Number(params.lng) : Number.NaN;
  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    return { type: "gps", lat, lng };
  }
  const locality = params.locality?.trim();
  if (locality) return { type: "locality", locality };
  return { type: "default" };
}

export function kindFromParam(raw: string | null | undefined): WasteKind {
  return raw && isWasteKind(raw) ? raw : "unknown";
}

export function listPoints(
  catalog: CollectionPoint[],
  kind: WasteKind,
  origin: PointsOrigin,
  locale: Locale = "es",
): PointsList | { error: string } {
  const en = locale === "en";
  if (origin.type === "gps") {
    if (!isInBogota(origin.lat, origin.lng)) {
      return { error: en ? "Outside Bogotá" : "Fuera de Bogotá" };
    }
    return {
      originLabel: en ? "your location" : "tu ubicación",
      points: rankPoints(catalog, kind, origin),
    };
  }
  if (origin.type === "locality") {
    const hit = geocodeLocality(origin.locality);
    if (!hit) {
      return { error: en ? "Neighborhood not found" : "Localidad no encontrada" };
    }
    return {
      originLabel: hit.name,
      points: rankPoints(catalog, kind, hit),
    };
  }
  return {
    originLabel: en ? "Bogotá center" : "centro de Bogotá",
    points: rankPoints(catalog, kind, BOGOTA_CENTER),
  };
}
