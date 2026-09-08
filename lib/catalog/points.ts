import { readFileSync } from "node:fs";
import { join } from "node:path";
import type { SupabaseClient } from "@supabase/supabase-js";
import { isWasteKind, type WasteKind } from "@/lib/catalog/kinds";
import { pointFromRow, pointToRow, type PointRow } from "@/lib/catalog/point-row";
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
      return data.map((row) =>
        pointFromRow({ ...row, accepted: row.accepted as string[] }),
      );
    }
  } catch {
    // ponytail: CSV until the cloud table is seeded
  }
  return loadSeedPoints();
}

const POINT_COLS =
  "id,name,address,lat,lng,locality,hours,contact,accepted,is_active,last_verified_at";

export const POINTS_MIGRATION_HINT =
  "Aplica supabase/migrations/0003_points.sql y 0004_reports.sql en el SQL editor de Supabase para poder editar.";

function rowsFrom(data: PointRow[] | null): CollectionPoint[] {
  return (data ?? []).map(pointFromRow);
}

export async function loadDbPoints(
  supabase: SupabaseClient,
  opts: { activeOnly?: boolean } = {},
): Promise<CollectionPoint[] | null> {
  let query = supabase.from("collection_points").select(POINT_COLS);
  if (opts.activeOnly) query = query.eq("is_active", true);
  const { data, error } = await query;
  if (error) return null;
  return rowsFrom((data ?? []) as PointRow[]);
}

export type AdminPointsPayload = {
  points: CollectionPoint[];
  source: "supabase" | "csv";
  warning?: string;
};

export async function loadAdminPoints(
  supabase: SupabaseClient,
): Promise<AdminPointsPayload> {
  const { data, error } = await supabase
    .from("collection_points")
    .select(POINT_COLS);
  if (!error && data && data.length > 0) {
    return {
      points: rowsFrom((data ?? []) as PointRow[]),
      source: "supabase",
    };
  }
  if (!error && data && data.length === 0) {
    const seeded = await supabase
      .from("collection_points")
      .upsert(loadSeedPoints().map(pointToRow));
    if (!seeded.error) {
      const again = await loadDbPoints(supabase);
      if (again && again.length > 0) {
        return { points: again, source: "supabase" };
      }
    }
  }
  return {
    points: loadSeedPoints(),
    source: "csv",
    warning: POINTS_MIGRATION_HINT,
  };
}
