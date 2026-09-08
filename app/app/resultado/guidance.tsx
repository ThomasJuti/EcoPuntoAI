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
import { applyConditions, type Conditions } from "@/lib/catalog/conditions";
import type { WasteKind } from "@/lib/catalog/kinds";

type Props = { kind: WasteKind; onShowMap?: () => void };

const QUESTIONS: { key: keyof Conditions; label: string }[] = [
  { key: "powersOn", label: "¿Enciende?" },
  { key: "broken", label: "¿Está roto?" },
  { key: "swollenBattery", label: "¿Batería hinchada?" },
  { key: "waterExposed", label: "¿Se mojó?" },
];

const FLAGS: {
  key: "canUse" | "canReuse" | "canRepair" | "canDonate" | "canRecycle";
  label: string;
}[] = [
  { key: "canUse", label: "Usarlo" },
  { key: "canReuse", label: "Reusarlo" },
  { key: "canRepair", label: "Repararlo" },
  { key: "canDonate", label: "Donarlo" },
  { key: "canRecycle", label: "Reciclarlo" },
];

const DONT_HAZARD = /basura|pinch|fuego|quem/i;
const RISK_DANGER = /hinchad|incendio|fuego|fuga/i;
const DATA_LINE = /dato|sim|memoria|disco|fábrica/i;

type SectionId = "condition" | "flags" | "risks" | "dos" | "storage" | "data";

const TITLES: Record<SectionId, string> = {
  condition: "¿Cómo está el aparato?",
  flags: "Qué se puede",
  risks: "Riesgos",
  dos: "Qué hacer y qué no",
  storage: "Guardar y transportar",
  data: "Tus datos",
};

const btnBase =
  "inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-medium transition duration-100 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";
const btnPrimary = `${btnBase} bg-pine-600 text-white hover:bg-pine-600/90`;
const btnGhost = `${btnBase} liquid-glass-strong text-petroleum hover:bg-white/50`;

export function Guidance({ kind, onShowMap }: Props) {
  const [conditions, setConditions] = useState<Conditions>({});
  const [step, setStep] = useState(0);

  useEffect(() => {
    setConditions({});
    setStep(0);
  }, [kind]);

  const device = useMemo(
    () => applyConditions(deviceFor(kind), conditions),
    [kind, conditions],
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

  function answer(key: keyof Conditions, value: boolean) {
    setConditions((c) => ({ ...c, [key]: value }));
  }

  function skip() {
    setConditions({});
    setStep(1);
  }

  return (
    <section className="liquid-glass mt-6 max-w-2xl rounded-3xl p-6 md:p-8">
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs font-medium tracking-wide text-petroleum/55 uppercase">
          Paso {step + 1} de {sections.length}
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
        {TITLES[section]}
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
            Atrás
          </button>
        )}
        {isFirst && (
          <button type="button" onClick={skip} className={btnGhost}>
            Saltar
          </button>
        )}
        {!isLast && (
          <button
            type="button"
            onClick={() => setStep(Math.min(step + 1, sections.length - 1))}
            className={btnPrimary}
          >
            Siguiente
            <ArrowRight size={16} weight="bold" />
          </button>
        )}
        {isLast && onShowMap && (
          <button type="button" onClick={onShowMap} className={btnPrimary}>
            <MapPin size={16} weight="fill" />
            Ver en el mapa
          </button>
        )}
      </div>
      {isFirst && (
        <p className="mt-3 text-xs font-light text-petroleum/55">
          Opcional. Si no sabes, salta y te mostramos los consejos generales.
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
  return (
    <div className="grid gap-5 sm:grid-cols-2">
      {QUESTIONS.map((q) => (
        <fieldset key={q.key}>
          <legend className="text-sm font-medium text-petroleum">
            {q.label}
          </legend>
          <div className="mt-2 flex gap-4">
            {(
              [
                { value: true, label: "Sí" },
                { value: false, label: "No" },
              ] as const
            ).map((opt) => (
              <label
                key={opt.label}
                className="flex cursor-pointer items-center gap-2 text-sm text-petroleum/80"
              >
                <input
                  type="radio"
                  name={q.key}
                  checked={conditions[q.key] === opt.value}
                  onChange={() => onAnswer(q.key, opt.value)}
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
  return (
    <div>
      <ul className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {FLAGS.map((f) => {
          const ok = device[f.key];
          return (
            <li
              key={f.key}
              className="liquid-glass flex items-center gap-2 rounded-2xl px-3 py-2.5 text-sm font-medium text-petroleum"
            >
              {ok ? (
                <Check size={16} weight="bold" className="shrink-0 text-pine-600" />
              ) : (
                <X size={16} weight="bold" className="shrink-0 text-petroleum/40" />
              )}
              <span className={ok ? "" : "text-petroleum/45"}>{f.label}</span>
            </li>
          );
        })}
      </ul>
      {device.specialHandling && (
        <p className="mt-4 flex items-center gap-2 text-sm font-medium text-warning">
          <Warning size={16} weight="fill" className="shrink-0" />
          Necesita manejo especial.
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
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="text-xs font-medium tracking-wide text-petroleum/55 uppercase">
          Haz esto
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
          Evita esto
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
  return (
    <div className="grid gap-6 md:grid-cols-2">
      <div>
        <h3 className="text-xs font-medium tracking-wide text-petroleum/55 uppercase">
          Cómo guardarlo
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-petroleum">
          {device.storage}
        </p>
      </div>
      <div>
        <h3 className="text-xs font-medium tracking-wide text-petroleum/55 uppercase">
          Cómo llevarlo
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-petroleum">
          {device.transport}
        </p>
      </div>
    </div>
  );
}

function DataStep({ device }: { device: DeviceType }) {
  const lines = device.dos.filter((line) => DATA_LINE.test(line));
  return (
    <div>
      <p className="text-sm font-medium text-petroleum">Antes de entregarlo:</p>
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
