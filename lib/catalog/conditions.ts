import type { DeviceType } from "@/lib/catalog/device-types";
import type { Locale } from "@/lib/i18n/locale";

export type Conditions = {
  powersOn?: boolean;
  broken?: boolean;
  swollenBattery?: boolean;
  waterExposed?: boolean;
};

export const CONDITION_KEYS: (keyof Conditions)[] = [
  "powersOn",
  "broken",
  "swollenBattery",
  "waterExposed",
];

export const CONDITION_QUESTIONS: {
  key: keyof Conditions;
  label: string;
}[] = [
  { key: "powersOn", label: "¿Enciende?" },
  { key: "broken", label: "¿Está roto?" },
  { key: "swollenBattery", label: "¿Batería hinchada?" },
  { key: "waterExposed", label: "¿Se mojó?" },
];

const QUESTION_LABELS: Record<Locale, Record<keyof Conditions, string>> = {
  es: {
    powersOn: "¿Enciende?",
    broken: "¿Está roto?",
    swollenBattery: "¿Batería hinchada?",
    waterExposed: "¿Se mojó?",
  },
  en: {
    powersOn: "Does it turn on?",
    broken: "Is it broken?",
    swollenBattery: "Swollen battery?",
    waterExposed: "Did it get wet?",
  },
};

export function parseAnswers(raw: unknown): Conditions {
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return {};
  const row = raw as Record<string, unknown>;
  const out: Conditions = {};
  for (const key of CONDITION_KEYS) {
    if (typeof row[key] === "boolean") out[key] = row[key];
  }
  return out;
}

export function formatAnsweredConditions(
  answers: Conditions,
  locale: Locale = "es",
): { label: string; value: string }[] {
  const yes = locale === "en" ? "Yes" : "Sí";
  const no = locale === "en" ? "No" : "No";
  const out: { label: string; value: string }[] = [];
  for (const key of CONDITION_KEYS) {
    const value = answers[key];
    if (typeof value === "boolean") {
      out.push({ label: QUESTION_LABELS[locale][key], value: value ? yes : no });
    }
  }
  return out;
}

const OVERLAY: Record<
  Locale,
  {
    swollenStorage: string;
    swollenTransport: string;
    swollenDonts: string[];
    swollenRisk: string;
    waterDont: string;
  }
> = {
  es: {
    swollenStorage:
      "No la guardes. Aísla bornes, déjala en un recipiente no metálico y llévala ya a un punto de baterías.",
    swollenTransport:
      "No la aplastes ni la pongas en el bolsillo. Caja rígida, bornes cubiertos, sin calor.",
    swollenDonts: [
      "No la pinches ni la aplastes.",
      "No la guardes mucho tiempo.",
    ],
    swollenRisk: "Batería dañada o hinchada",
    waterDont: "No lo enciendas para ‘probarlo’ si se mojó.",
  },
  en: {
    swollenStorage:
      "Don’t store it. Isolate the terminals, leave it in a non-metal container, and take it to a battery point now.",
    swollenTransport:
      "Don’t crush it or put it in a pocket. Rigid box, terminals covered, no heat.",
    swollenDonts: [
      "Don’t puncture or crush it.",
      "Don’t store it for long.",
    ],
    swollenRisk: "Damaged or swollen battery",
    waterDont: "Don’t turn it on to ‘test it’ if it got wet.",
  },
};

function extraDonts(device: DeviceType, lines: string[]) {
  const set = new Set(device.donts);
  for (const line of lines) set.add(line);
  return [...set];
}

export function applyConditions(
  device: DeviceType,
  conditions: Conditions,
  locale: Locale = "es",
): DeviceType {
  const answered = Object.values(conditions).some((v) => v !== undefined);
  if (!answered) return device;

  const copy = OVERLAY[locale];
  let next: DeviceType = {
    ...device,
    dos: [...device.dos],
    donts: [...device.donts],
    risks: [...device.risks],
  };

  if (conditions.swollenBattery) {
    next = {
      ...next,
      canUse: false,
      canReuse: false,
      canDonate: false,
      specialHandling: true,
      storage: copy.swollenStorage,
      transport: copy.swollenTransport,
      donts: extraDonts(next, copy.swollenDonts),
    };
    if (!next.risks.includes(copy.swollenRisk)) {
      next.risks = [copy.swollenRisk, ...next.risks];
    }
  }

  if (conditions.waterExposed) {
    next = {
      ...next,
      canUse: false,
      specialHandling: true,
      donts: extraDonts(next, [copy.waterDont]),
    };
  }

  if (conditions.broken || conditions.powersOn === false) {
    next = { ...next, canUse: false };
  }

  return next;
}
