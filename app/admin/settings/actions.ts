"use server"

import { createClient, createAdminClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"

async function checkAdminAccess() {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return false

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    return profile && ['administrador', 'coordenador'].includes(profile.role)
}

export async function toggleGlobalElectionMode(newState: boolean) {
    if (!(await checkAdminAccess())) {
        throw new Error('Não autorizado')
    }

    const supabase = createAdminClient()
    
    const { error } = await supabase
        .from('global_settings')
        .update({ is_election_mode: newState, updated_at: new Date().toISOString() })
        .eq('id', 1)

    if (error) {
        console.error("Error updating global_settings:", error)
        throw new Error('Falha ao atualizar o modo de vedação eleitoral.')
    }

    revalidatePath('/', 'layout')
    
    return { success: true }
}
