'use server'

import { createClient } from '@/utils/supabase/server'
import { jobSchema, JobFormData } from './schema'
import { revalidatePath } from 'next/cache'

export async function createJob(formData: JobFormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autorizado' }

    const result = jobSchema.safeParse(formData)
    if (!result.success) return { error: 'Dados inválidos' }

    const { error } = await supabase.from('jobs').insert({
        profile_id: user.id,
        title: formData.title,
        company: formData.company,
        location: formData.location,
        description: formData.description,
        application_url: formData.applicationUrl,
        type: formData.type,
    })

    if (error) {
        console.error('Error creating job:', error)
        return { error: 'Erro ao publicar vaga' }
    }

    revalidatePath('/jobs')
    return { success: true }
}

export async function deleteJob(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autorizado' }

    const { error } = await supabase.from('jobs')
        .delete()
        .eq('id', id)
        .eq('profile_id', user.id) // Enforce ownership

    if (error) {
        return { error: 'Erro ao remover vaga' }
    }

    revalidatePath('/jobs')
    return { success: true }
}
