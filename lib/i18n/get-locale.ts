import { cookies, headers } from "next/headers";
import {
  LOCALE_COOKIE,
  isLocale,
  localeFromAcceptLanguage,
  type Locale,
} from "./locale";

export async function getLocale(): Promise<Locale> {
  const saved = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (saved && isLocale(saved)) return saved;
  return localeFromAcceptLanguage((await headers()).get("accept-language"));
}
