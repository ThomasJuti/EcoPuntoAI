"use client";

import { useState } from "react";
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
  Mouse,
  PlugCharging,
  Printer,
  Question,
  Television,
  Usb,
  type Icon,
} from "@phosphor-icons/react";
import {
  blurbFor,
  isWasteKind,
  labelFor,
  wasteKinds,
  type WasteKind,
} from "@/lib/catalog/kinds";
import type { Conditions } from "@/lib/catalog/conditions";
import { RecommendedPointModal } from "@/app/components/recommended-point-modal";
import { useLocale, useMessages } from "@/app/components/locale-provider";
import { Guidance } from "./guidance";
import { ResultBackButton } from "./result-back-button";

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
  answers?: Conditions;
};

export function Result({ kind, confidence, path, answers = {} }: Props) {
  const router = useRouter();
  const [mapOpen, setMapOpen] = useState(false);
  const locale = useLocale();
  const t = useMessages();
  const kinds = wasteKinds(locale);

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
      <ResultBackButton />

      <div className="liquid-glass mb-8 grid h-12 w-12 place-items-center rounded-2xl text-grey">
        <KindIcon size={24} weight="regular" />
      </div>

      <p className="text-xs font-medium tracking-wide text-petroleum/55 uppercase">
        {mustPick ? t.result.unclear : t.result.identified}
      </p>
      <h1 className="mt-2 font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        {labelFor(valid, locale)}
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        {blurbFor(valid, locale)}
      </p>
      {!mustPick && confidencePct !== null && (
        <p className="mt-2 text-sm text-petroleum/55">
          {t.result.confidence}: {confidencePct}%
        </p>
      )}

      <section className="liquid-glass mt-10 max-w-lg rounded-3xl p-6">
        <label
          htmlFor="kind"
          className="text-xs font-medium tracking-wide text-petroleum/55 uppercase"
        >
          {mustPick ? t.result.pick : t.result.correct}
        </label>
        <select
          id="kind"
          value={valid}
          onChange={onCorrect}
          className="liquid-glass-strong mt-3 w-full appearance-none rounded-full px-5 py-3 text-base font-medium text-petroleum transition duration-100 ease-[var(--ease-out)] hover:bg-white/50 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-600/50 motion-reduce:transition-none"
        >
          {kinds.map((k) => (
            <option key={k.id} value={k.id}>
              {k.label}
            </option>
          ))}
        </select>
      </section>

      <Guidance
        kind={valid}
        path={path}
        initialAnswers={answers}
        onShowMap={() => setMapOpen(true)}
      />

      {!mustPick && (
        <RecommendedPointModal
          kind={valid}
          open={mapOpen}
          onClose={() => setMapOpen(false)}
        />
      )}
    </>
  );
}
