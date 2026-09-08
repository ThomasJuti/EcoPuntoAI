"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  BatteryFull,
  BatteryMedium,
  CookingPot,
  Desktop,
  DeviceMobile,
  DeviceTablet,
  Headphones,
  Laptop,
  Mouse,
  PlugCharging,
  Printer,
  Question,
  Television,
  Usb,
  type Icon,
} from "@phosphor-icons/react";
import { labelFor, type WasteKind } from "@/lib/catalog/kinds";
import {
  parseHistory,
  type IdentificationRecord,
} from "@/lib/identify/history";

const KIND_ICONS: Record<WasteKind, Icon> = {
  phones: DeviceMobile,
  computers: Desktop,
  laptops: Laptop,
  tablets: DeviceTablet,
  chargers: PlugCharging,
  batteries: BatteryFull,
  cells: BatteryMedium,
  headphones: Headphones,
  tvs: Television,
  printers: Printer,
  cables: Usb,
  peripherals: Mouse,
  small_appliances: CookingPot,
  unknown: Question,
};

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return new Intl.DateTimeFormat("es-CO", {
    day: "numeric",
    month: "short",
    year: "numeric",
  }).format(date);
}

function confidencePct(confidence: number): number | null {
  if (!Number.isFinite(confidence) || confidence <= 0) return null;
  return Math.round(confidence * (confidence <= 1 ? 100 : 1));
}

function historyHref(record: IdentificationRecord): string {
  const params = new URLSearchParams({
    kind: record.kind,
    confidence: String(record.confidence),
    path: record.path,
  });
  return `/app/resultado?${params.toString()}`;
}

/**
 * Historial en Supabase. Inicio no espera auth: hidrata en el cliente.
 */
export function IdentifyHistory() {
  const [state, setState] = useState<
    | { type: "loading" }
    | { type: "guest" }
    | { type: "ready"; records: IdentificationRecord[] }
  >({ type: "loading" });

  useEffect(() => {
    const controller = new AbortController();
    fetch("/api/identifications", { signal: controller.signal })
      .then(async (res) => {
        if (res.status === 401) {
          setState({ type: "guest" });
          return;
        }
        const json = (await res.json()) as { identifications?: unknown };
        setState({
          type: "ready",
          records: parseHistory(json.identifications),
        });
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setState({ type: "ready", records: [] });
      });
    return () => controller.abort();
  }, []);

  if (state.type === "loading") return null;

  if (state.type === "guest") {
    return (
      <div className="liquid-glass rounded-3xl p-6 md:p-8">
        <p className="text-sm leading-relaxed text-petroleum/75">
          Entra con Google para ver tu historial.
        </p>
        <p className="mt-1 text-sm text-petroleum/55">
          Identificar pide sesión; ahí se guarda cada aparato.
        </p>
      </div>
    );
  }

  if (state.records.length === 0) {
    return (
      <div className="liquid-glass rounded-3xl p-6 md:p-8">
        <p className="text-sm leading-relaxed text-petroleum/75">
          Todavía no identificas ningún aparato.
        </p>
        <p className="mt-1 text-sm text-petroleum/55">
          Usa Identificar para escanear tu primer electrónico.
        </p>
      </div>
    );
  }

  const records = state.records;

  return (
    <ul className="space-y-3">
      {records.map((record) => {
        const KindIcon = KIND_ICONS[record.kind];
        const when = formatWhen(record.at);
        const pct =
          record.kind !== "unknown" ? confidencePct(record.confidence) : null;
        return (
          <li key={record.path}>
            <Link
              href={historyHref(record)}
              className="liquid-glass flex items-center gap-4 rounded-3xl p-4 transition duration-100 ease-[var(--ease-out)] hover:bg-white/50 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 md:p-5"
            >
              <span className="liquid-glass-strong grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-pine-600">
                <KindIcon size={22} weight="regular" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-base font-medium text-petroleum">
                  {labelFor(record.kind)}
                </span>
                <span className="mt-0.5 block text-sm text-petroleum/55">
                  {when}
                  {pct !== null && ` · ${pct}% de confianza`}
                </span>
              </span>
              <ArrowRight
                size={18}
                weight="bold"
                className="shrink-0 text-petroleum/40"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
