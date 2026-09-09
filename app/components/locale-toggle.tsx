"use client";

import { useRouter } from "next/navigation";
import { setLocale } from "@/app/i18n/actions";
import type { Locale } from "@/lib/i18n/locale";

type Props = {
  locale: Locale;
  label: string;
};

const OPTIONS: { code: Locale; short: string }[] = [
  { code: "es", short: "ES" },
  { code: "en", short: "EN" },
];

const SEGMENT =
  "h-full place-items-center rounded-full px-2.5 transition-colors duration-100 motion-reduce:transition-none sm:px-3";

export function LocaleToggle({ locale, label }: Props) {
  const router = useRouter();
  const next: Locale = locale === "es" ? "en" : "es";

  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        void setLocale(next).then(() => router.refresh());
      }}
      className="liquid-glass inline-flex h-11 shrink-0 items-center gap-0.5 rounded-full p-1 text-xs font-semibold tracking-wide transition duration-100 ease-[var(--ease-out)] hover:bg-white/40 active:scale-[0.97] sm:h-12 motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      {OPTIONS.map(({ code, short }) => {
        const active = locale === code;
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
