import { NextResponse } from "next/server";
import { isWasteKind } from "@/lib/catalog/kinds";
import { loadPoints } from "@/lib/catalog/points";
import { rankPoints } from "@/lib/catalog/ranking";
import { BOGOTA_CENTER, geocodeLocality, isInBogota } from "@/lib/geo/bogota";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const kindRaw = url.searchParams.get("kind") ?? "unknown";
  const kind = isWasteKind(kindRaw) ? kindRaw : "unknown";
  const locality = url.searchParams.get("locality");
  const latRaw = url.searchParams.get("lat");
  const lngRaw = url.searchParams.get("lng");
  const lat = latRaw ? Number(latRaw) : Number.NaN;
  const lng = lngRaw ? Number(lngRaw) : Number.NaN;

  let origin = BOGOTA_CENTER;
  let originLabel = "centro de Bogotá";

  if (Number.isFinite(lat) && Number.isFinite(lng)) {
    if (!isInBogota(lat, lng)) {
      return NextResponse.json({ error: "Fuera de Bogotá" }, { status: 400 });
    }
    origin = { lat, lng };
    originLabel = "tu ubicación";
  } else if (locality) {
    const hit = geocodeLocality(locality);
    if (!hit) {
      return NextResponse.json({ error: "Localidad no encontrada" }, { status: 400 });
    }
    origin = hit;
    originLabel = hit.name;
  }

  const ranked = rankPoints(await loadPoints(), kind, origin);
  return NextResponse.json({
    kind,
    origin,
    originLabel,
    recommended: ranked.find((p) => p.recommended) ?? null,
    points: ranked,
  });
}
