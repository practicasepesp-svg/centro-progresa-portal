import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";

const montserrat = Montserrat({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Portal de Prácticas Profesionales — Centro Progresa E.P.E.",
  description: "Ruta paso a paso y herramientas digitales para prácticas profesionales en UNIMINUTO Rectoría Bogotá.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={montserrat.className}>{children}</body>
    </html>
  );
}
