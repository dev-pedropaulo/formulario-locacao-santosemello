import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ficha de Cadastro e Locação — Santos e Mello Imóveis",
  description:
    "Formulário Oficial de Cadastro e Documentação de Locação da Santos e Mello Imóveis. Cadastro de dados de locação, locatário, proprietário e imóvel.",
  keywords: [
    "imobiliária",
    "locação",
    "santos e mello",
    "cadastro de locação",
    "superlógica",
  ],
  authors: [{ name: "Santos e Mello Imóveis" }],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="pt-BR" className={`${inter.variable} h-full antialiased`}>
      <body className="min-h-screen flex flex-col bg-slate-100 text-slate-800 font-sans">
        {children}
      </body>
    </html>
  );
}
