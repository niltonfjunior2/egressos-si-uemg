'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getCoordinatorProfile() {
    const supabase = await createClient()

    // Query for the first user with role 'coordenador'
    const { data: coordinator, error } = await supabase
        .from('profiles')
        .select(`
            *,
            professional_history (
                role_title,
                company_name,
                is_current,
                start_date
            ),
            academic_records (
                status
            )
        `)
        .eq('role', 'coordenador')
        .limit(1)
        .single()

    if (error) {
        // If no coordinator found (PGRST116 is code for no rows returned by single())
        if (error.code === 'PGRST116') {
            return { data: null }
        }
        console.error('Error fetching coordinator:', error)
        return { error: 'Erro ao buscar coordenador' }
    }

    return { data: coordinator }
}
