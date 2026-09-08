"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  BatteryFull,
  BatteryMedium,
  CookingPot,
  Desktop,
  DeviceMobile,
  DeviceTablet,
  Headphones,
  Laptop,
  MapPin,
  Mouse,
  PlugCharging,
  Printer,
  Question,
  Television,
  Usb,
  type Icon,
} from "@phosphor-icons/react";
import {
  WASTE_KINDS,
  blurbFor,
  isWasteKind,
  labelFor,
  type WasteKind,
} from "@/lib/catalog/kinds";
import { Guidance } from "./guidance";

const KIND_ICONS: Record<WasteKind, Icon> = {
  phones: DeviceMobile,
  computers: Desktop,
  laptops: Laptop,
  tablets: DeviceTablet,
  chargers: PlugCharging,
  batteries: BatteryFull,
  cells: BatteryMedium,
  headphones: Headphones,
  tvs: Television,
  printers: Printer,
  cables: Usb,
  peripherals: Mouse,
  small_appliances: CookingPot,
  unknown: Question,
};

type Props = {
  kind: string | null;
  confidence: string | null;
  path: string | null;
};

export function Result({ kind, confidence, path }: Props) {
  const router = useRouter();

  const valid: WasteKind = kind && isWasteKind(kind) ? kind : "unknown";
  const mustPick = valid === "unknown";
  const KindIcon = KIND_ICONS[valid];

  const confidenceNumber = confidence ? Number(confidence) : NaN;
  const confidencePct =
    Number.isFinite(confidenceNumber) && confidenceNumber >= 0
      ? Math.round(confidenceNumber * (confidenceNumber <= 1 ? 100 : 1))
      : null;

  function onCorrect(event: React.ChangeEvent<HTMLSelectElement>) {
    const next = event.target.value;
    if (!isWasteKind(next)) return;
    if (path) {
      void fetch("/api/identifications", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path, kind: next }),
      });
    }
    const params = new URLSearchParams();
    params.set("kind", next);
    if (confidence) params.set("confidence", confidence);
    if (path) params.set("path", path);
    router.replace(`/app/resultado?${params.toString()}`);
  }

  return (
    <>
      <div className="liquid-glass mb-8 grid h-12 w-12 place-items-center rounded-2xl text-pine-600">
        <KindIcon size={24} weight="regular" />
      </div>

      <p className="text-xs font-medium tracking-wide text-petroleum/55 uppercase">
        {mustPick ? "No lo tenemos claro" : "Identificamos"}
      </p>
      <h1 className="mt-2 font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        {labelFor(valid)}
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        {blurbFor(valid)}
      </p>
      {!mustPick && confidencePct !== null && (
        <p className="mt-2 text-sm text-petroleum/55">
          Confianza: {confidencePct}%
        </p>
      )}

      <section className="liquid-glass mt-10 max-w-lg rounded-3xl p-6">
        <label
          htmlFor="kind"
          className="text-xs font-medium tracking-wide text-petroleum/55 uppercase"
        >
          {mustPick ? "Elige la categoría" : "¿No es? Corrige la categoría"}
        </label>
        <select
          id="kind"
          value={valid}
          onChange={onCorrect}
          className="liquid-glass-strong mt-3 w-full appearance-none rounded-full px-5 py-3 text-base font-medium text-petroleum transition duration-100 ease-[var(--ease-out)] hover:bg-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-600/50 motion-reduce:transition-none"
        >
          {WASTE_KINDS.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </select>
      </section>

      <Guidance kind={valid} />

      {!mustPick && (
        <div className="mt-8">
          <Link
            href={`/app/puntos?kind=${valid}`}
            className="inline-flex items-center gap-2 rounded-full bg-pine-600 px-6 py-3 text-sm font-medium text-white transition duration-100 ease-[var(--ease-out)] hover:bg-pine-600/90 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            <MapPin size={16} weight="fill" />
            Ver puntos en Bogotá
          </Link>
        </div>
      )}
    </>
  );
}
