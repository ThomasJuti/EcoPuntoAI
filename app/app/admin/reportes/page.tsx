import type { Metadata } from "next";
import Link from "next/link";
import { ShieldWarning, User } from "@phosphor-icons/react/dist/ssr";
import { SignInForm } from "@/app/components/sign-in-form";
import { getIsAdmin } from "@/lib/auth/admin";
import { getUser } from "@/lib/supabase/server";
import { ReportsAdmin } from "./reports-admin";

export const metadata: Metadata = {
  title: "Reportes de puntos - EcoPunto IA",
};

export default async function AdminReportesPage() {
  const user = await getUser();

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

  const isAdmin = await getIsAdmin();

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

  return (
    <main>
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        Reportes
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        Datos reportados por la gente. Los puntos siguen visibles hasta que el
        equipo los revise.
      </p>
      <ReportsAdmin />
    </main>
  );
}
