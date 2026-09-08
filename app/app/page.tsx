import { Suspense } from "react";
import type { Metadata } from "next";
import { Capture } from "@/app/app/escanear/capture";
import { IdentifyHistory } from "@/app/components/identify-history";
import { SignInForm } from "@/app/components/sign-in-form";
import { HistoryRowsSkeleton } from "@/app/components/ui-skeleton";
import { resolveSessionUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Inicio - EcoPunto IA",
};

export default async function AppHomePage() {
  const signedIn = Boolean(await resolveSessionUser());

  return (
    <main>
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        Inicio
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        Una foto identifica tu aparato y te dice a qué punto de Bogotá
        llevarlo.
      </p>

      {signedIn ? (
        <Capture />
      ) : (
        <div className="mt-8">
          <SignInForm next="/app" />
        </div>
      )}

      <section className="mt-20 md:mt-24">
        <h2 className="font-heading text-2xl font-normal italic leading-tight tracking-[-0.01em] text-petroleum md:text-3xl">
          Historial
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
