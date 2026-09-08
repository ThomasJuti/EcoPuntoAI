import type { Metadata } from "next";
import Link from "next/link";
import { Camera } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "Inicio - EcoPunto IA",
};

export default function AppHomePage() {
  return (
    <main className="flex min-h-[62dvh] flex-col justify-center">
      <h1 className="max-w-[15ch] pb-1 font-heading text-5xl font-normal italic leading-[1.05] tracking-[-0.03em] text-petroleum md:text-7xl">
        ¿Qué hago con este aparato?
      </h1>
      <p className="mt-6 max-w-[46ch] text-lg font-light leading-relaxed text-petroleum/75">
        Una foto basta: EcoPunto IA identifica tu electrónico, te dice qué
        hacer con él — riesgos incluidos — y a qué punto de Bogotá llevarlo.
      </p>
      <div className="mt-10">
        <Link
          href="/app/escanear"
          className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-8 py-4 text-base font-medium text-petroleum transition duration-200 hover:bg-white/50 active:scale-[0.97]"
        >
          <Camera size={20} weight="fill" />
          Identificar dispositivo
        </Link>
      </div>
      <p className="mt-20 text-sm text-petroleum/50">
        <Link
          href="/"
          className="underline decoration-petroleum/25 underline-offset-4 transition duration-100 ease-[var(--ease-out)] hover:text-petroleum"
        >
          Volver a la portada
        </Link>
      </p>
    </main>
  );
}
