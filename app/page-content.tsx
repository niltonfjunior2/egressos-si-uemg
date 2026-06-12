"use client"

import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { BenefitsSection } from "@/components/landing/benefits-section"
import { FeedSection } from "@/components/landing/feed-section"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"
import { ElectionHero } from "@/components/landing/election-hero"

interface PageContentProps {
  mentors: any[]
  jobs: any[]
  isElectionMode: boolean
}

export function PageContent({ mentors, jobs, isElectionMode }: PageContentProps) {
  if (isElectionMode) {
    return (
      <div className="flex min-h-screen flex-col bg-slate-100 dark:bg-slate-900 font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
        <main className="flex-1 flex flex-col items-center justify-center">
            <ElectionHero />
            <div className="w-full">
              <FeedSection mentors={mentors} jobs={jobs} hideInstagramFeed={true} />
            </div>
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
