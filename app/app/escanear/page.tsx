import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Escanear - EcoPunto IA",
};

export default function EscanearPage() {
  return (
    <main>
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        Identificar
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        Toma o sube una foto del aparato para identificarlo.
      </p>
    </main>
  );
}
