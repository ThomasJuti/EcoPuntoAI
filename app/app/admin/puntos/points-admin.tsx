"use client";

import { useState } from "react";
import {
  MapPin,
  PencilSimple,
  Plus,
  SpinnerGap,
  X,
} from "@phosphor-icons/react";
import { wasteKinds, type WasteKind } from "@/lib/catalog/kinds";
import type { CollectionPoint } from "@/lib/catalog/ranking";
import { useLocale, useMessages } from "@/app/components/locale-provider";

type FormState = {
  name: string;
  address: string;
  lat: string;
  lng: string;
  locality: string;
  hours: string;
  contact: string;
  accepted: WasteKind[];
  isActive: boolean;
};

const EMPTY_FORM: FormState = {
  name: "",
  address: "",
  lat: "",
  lng: "",
  locality: "",
  hours: "",
  contact: "",
  accepted: [],
  isActive: true,
};

function formFromPoint(point: CollectionPoint): FormState {
  return {
    name: point.name,
    address: point.address,
    lat: String(point.lat),
    lng: String(point.lng),
    locality: point.locality,
    hours: point.hours,
    contact: point.contact ?? "",
    accepted: point.accepted,
    isActive: point.isActive,
  };
}

type LoadState =
  | { type: "ready"; points: CollectionPoint[]; warning?: string }
  | { type: "forbidden" }
  | { type: "error"; message: string };

const inputClass =
  "liquid-glass-strong w-full rounded-2xl px-4 py-2.5 text-sm text-petroleum placeholder:text-petroleum/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-600/50";
const labelClass =
  "block text-xs font-medium tracking-wide text-petroleum/55 uppercase";
const btnBase =
  "inline-flex items-center gap-1.5 rounded-full text-sm font-medium transition duration-100 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";
const spinner = "animate-spin motion-reduce:animate-none";

