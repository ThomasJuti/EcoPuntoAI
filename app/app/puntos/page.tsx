import type { Metadata } from "next";
import {
  PointsBrowser,
  type PointsOrigin,
} from "@/app/components/points-browser";
import { isWasteKind, labelFor, type WasteKind } from "@/lib/catalog/kinds";

export const metadata: Metadata = {
  title: "¿Dónde lo llevo? - EcoPunto IA",
};

export default async function PuntosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const rawKind = first(params.kind);
  const kind: WasteKind = rawKind && isWasteKind(rawKind) ? rawKind : "unknown";

  const lat = Number(first(params.lat));
  const lng = Number(first(params.lng));
  const locality = first(params.locality)?.trim();

  const initialOrigin: PointsOrigin =
    Number.isFinite(lat) && Number.isFinite(lng)
      ? { type: "gps", lat, lng }
      : locality
        ? { type: "locality", locality }
        : { type: "default" };

  return (
    <main>
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        ¿Dónde lo llevo?
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        {kind === "unknown"
          ? "Todos los puntos activos de Bogotá. Afina la categoría si ya sabes qué es."
          : `Puntos de Bogotá que reciben «${labelFor(kind)}». Busca desde tu ubicación o tu localidad.`}
      </p>
      <PointsBrowser initialKind={kind} initialOrigin={initialOrigin} />
    </main>
  );
}
