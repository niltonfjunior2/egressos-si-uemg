import { createClient } from "@/utils/supabase/server"
import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
import { StatsSection } from "@/components/landing/stats-section"
import { BenefitsSection } from "@/components/landing/benefits-section"
import { FeedSection } from "@/components/landing/feed-section"
import { CtaSection } from "@/components/landing/cta-section"
import { Footer } from "@/components/landing/footer"
import { Post } from "@/components/feed/types"

export default async function Home() {
  const supabase = await createClient()

  // Fetch latest 3 posts for public view
  const { data: posts } = await supabase
    .from('feed_posts')
    .select(`
      id,
      content,
      created_at,
      profile_id,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main>
        <HeroSection />
        <StatsSection />
        <BenefitsSection />
        <FeedSection posts={(posts || []) as unknown as Post[]} />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
