import type { Metadata } from "next";
import Link from "next/link";
import { Camera, CaretLeft, MapPin } from "@phosphor-icons/react/dist/ssr";

export const metadata: Metadata = {
  title: "EcoPunto IA - App",
};

const ROWS = [
  {
    icon: Camera,
    title: "Escáner",
    detail: "Identifica el aparato con una foto",
  },
  {
    icon: MapPin,
    title: "Mapa de puntos",
    detail: "Dónde llevarlo en Bogotá",
  },
] as const;

export default function AppPage() {
  return (
    <main className="min-h-[100dvh] bg-grouped">
      <header className="liquid-glass sticky top-0 z-10">
        <div className="mx-auto flex h-12 max-w-lg items-center px-1">
          <Link
            href="/"
            className="inline-flex items-center gap-0.5 rounded-lg px-2 py-1.5 text-[17px] font-medium text-pine-600 transition duration-150 ease-[var(--ease-out)] active:scale-[0.97]"
          >
            <CaretLeft size={22} weight="bold" />
            Inicio
          </Link>
        </div>
      </header>

      <div className="mx-auto max-w-lg px-4 pb-16 pt-6">
        <p className="text-[13px] font-medium uppercase tracking-[0.06em] text-petroleum/45">
          EcoPunto IA
        </p>
        <h1 className="mt-1 text-[34px] font-semibold leading-[1.1] tracking-[-0.02em] text-petroleum">
          En construcción
        </h1>
        <p className="mt-2 text-[17px] font-light leading-relaxed text-petroleum/60">
          El escáner y el mapa de puntos viven aquí. Mientras tanto, esto es lo
          que llega.
        </p>

        <ul className="mt-8 overflow-hidden rounded-[20px] bg-white">
          {ROWS.map((row) => (
            <li
              key={row.title}
              className="flex items-center gap-3 border-b border-black/[0.06] px-4 py-3.5 last:border-b-0"
            >
              <span className="grid size-9 place-items-center rounded-[10px] bg-pine-600 text-white">
                <row.icon size={20} weight="fill" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[17px] font-medium text-petroleum">
                  {row.title}
                </p>
                <p className="text-[13px] text-petroleum/50">{row.detail}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
