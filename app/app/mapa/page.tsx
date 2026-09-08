import type { Metadata } from "next";
import { PointsBrowser } from "@/app/components/points-browser";
import { isWasteKind, type WasteKind } from "@/lib/catalog/kinds";

export const metadata: Metadata = {
  title: "Mapa - EcoPunto IA",
};

export default async function MapaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.kind) ? params.kind[0] : params.kind;
  const initialKind: WasteKind = raw && isWasteKind(raw) ? raw : "unknown";

  return (
    <main>
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        Mapa
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        Los puntos de Bogotá que reciben tu aparato. Filtra por categoría y
        busca desde tu ubicación o tu localidad.
      </p>
      <PointsBrowser initialKind={initialKind} />
    </main>
  );
}
