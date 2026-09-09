import es from "@/data/seed/device-types.json";
import en from "@/data/seed/device-types.en.json";
import type { WasteKind } from "@/lib/catalog/kinds";
import type { Locale } from "@/lib/i18n/locale";

export type DeviceType = {
  id: WasteKind;
  label: string;
  blurb: string;
  wasteLabel: string;
  canUse: boolean;
  canReuse: boolean;
  canRepair: boolean;
  canDonate: boolean;
  canRecycle: boolean;
  specialHandling: boolean;
  wipeData: boolean;
  removeSim: boolean;
  risks: string[];
  dos: string[];
  donts: string[];
  storage: string;
  transport: string;
};

function catalogFor(locale: Locale): DeviceType[] {
  return (locale === "en" ? en : es).kinds as DeviceType[];
}

export function deviceFor(kind: WasteKind, locale: Locale = "es"): DeviceType {
  const devices = catalogFor(locale);
  const found = devices.find((d) => d.id === kind);
  if (found) return found;
  const fallback = devices.find((d) => d.id === "unknown");
  if (!fallback) throw new Error("catalog missing unknown");
  return fallback;
}
