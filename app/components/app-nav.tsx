"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, House, MapPin, User } from "@phosphor-icons/react";

const LINKS = [
  { href: "/app", label: "Inicio", icon: House, exact: true },
  { href: "/app/mapa", label: "Mapa", icon: MapPin, exact: false },
  { href: "/app/aprender", label: "Aprende", icon: BookOpen, exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav() {
  const pathname = usePathname();
  const perfilActive = isActive(pathname, "/app/perfil", false);

  return (
    <header className="sticky top-0 z-50 grid shrink-0 grid-cols-[1fr_auto_1fr] items-center gap-2 bg-gradient-to-b from-white/80 to-transparent px-4 pt-4 sm:gap-3 sm:px-6 lg:px-16">
      <Link
        href="/?landing"
        aria-label="EcoPunto IA - sitio"
        className="liquid-glass grid h-11 shrink-0 place-items-center justify-self-start rounded-full px-2.5 text-petroleum transition duration-100 ease-[var(--ease-out)] hover:bg-white/40 active:scale-[0.97] sm:h-12 sm:px-3"
      >
        <img
          src="/images/logo-ecopunto-ia.png"
          alt=""
          className="h-4 w-auto sm:h-6"
        />
      </Link>

      <nav
        aria-label="Navegación principal"
        className="liquid-glass flex items-center gap-0.5 rounded-full p-1 sm:gap-1 sm:p-1.5"
      >
        {LINKS.map((link) => {
          const active = isActive(pathname, link.href, link.exact);
          const Icon = link.icon;
          return (
            <Link
              key={link.href}
              href={link.href}
              aria-current={active ? "page" : undefined}
              aria-label={link.label}
              className={`flex items-center gap-1.5 rounded-full px-2.5 py-2 text-sm transition duration-100 ease-[var(--ease-out)] hover:bg-white/40 active:scale-[0.97] sm:px-4 ${
                active
                  ? "bg-white/40 font-medium text-petroleum"
                  : "text-petroleum/70 hover:text-petroleum"
              }`}
            >
              <Icon size={18} weight={active ? "fill" : "regular"} />
              <span className="hidden md:inline">{link.label}</span>
            </Link>
          );
        })}
      </nav>

      <Link
        href="/app/perfil"
        aria-label="Perfil"
        aria-current={perfilActive ? "page" : undefined}
        className="liquid-glass-strong inline-flex h-11 w-11 shrink-0 items-center justify-center justify-self-end gap-1.5 rounded-full px-0 text-sm font-semibold text-petroleum transition duration-100 ease-[var(--ease-out)] hover:bg-white/50 active:scale-[0.97] sm:h-12 sm:w-auto sm:px-5"
      >
        <User size={18} weight={perfilActive ? "fill" : "regular"} />
        <span className="hidden sm:inline">Perfil</span>
      </Link>
    </header>
  );
}
