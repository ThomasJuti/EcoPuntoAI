import catalog from "@/data/seed/device-types.json";
import type { WasteKind } from "@/lib/catalog/kinds";

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

const DEVICES = catalog.kinds as DeviceType[];

export function deviceFor(kind: WasteKind): DeviceType {
  const found = DEVICES.find((d) => d.id === kind);
  if (found) return found;
  const fallback = DEVICES.find((d) => d.id === "unknown");
  if (!fallback) throw new Error("catalog missing unknown");
  return fallback;
}
