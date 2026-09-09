"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "@phosphor-icons/react";
import { useMessages } from "@/app/components/locale-provider";

export function ResultBackButton() {
  const router = useRouter();
  const t = useMessages();

  function goBack() {
    const referrer = document.referrer;
    if (referrer) {
      try {
        if (new URL(referrer).origin === window.location.origin) {
          router.back();
          return;
        }
      } catch {
        // fall through to Inicio
      }
    }
    router.push("/app");
  }

  return (
    <button
      type="button"
      onClick={goBack}
      className="mb-6 inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium text-petroleum liquid-glass-strong transition duration-100 ease-[var(--ease-out)] hover:bg-white/50 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
    >
      <ArrowLeft size={16} weight="bold" />
      {t.common.back}
    </button>
  );
}
