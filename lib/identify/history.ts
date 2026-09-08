import type { SupabaseClient } from "@supabase/supabase-js";
import { isWasteKind, type WasteKind } from "@/lib/catalog/kinds";

export const HISTORY_CAP = 20;

export type IdentificationRecord = {
  path: string;
  kind: WasteKind;
  confidence: number;
  at: string;
};

export function recordFromRow(row: Record<string, unknown>): IdentificationRecord | null {
  const path =
    typeof row.path === "string"
      ? row.path
      : typeof row.storage_path === "string"
        ? row.storage_path
        : "";
  const kindRaw =
    typeof row.kind === "string"
      ? row.kind
      : typeof row.waste_kind === "string"
        ? row.waste_kind
        : "";
  const at =
    typeof row.at === "string"
      ? row.at
      : typeof row.created_at === "string"
        ? row.created_at
        : "";
  const confidence =
    typeof row.confidence === "number" ? row.confidence : Number(row.confidence);
  if (!path.trim() || !isWasteKind(kindRaw) || !at) return null;
  return {
    path,
    kind: kindRaw,
    confidence: Number.isFinite(confidence) ? confidence : 0,
    at,
  };
}

export function parseHistory(raw: unknown): IdentificationRecord[] {
  if (!Array.isArray(raw)) return [];
  const out: IdentificationRecord[] = [];
  for (const row of raw) {
    if (!row || typeof row !== "object") continue;
    const parsed = recordFromRow(row as Record<string, unknown>);
    if (parsed) out.push(parsed);
  }
  return out.slice(0, HISTORY_CAP);
}

export async function insertIdentification(
  supabase: SupabaseClient,
  userId: string,
  entry: { path: string; kind: WasteKind; confidence: number },
) {
  const { error } = await supabase.from("identifications").upsert(
    {
      user_id: userId,
      storage_path: entry.path,
      waste_kind: entry.kind,
      confidence: entry.confidence,
      created_at: new Date().toISOString(),
    },
    { onConflict: "user_id,storage_path" },
  );
  void error;
}

export async function listIdentifications(
  supabase: SupabaseClient,
): Promise<IdentificationRecord[]> {
  const { data, error } = await supabase
    .from("identifications")
    .select("storage_path, waste_kind, confidence, created_at")
    .order("created_at", { ascending: false })
    .limit(HISTORY_CAP);
  if (error) return [];
  return parseHistory(data ?? []);
}

export async function updateIdentificationKind(
  supabase: SupabaseClient,
  userId: string,
  path: string,
  kind: WasteKind,
) {
  await supabase
    .from("identifications")
    .update({ waste_kind: kind })
    .eq("user_id", userId)
    .eq("storage_path", path);
}
