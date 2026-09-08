import aprende from "@/data/seed/aprende.json";

export type AprendeTone = "default" | "hazard";

export type AprendeSection = {
  id: string;
  title: string;
  lede: string;
  paragraphs: string[];
  items: { text: string; tone: AprendeTone }[];
};

export const APRENDE_SECTIONS = aprende.sections as AprendeSection[];
