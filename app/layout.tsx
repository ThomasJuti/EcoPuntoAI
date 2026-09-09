import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Barlow } from "next/font/google";
import { LocaleProvider } from "@/app/components/locale-provider";
import { getLocale } from "@/lib/i18n/get-locale";
import { messages } from "@/lib/i18n/messages";
import "./globals.css";

const instrument = Instrument_Serif({
  weight: "400",
  style: ["normal", "italic"],
  subsets: ["latin"],
  variable: "--font-instrument",
});

const barlow = Barlow({
  weight: ["300", "400", "500", "600"],
  subsets: ["latin"],
  variable: "--font-barlow",
});

export async function generateMetadata(): Promise<Metadata> {
  const locale = await getLocale();
  const t = messages[locale].meta;
  return {
    title: t.title,
    description: t.description,
  };
}

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${instrument.variable} ${barlow.variable}`}>
      <body>
        <LocaleProvider locale={locale}>{children}</LocaleProvider>
      </body>
    </html>
  );
}
