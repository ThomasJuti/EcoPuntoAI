import type { SupabaseClient } from "@supabase/supabase-js";
import { parseAnswers, type Conditions } from "@/lib/catalog/conditions";
import { isWasteKind, type WasteKind } from "@/lib/catalog/kinds";

export const HISTORY_CAP = 20;

export type IdentificationRecord = {
  path: string;
  kind: WasteKind;
  confidence: number;
  at: string;
  answers: Conditions;
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
    answers: parseAnswers(row.answers),
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

const LIST_COLS = "storage_path, waste_kind, confidence, created_at";
const LIST_COLS_WITH_ANSWERS = `${LIST_COLS}, answers`;

export async function insertIdentification(
  supabase: SupabaseClient,
  userId: string,
  entry: { path: string; kind: WasteKind; confidence: number },
) {
  const row = {
    user_id: userId,
    storage_path: entry.path,
    waste_kind: entry.kind,
    confidence: entry.confidence,
    answers: {} as Conditions,
    created_at: new Date().toISOString(),
  };
  const { error } = await supabase
    .from("identifications")
    .upsert(row, { onConflict: "user_id,storage_path" });
  if (!error) return;
  const { answers: _answers, ...withoutAnswers } = row;
  void _answers;
  await supabase
    .from("identifications")
    .upsert(withoutAnswers, { onConflict: "user_id,storage_path" });
}

export async function listIdentifications(
  supabase: SupabaseClient,
): Promise<IdentificationRecord[]> {
  const { data, error } = await supabase
    .from("identifications")
    .select(LIST_COLS_WITH_ANSWERS)
    .order("created_at", { ascending: false })
    .limit(HISTORY_CAP);
  if (!error) return parseHistory(data ?? []);
  const fallback = await supabase
    .from("identifications")
    .select(LIST_COLS)
    .order("created_at", { ascending: false })
    .limit(HISTORY_CAP);
  if (fallback.error) return [];
  return parseHistory(fallback.data ?? []);
}

export async function updateIdentification(
  supabase: SupabaseClient,
  userId: string,
  path: string,
  patch: { kind?: WasteKind; answers?: Conditions },
) {
  const row: { waste_kind?: WasteKind; answers?: Conditions } = {};
  if (patch.kind) row.waste_kind = patch.kind;
  if (patch.answers !== undefined) row.answers = patch.answers;
  if (row.waste_kind === undefined && row.answers === undefined) return;
  await supabase
    .from("identifications")
    .update(row)
    .eq("user_id", userId)
    .eq("storage_path", path);
}

export async function getIdentification(
  supabase: SupabaseClient,
  path: string,
): Promise<IdentificationRecord | null> {
  const { data, error } = await supabase
    .from("identifications")
    .select(LIST_COLS_WITH_ANSWERS)
    .eq("storage_path", path)
    .maybeSingle();
  if (!error && data) return recordFromRow(data as Record<string, unknown>);
  if (!error) return null;
  const fallback = await supabase
    .from("identifications")
    .select(LIST_COLS)
    .eq("storage_path", path)
    .maybeSingle();
  if (fallback.error || !fallback.data) return null;
  return recordFromRow(fallback.data as Record<string, unknown>);
}
