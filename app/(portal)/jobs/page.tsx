import { JobList } from "@/components/jobs/job-list"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Job } from "@/components/jobs/types"

export default async function JobsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch jobs
    const { data: jobs } = await supabase
        .from('jobs')
        .select('*')
        .order('created_at', { ascending: false })

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Mural de Oportunidades</h1>
                <p className="text-muted-foreground mt-2">
                    Encontre o seu próximo desafio profissional ou divulgue vagas para a comunidade.
                </p>
            </div>

            <JobList jobs={(jobs || []) as unknown as Job[]} currentUserId={user.id} />
        </div>
    )
}
