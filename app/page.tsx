import { createClient } from "@/utils/supabase/server"
import { Navbar } from "@/components/landing/navbar"
import { HeroSection } from "@/components/landing/hero-section"
// import { StatsSection } from "@/components/landing/stats-section"
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
      author_id,
      profiles:author_id (
        full_name,
        role
      )
    `)
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(3)

  // Fetch latest 6 mentors (students/alumni open to mentoring)
  const { data: mentors } = await supabase
    .from('profiles')
    .select(`
        id,
        full_name,
        role,
        is_open_to_mentoring,
        professional_history (
            role_title,
            company_name,
            tech_stack
        )
    `)
    .eq('is_open_to_mentoring', true)
    .order('created_at', { ascending: false })
    .limit(6)

  // Fetch latest 6 jobs
  const { data: jobs } = await supabase
    .from('opportunities')
    .select('*')
    .eq('status', 'aberta')
    .order('created_at', { ascending: false })
    .limit(6)

  return (
    <div className="flex min-h-screen flex-col bg-background-light dark:bg-background-dark font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <Navbar />
      <main>
        <HeroSection />
        {/*<StatsSection />*/}
        <BenefitsSection />
        <FeedSection
          posts={(posts || []) as unknown as Post[]}
          mentors={mentors || []}
          jobs={jobs || []}
        />
        <CtaSection />
      </main>
      <Footer />
    </div>
  )
}
