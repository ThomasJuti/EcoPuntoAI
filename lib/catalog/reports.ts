export const REPORT_REASONS = [
  "closed",
  "wrong_address",
  "wrong_hours",
  "wrong_accepted",
] as const;

export type ReportReason = (typeof REPORT_REASONS)[number];

export const REPORT_REASON_LABELS: Record<ReportReason, string> = {
  closed: "Está cerrado",
  wrong_address: "Dirección incorrecta",
  wrong_hours: "Horario incorrecto",
  wrong_accepted: "Ya no recibe este residuo",
};

export function isReportReason(value: string): value is ReportReason {
  return (REPORT_REASONS as readonly string[]).includes(value);
}

export type PointReport = {
  id: string;
  point_id: string;
  point_name: string;
  reason: ReportReason;
  comment: string | null;
  status: string;
  created_at: string;
  resolved_at: string | null;
};

export type ReportInput = {
  pointId: string;
  pointName: string;
  reason: ReportReason;
  comment: string | null;
};

export function parseReportInput(body: unknown): ReportInput {
  if (!body || typeof body !== "object") {
    throw new Error("Cuerpo inválido");
  }
  const row = body as Record<string, unknown>;
  const pointId = typeof row.pointId === "string" ? row.pointId.trim() : "";
  const pointName =
    typeof row.pointName === "string" ? row.pointName.trim() : "";
  const reasonRaw = typeof row.reason === "string" ? row.reason : "";
  const commentRaw =
    typeof row.comment === "string" ? row.comment.trim() : "";
  if (!pointId) throw new Error("Falta el punto");
  if (!isReportReason(reasonRaw)) throw new Error("Motivo inválido");
  return {
    pointId,
    pointName: pointName || pointId,
    reason: reasonRaw,
    comment: commentRaw || null,
  };
}
