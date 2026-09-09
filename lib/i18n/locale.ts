export const LOCALE_COOKIE = "ecopunto-locale";

export type Locale = "es" | "en";

export function isLocale(value: string): value is Locale {
  return value === "es" || value === "en";
}

export function localeFromAcceptLanguage(header: string | null | undefined): Locale {
  if (!header?.trim()) return "es";
  const parts = header.split(",").map((chunk) => {
    const [tagRaw, ...params] = chunk.trim().split(";");
    const tag = (tagRaw ?? "").trim().toLowerCase();
    const qRaw = params.find((p) => p.trim().startsWith("q="))?.trim().slice(2);
    const q = qRaw === undefined || qRaw === "" ? 1 : Number(qRaw);
    return { tag, q: Number.isFinite(q) ? q : 0 };
  });
  parts.sort((a, b) => b.q - a.q);
  for (const { tag } of parts) {
    if (!tag || tag === "*") continue;
    if (tag === "en" || tag.startsWith("en-")) return "en";
    if (tag === "es" || tag.startsWith("es-")) return "es";
  }
  return "es";
}
