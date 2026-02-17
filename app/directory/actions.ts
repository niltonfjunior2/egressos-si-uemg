'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function searchProfiles(query: string = '') {
    const supabase = await createClient()

    // Ensure authenticated
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Não autorizado' }
    }

    // Base query
    let queryBuilder = supabase
        .from('profiles')
        .select(`
      *,
      professional_history (
        role_title,
        company_name,
        is_current,
        start_date,
        tech_stack
      ),
      academic_records (
        status
      )
    `)
        .order('full_name', { ascending: true })
        .in('role', ['aluno', 'egresso'])

    // Apply search filter if query provided
    if (query.trim().length > 0) {
        queryBuilder = queryBuilder.or(`full_name.ilike.%${query}%,social_name.ilike.%${query}%`)
    }

    const { data, error } = await queryBuilder

    if (error) {
        console.error('Error searching profiles:', JSON.stringify(error, null, 2))
        return { error: 'Erro ao buscar perfis' }
    }

    // Post-process to find current role and academic status
    const profiles = data.map(profile => {
        // Find current job
        const currentJob = profile.professional_history?.find((ph: any) => ph.is_current)
        // Find if student or alumni
        const academicStatus = profile.academic_records?.length > 0
            ? profile.academic_records[0].status
            : 'N/A'

        return {
            ...profile,
            currentJob,
            academicStatus
        }
    })

    return { data: profiles }
}
