import type { ReactNode } from "react";

/**
 * Barra de pulso para skeletons. Decorativa: siempre va dentro de un
 * contenedor con aria-hidden + un "Cargando…" sr-only (ver LoadingShell).
 */
export function Pulse({ className = "" }: { className?: string }) {
  return (
    <div
      aria-hidden="true"
      className={`animate-pulse rounded-full bg-petroleum/10 motion-reduce:animate-none ${className}`}
    />
  );
}

/**
 * Envoltura accesible para estados de carga: anuncia "Cargando…" y oculta
 * los bloques decorativos del lector de pantalla.
 */
export function LoadingShell({ children }: { children: ReactNode }) {
  return (
    <main aria-busy="true">
      <span className="sr-only">Cargando…</span>
      <div aria-hidden="true">{children}</div>
    </main>
  );
}

/** Encabezado de página: título + lede, con el espaciado real (mt-3). */
export function PageHeaderSkeleton() {
  return (
    <header>
      <Pulse className="h-12 w-48 max-w-full" />
      <div className="mt-3 max-w-[52ch] space-y-3">
        <Pulse className="h-5 w-full" />
        <Pulse className="h-5 w-2/3" />
      </div>
    </header>
  );
}

/** Tarjeta de punto, igual que PointCard: título, líneas y pie con píldora + botón. */
export function PointCardSkeleton() {
  return (
    <div className="liquid-glass flex h-full flex-col rounded-3xl p-5 md:p-6">
      <Pulse className="h-5 w-3/4" />
      <div className="mt-4 space-y-2.5">
        <Pulse className="h-3.5 w-full" />
        <Pulse className="h-3.5 w-5/6" />
        <Pulse className="h-3.5 w-2/3" />
      </div>
      <div className="mt-auto flex items-center justify-between gap-3 pt-5">
        <Pulse className="h-6 w-24" />
        <Pulse className="h-9 w-28" />
      </div>
    </div>
  );
}

/**
 * Explorador de puntos: fila de filtros, fila de ubicación y rejilla de
 * tarjetas. Fallback de Suspense que Grok conecta bajo el h1 real.
 */
export function PointsBrowserSkeleton() {
  return (
    <div className="mt-10">
      <div className="flex gap-2 overflow-hidden">
        {Array.from({ length: 7 }, (_, i) => (
          <Pulse key={i} className="h-9 w-24 shrink-0" />
        ))}
      </div>
      <div className="mt-6 flex flex-wrap items-center gap-3">
        <Pulse className="h-12 w-44" />
        <Pulse className="h-12 min-w-0 flex-1 basis-56" />
        <Pulse className="h-12 w-28" />
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }, (_, i) => (
          <li key={i}>
            <PointCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Aprende: 4 tarjetas glass con título y 4 líneas. */
export function LearnSkeleton() {
  return (
    <div className="mt-10 grid gap-4 md:grid-cols-2">
      {Array.from({ length: 4 }, (_, i) => (
        <div key={i} className="liquid-glass rounded-3xl p-6 md:p-8">
          <Pulse className="h-7 w-1/2" />
          <div className="mt-4 space-y-2.5">
            <Pulse className="h-3.5 w-full" />
            <Pulse className="h-3.5 w-5/6" />
            <Pulse className="h-3.5 w-full" />
            <Pulse className="h-3.5 w-2/3" />
          </div>
        </div>
      ))}
    </div>
  );
}

/** Inicio: CTA «Identificar» + sección Historial con 3 filas. */
export function HomeSkeleton() {
  return (
    <div>
      <Pulse className="mt-8 h-14 w-44" />
      <Pulse className="mt-20 h-8 w-36 md:mt-24" />
      <ul className="mt-5 space-y-3">
        {Array.from({ length: 3 }, (_, i) => (
          <li
            key={i}
            className="liquid-glass flex items-center gap-4 rounded-3xl p-4 md:p-5"
          >
            <div className="h-11 w-11 shrink-0 animate-pulse rounded-2xl bg-petroleum/10 motion-reduce:animate-none" />
            <div className="min-w-0 flex-1 space-y-2">
              <Pulse className="h-5 w-40 max-w-full" />
              <Pulse className="h-3.5 w-56 max-w-full" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Perfil: columna centrada con icono, encabezado y tarjeta de sesión. */
export function ProfileSkeleton() {
  return (
    <div className="flex min-h-[62dvh] flex-col justify-center">
      <div className="mb-8 h-12 w-12 animate-pulse rounded-2xl bg-petroleum/10 motion-reduce:animate-none" />
      <Pulse className="h-12 w-48 max-w-full" />
      <div className="mt-3 max-w-[52ch] space-y-3">
        <Pulse className="h-5 w-full" />
        <Pulse className="h-5 w-2/3" />
      </div>
      <div className="liquid-glass mt-10 flex max-w-lg items-center gap-5 rounded-3xl p-6">
        <Pulse className="h-14 w-14 shrink-0" />
        <div className="min-w-0 flex-1 space-y-2.5">
          <Pulse className="h-3 w-28" />
          <Pulse className="h-5 w-48 max-w-full" />
        </div>
      </div>
    </div>
  );
}

/** Escanear: encabezado + botones grandes de cámara y galería. */
export function CaptureSkeleton() {
  return (
    <div>
      <PageHeaderSkeleton />
      <div className="mt-10 flex flex-wrap items-center gap-3">
        <Pulse className="h-14 w-44" />
        <Pulse className="h-14 w-56" />
      </div>
    </div>
  );
}

/** Listas de administración: encabezado + filas glass con acciones. */
export function AdminListSkeleton() {
  return (
    <div>
      <PageHeaderSkeleton />
      <ul className="mt-10 space-y-4">
        {Array.from({ length: 6 }, (_, i) => (
          <li
            key={i}
            className="liquid-glass flex items-center justify-between gap-4 rounded-3xl p-5 md:p-6"
          >
            <div className="min-w-0 flex-1">
              <Pulse className="h-5 w-48 max-w-full" />
              <div className="mt-2.5 space-y-2">
                <Pulse className="h-3.5 w-full max-w-md" />
                <Pulse className="h-3.5 w-2/3 max-w-sm" />
              </div>
            </div>
            <div className="flex shrink-0 gap-2">
              <Pulse className="h-9 w-20" />
              <Pulse className="h-9 w-20" />
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

/** Resultado: encabezado + ficha grande + vista previa de 3 puntos. */
export function ResultSkeleton() {
  return (
    <div>
      <PageHeaderSkeleton />
      <div className="liquid-glass mt-10 rounded-3xl p-6 md:p-8">
        <Pulse className="h-8 w-2/3 max-w-full" />
        <div className="mt-4 flex flex-wrap gap-2">
          <Pulse className="h-7 w-24" />
          <Pulse className="h-7 w-28" />
          <Pulse className="h-7 w-20" />
        </div>
        <div className="mt-5 space-y-2.5">
          <Pulse className="h-3.5 w-full" />
          <Pulse className="h-3.5 w-5/6" />
          <Pulse className="h-3.5 w-full" />
          <Pulse className="h-3.5 w-4/6" />
          <Pulse className="h-3.5 w-1/2" />
        </div>
      </div>
      <ul className="mt-10 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 3 }, (_, i) => (
          <li key={i}>
            <PointCardSkeleton />
          </li>
        ))}
      </ul>
    </div>
  );
}
