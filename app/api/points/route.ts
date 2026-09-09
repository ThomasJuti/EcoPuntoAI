import { NextResponse } from "next/server";
import { kindFromParam, listPoints, originFromParams } from "@/lib/catalog/list";
import { loadPoints } from "@/lib/catalog/points";
import { getLocale } from "@/lib/i18n/get-locale";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const kind = kindFromParam(url.searchParams.get("kind"));
  const listed = listPoints(
    await loadPoints(),
    kind,
    originFromParams({
      lat: url.searchParams.get("lat"),
      lng: url.searchParams.get("lng"),
      locality: url.searchParams.get("locality"),
    }),
    await getLocale(),
  );
  if ("error" in listed) {
    return NextResponse.json({ error: listed.error }, { status: 400 });
  }
  return NextResponse.json({
    kind,
    originLabel: listed.originLabel,
    recommended: listed.points.find((p) => p.recommended) ?? null,
    points: listed.points,
  });
}
