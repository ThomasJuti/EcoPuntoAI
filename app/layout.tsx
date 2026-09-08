import type { Metadata } from "next";
import { Instrument_Serif, Barlow } from "next/font/google";
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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" className={`${instrument.variable} ${barlow.variable}`}>
      <body>{children}</body>
    </html>
  );
}
