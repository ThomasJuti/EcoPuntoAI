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
