import type { Metadata } from "next";
import { Check, Warning } from "@phosphor-icons/react/dist/ssr";
import { APRENDE_SECTIONS } from "@/lib/catalog/aprende";

export const metadata: Metadata = {
  title: "Aprende - EcoPunto IA",
};

export default function AprenderPage() {
  return (
    <main>
      <h1 className="font-heading text-4xl font-normal italic leading-[1.05] tracking-[-0.02em] text-petroleum md:text-5xl">
        Aprende
      </h1>
      <p className="mt-3 max-w-[52ch] text-lg font-light leading-relaxed text-petroleum/70">
        Guías cortas sobre RAEE, basura del hogar, pilas y aparatos dañados.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {APRENDE_SECTIONS.map((section) => (
          <section
            key={section.id}
            className="liquid-glass rounded-3xl p-6 md:p-8"
          >
            <h2 className="font-heading text-2xl font-normal italic leading-tight tracking-[-0.01em] text-petroleum md:text-3xl">
              {section.title}
            </h2>
            <p className="mt-2 text-sm font-medium text-pine-600">
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
    </main>
  );
}
