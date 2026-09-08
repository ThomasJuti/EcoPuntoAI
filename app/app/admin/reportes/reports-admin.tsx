"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CheckCircle,
  Flag,
  SpinnerGap,
  XCircle,
} from "@phosphor-icons/react";
import {
  REPORT_REASON_LABELS,
  type PointReport,
} from "@/lib/catalog/reports";

type LoadState =
  | { type: "ready"; reports: PointReport[]; warning?: string }
  | { type: "forbidden" }
  | { type: "error"; message: string };

const dateFormat = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

const btnBase =
  "inline-flex items-center gap-1.5 rounded-full text-sm font-medium transition duration-100 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";
const spinner = "animate-spin motion-reduce:animate-none";

export function ReportsAdmin({
  initialReports,
  warning,
}: {
  initialReports: PointReport[];
  warning?: string;
}) {
  const [state, setState] = useState<LoadState>({
    type: "ready",
    reports: initialReports,
    warning,
  });
  const [busyId, setBusyId] = useState<string | null>(null);

  async function resolve(id: string, status: "resolved" | "dismissed") {
    if (state.type !== "ready") return;
    setBusyId(id);
    try {
      const res = await fetch(`/api/admin/reports/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      if (res.status === 403) {
        setState({ type: "forbidden" });
        return;
      }
      if (!res.ok) return;
      setState((s) =>
        s.type === "ready"
          ? {
              type: "ready",
              warning: s.warning,
              reports: s.reports.filter((r) => r.id !== id),
            }
          : s,
      );
    } finally {
      setBusyId(null);
    }
  }

  if (state.type === "forbidden") {
    return (
      <div className="liquid-glass mt-10 max-w-xl rounded-3xl p-6">
        <p className="text-sm font-medium text-petroleum">No tienes acceso.</p>
      </div>
    );
  }

  if (state.type === "error") {
    return (
      <div className="liquid-glass mt-10 max-w-xl rounded-3xl p-6">
        <p className="text-sm font-medium text-petroleum">{state.message}</p>
      </div>
    );
  }

  const { reports, warning: notice } = state;

  if (reports.length === 0) {
    return (
      <div className="liquid-glass mt-10 max-w-xl rounded-3xl p-8 text-center">
        <CheckCircle size={28} className="mx-auto text-pine-600" />
        <p className="mt-3 text-base font-medium text-petroleum">
          No hay reportes abiertos.
        </p>
        {notice && (
          <p className="mt-3 text-sm leading-relaxed text-petroleum/70">
            {notice}
          </p>
        )}
      </div>
    );
  }

  return (
    <ul className="mt-10 grid gap-4 md:grid-cols-2">
      {reports.map((report) => (
        <li
          key={report.id}
          className="liquid-glass flex flex-col rounded-3xl p-5 md:p-6"
        >
          <div className="flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold leading-snug text-petroleum">
              {report.point_name}
            </h3>
            <span className="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-pine-600/10 px-2.5 py-1 text-xs font-medium text-pine-950">
              <Flag size={12} weight="fill" />
              {REPORT_REASON_LABELS[report.reason] ?? report.reason}
            </span>
          </div>
          {report.comment && (
            <p className="mt-2 text-sm leading-relaxed text-petroleum/75">
              {report.comment}
            </p>
          )}
          <p className="mt-2 text-xs text-petroleum/55">
            {dateFormat.format(new Date(report.created_at))}
          </p>

          <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
            <button
              type="button"
              onClick={() => resolve(report.id, "resolved")}
              disabled={busyId === report.id}
              className={`${btnBase} bg-pine-600 px-4 py-2 text-white hover:bg-pine-600/90 disabled:cursor-wait disabled:opacity-60 disabled:active:scale-100`}
            >
              {busyId === report.id ? (
                <SpinnerGap size={14} weight="bold" className={spinner} />
              ) : (
                <CheckCircle size={14} weight="bold" />
              )}
              Resolver
            </button>
            <button
              type="button"
              onClick={() => resolve(report.id, "dismissed")}
              disabled={busyId === report.id}
              className={`${btnBase} liquid-glass-strong px-4 py-2 text-petroleum hover:bg-white/50 disabled:cursor-wait disabled:opacity-60 disabled:active:scale-100`}
            >
              <XCircle size={14} weight="bold" />
              Descartar
            </button>
            <Link
              href="/app/admin/puntos"
              className={`${btnBase} px-4 py-2 text-petroleum/60 hover:bg-white/40 hover:text-petroleum`}
            >
              Editar punto
              <ArrowRight size={14} weight="bold" />
            </Link>
          </div>
        </li>
      ))}
    </ul>
  );
}
