"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { setLocale } from "@/app/i18n/actions";
import { LOCALE_COOKIE, type Locale } from "@/lib/i18n/locale";

type Props = {
  locale: Locale;
  label: string;
};

const OPTIONS: { code: Locale; short: string }[] = [
  { code: "es", short: "ES" },
  { code: "en", short: "EN" },
];

const SEGMENT =
  "h-full place-items-center rounded-full px-2.5 sm:px-3";

function writeLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

export function LocaleToggle({ locale, label }: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(locale);

  useEffect(() => {
    setCurrent(locale);
  }, [locale]);

  function switchLocale() {
    const next: Locale = current === "es" ? "en" : "es";
    setCurrent(next);
    writeLocaleCookie(next);
    void setLocale(next);
    router.refresh();
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={switchLocale}
      className="liquid-glass inline-flex h-11 shrink-0 items-center gap-0.5 rounded-full p-1 text-xs font-semibold tracking-wide transition duration-100 ease-[var(--ease-out)] hover:bg-white/40 active:scale-[0.97] sm:h-12 motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      {OPTIONS.map(({ code, short }) => {
        const active = current === code;
        return (
          <span
            key={code}
            className={
              active
                ? `grid ${SEGMENT} bg-petroleum text-white`
                : `hidden ${SEGMENT} text-petroleum/40 sm:grid`
            }
          >
            {short}
          </span>
        );
      })}
    </button>
  );
}
