import type { Metadata } from "next";
import Link from "next/link";
import { Flag, MapPin, SignOut, User } from "@phosphor-icons/react/dist/ssr";
import { signOut } from "@/app/auth/actions";
import { SignInForm } from "@/app/components/sign-in-form";
import { getProfile } from "@/lib/auth/admin";
import { getLocale } from "@/lib/i18n/get-locale";
import { messages } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: messages[locale].profile.metaTitle };
}

export default async function PerfilPage() {
  const locale = await getLocale();
  const t = messages[locale];
  const { user, isAdmin } = await getProfile();

  if (!user) {
    return (
      <main className="flex min-h-[62dvh] flex-col justify-center">
        <div className="liquid-glass mb-8 grid h-12 w-12 place-items-center rounded-2xl text-pine-600">
          <User size={24} weight="regular" />
        </div>
        <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
          {t.profile.title}
        </h1>
        <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
          {t.profile.lede}
        </p>
        <div className="mt-8">
          <SignInForm next="/app/perfil" label={t.signIn.google} />
        </div>
      </main>
    );
  }

  const email = user.email ?? "";
  const initial = (user.name || email || "e").charAt(0).toUpperCase();

  return (
    <main className="flex min-h-[62dvh] flex-col justify-center">
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        {t.profile.title}
      </h1>
      <section className="liquid-glass mt-10 flex max-w-lg items-center gap-5 rounded-3xl p-6">
        {user.avatarUrl ? (
          // Google avatars 403 without no-referrer
          <img
            src={user.avatarUrl}
            alt=""
            width={56}
            height={56}
            referrerPolicy="no-referrer"
            className="h-14 w-14 shrink-0 rounded-full object-cover"
          />
        ) : (
          <div className="liquid-glass-strong grid h-14 w-14 shrink-0 place-items-center rounded-full">
            <span className="font-heading text-2xl italic leading-none text-petroleum">
              {initial}
            </span>
          </div>
        )}
        <div className="min-w-0">
          <p className="text-xs tracking-wide text-petroleum/55">
            {t.profile.session}
          </p>
          <p className="mt-1 truncate text-lg font-medium text-petroleum">
            {user.name || email}
          </p>
          {user.name && email ? (
            <p className="mt-0.5 truncate text-sm text-petroleum/60">{email}</p>
          ) : null}
        </div>
      </section>
      {isAdmin && (
        <nav aria-label="Administración" className="mt-6 flex flex-wrap gap-3">
          <Link
            href="/app/admin/puntos"
            className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-medium text-petroleum/80 transition duration-200 ease-[var(--ease-out)] hover:bg-white/40 hover:text-petroleum active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            <MapPin size={16} weight="regular" />
            {t.profile.points}
          </Link>
          <Link
            href="/app/admin/reportes"
            className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-medium text-petroleum/80 transition duration-200 ease-[var(--ease-out)] hover:bg-white/40 hover:text-petroleum active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
          >
            <Flag size={16} weight="regular" />
            {t.profile.reports}
          </Link>
        </nav>
      )}
      <form action={signOut} className="mt-8">
        <button
          type="submit"
          className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-medium text-petroleum/80 transition duration-200 ease-[var(--ease-out)] hover:bg-white/40 hover:text-petroleum active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <SignOut size={16} weight="regular" />
          {t.profile.signOut}
        </button>
      </form>
    </main>
  );
}
