import type { DeviceType } from "@/lib/catalog/device-types";

export type Conditions = {
  powersOn?: boolean;
  broken?: boolean;
  swollenBattery?: boolean;
  waterExposed?: boolean;
};

export const CONDITION_QUESTIONS: {
  key: keyof Conditions;
  label: string;
}[] = [
  { key: "powersOn", label: "¿Enciende?" },
  { key: "broken", label: "¿Está roto?" },
  { key: "swollenBattery", label: "¿Batería hinchada?" },
  { key: "waterExposed", label: "¿Se mojó?" },
];

const ANSWER_KEYS = CONDITION_QUESTIONS.map((q) => q.key);

export function parseAnswers(raw: unknown): Conditions {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const row = raw as Record<string, unknown>;
  const out: Conditions = {};
  for (const key of ANSWER_KEYS) {
    if (typeof row[key] === "boolean") out[key] = row[key];
  }
  return out;
}

export function formatAnsweredConditions(
  answers: Conditions,
): { label: string; value: "Sí" | "No" }[] {
  const out: { label: string; value: "Sí" | "No" }[] = [];
  for (const q of CONDITION_QUESTIONS) {
    const value = answers[q.key];
    if (typeof value === "boolean") {
      out.push({ label: q.label, value: value ? "Sí" : "No" });
    }
  }
  return out;
}

const SWOLLEN_STORAGE =
  "No la guardes. Aísla bornes, déjala en un recipiente no metálico y llévala ya a un punto de baterías.";
const SWOLLEN_TRANSPORT =
  "No la aplastes ni la pongas en el bolsillo. Caja rígida, bornes cubiertos, sin calor.";

function extraDonts(device: DeviceType, lines: string[]) {
  const set = new Set(device.donts);
  for (const line of lines) set.add(line);
  return [...set];
}

export function applyConditions(device: DeviceType, conditions: Conditions): DeviceType {
  const answered = Object.values(conditions).some((v) => v !== undefined);
  if (!answered) return device;

  let next: DeviceType = { ...device, dos: [...device.dos], donts: [...device.donts], risks: [...device.risks] };

  if (conditions.swollenBattery) {
    next = {
      ...next,
      canUse: false,
      canReuse: false,
      canDonate: false,
      specialHandling: true,
      storage: SWOLLEN_STORAGE,
      transport: SWOLLEN_TRANSPORT,
      donts: extraDonts(next, [
        "No la pinches ni la aplastes.",
        "No la guardes mucho tiempo.",
      ]),
    };
    if (!next.risks.includes("Batería dañada o hinchada")) {
      next.risks = ["Batería dañada o hinchada", ...next.risks];
    }
  }

  if (conditions.waterExposed) {
    next = {
      ...next,
      canUse: false,
      specialHandling: true,
      donts: extraDonts(next, ["No lo enciendas para ‘probarlo’ si se mojó."]),
    };
  }

  if (conditions.broken || conditions.powersOn === false) {
    next = { ...next, canUse: false };
  }

  return next;
}
