import type { Metadata } from "next";
import { Bebas_Neue, DM_Sans, Barlow, Barlow_Condensed } from "next/font/google";
import "./globals.css";

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
  title: "Impressive Studio — Creative Production · Meta Ads · IA",
  description:
    "Estudio integral de contenido cinematográfico, publicidad en Meta y agentes de IA para marcas que entienden que la imagen lo es todo.",
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
        {children}
      </body>
    </html>
  );
}
