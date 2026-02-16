import { DirectoryList } from "@/components/directory/directory-list"
import { searchProfiles } from "@/app/directory/actions"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function DirectoryPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch initial list (e.g. all or limited)
    const result = await searchProfiles()
    const initialProfiles = result.data || []

    return (
        <div className="container mx-auto py-10 px-4">
            <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">Diretório de Egressos</h1>
                    <p className="text-muted-foreground">
                        Conecte-se com alunos e ex-alunos da UEMG Carangola.
                    </p>
                </div>
            </div>

            <DirectoryList initialProfiles={initialProfiles} />
        </div>
    )
}
