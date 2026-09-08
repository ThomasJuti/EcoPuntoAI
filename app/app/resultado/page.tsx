import type { Metadata } from "next";
import { ScanSmiley } from "@phosphor-icons/react/dist/ssr";
import { SignInForm } from "@/app/components/sign-in-form";
import { getUser } from "@/lib/supabase/server";
import { Result } from "./result";

export const metadata: Metadata = {
  title: "Resultado - EcoPunto IA",
};

export default async function ResultadoPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;
  const kind = first(params.kind) ?? null;
  const confidence = first(params.confidence) ?? null;
  const path = first(params.path) ?? null;

  const nextParams = new URLSearchParams();
  if (kind) nextParams.set("kind", kind);
  if (confidence) nextParams.set("confidence", confidence);
  if (path) nextParams.set("path", path);
  const next = nextParams.size
    ? `/app/resultado?${nextParams.toString()}`
    : "/app/resultado";

  const user = await getUser();

  if (!user) {
    return (
      <main className="flex min-h-[62dvh] flex-col justify-center">
        <div className="liquid-glass mb-8 grid h-12 w-12 place-items-center rounded-2xl text-pine-600">
          <ScanSmiley size={24} weight="regular" />
        </div>
        <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
          Resultado
        </h1>
        <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
          Entra con Google para ver qué identificamos.
        </p>
        <div className="mt-8">
          <SignInForm next={next} />
        </div>
      </main>
    );
  }

  return (
    <main>
      <Result kind={kind} confidence={confidence} path={path} />
    </main>
  );
}
