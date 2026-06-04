import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Eleva+ Educação Empreendedora",
  description: "Plataforma de Gestão Pedagógica para Educação Empreendedora",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR">
      <body>{children}</body>
    </html>
  );
}
