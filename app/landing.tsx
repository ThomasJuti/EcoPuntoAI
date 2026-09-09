"use client";

import Link from "next/link";
import type { ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  Camera,
  MapPin,
  Recycle,
} from "@phosphor-icons/react/dist/ssr";
import { FadingStill } from "./components/fading-still";
import { BlurText } from "./components/blur-text";
import { ArrowUpRight, ClockIcon } from "./components/icons";
import { LocaleToggle } from "./components/locale-toggle";
import { useLocale, useMessages } from "./components/locale-provider";

const HERO_IMAGES = [
  "/images/still-cables.webp",
  "/images/still-phone.webp",
  "/images/still-camera.webp",
];

const BUBBLES = [1, 0, 1, 0, 1, 0, 1] as const;

function RecycleMancha() {
  return (
    <div className="recycle-mancha" aria-hidden>
      <span className="recycle-mancha__blob" />
      <span className="recycle-mancha__blob recycle-mancha__blob--b" />
      {BUBBLES.map((icon, i) => (
        <span key={i} className={`recycle-bubble recycle-bubble--${i + 1}`}>
          {icon ? <Recycle weight="regular" /> : null}
        </span>
      ))}
    </div>
  );
}

const CARD_LAYOUT = [
  { n: "01", offset: "md:col-span-7", radius: "rounded-[2rem]", icon: Camera },
  { n: "02", offset: "md:col-span-7 md:col-start-6", radius: "rounded-3xl", icon: Recycle },
  { n: "03", offset: "md:col-span-7 md:col-start-3", radius: "rounded-[1.75rem]", icon: MapPin },
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
  const reduce = useReducedMotion();
  const locale = useLocale();
  const t = useMessages();
  return (
    <motion.header
      className="fixed inset-x-0 top-4 z-50 flex items-center justify-between px-6 lg:px-16"
      initial={reduce ? false : { opacity: 0, y: -18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href="/"
        aria-current="page"
        aria-label={t.landing.homeAria}
        className="liquid-glass grid h-12 w-12 place-items-center rounded-full text-petroleum transition duration-200 hover:bg-white/40 active:scale-[0.98]"
      >
        <span className="font-heading text-2xl italic">e</span>
      </Link>
      <nav className="liquid-glass hidden items-center gap-1 rounded-full p-1.5 md:flex">
        <a
          href="#pasos"
          className="rounded-full px-4 py-2 text-sm text-petroleum/70 transition duration-200 hover:bg-white/40 hover:text-petroleum"
        >
          {t.landing.how}
        </a>
        <a
          href="#capacidades"
          className="rounded-full px-4 py-2 text-sm text-petroleum/70 transition duration-200 hover:bg-white/40 hover:text-petroleum"
        >
          {t.landing.capabilities}
        </a>
      <Link
        href="/app"
        className="group liquid-glass-strong ml-1 inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm font-semibold text-petroleum transition duration-200 hover:bg-white/50 active:scale-[0.98]"
      >
          {t.landing.openApp}
          <ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" width={16} height={16} />
        </Link>
      </nav>
      <div className="flex items-center gap-2">
        <LocaleToggle locale={locale} label={t.nav.language} />
        <Link
          href="/app"
          className="liquid-glass-strong inline-flex h-12 items-center rounded-full px-4 text-sm font-semibold text-petroleum transition duration-200 hover:bg-white/50 active:scale-[0.98] md:hidden"
        >
          {t.landing.open}
        </Link>
      </div>
    </motion.header>
  );
}

function Hero() {
  const t = useMessages();
  return (
    <section className="relative overflow-hidden bg-white">
      <FadingStill
        src={HERO_IMAGES}
        className="absolute inset-0"
        imgClassName="object-center"
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/20 via-transparent via-[58%] to-white" />
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[min(100%,48rem)] bg-gradient-to-r from-white/85 via-white/60 via-[65%] to-transparent" />

      <div
        id="contenido"
        className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col justify-center px-6 pb-28 pt-28 text-left lg:px-16"
      >
        <h1 className="max-w-[13ch] pb-1 font-heading text-6xl font-normal italic leading-[1.05] tracking-[-0.04em] text-petroleum [text-shadow:0_0_28px_#fff,0_0_8px_#fff] md:text-7xl lg:text-[5.25rem]">
          <BlurText
            className="justify-start"
            text={t.landing.hero}
            key={t.landing.hero}
          />
        </h1>

        <Reveal delay={0.35}>
          <p className="mt-6 max-w-[36ch] text-lg font-light leading-relaxed text-petroleum">
            {t.landing.lede}
          </p>
        </Reveal>

        <Reveal delay={0.5}>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Link
              href="/app"
              className="group liquid-glass-strong inline-flex items-center gap-2 rounded-full px-7 py-3.5 text-base font-medium text-petroleum transition duration-200 hover:bg-white/50 active:scale-[0.98]"
            >
              {t.landing.openApp}
              <ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" width={18} height={18} />
            </Link>
            <a
              href="#capacidades"
              className="liquid-glass inline-flex items-center rounded-full px-7 py-3.5 text-base font-medium text-petroleum/80 transition duration-200 hover:bg-white/40 active:scale-[0.98]"
            >
              {t.landing.seeCapabilities}
            </a>
          </div>
        </Reveal>

        <Reveal delay={0.65} className="mt-16">
          <div
            id="pasos"
            className="grid max-w-xl grid-cols-1 gap-8 sm:grid-cols-2"
          >
            <div>
              <ClockIcon className="text-pine-600" />
              <p className="mt-4 text-lg font-medium text-petroleum">{t.landing.threeSteps}</p>
              <p className="mt-1 max-w-[28ch] text-sm font-light text-petroleum/70">
                {t.landing.threeStepsLede}
              </p>
            </div>
            <div>
              <MapPin className="text-pine-600" size={24} weight="regular" />
              <p className="mt-4 text-lg font-medium text-petroleum">Bogotá</p>
              <p className="mt-1 max-w-[28ch] text-sm font-light text-petroleum/70">
                {t.landing.bogotaLede}
              </p>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Capabilities() {
  const reduce = useReducedMotion();
  const t = useMessages();
  const cards = CARD_LAYOUT.map((layout, i) => ({
    ...layout,
    ...t.landing.cards[i],
  }));
  return (
    <section id="capacidades" className="relative overflow-hidden bg-white">
      <RecycleMancha />
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-28 bg-gradient-to-b from-white to-transparent" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] w-full max-w-6xl flex-col justify-center px-6 py-28 lg:px-16">
        <motion.p
          className="font-heading text-lg italic text-pine-600"
          initial={reduce ? false : { opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.6 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          {t.landing.capabilities}
        </motion.p>
        <motion.h2
          className="mt-3 max-w-[14ch] font-heading text-5xl font-normal italic leading-[1.08] text-petroleum md:text-6xl"
          initial={reduce ? false : { opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.7, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
        >
          {t.landing.capabilitiesTitle}
        </motion.h2>

        <div className="mt-16 grid gap-5 md:grid-cols-12">
          {cards.map((card, i) => (
            <motion.article
              key={card.title}
              className={`liquid-glass flex flex-col p-6 md:min-h-[300px] ${card.radius} ${card.offset}`}
              initial={reduce ? false : { opacity: 0, y: 42 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{
                duration: 0.75,
                delay: 0.1 + i * 0.14,
                ease: [0.22, 1, 0.36, 1],
              }}
              whileHover={reduce ? undefined : { y: -8 }}
            >
              <div className="flex items-start justify-between gap-3">
                <span className="liquid-glass grid h-11 w-11 shrink-0 place-items-center rounded-xl text-pine-600">
                  <card.icon size={22} weight="regular" />
                </span>
                <span className="font-heading text-sm italic text-petroleum/45">
                  {card.n}
                </span>
              </div>
              <p className="mt-5 text-xs tracking-wide text-petroleum/55">
                {card.tags}
              </p>
              <div className="flex-1" />
              <h3 className="mt-8 font-heading text-3xl italic text-petroleum">
                {card.title}
              </h3>
              <p className="mt-3 max-w-[34ch] font-light leading-relaxed text-petroleum/80">
                {card.body}
              </p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Landing() {
  const t = useMessages();
  return (
    <main className="grain bg-white text-petroleum">
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2"
      >
        {t.landing.skip}
      </a>
      <Navbar />
      <Hero />
      <Capabilities />
      <footer className="relative z-10 border-t border-soft px-6 py-10 lg:px-16">
        <motion.div
          className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="font-heading text-2xl italic text-petroleum">
            EcoPunto IA
            <span className="mt-1 block font-body text-sm font-light not-italic text-petroleum/60">
              Bogotá
            </span>
          </p>
          <Link
            href="/app"
            className="group inline-flex items-center gap-1.5 text-sm font-medium text-petroleum transition duration-200 hover:text-pine-600"
          >
            {t.landing.openApp}
            <ArrowUpRight className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" width={16} height={16} />
          </Link>
        </motion.div>
      </footer>
    </main>
  );
}
