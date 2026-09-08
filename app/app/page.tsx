import type { Metadata } from "next";
import Link from "next/link";
import { Recycle } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "EcoPunto IA - App",
};

export default function AppPage() {
  return (
    <main className="grid min-h-[100dvh] place-items-center bg-black px-5">
      <div className="max-w-md text-center">
        <span className="mx-auto grid size-12 place-items-center rounded-2xl bg-pine-600 text-white">
          <Recycle size={26} weight="bold" />
        </span>
        <h1 className="mt-6 text-3xl font-semibold tracking-tight text-white">
          La app está en construcción
        </h1>
        <p className="mt-3 font-light leading-relaxed text-white/70">
          Estamos preparando el escáner y el mapa de puntos. Vuelve pronto.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center rounded-full border border-white/20 px-6 py-3 text-sm font-semibold text-white transition hover:border-white/40 hover:bg-white/5 active:translate-y-px"
        >
          Volver al inicio
        </Link>
      </div>
    </main>
  );
}
