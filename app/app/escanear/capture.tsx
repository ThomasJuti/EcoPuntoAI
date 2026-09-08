"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, ImageSquare, SpinnerGap, WarningCircle } from "@phosphor-icons/react";

type Status = "idle" | "uploading" | "identifying" | "error";

const STATUS_COPY: Record<Exclude<Status, "idle" | "error">, string> = {
  uploading: "Subiendo la foto…",
  identifying: "Identificando el aparato…",
};

export function Capture() {
  const router = useRouter();
  const cameraRef = useRef<HTMLInputElement>(null);
  const galleryRef = useRef<HTMLInputElement>(null);
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState<string | null>(null);

  const busy = status === "uploading" || status === "identifying";

  async function handleFile(file: File) {
    setStatus("uploading");
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const uploadRes = await fetch("/api/storage/upload", {
        method: "POST",
        body: form,
      });
      if (!uploadRes.ok) throw new Error("upload");
      const { path } = (await uploadRes.json()) as { path: string };

      setStatus("identifying");
      const identifyRes = await fetch("/api/identify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ path }),
      });
      if (!identifyRes.ok) throw new Error("identify");
      const result = (await identifyRes.json()) as {
        wasteKind: string;
        confidence: number;
        path: string;
      };

      const params = new URLSearchParams({
        kind: result.wasteKind,
        confidence: String(result.confidence),
        path: result.path,
      });
      router.push(`/app/resultado?${params.toString()}`);
    } catch {
      setStatus("error");
      setError("No pudimos procesar la foto. Intenta de nuevo.");
    }
  }

  function onPick(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file || busy) return;
    void handleFile(file);
  }

  const buttonBase =
    "inline-flex items-center gap-2.5 rounded-full px-7 py-4 text-base font-medium text-petroleum transition duration-100 ease-[var(--ease-out)] hover:bg-white/40 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100 disabled:cursor-not-allowed disabled:opacity-50 disabled:active:scale-100";

  return (
    <div className="mt-10">
      <input
        ref={cameraRef}
        type="file"
        accept="image/*"
        capture="environment"
        className="sr-only"
        aria-label="Tomar una foto con la cámara"
        onChange={onPick}
      />
      <input
        ref={galleryRef}
        type="file"
        accept="image/*"
        className="sr-only"
        aria-label="Elegir una foto de la galería"
        onChange={onPick}
      />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          disabled={busy}
          onClick={() => cameraRef.current?.click()}
          className={`liquid-glass-strong ${buttonBase}`}
        >
          <Camera size={20} weight="fill" />
          Tomar foto
        </button>
        <button
          type="button"
          disabled={busy}
          onClick={() => galleryRef.current?.click()}
          className={`liquid-glass ${buttonBase}`}
        >
          <ImageSquare size={20} weight="regular" />
          Subir de la galería
        </button>
      </div>

      <div aria-live="polite" className="mt-6 min-h-6">
        {busy && (
          <p className="inline-flex items-center gap-2 text-sm text-petroleum/70">
            <SpinnerGap size={16} className="animate-spin motion-reduce:animate-none" />
            {STATUS_COPY[status as "uploading" | "identifying"]}
          </p>
        )}
        {status === "error" && error && (
          <p role="alert" className="inline-flex items-center gap-2 text-sm font-medium text-danger">
            <WarningCircle size={16} weight="fill" />
            {error}
          </p>
        )}
      </div>
    </div>
  );
}
