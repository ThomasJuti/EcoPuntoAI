"use client";

import { useEffect, useRef, useState } from "react";
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

const SLIDE_MS = 250;

function writeLocaleCookie(locale: Locale) {
  document.cookie = `${LOCALE_COOKIE}=${locale};path=/;max-age=${60 * 60 * 24 * 365};samesite=lax`;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function LocaleToggle({ locale, label }: Props) {
  const router = useRouter();
  const [current, setCurrent] = useState(locale);
  const currentRef = useRef(locale);
  const refreshTimer = useRef<number | null>(null);

  useEffect(() => {
    currentRef.current = locale;
    setCurrent(locale);
  }, [locale]);

  function switchLocale() {
    const next: Locale = currentRef.current === "es" ? "en" : "es";
    currentRef.current = next;
    setCurrent(next);
    writeLocaleCookie(next);

    if (refreshTimer.current !== null) {
      window.clearTimeout(refreshTimer.current);
    }

    const delay = prefersReducedMotion() ? 0 : SLIDE_MS;
    refreshTimer.current = window.setTimeout(() => {
      void setLocale(next);
      router.refresh();
    }, delay);
  }

  return (
    <button
      type="button"
      aria-label={label}
      onClick={switchLocale}
      className="liquid-glass relative isolate grid h-11 shrink-0 grid-cols-1 items-stretch rounded-full p-1 text-[11px] font-semibold tracking-wide transition-[background-color] duration-100 ease-[var(--ease-out)] hover:bg-white/40 sm:h-12 sm:grid-cols-2 sm:text-xs"
    >
      <span
        aria-hidden
        className={`pointer-events-none absolute inset-y-1 left-1 hidden w-[calc(50%-0.25rem)] rounded-full bg-petroleum transition-transform duration-[250ms] ease-[var(--ease-in-out)] motion-reduce:transition-none sm:block ${
          current === "en" ? "translate-x-full" : "translate-x-0"
        }`}
      />
      {OPTIONS.map(({ code, short }) => (
        <span
          key={code}
          className={`relative z-10 place-items-center px-2.5 transition-colors duration-[250ms] ease-[var(--ease-in-out)] sm:px-3 motion-reduce:transition-none ${
            current === code
              ? "grid text-white sm:text-white"
              : "hidden text-petroleum/40 sm:grid"
          }`}
        >
          {short}
        </span>
      ))}
    </button>
  );
}
