import type { Metadata } from "next";
import { SignOut, User } from "@phosphor-icons/react/dist/ssr";
import { signOut } from "@/app/auth/actions";
import { SignInForm } from "@/app/components/sign-in-form";
import { getUser } from "@/lib/supabase/server";

export const metadata: Metadata = {
  title: "Perfil - EcoPunto IA",
};

export default async function PerfilPage() {
  const user = await getUser();

  if (!user) {
    return (
      <main className="flex min-h-[62dvh] flex-col justify-center">
        <div className="liquid-glass mb-8 grid h-12 w-12 place-items-center rounded-2xl text-pine-600">
          <User size={24} weight="regular" />
        </div>
        <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
          Perfil
        </h1>
        <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
          Entra con Google. No hay usuario ni contraseña.
        </p>
        <div className="mt-8">
          <SignInForm next="/app/perfil" />
        </div>
      </main>
    );
  }

  const email = user.email ?? "";
  const initial = (email || "e").charAt(0).toUpperCase();

  return (
    <main className="flex min-h-[62dvh] flex-col justify-center">
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        Perfil
      </h1>
      <section className="liquid-glass mt-10 flex max-w-lg items-center gap-5 rounded-3xl p-6">
        <div className="liquid-glass-strong grid h-14 w-14 shrink-0 place-items-center rounded-full">
          <span className="font-heading text-2xl italic leading-none text-petroleum">
            {initial}
          </span>
        </div>
        <div className="min-w-0">
          <p className="text-xs tracking-wide text-petroleum/55">
            Sesión con Google
          </p>
          <p className="mt-1 truncate text-lg font-medium text-petroleum">
            {email}
          </p>
        </div>
      </section>
      <form action={signOut} className="mt-8">
        <button
          type="submit"
          className="liquid-glass inline-flex items-center gap-1.5 rounded-full px-6 py-3 text-sm font-medium text-petroleum/80 transition duration-200 ease-[var(--ease-out)] hover:bg-white/40 hover:text-petroleum active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <SignOut size={16} weight="regular" />
          Cerrar sesión
        </button>
      </form>
    </main>
  );
}
