import type { Metadata } from "next";
import Link from "next/link";
import { ShieldWarning, User } from "@phosphor-icons/react/dist/ssr";
import { SignInForm } from "@/app/components/sign-in-form";
import { getProfile } from "@/lib/auth/admin";
import { createClient } from "@/lib/supabase/server";
import { loadAdminPoints } from "@/lib/catalog/points";
import { getLocale } from "@/lib/i18n/get-locale";
import { messages } from "@/lib/i18n/messages";
import { PointsAdmin } from "./points-admin";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: messages[locale].admin.pointsMeta };
}

export default async function AdminPuntosPage() {
  const { user, isAdmin } = await getProfile();
  const t = messages[await getLocale()];

  if (!user) {
    return (
      <main className="flex min-h-[62dvh] flex-col justify-center">
        <div className="liquid-glass mb-8 grid h-12 w-12 place-items-center rounded-2xl text-pine-600">
          <User size={24} weight="regular" />
        </div>
        <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
          {t.profile.points}
        </h1>
        <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
          {t.profile.lede}
        </p>
        <div className="mt-8">
          <SignInForm next="/app/admin/puntos" label={t.signIn.google} />
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
          {t.profile.points}
        </h1>
        <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
          {t.admin.noAccess}
        </p>
        <div className="mt-8">
          <Link
            href="/app"
            className="liquid-glass-strong inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-medium text-petroleum transition duration-200 ease-[var(--ease-out)] hover:bg-white/50 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            {t.admin.backApp}
          </Link>
        </div>
      </main>
    );
  }

  const payload = await loadAdminPoints(await createClient());

  return (
    <main>
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        {t.profile.points}
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        {t.admin.pointsLede}
      </p>
      <PointsAdmin initialPoints={payload.points} warning={payload.warning} />
    </main>
  );
}
