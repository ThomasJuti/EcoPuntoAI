import es from "@/data/seed/device-types.json";
import en from "@/data/seed/device-types.en.json";
import type { Locale } from "@/lib/i18n/locale";

export type WasteKind =
  | "phones"
  | "computers"
  | "laptops"
  | "tablets"
  | "chargers"
  | "batteries"
  | "cells"
  | "headphones"
  | "tvs"
  | "printers"
  | "cables"
  | "peripherals"
  | "small_appliances"
  | "unknown";

export type KindRow = { id: WasteKind; label: string; blurb: string };

function rows(locale: Locale): KindRow[] {
  return (locale === "en" ? en : es).kinds as KindRow[];
}

export function wasteKinds(locale: Locale = "es"): KindRow[] {
  return rows(locale).map(({ id, label, blurb }) => ({ id, label, blurb }));
}

export const WASTE_KINDS = wasteKinds("es");

const KIND_IDS = new Set(WASTE_KINDS.map((k) => k.id));

export function isWasteKind(value: string): value is WasteKind {
  return KIND_IDS.has(value as WasteKind);
}

export function labelFor(kind: WasteKind, locale: Locale = "es") {
  return (
    wasteKinds(locale).find((k) => k.id === kind)?.label ??
    wasteKinds(locale).find((k) => k.id === "unknown")?.label ??
    "No sé qué es"
  );
}

export function blurbFor(kind: WasteKind, locale: Locale = "es") {
  return (
    wasteKinds(locale).find((k) => k.id === kind)?.blurb ??
    wasteKinds(locale).find((k) => k.id === "unknown")?.blurb ??
    "Elige la categoría a mano si la foto no alcanza."
  );
}
