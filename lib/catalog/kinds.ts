import catalog from "@/data/seed/device-types.json";

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

export const WASTE_KINDS = catalog.kinds as KindRow[];

const KIND_IDS = new Set(WASTE_KINDS.map((k) => k.id));

export function isWasteKind(value: string): value is WasteKind {
  return KIND_IDS.has(value as WasteKind);
}

export function labelFor(kind: WasteKind) {
  return WASTE_KINDS.find((k) => k.id === kind)?.label ?? "No sé qué es";
}

export function blurbFor(kind: WasteKind) {
  return (
    WASTE_KINDS.find((k) => k.id === kind)?.blurb ??
    "Elige la categoría a mano si la foto no alcanza."
  );
}
