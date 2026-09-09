import { Suspense } from "react";
import type { Metadata } from "next";
import { Capture } from "@/app/app/escanear/capture";
import { IdentifyHistory } from "@/app/components/identify-history";
import { SignInForm } from "@/app/components/sign-in-form";
import { HistoryRowsSkeleton } from "@/app/components/ui-skeleton";
import { getLocale } from "@/lib/i18n/get-locale";
import { messages } from "@/lib/i18n/messages";
import { resolveSessionUser } from "@/lib/supabase/server";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: `${messages[locale].home.title} - EcoPunto IA` };
}

export default async function AppHomePage() {
  const locale = await getLocale();
  const t = messages[locale];
  const signedIn = Boolean(await resolveSessionUser());

  return (
    <main>
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        {t.home.title}
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        {t.home.lede}
      </p>

      {signedIn ? (
        <Capture copy={t.capture} />
      ) : (
        <div className="mt-8">
          <SignInForm next="/app" label={t.signIn.google} />
        </div>
      )}

      <section className="mt-5 md:mt-6">
        <h2 className="font-heading text-2xl font-normal italic leading-tight tracking-[-0.01em] text-petroleum md:text-3xl">
          {t.home.history}
        </h2>
        <div className="mt-5">
          <Suspense fallback={<HistoryRowsSkeleton />}>
            <IdentifyHistory />
          </Suspense>
        </div>
      </section>
    </main>
  );
}
