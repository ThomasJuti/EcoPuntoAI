import type { SupabaseClient } from "@supabase/supabase-js";
import { isWasteKind, type WasteKind } from "@/lib/catalog/kinds";

export type DeliveryInput = {
  pointId: string;
  pointName: string;
  kind: WasteKind;
  path: string | null;
  km: number | null;
};

export function parseDeliveryInput(body: unknown): DeliveryInput {
  if (!body || typeof body !== "object") {
    throw new Error("Cuerpo inválido");
  }
  const row = body as Record<string, unknown>;
  const pointId = typeof row.pointId === "string" ? row.pointId.trim() : "";
  const pointName =
    typeof row.pointName === "string" ? row.pointName.trim() : "";
  const kindRaw = typeof row.kind === "string" ? row.kind : "";
  const path = typeof row.path === "string" ? row.path.trim() : "";
  const km =
    typeof row.km === "number" && Number.isFinite(row.km) && row.km >= 0
      ? row.km
      : null;
  if (!pointId) throw new Error("Falta el punto");
  if (!isWasteKind(kindRaw)) throw new Error("Tipo inválido");
  return {
    pointId,
    pointName: pointName || pointId,
    kind: kindRaw,
    path: path || null,
    km,
  };
}

/** Paths of the given identifications already handed in, mapped to the point name. */
export async function deliveredPaths(
  supabase: SupabaseClient,
  paths: string[],
): Promise<Map<string, string>> {
  const out = new Map<string, string>();
  if (paths.length === 0) return out;
  const { data, error } = await supabase
    .from("deliveries")
    .select("storage_path, point_name")
    .in("storage_path", paths);
  if (error) return out;
  for (const row of data ?? []) {
    if (typeof row.storage_path === "string") {
      out.set(row.storage_path, String(row.point_name ?? ""));
    }
  }
  return out;
}
