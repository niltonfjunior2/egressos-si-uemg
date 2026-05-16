"use client"

import { useEffect, useState } from "react"

import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { BenefitsSection } from "@/components/landing/benefits-section"
import { FeedSection } from "@/components/landing/feed-section"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"
import { ElectionHero } from "@/components/landing/election-hero"
import { useAppStore } from "@/utils/store/app-store"

interface PageContentProps {
  mentors: any[]
  jobs: any[]
}

export function PageContent({ mentors, jobs }: PageContentProps) {
  const isElectionMode = useAppStore((state) => state.isElectionMode)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Renderiza um estado nulo ou um loader simples para evitar mismatch de hidratação
    // Opcionalmente, pode-se renderizar o layout padrão se quisermos assumir que não é época de eleição por padrão.
    // Mas para evitar mismatch absoluto com persistência local, null ou esqueleto é seguro.
    return null
  }

  if (isElectionMode) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-100 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <main className="flex-1 flex flex-col items-center justify-center">
            <ElectionHero />
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main>
        <HeroSection />
        <BenefitsSection />
        <FeedSection mentors={mentors} jobs={jobs} />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
