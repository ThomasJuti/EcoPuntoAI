import { Suspense } from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { Camera } from "@phosphor-icons/react/dist/ssr";
import { IdentifyHistory } from "@/app/components/identify-history";
import { HistoryRowsSkeleton } from "@/app/components/ui-skeleton";

export const metadata: Metadata = {
  title: "Inicio - EcoPunto IA",
};

export default function AppHomePage() {
  return (
    <main>
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        Inicio
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        Una foto identifica tu aparato y te dice a qué punto de Bogotá
        llevarlo.
      </p>
      <div className="mt-8">
        <Link
          href="/app/escanear"
          className="liquid-glass-strong inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-base font-medium text-petroleum transition duration-100 ease-[var(--ease-out)] hover:bg-white/40 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <Camera size={20} weight="fill" />
          Identificar
        </Link>
      </div>

      <section className="mt-20 md:mt-24">
        <h2 className="font-heading text-2xl font-normal italic leading-tight tracking-[-0.01em] text-petroleum md:text-3xl">
          Historial
        </h2>
        <div className="mt-5">
          <Suspense fallback={<HistoryRowsSkeleton />}>
            <IdentifyHistory />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
