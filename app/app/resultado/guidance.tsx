"use client";

import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  MapPin,
  Warning,
  X,
} from "@phosphor-icons/react";
import { deviceFor, type DeviceType } from "@/lib/catalog/device-types";
import {
  applyConditions,
  CONDITION_KEYS,
  type Conditions,
} from "@/lib/catalog/conditions";
import type { WasteKind } from "@/lib/catalog/kinds";
import { useLocale, useMessages } from "@/app/components/locale-provider";
import { Mascot } from "@/app/components/mascot";

type Props = {
  kind: WasteKind;
  path: string | null;
  initialAnswers?: Conditions;
  onShowMap?: () => void;
};

const FLAG_KEYS = [
  "canUse",
  "canReuse",
  "canRepair",
  "canDonate",
  "canRecycle",
] as const;

const DONT_HAZARD = /basura|pinch|fuego|quem|trash|puncture|fire|burn/i;
const RISK_DANGER = /hinchad|incendio|fuego|fuga|swollen|fire|leak/i;
const DATA_LINE = /dato|sim|memoria|disco|fábrica|data|factory|disk|wipe|erase|reset/i;

type SectionId = "condition" | "flags" | "risks" | "dos" | "storage" | "data";

const btnBase =
  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition duration-100 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";
const btnPrimary = `${btnBase} bg-pine-600 text-white hover:bg-pine-600/90`;
const btnGhost = `${btnBase} liquid-glass-strong text-petroleum hover:bg-white/50`;

export function Guidance({
  kind,
  path,
  initialAnswers = {},
  onShowMap,
}: Props) {
  const locale = useLocale();
  const t = useMessages();
  const [conditions, setConditions] = useState<Conditions>(initialAnswers);
  const [step, setStep] = useState(0);

  useEffect(() => {
    setStep(0);
  }, [kind]);

  const device = useMemo(
    () => applyConditions(deviceFor(kind, locale), conditions, locale),
    [kind, conditions, locale],
  );

  const sections = useMemo<SectionId[]>(() => {
    const list: SectionId[] = ["condition", "flags", "risks", "dos", "storage"];
    if (device.wipeData || device.removeSim) list.push("data");
    return list;
  }, [device]);

  if (kind === "unknown") return null;

  const section = sections[Math.min(step, sections.length - 1)];
  const isFirst = step === 0;
  const isLast = step === sections.length - 1;

  function persist(next: Conditions) {
    if (!path) return;
    void fetch("/api/identifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ path, answers: next }),
    });
  }

  function answer(key: keyof Conditions, value: boolean) {
    setConditions((c) => {
      const next = { ...c, [key]: value };
      persist(next);
      return next;
    });
  }

  function skip() {
    const next: Conditions = {};
    setConditions(next);
    persist(next);
    setStep(1);
  }

  return (
    <section className="liquid-glass mt-6 max-w-2xl rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-medium tracking-wide text-petroleum/55 uppercase">
          {t.guidance.step
            .replace("{n}", String(step + 1))
            .replace("{total}", String(sections.length))}
        </p>
        <div className="flex gap-1.5" aria-hidden="true">
          {sections.map((s, i) => (
            <span
              key={s}
              className={`h-1.5 w-1.5 rounded-full ${
                i === step ? "bg-pine-600" : "bg-petroleum/20"
              }`}
            />
          ))}
        </div>
      </div>

      <h2 className="mt-3 font-heading text-2xl font-normal italic leading-tight tracking-[-0.01em] text-petroleum md:text-3xl">
        {t.guidance.titles[section]}
      </h2>

      <div className="mt-5">
        {section === "condition" && (
          <ConditionStep conditions={conditions} onAnswer={answer} />
        )}
        {section === "flags" && <FlagsStep device={device} />}
        {section === "risks" && <RisksStep device={device} />}
        {section === "dos" && <DosStep device={device} />}
        {section === "storage" && <StorageStep device={device} />}
        {section === "data" && <DataStep device={device} />}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        {!isFirst && (
          <button type="button" onClick={() => setStep(step - 1)} className={btnGhost}>
            <ArrowLeft size={16} weight="bold" />
            {t.common.back}
          </button>
        )}
        {isFirst && (
          <button type="button" onClick={skip} className={btnGhost}>
            {t.guidance.skip}
          </button>
        )}
        {!isLast && (
          <button
            type="button"
            onClick={() => setStep(Math.min(step + 1, sections.length - 1))}
            className={btnPrimary}
          >
            {t.guidance.next}
            <ArrowRight size={16} weight="bold" />
          </button>
        )}
        {isLast && onShowMap && (
          <span className="flex items-center gap-2 sm:gap-3">
            <Mascot pose="map" size="companion" className="shrink-0" />
            <button type="button" onClick={onShowMap} className={btnPrimary}>
              <MapPin size={16} weight="fill" />
              {t.guidance.seeMap}
            </button>
          </span>
        )}
      </div>
      {isFirst && (
        <p className="mt-3 text-xs font-light text-petroleum/55">
          {t.guidance.skipHint}
        </p>
      )}
    </section>
  );
}

