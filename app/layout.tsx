import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";
import Providers from "./providers";

const display = Bebas_Neue({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-display",
});

const body = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-body",
});

const barlow = Barlow({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-barlow",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "700", "800"],
  variable: "--font-barlow-condensed",
});

export const metadata: Metadata = {
  title: "Impressive Studio — Branding · Producción Audiovisual · Eventos",
  description:
    "Estudio integral de branding, producción audiovisual cinematográfica y producción de eventos y experiencias. Nothing Impressive. Happens by accident.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body
        className={`${display.variable} ${body.variable} ${barlow.variable} ${barlowCondensed.variable} font-body`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
