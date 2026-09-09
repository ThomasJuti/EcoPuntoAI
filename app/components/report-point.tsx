"use client";

import { useState } from "react";
import { usePathname } from "next/navigation";
import {
  CaretDown,
  CheckCircle,
  Flag,
  SpinnerGap,
} from "@phosphor-icons/react";
import { REPORT_REASONS, type ReportReason } from "@/lib/catalog/reports";
import { SignInForm } from "@/app/components/sign-in-form";
import { useMessages } from "./locale-provider";

type Props = {
  pointId: string;
  pointName: string;
};

type Status =
  | { type: "idle" }
  | { type: "sending" }
  | { type: "done" }
  | { type: "unauthenticated" }
  | { type: "error"; message: string };

const btnBase =
  "inline-flex items-center gap-1.5 rounded-full text-sm font-medium transition duration-100 ease-[var(--ease-out)] active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100";

export function ReportPoint({ pointId, pointName }: Props) {
  const t = useMessages();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState<ReportReason>("closed");
  const [comment, setComment] = useState("");
  const [status, setStatus] = useState<Status>({ type: "idle" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setStatus({ type: "sending" });
    try {
      const res = await fetch("/api/reports", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          pointId,
          pointName,
          reason,
          comment: comment.trim() || null,
        }),
      });
      if (res.status === 201) {
        setStatus({ type: "done" });
        return;
      }
      if (res.status === 401) {
        setStatus({ type: "unauthenticated" });
        return;
      }
      const json = (await res.json().catch(() => null)) as {
        error?: string;
      } | null;
      setStatus({
        type: "error",
        message: json?.error ?? t.report.sendError,
      });
    } catch {
      setStatus({ type: "error", message: t.report.sendError });
    }
  }

  if (status.type === "done") {
    return (
      <p
        role="status"
        className="flex items-start gap-2 text-sm font-medium text-pine-600"
      >
        <CheckCircle size={16} weight="fill" className="mt-0.5 shrink-0" />
        {t.report.thanks}
      </p>
    );
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-expanded={false}
        className={`${btnBase} px-4 py-2 text-petroleum/60 hover:bg-white/40 hover:text-petroleum`}
      >
        <Flag size={14} weight="regular" />
        {t.report.action}
      </button>
    );
  }

  return (
    <div className="liquid-glass rounded-2xl p-4">
      <button
        type="button"
        onClick={() => setOpen(false)}
        aria-expanded={true}
        className="flex w-full items-center justify-between gap-2 text-sm font-medium text-petroleum"
      >
        <span className="inline-flex items-center gap-1.5">
          <Flag size={14} weight="fill" className="text-pine-600" />
          Reportar un dato
        </span>
        <CaretDown size={14} weight="bold" className="text-petroleum/50" />
      </button>

      {status.type === "unauthenticated" ? (
        <div className="mt-4">
          <p className="text-sm text-petroleum/70">
            {t.report.signIn}
          </p>
          <div className="mt-3">
            <SignInForm next={pathname} label={t.signIn.google} />
          </div>
        </div>
      ) : (
        <form onSubmit={submit} className="mt-4">
          <fieldset>
            <legend className="sr-only">{t.report.reasonLegend}</legend>
            <div className="space-y-2">
              {REPORT_REASONS.map((value) => (
                <label
                  key={value}
                  className="flex cursor-pointer items-center gap-2 text-sm text-petroleum/80"
                >
                  <input
                    type="radio"
                    name="report-reason"
                    value={value}
                    checked={reason === value}
                    onChange={() => setReason(value)}
                    className="size-4 accent-pine-600"
                  />
                  {t.report.reasons[value]}
                </label>
              ))}
            </div>
          </fieldset>

          <label
            htmlFor={`report-comment-${pointId}`}
            className="mt-4 block text-xs font-medium tracking-wide text-petroleum/55 uppercase"
          >
            {t.report.comment}
          </label>
          <textarea
            id={`report-comment-${pointId}`}
            value={comment}
            onChange={(event) => setComment(event.target.value)}
            rows={2}
            maxLength={280}
            placeholder={t.report.commentPlaceholder}
            className="liquid-glass-strong mt-2 w-full resize-none rounded-2xl px-4 py-2.5 text-sm text-petroleum placeholder:text-petroleum/40 focus:outline-none focus-visible:ring-2 focus-visible:ring-pine-600/50"
          />

          {status.type === "error" && (
            <p role="alert" className="mt-2 text-sm font-medium text-danger">
              {status.message}
            </p>
          )}

          <button
            type="submit"
            disabled={status.type === "sending"}
            className={`${btnBase} mt-3 bg-pine-600 px-5 py-2.5 text-white hover:bg-pine-600/90 disabled:cursor-wait disabled:opacity-60 disabled:active:scale-100`}
          >
            {status.type === "sending" && (
              <SpinnerGap
                size={14}
                weight="bold"
                className="animate-spin motion-reduce:animate-none"
              />
            )}
            {status.type === "sending" ? t.report.sending : t.report.send}
          </button>
        </form>
      )}
    </div>
  );
}
