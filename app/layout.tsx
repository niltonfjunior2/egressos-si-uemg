import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | EGRESSOS SISTEMAS DE INFORMACAO - UEMG Carangola',
    default: 'EGRESSOS SISTEMAS DE INFORMACAO - UEMG Carangola',
  },
  description: 'Plataforma de acompanhamento de egressos do curso de Sistemas de Informação da UEMG Unidade Carangola. Conecte-se, encontre vagas e mantenha vínculo com a universidade.',
  keywords: ['UEMG', 'Carangola', 'Sistemas de Informação', 'Egressos', 'Alumni', 'Vagas', 'Emprego', 'Tecnologia'],
  authors: [{ name: 'Sistemas de Informação UEMG' }],
  openGraph: {
    type: 'website',
    locale: 'pt_BR',
    url: 'https://egressos-si-uemg.vercel.app', // Replace with actual URL later
    title: 'EGRESSOS SISTEMAS DE INFORMACAO - UEMG Carangola',
    description: 'Conecte-se com a comunidade de Sistemas de Informação da UEMG Carangola.',
    siteName: 'EGRESSOS SISTEMAS DE INFORMACAO - UEMG Carangola',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={inter.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
