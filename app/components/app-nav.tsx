"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { BookOpen, Camera, House, MapPin, User } from "@phosphor-icons/react";

const LINKS = [
  { href: "/app", label: "Inicio", icon: House, exact: true },
  { href: "/app/mapa", label: "Mapa", icon: MapPin, exact: false },
  { href: "/app/aprender", label: "Aprende", icon: BookOpen, exact: false },
  { href: "/app/perfil", label: "Perfil", icon: User, exact: false },
];

function isActive(pathname: string, href: string, exact: boolean) {
  if (exact) return pathname === href;
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function AppNav() {
  const pathname = usePathname();
  const escanearActive = isActive(pathname, "/app/escanear", false);

  return (
    <header className="fixed inset-x-0 top-4 z-50 flex items-center justify-between gap-2 px-4 sm:gap-3 sm:px-6 lg:px-16">
      <Link
        href="/app"
        aria-label="EcoPunto IA - inicio de la app"
        className="liquid-glass grid h-11 w-11 shrink-0 place-items-center rounded-full text-petroleum transition duration-100 ease-[var(--ease-out)] hover:bg-white/40 active:scale-[0.97] sm:h-12 sm:w-12"
      >
        <span className="font-heading text-2xl italic">e</span>
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
        href="/app/escanear"
        aria-current={escanearActive ? "page" : undefined}
        className="liquid-glass-strong inline-flex h-11 shrink-0 items-center gap-1.5 rounded-full px-3.5 text-sm font-semibold text-petroleum transition duration-100 ease-[var(--ease-out)] hover:bg-white/50 active:scale-[0.97] sm:h-12 sm:px-5"
      >
        <Camera size={18} weight="fill" />
        Identificar
      </Link>
    </header>
  );
}
