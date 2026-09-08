import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mapa - EcoPunto IA",
};

export default function MapaPage() {
  return (
    <main>
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        Mapa
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        Los puntos de Bogotá que reciben tu aparato aparecen aquí.
      </p>
    </main>
  );
}
