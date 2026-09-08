"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { FadingStill } from "./components/fading-still";
import { BlurText } from "./components/blur-text";
import {
  ArrowUpRight,
  ClockIcon,
  GlobeIcon,
  ImageIcon,
  LightbulbIcon,
} from "./components/icons";

const HERO_IMAGES = [
  "/images/hf-hero-01.png",
  "/images/hf-hero-03.png",
  "/images/hf-hero-04.png",
];

const CAPABILITIES_IMAGES = [
  "/images/hf-hero-03.png",
  "/images/hf-hero-04.png",
];

const CARDS = [
  {
    icon: ImageIcon,
    title: "Identificar",
    tags: ["Foto", "Cámara", "Galería", "Corrección"],
    body: "Fotografía el aparato o súbelo desde tu galería. Si la app se equivoca, lo corriges con un toque y seguimos.",
  },
  {
    icon: LightbulbIcon,
    title: "Orientar",
    tags: ["Riesgos", "Reusar", "Reparar", "Reciclar"],
    body: "Te decimos qué hacer y qué no: si todavía sirve para reusar o reparar, y por qué las pilas jamás van a la caneca de la casa.",
  },
  {
    icon: GlobeIcon,
    title: "Llevar",
    tags: ["Bogotá", "Filtro", "Cómo llegar", "Horarios"],
    body: "Puntos de Bogotá que sí reciben ese tipo de residuo, con horarios y la ruta lista para abrir en Google Maps.",
  },
];

function Reveal({
  children,
  className,
  delay = 0,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
}) {
  const reduce = useReducedMotion();
  if (reduce) return <div className={className}>{children}</div>;
  return (
    <motion.div
      className={`motion-blur-in ${className ?? ""}`}
      initial={{ filter: "blur(10px)", opacity: 0, y: 20 }}
      whileInView={{ filter: "blur(0px)", opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.8, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
}

function Navbar() {
  return (
    <header className="fixed inset-x-0 top-4 z-50 flex items-center justify-between px-8 lg:px-16">
      <Link
        href="/"
        aria-label="EcoPunto IA - inicio"
        className="liquid-glass grid h-12 w-12 place-items-center rounded-full text-black"
      >
        <span className="font-heading text-2xl italic">e</span>
      </Link>
      <nav className="liquid-glass hidden items-center gap-1 rounded-full p-1.5 md:flex">
        <a
          href="#capacidades"
          className="rounded-full px-4 py-2 text-sm text-black/70 transition hover:bg-black/5 hover:text-black"
        >
          Cómo
        </a>
        <a
          href="#capacidades"
          className="rounded-full px-4 py-2 text-sm text-black/70 transition hover:bg-black/5 hover:text-black"
        >
          Capacidades
        </a>
        <Link
          href="/app"
          className="liquid-glass-strong ml-1 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-black transition hover:bg-white/40"
        >
          Abrir la app
          <ArrowUpRight width={16} height={16} />
        </Link>
      </nav>
      <div className="h-12 w-12" aria-hidden />
    </header>
  );
}

function Hero() {
  return (
    <section className="relative overflow-hidden bg-white">
      <FadingStill
        src={HERO_IMAGES}
        className="absolute inset-0"
        imgClassName="object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/15 via-transparent to-white/25" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-5xl flex-col items-center justify-center px-6 pb-14 pt-28 text-center text-black">
        <h1 className="pb-1 font-heading text-6xl font-normal italic leading-[1.1] tracking-[-4px] text-black md:text-7xl lg:text-[5.5rem]">
          <BlurText text="El cajón de cables no tiene que ser basura" />
        </h1>

        <Reveal delay={0.35}>
          <p className="mx-auto mt-6 max-w-2xl text-lg font-light leading-relaxed text-black/80">
            EcoPunto IA identifica tu electrónico con una foto y te muestra
            puntos de entrega en Bogotá que sí reciben ese residuo.
          </p>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/app"
              className="liquid-glass-strong inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-medium text-black transition hover:bg-white/40"
            >
              Abrir la app
              <ArrowUpRight width={18} height={18} />
            </Link>
            <a
              href="#capacidades"
              className="liquid-glass inline-flex items-center rounded-full px-7 py-3.5 text-base font-medium text-black/80 transition hover:bg-white/40"
            >
              Ver capacidades
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.65} className="w-full max-w-2xl">
          <div className="mt-12 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div className="liquid-glass rounded-3xl p-5 text-left">
              <ClockIcon className="text-black/80" />
              <p className="mt-4 text-lg font-medium text-black">3 pasos</p>
              <p className="mt-1 text-sm font-light text-black/75">
                Foto, identificación y punto de entrega
              </p>
            </div>
            <div className="liquid-glass rounded-3xl p-5 text-left">
              <GlobeIcon className="text-black/80" />
              <p className="mt-4 text-lg font-medium text-black">Bogotá</p>
              <p className="mt-1 text-sm font-light text-black/75">
                Puntos que reciben el tipo de aparato, no solo el más cercano
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Capabilities() {
  return (
    <section
      id="capacidades"
      className="relative overflow-hidden bg-white"
    >
      <FadingStill
        src={CAPABILITIES_IMAGES}
        holdMs={7000}
        className="absolute inset-0"
        imgClassName="object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/30" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col justify-center px-6 py-24 text-black">
        <Reveal>
          <p className="text-center text-sm tracking-[0.2em] text-black/70">
            {"// Capacidades"}
          </p>
        </Reveal>
        <h2 className="mt-4 pb-1 text-center font-heading text-5xl font-normal italic leading-[1.1] text-black md:text-6xl">
          <BlurText text="Del cajón al punto correcto" />
        </h2>

        <div className="mt-12 grid gap-4 md:grid-cols-3">
          {CARDS.map((card, i) => (
            <Reveal key={card.title} delay={i * 0.12} className="h-full">
              <article className="liquid-glass flex h-full min-h-[360px] flex-col rounded-3xl p-6">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <span className="liquid-glass grid h-12 w-12 shrink-0 place-items-center rounded-2xl">
                    <card.icon className="text-black/80" />
                  </span>
                  <ul className="flex max-w-[60%] flex-wrap justify-end gap-1.5">
                    {card.tags.map((tag) => (
                      <li
                        key={tag}
                        className="rounded-full border border-black/20 px-2.5 py-1 text-[11px] text-black/80"
                      >
                        {tag}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex-1" />
                <h3 className="font-heading text-3xl italic text-black">{card.title}</h3>
                <p className="mt-3 max-w-[32ch] font-light leading-relaxed text-black/80">
                  {card.body}
                </p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Landing() {
  return (
    <main className="bg-white text-black">
      <Navbar />
      <Hero />
      <Capabilities />
    </main>
  );
}
