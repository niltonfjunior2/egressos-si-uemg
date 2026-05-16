import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { SettingsContent } from "./settings-content"

export default async function SettingsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'administrador') {
        redirect('/admin')
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800 dark:text-white">Configurações do Sistema</h1>
                <p className="text-slate-600 dark:text-slate-400 mt-2">Gerencie as configurações globais da plataforma.</p>
            </div>
            
            <SettingsContent />
        </div>
    )
}
