"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  ArrowUpRight,
  CheckCircle,
  Clock,
  MapPin,
  Package,
  SpinnerGap,
  Star,
  X,
} from "@phosphor-icons/react";
import { labelFor, type WasteKind } from "@/lib/catalog/kinds";
import { mapsUrl, type RankedPoint } from "@/lib/catalog/ranking";
import { BOGOTA_CENTER, type LatLng } from "@/lib/geo/bogota";
import { formatPointHours } from "@/lib/i18n/hours";
import { DeliveryMap } from "./delivery-map";
import { useLocale, useMessages } from "./locale-provider";

type Props = {
  kind: WasteKind;
  path?: string | null;
  /** Point name when this identification was already handed in. */
  deliveredAt?: string | null;
  /** Open straight on the hand-in confirmation. */
  confirmOnOpen?: boolean;
  onDelivered?: (pointName: string) => void;
  open: boolean;
  onClose: () => void;
};

type FetchState =
  | { status: "loading" }
  | { status: "error" }
  | { status: "ready"; originLabel: string; origin: LatLng; point: RankedPoint };

type Delivery = {
  walking: boolean;
  arrived: boolean;
  post: "idle" | "pending" | "ok" | "error" | "unauth";
};

const NO_DELIVERY: Delivery = { walking: false, arrived: false, post: "idle" };

const btnShape =
  "inline-flex items-center justify-center gap-2 rounded-full text-sm font-medium transition duration-100 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";
const btnBase = `${btnShape} px-5 py-2.5`;
const btnSmall = `${btnShape} px-4 py-2`;

function nearLabel(
  originLabel: string,
  copy: { nearCenter: string; nearNamed: string },
) {
  if (originLabel === "centro de Bogotá" || originLabel === "Bogotá center") {
    return copy.nearCenter;
  }
  return copy.nearNamed.replace("{name}", originLabel);
}

