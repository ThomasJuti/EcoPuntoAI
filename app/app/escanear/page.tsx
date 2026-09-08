import type { Metadata } from "next";
import { Camera } from "@phosphor-icons/react/dist/ssr";
import { SignInForm } from "@/app/components/sign-in-form";
import { getUser } from "@/lib/supabase/server";
import { Capture } from "./capture";

export const metadata: Metadata = {
  title: "Escanear - EcoPunto IA",
};

export default async function EscanearPage() {
  const user = await getUser();

  if (!user) {
    return (
      <main className="flex min-h-[62dvh] flex-col justify-center">
        <div className="liquid-glass mb-8 grid h-12 w-12 place-items-center rounded-2xl text-pine-600">
          <Camera size={24} weight="regular" />
        </div>
        <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
          Identificar
        </h1>
        <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
          Entra con Google para tomar o subir una foto. Sin sesión no se sube
          nada.
        </p>
        <div className="mt-8">
          <SignInForm next="/app/escanear" />
        </div>
      </main>
    );
  }

  return (
    <main>
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        Identificar
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        Toma o sube una foto del aparato para identificarlo.
      </p>
      <Capture />
    </main>
  );
}