export function PointsAdmin({
  initialPoints,
  warning,
}: {
  initialPoints: CollectionPoint[];
  warning?: string;
}) {
  const t = useMessages();
  const locale = useLocale();
  const kinds = wasteKinds(locale).filter((k) => k.id !== "unknown");
  const [state, setState] = useState<LoadState>({
    type: "ready",
    points: initialPoints,
    warning,
  });
  const [editing, setEditing] = useState<string | "new" | null>(null);
  const [form, setForm] = useState<FormState>(EMPTY_FORM);
  const [saving, setSaving] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  function startCreate() {
    setForm(EMPTY_FORM);
    setFormError(null);
    setEditing("new");
  }

  function startEdit(point: CollectionPoint) {
    setForm(formFromPoint(point));
    setFormError(null);
    setEditing(point.id);
  }

  function cancelEdit() {
    setEditing(null);
    setFormError(null);
  }

  function toggleKind(kind: WasteKind) {
    setForm((f) => ({
      ...f,
      accepted: f.accepted.includes(kind)
        ? f.accepted.filter((k) => k !== kind)
        : [...f.accepted, kind],
    }));
  }

  function payload() {
    return {
      name: form.name.trim(),
      address: form.address.trim(),
      lat: Number(form.lat),
      lng: Number(form.lng),
      locality: form.locality.trim(),
      hours: form.hours.trim(),
      contact: form.contact.trim(),
      accepted: form.accepted,
      isActive: form.isActive,
    };
  }

  async function save(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (state.type !== "ready" || editing === null) return;
    setSaving(true);
    setFormError(null);
    try {
      const isNew = editing === "new";
      const res = await fetch(
        isNew ? "/api/admin/points" : `/api/admin/points/${editing}`,
        {
          method: isNew ? "POST" : "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload()),
        },
      );
      const json = (await res.json().catch(() => null)) as {
        point?: CollectionPoint;
        error?: string;
      } | null;
      if (res.status === 403) {
        setState({ type: "forbidden" });
        return;
      }
      if (!res.ok) {
        setFormError(json?.error ?? t.admin.saveError);
        return;
      }
      if (isNew && json?.point) {
        setState((s) =>
          s.type === "ready"
            ? {
                type: "ready",
                points: [json.point as CollectionPoint, ...s.points],
                warning: s.warning,
              }
            : s,
        );
      } else if (!isNew) {
        const body = payload();
        setState((s) =>
          s.type === "ready"
            ? {
                type: "ready",
                warning: s.warning,
                points: s.points.map((p) =>
                  p.id === editing
                    ? {
                        ...p,
                        ...body,
                        contact: body.contact || null,
                        lastVerifiedAt: new Date().toISOString().slice(0, 10),
                      }
                    : p,
                ),
              }
            : s,
        );
      }
      setEditing(null);
    } catch {
      setFormError(t.admin.saveError);
    } finally {
      setSaving(false);
    }
  }

  async function setActive(point: CollectionPoint, active: boolean) {
    if (state.type !== "ready") return;
    setBusyId(point.id);
    try {
      const res = await fetch(
        `/api/admin/points/${point.id}`,
        active
          ? {
              method: "PATCH",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ isActive: true }),
            }
          : { method: "DELETE" },
      );
      if (res.status === 403) {
        setState({ type: "forbidden" });
        return;
      }
      if (!res.ok) return;
      setState((s) =>
        s.type === "ready"
          ? {
              type: "ready",
              warning: s.warning,
              points: s.points.map((p) =>
                p.id === point.id ? { ...p, isActive: active } : p,
              ),
            }
          : s,
      );
    } finally {
      setBusyId(null);
    }
  }

  if (state.type === "forbidden") {
    return (
      <div className="liquid-glass mt-10 max-w-xl rounded-3xl p-6">
        <p className="text-sm font-medium text-petroleum">{t.admin.forbidden}</p>
      </div>
    );
  }

  if (state.type === "error") {
    return (
      <div className="liquid-glass mt-10 max-w-xl rounded-3xl p-6">
        <p className="text-sm font-medium text-petroleum">{state.message}</p>
      </div>
    );
  }

  const { points, warning: notice } = state;

  return (
    <div className="mt-10">
      {notice && (
        <p
          role="status"
          className="mb-6 max-w-2xl text-sm leading-relaxed text-petroleum/70"
        >
          {notice}
        </p>
      )}
      {editing === null && (
        <button
          type="button"
          onClick={startCreate}
          className={`${btnBase} bg-pine-600 px-5 py-2.5 text-white hover:bg-pine-600/90`}
        >
          <Plus size={16} weight="bold" />
          {t.admin.newPoint}
        </button>
      )}

      {editing !== null && (
        <form
          onSubmit={save}
          className="liquid-glass max-w-2xl rounded-3xl p-6 md:p-8"
        >
          <h2 className="font-heading text-2xl font-normal italic leading-tight tracking-[-0.01em] text-petroleum">
            {editing === "new" ? t.admin.newPoint : t.admin.editPoint}
          </h2>

          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <label htmlFor="point-name" className={labelClass}>
                {t.admin.name}
              </label>
              <input
                id="point-name"
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className={`${inputClass} mt-2`}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="point-address" className={labelClass}>
                {t.admin.address}
              </label>
              <input
                id="point-address"
                type="text"
                required
                value={form.address}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
                className={`${inputClass} mt-2`}
              />
            </div>
            <div>
              <label htmlFor="point-lat" className={labelClass}>
                {t.admin.lat}
              </label>
              <input
                id="point-lat"
                type="number"
                step="any"
                required
                value={form.lat}
                onChange={(e) => setForm((f) => ({ ...f, lat: e.target.value }))}
                placeholder="4.65"
                className={`${inputClass} mt-2`}
              />
            </div>
            <div>
              <label htmlFor="point-lng" className={labelClass}>
                {t.admin.lng}
              </label>
              <input
                id="point-lng"
                type="number"
                step="any"
                required
                value={form.lng}
                onChange={(e) => setForm((f) => ({ ...f, lng: e.target.value }))}
                placeholder="-74.08"
                className={`${inputClass} mt-2`}
              />
            </div>
            <div>
              <label htmlFor="point-locality" className={labelClass}>
                {t.admin.locality}
              </label>
              <input
                id="point-locality"
                type="text"
                required
                value={form.locality}
                onChange={(e) =>
                  setForm((f) => ({ ...f, locality: e.target.value }))
                }
                placeholder="Kennedy"
                className={`${inputClass} mt-2`}
              />
            </div>
            <div>
              <label htmlFor="point-hours" className={labelClass}>
                {t.admin.hours}
              </label>
              <input
                id="point-hours"
                type="text"
                required
                value={form.hours}
                onChange={(e) =>
                  setForm((f) => ({ ...f, hours: e.target.value }))
                }
                placeholder={t.admin.hoursPlaceholder}
                className={`${inputClass} mt-2`}
              />
            </div>
            <div className="sm:col-span-2">
              <label htmlFor="point-contact" className={labelClass}>
                {t.admin.contact}
              </label>
              <input
                id="point-contact"
                type="text"
                value={form.contact}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contact: e.target.value }))
                }
                placeholder={t.admin.contactPlaceholder}
                className={`${inputClass} mt-2`}
              />
            </div>
          </div>

          <fieldset className="mt-5">
            <legend className={labelClass}>{t.admin.accepts}</legend>
            <div className="mt-3 flex flex-wrap gap-2">
              {kinds.map((kind) => {
                const checked = form.accepted.includes(kind.id);
                return (
                  <label
                    key={kind.id}
                    className={`flex cursor-pointer items-center gap-2 rounded-full px-3.5 py-2 text-sm font-medium transition duration-100 ease-[var(--ease-out)] ${
                      checked
                        ? "bg-pine-600 text-white"
                        : "liquid-glass-strong text-petroleum/70 hover:bg-white/50"
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleKind(kind.id)}
                      className="sr-only"
                    />
                    {kind.label}
                  </label>
                );
              })}
            </div>
          </fieldset>

          <label className="mt-5 flex cursor-pointer items-center gap-2 text-sm font-medium text-petroleum">
            <input
              type="checkbox"
              checked={form.isActive}
              onChange={(e) =>
                setForm((f) => ({ ...f, isActive: e.target.checked }))
              }
              className="size-4 accent-pine-600"
            />
            {t.admin.activeMap}
          </label>

          {formError && (
            <p role="alert" className="mt-4 text-sm font-medium text-danger">
              {formError}
            </p>
          )}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="submit"
              disabled={saving}
              className={`${btnBase} bg-pine-600 px-5 py-2.5 text-white hover:bg-pine-600/90 disabled:cursor-wait disabled:opacity-60 disabled:active:scale-100`}
            >
              {saving && (
                <SpinnerGap size={14} weight="bold" className={spinner} />
              )}
              {saving ? t.admin.saving : t.admin.save}
            </button>
            <button
              type="button"
              onClick={cancelEdit}
              className={`${btnBase} liquid-glass-strong px-5 py-2.5 text-petroleum hover:bg-white/50`}
            >
              <X size={14} weight="bold" />
              {t.common.cancel}
            </button>
          </div>
        </form>
      )}

      <ul className="mt-6 grid gap-4 md:grid-cols-2">
        {points.map((point) => (
          <li
            key={point.id}
            className="liquid-glass flex flex-col rounded-3xl p-5 md:p-6"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="text-base font-semibold leading-snug text-petroleum">
                {point.name}
              </h3>
              <span
                className={`inline-flex shrink-0 items-center gap-1.5 text-xs font-medium ${
                  point.isActive ? "text-pine-600" : "text-petroleum/50"
                }`}
              >
                <span
                  aria-hidden="true"
                  className={`h-1.5 w-1.5 rounded-full ${
                    point.isActive ? "bg-pine-600" : "bg-petroleum/30"
                  }`}
                />
                {point.isActive ? t.admin.active : t.admin.inactive}
              </span>
            </div>
            <p className="mt-1.5 flex items-center gap-1.5 text-sm text-petroleum/70">
              <MapPin size={14} className="shrink-0 text-pine-600" />
              {point.address} · {point.locality}
            </p>
            <p className="mt-1 text-xs text-petroleum/55">{point.hours}</p>

            <div className="mt-auto flex flex-wrap items-center gap-2 pt-4">
              <button
                type="button"
                onClick={() => startEdit(point)}
                className={`${btnBase} liquid-glass-strong px-4 py-2 text-petroleum hover:bg-white/50`}
              >
                <PencilSimple size={14} weight="bold" />
                {t.admin.edit}
              </button>
              {point.isActive ? (
                <button
                  type="button"
                  onClick={() => setActive(point, false)}
                  disabled={busyId === point.id}
                  className={`${btnBase} px-4 py-2 text-petroleum/60 hover:bg-white/40 hover:text-petroleum disabled:cursor-wait disabled:opacity-60 disabled:active:scale-100`}
                >
                  {busyId === point.id && (
                    <SpinnerGap size={14} weight="bold" className={spinner} />
                  )}
                  {t.admin.deactivate}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setActive(point, true)}
                  disabled={busyId === point.id}
                  className={`${btnBase} px-4 py-2 text-pine-600 hover:bg-white/40 disabled:cursor-wait disabled:opacity-60 disabled:active:scale-100`}
                >
                  {busyId === point.id && (
                    <SpinnerGap size={14} weight="bold" className={spinner} />
                  )}
                  {t.admin.reactivate}
                </button>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
