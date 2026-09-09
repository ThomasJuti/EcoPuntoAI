import type { Metadata } from "next";
import { ScanSmiley } from "@phosphor-icons/react/dist/ssr";
import { SignInForm } from "@/app/components/sign-in-form";
import { getIdentification } from "@/lib/identify/history";
import { getLocale } from "@/lib/i18n/get-locale";
import { messages } from "@/lib/i18n/messages";
import { createClient, getUser } from "@/lib/supabase/server";
import { Result } from "./result";
import { ResultBackButton } from "./result-back-button";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: messages[locale].result.metaTitle };
}

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
  const locale = await getLocale();
  const t = messages[locale];
  const saved =
    user && path ? await getIdentification(await createClient(), path) : null;

  if (!user) {
    return (
      <main className="flex min-h-[62dvh] flex-col justify-center">
        <ResultBackButton />
        <div className="liquid-glass mb-8 grid h-12 w-12 place-items-center rounded-2xl text-pine-600">
          <ScanSmiley size={24} weight="regular" />
        </div>
        <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
          {t.result.title}
        </h1>
        <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
          {t.result.signInLede}
        </p>
        <div className="mt-8">
          <SignInForm next={next} label={t.signIn.google} />
        </div>
      </main>
    );
  }

  return (
    <main>
      <Result
        kind={kind}
        confidence={confidence}
        path={path}
        answers={saved?.answers ?? {}}
      />
    </main>
  );
}
