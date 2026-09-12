"use client";

import {
  ArrowUpRight,
  Clock,
  MapPin,
  Phone,
  Star,
} from "@phosphor-icons/react";
import { labelFor } from "@/lib/catalog/kinds";
import { mapsUrl, type RankedPoint } from "@/lib/catalog/ranking";
import { formatPointHours } from "@/lib/i18n/hours";
import { ReportPoint } from "./report-point";
import { useLocale, useMessages } from "./locale-provider";

export function PointCard({ point }: { point: RankedPoint }) {
  const locale = useLocale();
  const t = useMessages();
  const kmFormat = new Intl.NumberFormat(locale === "en" ? "en-US" : "es-CO", {
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  });
  return (
    <article className="liquid-glass flex h-full flex-col rounded-3xl p-5 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <h3 className="text-base font-semibold leading-snug text-petroleum">
          {point.name}
        </h3>
        {point.recommended && (
          <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-petroleum px-2.5 py-1 text-xs font-medium text-white">
            <Star size={12} weight="fill" />
            {t.point.recommended}
          </span>
        )}
      </div>

      <p className="mt-1.5 text-sm leading-relaxed text-petroleum/70">
        {point.address} · {point.locality}
      </p>

      <ul className="mt-4 space-y-1.5 text-sm text-petroleum/75">
        <li className="flex items-center gap-2">
          <MapPin size={15} className="shrink-0 text-grey" />
          <span>
            <strong className="font-semibold text-petroleum">
              {kmFormat.format(point.km)} km
            </strong>{" "}
            {t.point.distance}
          </span>
        </li>
        <li className="flex items-center gap-2">
          <Clock size={15} className="shrink-0 text-grey" />
          {formatPointHours(point.hours, locale)}
        </li>
        {point.contact && (
          <li className="flex items-center gap-2">
            <Phone size={15} className="shrink-0 text-grey" />
            {point.contact}
          </li>
        )}
      </ul>

      <ul className="mt-4 flex flex-wrap gap-1.5" aria-label={t.point.acceptsAria}>
        {point.accepted.map((kind) => (
          <li
            key={kind}
            className="rounded-full bg-petroleum/10 px-2.5 py-1 text-xs font-medium text-petroleum/80"
          >
            {labelFor(kind, locale)}
          </li>
        ))}
      </ul>

      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <span className="inline-flex items-center gap-1.5 text-xs font-medium">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 rounded-full ${
              point.isActive ? "bg-pine-600" : "bg-petroleum/30"
            }`}
          />
          <span className={point.isActive ? "text-pine-600" : "text-petroleum/50"}>
            {point.isActive ? t.point.available : t.point.unavailable}
          </span>
        </span>
        <a
          href={mapsUrl(point)}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1.5 rounded-full bg-pine-600 px-4 py-2 text-sm font-medium text-white transition duration-100 ease-[var(--ease-out)] hover:bg-pine-600/90 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          {t.point.directions}
          <ArrowUpRight size={14} weight="bold" />
        </a>
      </div>

      <div className="mt-3">
        <ReportPoint pointId={point.id} pointName={point.name} />
      </div>
    </article>
  );
}
