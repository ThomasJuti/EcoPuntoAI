import es from "@/data/seed/aprende.json";
import en from "@/data/seed/aprende.en.json";
import type { Locale } from "@/lib/i18n/locale";

export type AprendeTone = "default" | "hazard";

export type AprendeSection = {
  id: string;
  title: string;
  lede: string;
  paragraphs: string[];
  items: { text: string; tone: AprendeTone }[];
};

export function aprendeSections(locale: Locale = "es"): AprendeSection[] {
  return (locale === "en" ? en : es).sections as AprendeSection[];
}

export const APRENDE_SECTIONS = aprendeSections("es");
