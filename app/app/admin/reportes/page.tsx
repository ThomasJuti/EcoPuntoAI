import type { Metadata } from "next";
import Link from "next/link";
import { ShieldWarning, User } from "@phosphor-icons/react/dist/ssr";
import { SignInForm } from "@/app/components/sign-in-form";
import { getProfile } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import type { PointReport, ReportReason } from "@/lib/catalog/reports";
import { isReportReason } from "@/lib/catalog/reports";
import { ReportsAdmin } from "./reports-admin";

export const metadata: Metadata = {
  title: "Reportes de puntos - EcoPunto IA",
};

export default async function AdminReportesPage() {
  const { user, isAdmin } = await getProfile();

  if (!user) {
    return (
      <main className="flex min-h-[62dvh] flex-col justify-center">
        <div className="liquid-glass mb-8 grid h-12 w-12 place-items-center rounded-2xl text-pine-600">
          <User size={24} weight="regular" />
        </div>
        <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
          Reportes
        </h1>
        <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
          Entra con Google. No hay usuario ni contraseña.
        </p>
        <div className="mt-8">
          <SignInForm next="/app/admin/reportes" />
        </div>
      </main>
    );
  }

  if (!isAdmin) {
    return (
      <main className="flex min-h-[62dvh] flex-col justify-center">
        <div className="liquid-glass mb-8 grid h-12 w-12 place-items-center rounded-2xl text-pine-600">
          <ShieldWarning size={24} weight="regular" />
        </div>
        <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
          Reportes
        </h1>
        <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
          No tienes acceso.
        </p>
        <div className="mt-8">
          <Link
            href="/app"
            className="liquid-glass-strong inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-medium text-petroleum transition duration-200 ease-[var(--ease-out)] hover:bg-white/50 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            Volver a la app
          </Link>
        </div>
      </main>
    );
  }

  const supabase = await createClient();
  const { data, error } = await supabase
    .from("point_reports")
    .select("id,point_id,point_name,reason,comment,status,created_at,resolved_at")
    .eq("status", "open")
    .order("created_at", { ascending: false });

  const reports: PointReport[] = (data ?? []).flatMap((row) => {
    if (!isReportReason(row.reason)) return [];
    return [
      {
        id: row.id,
        point_id: row.point_id,
        point_name: row.point_name,
        reason: row.reason as ReportReason,
        comment: row.comment,
        status: row.status,
        created_at: row.created_at,
        resolved_at: row.resolved_at,
      },
    ];
  });

  return (
    <main>
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        Reportes
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        Datos reportados por la gente. Los puntos siguen visibles hasta que el
        equipo los revise.
      </p>
      <ReportsAdmin
        initialReports={reports}
        warning={
          error
            ? "Aplica supabase/migrations/0004_reports.sql en el SQL editor de Supabase."
            : undefined
        }
      />
    </main>
  );
}
