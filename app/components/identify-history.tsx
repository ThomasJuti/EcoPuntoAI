import Link from "next/link";
import {
  ArrowRight,
  BatteryFull,
  BatteryMedium,
  CookingPot,
  Desktop,
  DeviceMobile,
  DeviceTablet,
  Headphones,
  Laptop,
  Mouse,
  PlugCharging,
  Printer,
  Question,
  Television,
  Usb,
} from "@phosphor-icons/react/dist/ssr";
import { labelFor } from "@/lib/catalog/kinds";
import {
  listIdentifications,
  type IdentificationRecord,
} from "@/lib/identify/history";
import { createClient, resolveSessionUser } from "@/lib/supabase/server";

const KIND_ICONS = {
  phones: DeviceMobile,
  computers: Desktop,
  laptops: Laptop,
  tablets: DeviceTablet,
  chargers: PlugCharging,
  batteries: BatteryFull,
  cells: BatteryMedium,
  headphones: Headphones,
  tvs: Television,
  printers: Printer,
  cables: Usb,
  peripherals: Mouse,
  small_appliances: CookingPot,
  unknown: Question,
};

const dateFormat = new Intl.DateTimeFormat("es-CO", {
  day: "numeric",
  month: "short",
  year: "numeric",
});

function formatWhen(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return dateFormat.format(date);
}

function confidencePct(confidence: number): number | null {
  if (!Number.isFinite(confidence) || confidence <= 0) return null;
  return Math.round(confidence * (confidence <= 1 ? 100 : 1));
}

function historyHref(record: IdentificationRecord): string {
  const params = new URLSearchParams({
    kind: record.kind,
    confidence: String(record.confidence),
    path: record.path,
  });
  return `/app/resultado?${params.toString()}`;
}

function EmptyCard({ title, hint }: { title: string; hint: string }) {
  return (
    <div className="liquid-glass rounded-3xl p-6 md:p-8">
      <p className="text-sm leading-relaxed text-petroleum/75">{title}</p>
      <p className="mt-1 text-sm text-petroleum/55">{hint}</p>
    </div>
  );
}

export async function IdentifyHistory() {
  const user = await resolveSessionUser();
  if (!user) {
    return (
      <EmptyCard
        title="Entra con Google para ver tu historial."
        hint="Identificar pide sesión; ahí se guarda cada aparato."
      />
    );
  }

  const records = await listIdentifications(await createClient());
  if (records.length === 0) {
    return (
      <EmptyCard
        title="Todavía no identificas ningún aparato."
        hint="Toma o sube una foto para escanear tu primer electrónico."
      />
    );
  }

  return (
    <ul className="space-y-3">
      {records.map((record) => {
        const KindIcon = KIND_ICONS[record.kind];
        const when = formatWhen(record.at);
        const pct =
          record.kind !== "unknown" ? confidencePct(record.confidence) : null;
        return (
          <li key={record.path}>
            <Link
              href={historyHref(record)}
              className="liquid-glass flex items-center gap-4 rounded-3xl p-4 transition duration-100 ease-[var(--ease-out)] hover:bg-white/50 active:scale-[0.98] motion-reduce:transition-none motion-reduce:active:scale-100 md:p-5"
            >
              <span className="liquid-glass-strong grid h-11 w-11 shrink-0 place-items-center rounded-2xl text-pine-600">
                <KindIcon size={22} weight="regular" />
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-base font-medium text-petroleum">
                  {labelFor(record.kind)}
                </span>
                <span className="mt-0.5 block text-sm text-petroleum/55">
                  {when}
                  {pct !== null && ` · ${pct}% de confianza`}
                </span>
              </span>
              <ArrowRight
                size={18}
                weight="bold"
                className="shrink-0 text-petroleum/40"
              />
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
