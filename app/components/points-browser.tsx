"use client";

import { useMemo, useState } from "react";
import {
  Crosshair,
  MagnifyingGlass,
  MapPin,
  SpinnerGap,
  X,
} from "@phosphor-icons/react";
import { WASTE_KINDS, labelFor, type WasteKind } from "@/lib/catalog/kinds";
import { listPoints, type PointsOrigin } from "@/lib/catalog/list";
import type { CollectionPoint } from "@/lib/catalog/ranking";
import { PointCard } from "./point-card";

export type { PointsOrigin };

type Props = {
  catalog: CollectionPoint[];
  initialKind?: WasteKind;
  initialOrigin?: PointsOrigin;
};

const pillBase =
  "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition duration-100 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";

const spinner =
  "animate-spin motion-reduce:animate-none";

export function PointsBrowser({
  catalog,
  initialKind = "unknown",
  initialOrigin = { type: "default" },
}: Props) {
  const [kind, setKind] = useState<WasteKind>(initialKind);
  const [origin, setOrigin] = useState<PointsOrigin>(initialOrigin);
  const [localityInput, setLocalityInput] = useState(
    initialOrigin.type === "locality" ? initialOrigin.locality : "",
  );
  const [locating, setLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  const listed = useMemo(
    () => listPoints(catalog, kind, origin),
    [catalog, kind, origin],
  );

  function useMyLocation() {
    setGpsError(null);
    if (!("geolocation" in navigator)) {
      setGpsError("Este navegador no tiene geolocalización. Escribe tu localidad.");
      return;
    }
    setLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setLocating(false);
        setLocalityInput("");
        setOrigin({
          type: "gps",
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      },
      () => {
        setLocating(false);
        setGpsError(
          "No pudimos usar tu ubicación. Escribe tu localidad, por ejemplo Kennedy.",
        );
      },
      { timeout: 10000, maximumAge: 300000 },
    );
  }

  function onLocalitySubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const value = localityInput.trim();
    setGpsError(null);
    setOrigin(value ? { type: "locality", locality: value } : { type: "default" });
  }

  const dirty =
    kind !== "unknown" ||
    origin.type !== "default" ||
    localityInput.trim() !== "" ||
    gpsError !== null;

  function clearFilters() {
    setKind("unknown");
    setOrigin({ type: "default" });
    setLocalityInput("");
    setGpsError(null);
  }

  const gpsActive = origin.type === "gps";
  const error = "error" in listed ? listed.error : null;
  const data = "error" in listed ? null : listed;

  return (
    <div className="mt-10">
      <div
        role="group"
        aria-label="Filtrar por categoría"
        className="chip-scroll-fade -mx-6 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:-mx-16 lg:px-16"
      >
        <div className="flex w-max gap-2">
          {WASTE_KINDS.map((row) => {
            const active = row.id === kind;
            return (
              <button
                key={row.id}
                type="button"
                aria-pressed={active}
                onClick={() => setKind(row.id)}
                className={`${pillBase} ${
                  active
                    ? "bg-pine-600 text-white"
                    : "liquid-glass-strong text-petroleum/70 hover:bg-white/50 hover:text-petroleum"
                }`}
              >
                {row.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className={`inline-flex w-full items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition duration-100 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:cursor-wait disabled:opacity-60 disabled:active:scale-100 sm:w-auto ${
            gpsActive
              ? "bg-pine-600 text-white"
              : "liquid-glass-strong text-petroleum hover:bg-white/50"
          }`}
        >
          {locating ? (
            <SpinnerGap size={16} weight="bold" className={spinner} />
          ) : (
            <Crosshair size={16} weight="bold" />
          )}
          {locating ? "Ubicando…" : "Usar mi ubicación"}
        </button>

        <form
          onSubmit={onLocalitySubmit}
          className="flex w-full min-w-0 flex-col gap-2 sm:flex-1 sm:flex-row sm:flex-nowrap sm:items-center"
        >
          <label htmlFor="locality" className="sr-only">
            Tu localidad
          </label>
          <input
            id="locality"
            type="text"
            value={localityInput}
            onChange={(event) => setLocalityInput(event.target.value)}
            placeholder="Kennedy, Suba, Chapinero…"
            autoComplete="off"
            className="liquid-glass-strong w-full rounded-full px-5 py-3 text-sm font-medium text-petroleum placeholder:text-petroleum/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-600/50 sm:min-w-0 sm:flex-1"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="liquid-glass-strong inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-petroleum transition duration-100 ease-[var(--ease-out)] hover:bg-white/50 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 sm:flex-none"
            >
              <MagnifyingGlass size={16} weight="bold" />
              Buscar
            </button>
            {dirty && (
              <button
                type="button"
                onClick={clearFilters}
                className="liquid-glass-strong inline-flex flex-1 items-center justify-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-petroleum transition duration-100 ease-[var(--ease-out)] hover:bg-white/50 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 sm:flex-none"
              >
                <X size={16} weight="bold" />
                Limpiar
              </button>
            )}
          </div>
        </form>
      </div>

      {gpsError && (
        <p role="status" className="mt-3 text-sm text-petroleum/60">
          {gpsError}
        </p>
      )}

      <div className="mt-8">
        {error && (
          <div className="liquid-glass max-w-xl rounded-3xl p-6">
            <p className="text-sm font-medium text-petroleum">{error}</p>
            <p className="mt-1.5 text-sm text-petroleum/60">
              Revisa el nombre de la localidad o intenta con tu ubicación.
            </p>
          </div>
        )}

        {data && (
          <>
            <p className="text-sm text-petroleum/60">
              {data.points.length === 0
                ? `Sin resultados desde ${data.originLabel}.`
                : `${data.points.length} ${
                    data.points.length === 1 ? "punto" : "puntos"
                  } · distancias desde ${data.originLabel}.`}
            </p>

            {data.points.length === 0 ? (
              <div className="liquid-glass mt-4 max-w-xl rounded-3xl p-8 text-center">
                <MapPin size={28} className="mx-auto text-pine-600" />
                <p className="mt-3 text-base font-medium text-petroleum">
                  No hay puntos activos para «{labelFor(kind)}».
                </p>
                {kind !== "unknown" && (
                  <p className="mt-1.5 text-sm text-petroleum/60">
                    Prueba con «No sé qué es» para ver todos los puntos de
                    Bogotá.
                  </p>
                )}
              </div>
            ) : (
              <ul className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {data.points.map((point) => (
                  <li key={point.id}>
                    <PointCard point={point} />
                  </li>
                ))}
              </ul>
            )}
          </>
        )}
      </div>
    </div>
  );
}
