"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  Clock,
  MapPin,
  Star,
  X,
} from "@phosphor-icons/react";
import type { WasteKind } from "@/lib/catalog/kinds";
import { embedMapUrl, mapsUrl, type RankedPoint } from "@/lib/catalog/ranking";
import { formatPointHours } from "@/lib/i18n/hours";
import { useLocale, useMessages } from "./locale-provider";

type Props = {
  kind: WasteKind;
  open: boolean;
  onClose: () => void;
};

type FetchState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; originLabel: string; point: RankedPoint };

const btnBase =
  "inline-flex items-center justify-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition duration-100 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";

function nearLabel(
  originLabel: string,
  copy: { nearCenter: string; nearNamed: string },
) {
  if (originLabel === "centro de Bogotá" || originLabel === "Bogotá center") {
    return copy.nearCenter;
  }
  return copy.nearNamed.replace("{name}", originLabel);
}

export function RecommendedPointModal({ kind, open, onClose }: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const t = useMessages();
  const locale = useLocale();
  const kmFormat = new Intl.NumberFormat(locale === "en" ? "en-US" : "es-CO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (open && !dialog.open) dialog.showModal();
    else if (!open && dialog.open) dialog.close();
  }, [open]);

  useEffect(() => {
    if (!open) return;
    let cancelled = false;
    let usedGps = false;

    async function load(lat?: number, lng?: number) {
      const isGps = lat !== undefined && lng !== undefined;
      const params = new URLSearchParams({ kind });
      if (isGps) {
        params.set("lat", String(lat));
        params.set("lng", String(lng));
      }
      try {
        const res = await fetch(`/api/points?${params.toString()}`);
        const data = (await res.json()) as {
          originLabel?: string;
          recommended?: RankedPoint | null;
        };
        if (cancelled || (!isGps && usedGps)) return;
        if (isGps) usedGps = true;
        if (!res.ok || !data.recommended) {
          setState({ status: "error" });
          return;
        }
        setState({
          status: "ready",
          originLabel: data.originLabel ?? (locale === "en" ? "Bogotá center" : "centro de Bogotá"),
          point: data.recommended,
        });
      } catch {
        if (!cancelled && !isGps) setState({ status: "error" });
      }
    }

    setState({ status: "loading" });
    void load();

    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (!cancelled) {
            void load(position.coords.latitude, position.coords.longitude);
          }
        },
        () => {},
        { timeout: 10000, maximumAge: 300000 },
      );
    }

    return () => {
      cancelled = true;
    };
  }, [open, kind, locale]);

  function onBackdropClick(event: React.MouseEvent<HTMLDialogElement>) {
    const rect = event.currentTarget.getBoundingClientRect();
    const inside =
      event.clientX >= rect.left &&
      event.clientX <= rect.right &&
      event.clientY >= rect.top &&
      event.clientY <= rect.bottom;
    if (!inside) event.currentTarget.close();
  }

  return (
    <dialog
      ref={dialogRef}
      aria-modal="true"
      aria-labelledby="recommended-point-title"
      onClose={onClose}
      onClick={onBackdropClick}
      className="modal-map liquid-glass-strong m-auto w-[calc(100vw-2.5rem)] max-w-md rounded-3xl p-6 text-petroleum md:p-7"
    >
      <div className="flex items-start justify-between gap-4">
        <div>
          <h2
            id="recommended-point-title"
            className="font-heading text-2xl font-normal italic leading-tight tracking-[-0.01em] text-petroleum"
          >
            {t.recommended.title}
          </h2>
          <p className="mt-1 text-sm text-petroleum/60">
            {state.status === "ready"
              ? nearLabel(state.originLabel, t.recommended)
              : t.recommended.searching}
          </p>
        </div>
        <button
          type="button"
          onClick={() => dialogRef.current?.close()}
          aria-label={t.common.close}
          className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-petroleum/5 text-petroleum/70 transition duration-100 ease-[var(--ease-out)] hover:bg-petroleum/10 hover:text-petroleum active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <X size={16} weight="bold" />
        </button>
      </div>

      {state.status === "loading" && (
        <div
          role="status"
          className="mt-5 animate-pulse motion-reduce:animate-none"
        >
          <span className="sr-only">{t.recommended.loading}</span>
          <div className="h-60 w-full rounded-2xl bg-petroleum/10" />
          <div className="mt-4 h-4 w-2/3 rounded-full bg-petroleum/10" />
          <div className="mt-2 h-3 w-1/2 rounded-full bg-petroleum/10" />
        </div>
      )}

      {state.status === "error" && (
        <p role="status" className="mt-5 text-sm text-petroleum/70">
          {t.recommended.error}
        </p>
      )}

      {state.status === "ready" && (
        <>
          <iframe
            title={t.recommended.mapTitle.replace("{name}", state.point.name)}
            src={embedMapUrl(state.point)}
            loading="lazy"
            className="mt-5 h-60 w-full rounded-2xl border-0 bg-petroleum/5"
          />
          <div className="mt-4 flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold leading-snug text-petroleum">
              {state.point.name}
            </h3>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-pine-600 px-2.5 py-1 text-xs font-medium text-white">
              <Star size={12} weight="fill" />
              {t.point.recommended}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-petroleum/70">
            {state.point.address} · {state.point.locality}
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-petroleum/75">
            <li className="flex items-center gap-2">
              <MapPin size={15} className="shrink-0 text-pine-600" />
              <span>
                <strong className="font-semibold text-petroleum">
                  {kmFormat.format(state.point.km)} km
                </strong>{" "}
                {t.point.distance}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={15} className="shrink-0 text-pine-600" />
              {formatPointHours(state.point.hours, locale)}
            </li>
          </ul>
        </>
      )}

      <div className="mt-6 flex flex-wrap items-center gap-3">
        {state.status === "ready" && (
          <a
            href={mapsUrl(state.point)}
            target="_blank"
            rel="noopener noreferrer"
            className={`${btnBase} bg-pine-600 text-white hover:bg-pine-600/90`}
          >
            {t.point.directions}
            <ArrowUpRight size={14} weight="bold" />
          </a>
        )}
        <Link
          href={`/app/puntos?kind=${kind}`}
          className={`${btnBase} bg-pine-600/10 text-pine-950 hover:bg-pine-600/15`}
        >
          {t.recommended.more}
        </Link>
      </div>
    </dialog>
  );
}
