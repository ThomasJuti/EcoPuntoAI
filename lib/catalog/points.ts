import { readFileSync } from "node:fs";
import { join } from "node:path";
import { isWasteKind, type WasteKind } from "@/lib/catalog/kinds";
import type { CollectionPoint } from "@/lib/catalog/ranking";

function parseAccepted(value: string): WasteKind[] {
  return value
    .split("|")
    .map((part) => part.trim())
    .filter(isWasteKind);
}

export function pointsFromCsv(raw: string): CollectionPoint[] {
  const lines = raw.trim().split(/\r?\n/);
  const header = lines.shift();
  if (!header) return [];
  const cols = header.split(",");
  const idx = (name: string) => cols.indexOf(name);
  return lines
    .filter((line) => line.trim())
    .map((line) => {
      const cells = line.split(",");
      const at = (name: string) => cells[idx(name)] ?? "";
      return {
        id: at("id"),
        name: at("name"),
        address: at("address"),
        lat: Number(at("lat")),
        lng: Number(at("lng")),
        locality: at("locality"),
        hours: at("hours"),
        contact: at("contact") || null,
        accepted: parseAccepted(at("accepted")),
        isActive: at("is_active") !== "false",
        lastVerifiedAt: at("last_verified_at"),
      };
    });
}

export function loadSeedPoints(): CollectionPoint[] {
  const raw = readFileSync(
    join(process.cwd(), "data/seed/collection-points.csv"),
    "utf8",
  );
  return pointsFromCsv(raw);
}

export async function loadPoints(): Promise<CollectionPoint[]> {
  try {
    const { createClient } = await import("@/lib/supabase/server");
    const supabase = await createClient();
    const { data, error } = await supabase
      .from("collection_points")
      .select(
        "id,name,address,lat,lng,locality,hours,contact,accepted,is_active,last_verified_at",
      )
      .eq("is_active", true);
    if (!error && data && data.length > 0) {
      return data.map((row) => ({
        id: row.id,
        name: row.name,
        address: row.address,
        lat: row.lat,
        lng: row.lng,
        locality: row.locality,
        hours: row.hours,
        contact: row.contact,
        accepted: (row.accepted as string[]).filter(isWasteKind),
        isActive: row.is_active,
        lastVerifiedAt: row.last_verified_at,
      }));
    }
  } catch {
    // ponytail: CSV until the cloud table is seeded
  }
  return loadSeedPoints();
}
