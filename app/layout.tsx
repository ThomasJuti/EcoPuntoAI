import type { Metadata, Viewport } from "next";
import { Instrument_Serif, Barlow } from "next/font/google";
import { getLocale } from "@/lib/i18n/get-locale";
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

export const metadata: Metadata = {
  title: "EcoPunto IA - Qué hacer con tus electrónicos viejos en Bogotá",
  description:
    "Le tomas una foto al aparato, la app lo identifica y te muestra dónde llevarlo en Bogotá.",
};

export const viewport: Viewport = {
  viewportFit: "cover",
};

export default async function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const locale = await getLocale();
  return (
    <html lang={locale} className={`${instrument.variable} ${barlow.variable}`}>
      <body>{children}</body>
    </html>
  );
}
