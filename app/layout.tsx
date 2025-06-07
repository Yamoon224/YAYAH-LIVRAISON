import type React from "react"
import type { Metadata } from "next"
import { Inter } from "next/font/google"
import "./globals.css"
import { ThemeProvider } from "@/contexts/theme-context"
import { CurrencyProvider } from "@/contexts/currency-context"
import { LanguageProvider } from "@/contexts/language-context"
import { Toaster } from "@/components/ui/toaster"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "YAYAH LIVRAISON - Service de Livraison Professionnel",
  description:
    "Service de livraison rapide et sécurisé pour tous types de produits. Commandez en ligne et recevez chez vous.",
  keywords: "livraison, Guinée, produits, service, YAYAH, rapide, sécurisé",
  icons: {
    icon: "/favicon.ico",
  },
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="fr" suppressHydrationWarning>
      <body className={inter.className}>
        <ThemeProvider>
          <CurrencyProvider>
            <LanguageProvider>
              {children}
              <Toaster />
            </LanguageProvider>
          </CurrencyProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
