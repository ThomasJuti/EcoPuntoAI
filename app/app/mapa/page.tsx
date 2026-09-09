import { Suspense } from "react";
import type { Metadata } from "next";
import { PointsBrowser } from "@/app/components/points-browser";
import { PointsBrowserSkeleton } from "@/app/components/ui-skeleton";
import { kindFromParam } from "@/lib/catalog/list";
import { loadPoints } from "@/lib/catalog/points";
import { getLocale } from "@/lib/i18n/get-locale";
import { messages } from "@/lib/i18n/messages";
import type { WasteKind } from "@/lib/catalog/kinds";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: messages[locale].map.metaTitle };
}

async function MapCatalog({ initialKind }: { initialKind: WasteKind }) {
  const catalog = await loadPoints();
  return <PointsBrowser catalog={catalog} initialKind={initialKind} />;
}

export default async function MapaPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  const raw = Array.isArray(params.kind) ? params.kind[0] : params.kind;
  const initialKind: WasteKind = kindFromParam(raw);
  const locale = await getLocale();
  const t = messages[locale].map;

  return (
    <main>
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        {t.title}
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        {t.lede}
      </p>
      <Suspense fallback={<PointsBrowserSkeleton />}>
        <MapCatalog initialKind={initialKind} />
      </Suspense>
    </main>
  );
}