function ConditionStep({
  conditions,
  onAnswer,
}: {
  conditions: Conditions;
  onAnswer: (key: keyof Conditions, value: boolean) => void;
}) {
  const t = useMessages();
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {CONDITION_KEYS.map((key) => (
        <fieldset key={key}>
          <legend className="text-sm font-medium text-petroleum">
            {t.guidance.questions[key]}
          </legend>
          <div className="mt-2 flex gap-4">
            {(
              [
                { value: true, label: t.common.yes },
                { value: false, label: t.common.no },
              ] as const
            ).map((opt) => (
              <label
                key={opt.label}
                className="flex cursor-pointer items-center gap-2 text-sm text-petroleum/80"
              >
                <input
                  type="radio"
                  name={key}
                  checked={conditions[key] === opt.value}
                  onChange={() => onAnswer(key, opt.value)}
                  className="size-4 accent-pine-600"
                />
                {opt.label}
              </label>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}

function FlagsStep({ device }: { device: DeviceType }) {
  const t = useMessages();
  return (
    <div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {FLAG_KEYS.map((key) => {
          const ok = device[key];
          return (
            <li
              key={key}
              className="liquid-glass flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium text-petroleum"
            >
              {ok ? (
                <Check size={16} weight="bold" className="shrink-0 text-pine-600" />
              ) : (
                <X size={16} weight="bold" className="shrink-0 text-petroleum/40" />
              )}
              <span className={ok ? "" : "text-petroleum/45"}>
                {t.guidance.flags[key]}
              </span>
            </li>
          );
        })}
      </ul>
      {device.specialHandling && (
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-warning">
          <Warning size={16} weight="fill" className="shrink-0" />
          {t.guidance.special}
        </p>
      )}
      <p className="mt-4 text-xs font-medium tracking-wide text-petroleum/55 uppercase">
        {device.wasteLabel}
      </p>
    </div>
  );
}

function RisksStep({ device }: { device: DeviceType }) {
  return (
    <ul className="space-y-2.5">
      {device.risks.map((risk) => (
        <li
          key={risk}
          className={`flex items-start gap-2 text-sm font-medium ${
            RISK_DANGER.test(risk) ? "text-danger" : "text-warning"
          }`}
        >
          <Warning size={16} weight="fill" className="mt-0.5 shrink-0" />
          {risk}
        </li>
      ))}
    </ul>
  );
}

function DosStep({ device }: { device: DeviceType }) {
  const t = useMessages();
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="text-xs font-medium tracking-wide text-petroleum/55 uppercase">
          {t.guidance.doThis}
        </h3>
        <ul className="mt-3 space-y-2.5">
          {device.dos.map((line) => (
            <li
              key={line}
              className="flex items-start gap-2 text-sm leading-relaxed text-petroleum"
            >
              <Check
                size={16}
                weight="bold"
                className="mt-0.5 shrink-0 text-pine-600"
              />
              {line}
            </li>
          ))}
        </ul>
      </div>
      <div>
        <h3 className="text-xs font-medium tracking-wide text-petroleum/55 uppercase">
          {t.guidance.avoidThis}
        </h3>
        <ul className="mt-3 space-y-2.5">
          {device.donts.map((line) => {
            const hazard = DONT_HAZARD.test(line);
            return (
              <li
                key={line}
                className={`flex items-start gap-2 text-sm leading-relaxed ${
                  hazard ? "font-medium text-warning" : "text-petroleum"
                }`}
              >
                <X
                  size={16}
                  weight="bold"
                  className={`mt-0.5 shrink-0 ${
                    hazard ? "text-warning" : "text-petroleum/50"
                  }`}
                />
                {line}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}

function StorageStep({ device }: { device: DeviceType }) {
  const t = useMessages();
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="text-xs font-medium tracking-wide text-petroleum/55 uppercase">
          {t.guidance.storage}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-petroleum">
          {device.storage}
        </p>
      </div>
      <div>
        <h3 className="text-xs font-medium tracking-wide text-petroleum/55 uppercase">
          {t.guidance.transport}
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-petroleum">
          {device.transport}
        </p>
      </div>
    </div>
  );
}

function DataStep({ device }: { device: DeviceType }) {
  const t = useMessages();
  const lines = device.dos.filter((line) => DATA_LINE.test(line));
  return (
    <div>
      <p className="text-sm font-medium text-petroleum">{t.guidance.beforeHandin}</p>
      <ul className="mt-3 space-y-2.5">
        {lines.map((line) => (
          <li
            key={line}
            className="flex items-start gap-2 text-sm leading-relaxed text-petroleum"
          >
            <Check
              size={16}
              weight="bold"
              className="mt-0.5 shrink-0 text-pine-600"
            />
            {line}
          </li>
        ))}
      </ul>
    </div>
  );
}