export function RecommendedPointModal({
  kind,
  path = null,
  deliveredAt = null,
  confirmOnOpen = false,
  onDelivered,
  open,
  onClose,
}: Props) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [state, setState] = useState<FetchState>({ status: "loading" });
  const [delivery, setDelivery] = useState<Delivery>(NO_DELIVERY);
  const [confirming, setConfirming] = useState(false);
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
          origin?: LatLng;
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
          origin: data.origin ?? BOGOTA_CENTER,
          point: data.recommended,
        });
      } catch {
        if (!cancelled && !isGps) setState({ status: "error" });
      }
    }

    setState({ status: "loading" });
    setDelivery(NO_DELIVERY);
    setConfirming(confirmOnOpen);
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
  }, [open, kind, locale, confirmOnOpen]);

  async function deliver(point: RankedPoint) {
    // A retry after arriving only re-sends; the walk already played.
    setDelivery((d) => ({ walking: true, arrived: d.arrived, post: "pending" }));
    try {
      const res = await fetch("/api/deliveries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pointId: point.id,
          pointName: point.name,
          kind,
          path,
          km: Math.round(point.km * 100) / 100,
        }),
      });
      const post = res.ok ? "ok" : res.status === 401 ? "unauth" : "error";
      setDelivery((d) => ({ ...d, post }));
    } catch {
      setDelivery((d) => ({ ...d, post: "error" }));
    }
  }

  const failed = delivery.post === "error" || delivery.post === "unauth";
  const justDelivered = delivery.arrived && delivery.post === "ok";
  const handedIn = deliveredAt !== null;
  const delivered = justDelivered || handedIn;
  const busy = delivery.walking && !justDelivered && !(delivery.arrived && failed);
  const canDeliver = Boolean(path) && !handedIn;
  const showConfirm = confirming && canDeliver && !busy && !justDelivered;

  const readyName = state.status === "ready" ? state.point.name : null;
  const onDeliveredRef = useRef(onDelivered);
  useEffect(() => {
    onDeliveredRef.current = onDelivered;
  }, [onDelivered]);
  useEffect(() => {
    if (justDelivered && readyName) onDeliveredRef.current?.(readyName);
  }, [justDelivered, readyName]);

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
          <DeliveryMap
            title={t.recommended.mapTitle.replace("{name}", state.point.name)}
            origin={state.origin}
            point={state.point}
            playing={delivery.walking}
            delivered={delivered}
            onArrive={() => setDelivery((d) => ({ ...d, arrived: true }))}
          />
          <div className="mt-4 flex items-start justify-between gap-3">
            <h3 className="text-base font-semibold leading-snug text-petroleum">
              {state.point.name}
            </h3>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-petroleum px-2.5 py-1 text-xs font-medium text-white">
              <Star size={12} weight="fill" />
              {t.point.recommended}
            </span>
          </div>
          <p className="mt-1 text-sm leading-relaxed text-petroleum/70">
            {state.point.address} · {state.point.locality}
          </p>
          <ul className="mt-3 space-y-1.5 text-sm text-petroleum/75">
            <li className="flex items-center gap-2">
              <MapPin size={15} className="shrink-0 text-grey" />
              <span>
                <strong className="font-semibold text-petroleum">
                  {kmFormat.format(state.point.km)} km
                </strong>{" "}
                {t.point.distance}
              </span>
            </li>
            <li className="flex items-center gap-2">
              <Clock size={15} className="shrink-0 text-grey" />
              {formatPointHours(state.point.hours, locale)}
            </li>
          </ul>
          {handedIn && !justDelivered && (
            <p
              role="status"
              className="liquid-glass mt-4 flex items-center gap-2 rounded-2xl p-4 text-sm font-medium text-petroleum"
            >
              <CheckCircle size={18} weight="fill" className="shrink-0 text-pine-600" />
              {t.recommended.alreadyDelivered.replace("{name}", deliveredAt ?? "")}
            </p>
          )}
          {justDelivered && (
            <div
              role="status"
              className="liquid-glass mt-4 flex items-start gap-3 rounded-2xl p-4"
            >
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-pine-600 text-white">
                <Package size={18} weight="fill" />
              </span>
              <div>
                <p className="text-sm font-semibold text-petroleum">
                  {t.recommended.deliveredTitle.replace("{name}", state.point.name)}
                </p>
                <p className="mt-0.5 text-sm text-petroleum/70">
                  {t.recommended.deliveredBody}
                </p>
              </div>
            </div>
          )}
          {delivery.arrived && failed && (
            <p role="status" className="mt-4 text-sm text-danger">
              {delivery.post === "unauth"
                ? t.recommended.deliverSignIn
                : t.recommended.deliverError}
            </p>
          )}
        </>
      )}

      {state.status === "ready" && showConfirm && (
        <div
          role="alertdialog"
          aria-labelledby="deliver-confirm-title"
          aria-describedby="deliver-confirm-body"
          className="mt-5 border-t border-petroleum/10 pt-4"
        >
          <p id="deliver-confirm-title" className="text-sm font-semibold text-petroleum">
            {t.recommended.confirmTitle}
          </p>
          <p id="deliver-confirm-body" className="mt-0.5 text-xs leading-relaxed text-petroleum/65">
            {t.recommended.confirmBody
              .replace("{device}", labelFor(kind, locale).toLowerCase())
              .replace("{name}", state.point.name)}
          </p>
          <div className="mt-3 flex flex-wrap gap-2">
            <button
              type="button"
              autoFocus
              onClick={() => {
                setConfirming(false);
                void deliver(state.point);
              }}
              className={`${btnSmall} bg-pine-600 text-white hover:bg-pine-600/90`}
            >
              <Package size={14} weight="bold" />
              {t.recommended.confirmYes}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className={`${btnSmall} liquid-glass-strong text-petroleum hover:bg-white/50`}
            >
              {t.common.cancel}
            </button>
          </div>
        </div>
      )}

      <div className={`mt-6 flex-wrap items-center gap-3 ${showConfirm ? "hidden" : "flex"}`}>
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
        {state.status === "ready" && (path || handedIn) && (
          <button
            type="button"
            onClick={() => setConfirming(true)}
            disabled={!canDeliver || busy || delivered}
            className={`${btnBase} liquid-glass-strong text-petroleum hover:bg-white/50 disabled:active:scale-100 ${busy ? "cursor-wait" : ""} ${delivered ? "cursor-default" : ""}`}
          >
            {delivered ? (
              <CheckCircle size={14} weight="fill" className="text-pine-600" />
            ) : busy ? (
              <SpinnerGap size={14} weight="bold" className="animate-spin motion-reduce:animate-none" />
            ) : (
              <Package size={14} weight="bold" />
            )}
            {delivered
              ? t.point.delivered
              : busy
                ? t.point.delivering
                : t.point.deliver}
          </button>
        )}
        <Link
          href={`/app/puntos?kind=${kind}`}
          className={`${btnBase} liquid-glass text-petroleum hover:bg-white/50`}
        >
          {t.recommended.more}
        </Link>
      </div>
    </dialog>
  );
}
