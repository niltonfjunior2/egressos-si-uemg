import { createClient } from "@/utils/supabase/server"
import { PageContent } from "./page-content"

export default async function Home() {
  const supabase = await createClient()

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
        ),
        education_history (
            degree_type,
            course_name
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

  return <PageContent mentors={mentors || []} jobs={jobs || []} />
}
