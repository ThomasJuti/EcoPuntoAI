import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Camera,
  Check,
  MapPin,
  Warning,
} from "@phosphor-icons/react/dist/ssr";
import { aprendeSections } from "@/lib/catalog/aprende";
import { getLocale } from "@/lib/i18n/get-locale";
import { messages } from "@/lib/i18n/messages";

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  return { title: messages[locale].learn.metaTitle };
}

export default async function AprenderPage() {
  const locale = await getLocale();
  const t = messages[locale].learn;
  const sections = aprendeSections(locale);

  return (
    <main>
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        {t.title}
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        {t.lede}
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {sections.map((section) => (
          <section
            key={section.id}
            className="liquid-glass rounded-3xl p-6 md:p-8"
          >
            <h2 className="font-heading text-2xl font-normal italic leading-tight tracking-[-0.01em] text-petroleum md:text-3xl">
              {section.title}
            </h2>
            <p className="mt-2 text-sm font-medium text-petroleum/60">
              {section.lede}
            </p>
            {section.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-3 text-sm leading-relaxed text-petroleum/75"
              >
                {paragraph}
              </p>
            ))}
            {section.items.length > 0 && (
              <ul className="mt-4 space-y-2.5">
                {section.items.map((item) => {
                  const hazard = item.tone === "hazard";
                  const routeAt =
                    section.id === "raee" ? item.text.indexOf(" → ") : -1;
                  if (routeAt !== -1) {
                    const from = item.text.slice(0, routeAt);
                    const rest = item.text.slice(routeAt + 3);
                    const cut = rest.search(/[.(]/);
                    const program = (
                      cut === -1 ? rest : rest.slice(0, cut)
                    ).trim();
                    const detail =
                      cut === -1 ? "" : rest.slice(cut).replace(/^\.\s*/, "");
                    return (
                      <li
                        key={item.text}
                        className="flex flex-wrap items-center gap-x-2 gap-y-1.5 text-sm leading-relaxed text-petroleum"
                      >
                        <span className="font-medium">{from}</span>
                        <ArrowRight
                          size={14}
                          weight="bold"
                          className="shrink-0 text-grey"
                        />
                        <span className="inline-flex items-center rounded-full bg-petroleum/10 px-2.5 py-1 text-xs font-semibold text-petroleum/80">
                          {program}
                        </span>
                        {detail && (
                          <span className="basis-full text-xs leading-relaxed text-petroleum/60">
                            {detail}
                          </span>
                        )}
                      </li>
                    );
                  }
                  return (
                    <li
                      key={item.text}
                      className={`flex items-start gap-2 text-sm leading-relaxed ${
                        hazard ? "font-medium text-warning" : "text-petroleum"
                      }`}
                    >
                      {hazard ? (
                        <Warning
                          size={16}
                          weight="fill"
                          className="mt-0.5 shrink-0 text-warning"
                        />
                      ) : (
                        <Check
                          size={16}
                          weight="bold"
                          className="mt-0.5 shrink-0 text-pine-600"
                        />
                      )}
                      {item.text}
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap gap-3">
        <Link
          href="/app"
          className="inline-flex items-center gap-2 rounded-full bg-pine-600 px-6 py-3 text-sm font-medium text-white transition duration-100 ease-[var(--ease-out)] hover:bg-pine-600/90 active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <Camera size={16} weight="bold" />
          {t.photo}
        </Link>
        <Link
          href="/app/mapa"
          className="liquid-glass inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-medium text-petroleum/80 transition duration-100 ease-[var(--ease-out)] hover:bg-white/40 hover:text-petroleum active:scale-[0.97] motion-reduce:transition-none motion-reduce:active:scale-100"
        >
          <MapPin size={16} weight="bold" />
          {t.points}
        </Link>
      </div>
    </main>
  );
}
