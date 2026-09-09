import type { Locale } from "./locale";

const HOUR_MAP: [RegExp, string][] = [
  [/Horario del centro comercial/g, "Mall hours"],
  [/Lun–Dom/g, "Mon–Sun"],
  [/Lun–Sáb/g, "Mon–Sat"],
  [/Lun–Vie/g, "Mon–Fri"],
];

export function formatPointHours(hours: string, locale: Locale): string {
  if (locale !== "en") return hours;
  return HOUR_MAP.reduce((text, [pattern, replacement]) => {
    return text.replace(pattern, replacement);
  }, hours);
}
