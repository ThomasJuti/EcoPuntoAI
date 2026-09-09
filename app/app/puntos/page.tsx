import { Suspense } from "react";
import type { Metadata } from "next";
import { PointsBrowser } from "@/app/components/points-browser";
import { PointsBrowserSkeleton } from "@/app/components/ui-skeleton";
import { kindFromParam, originFromParams, type PointsOrigin } from "@/lib/catalog/list";
import { loadPoints } from "@/lib/catalog/points";
import { labelFor, type WasteKind } from "@/lib/catalog/kinds";
import { getLocale } from "@/lib/i18n/get-locale";
import { messages } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: messages[locale].dropoff.metaTitle };
}

async function PuntosCatalog({
  kind,
  initialOrigin,
}: {
  kind: WasteKind;
  initialOrigin: PointsOrigin;
}) {
  const catalog = await loadPoints();
  return (
    <PointsBrowser
      catalog={catalog}
      initialKind={kind}
      initialOrigin={initialOrigin}
    />
  );
}

export default async function PuntosPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const first = (value: string | string[] | undefined) =>
    Array.isArray(value) ? value[0] : value;

  const kind = kindFromParam(first(params.kind));
  const locale = await getLocale();
  const t = messages[locale].dropoff;
  const initialOrigin = originFromParams({
    lat: first(params.lat),
    lng: first(params.lng),
    locality: first(params.locality),
  });

  return (
    <main>
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        {t.title}
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        {kind === "unknown"
          ? t.allLede
          : t.kindLede.replace("{kind}", labelFor(kind, locale))}
      </p>
      <Suspense fallback={<PointsBrowserSkeleton />}>
        <PuntosCatalog kind={kind} initialOrigin={initialOrigin} />
      </Suspense>
    </main>
  );
}
