"use client";

import { useEffect, useState } from "react";
import {
  Crosshair,
  MagnifyingGlass,
  MapPin,
  SpinnerGap,
} from "@phosphor-icons/react";
import { WASTE_KINDS, labelFor, type WasteKind } from "@/lib/catalog/kinds";
import type { RankedPoint } from "@/lib/catalog/ranking";
import { PointCard } from "./point-card";

export type PointsOrigin =
  | { type: "gps"; lat: number; lng: number }
  | { type: "locality"; locality: string }
  | { type: "default" };

type ApiOk = {
  originLabel: string;
  points: RankedPoint[];
};

type Props = {
  initialKind?: WasteKind;
  initialOrigin?: PointsOrigin;
};

const pillBase =
  "shrink-0 whitespace-nowrap rounded-full px-4 py-2 text-sm font-medium transition duration-100 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";

const spinner =
  "animate-spin motion-reduce:animate-none";

export function PointsBrowser({
  initialKind = "unknown",
  initialOrigin = { type: "default" },
}: Props) {
  const [kind, setKind] = useState<WasteKind>(initialKind);
  const [origin, setOrigin] = useState<PointsOrigin>(initialOrigin);
  const [localityInput, setLocalityInput] = useState(
    initialOrigin.type === "locality" ? initialOrigin.locality : "",
  );
  const [data, setData] = useState<ApiOk | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [locating, setLocating] = useState(false);
  const [gpsError, setGpsError] = useState<string | null>(null);

  useEffect(() => {
    const controller = new AbortController();
    const params = new URLSearchParams({ kind });
    if (origin.type === "gps") {
      params.set("lat", String(origin.lat));
      params.set("lng", String(origin.lng));
    } else if (origin.type === "locality") {
      params.set("locality", origin.locality);
    }

    setLoading(true);
    setError(null);

    fetch(`/api/points?${params.toString()}`, { signal: controller.signal })
      .then(async (res) => {
        const json = (await res.json()) as Partial<ApiOk> & { error?: string };
        if (!res.ok) {
          throw new Error(json.error ?? "No pudimos cargar los puntos.");
        }
        return json as ApiOk;
      })
      .then((json) => {
        setData(json);
        setLoading(false);
      })
      .catch((err: unknown) => {
        if (err instanceof DOMException && err.name === "AbortError") return;
        setData(null);
        setError(
          err instanceof Error ? err.message : "No pudimos cargar los puntos.",
        );
        setLoading(false);
      });

    return () => controller.abort();
  }, [kind, origin]);

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
        // Denegada o sin señal: el campo de localidad sigue funcionando
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

  const gpsActive = origin.type === "gps";

  return (
    <div className="mt-10">
      <div
        role="group"
        aria-label="Filtrar por categoría"
        className="-mx-6 overflow-x-auto px-6 pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:-mx-16 lg:px-16"
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

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={useMyLocation}
          disabled={locating}
          className={`inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium transition duration-100 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:cursor-wait disabled:opacity-60 disabled:active:scale-100 ${
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
          className="flex min-w-0 flex-1 flex-wrap items-center gap-2 sm:flex-nowrap"
        >
          <label htmlFor="locality" className="sr-only">
            Tu localidad
          </label>
          <input
            id="locality"
            type="text"
            value={localityInput}
            onChange={(event) => setLocalityInput(event.target.value)}
            placeholder="Tu localidad: Kennedy, Suba, Chapinero…"
            autoComplete="off"
            className="liquid-glass-strong min-w-0 flex-1 rounded-full px-5 py-3 text-sm font-medium text-petroleum placeholder:text-petroleum/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-600/50"
          />
          <button
            type="submit"
            className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-5 py-3 text-sm font-medium text-petroleum transition duration-100 ease-[var(--ease-out)] hover:bg-white/50 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            <MagnifyingGlass size={16} weight="bold" />
            Buscar
          </button>
        </form>
      </div>

      {gpsError && (
        <p role="status" className="mt-3 text-sm text-petroleum/60">
          {gpsError}
        </p>
      )}

      <div className="mt-8">
        {loading && (
          <p role="status" className="flex items-center gap-2 text-sm text-petroleum/60">
            <SpinnerGap size={16} weight="bold" className={spinner} />
            Buscando puntos…
          </p>
        )}

        {!loading && error && (
          <div className="liquid-glass max-w-xl rounded-3xl p-6">
            <p className="text-sm font-medium text-petroleum">{error}</p>
            <p className="mt-1.5 text-sm text-petroleum/60">
              Revisa el nombre de la localidad o intenta con tu ubicación.
            </p>
          </div>
        )}

        {!loading && !error && data && (
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
