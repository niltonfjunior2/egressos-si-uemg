"use server"

import { requireAdminOrCoord } from "@/lib/auth-guard"
import { createAdminClient } from "@/lib/supabase/admin"
import { revalidatePath } from "next/cache"

export async function toggleGlobalElectionMode(newState: boolean) {
    await requireAdminOrCoord()

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
