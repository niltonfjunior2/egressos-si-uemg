'use server'

import { createClient } from '@/utils/supabase/server'
import { professionalHistorySchema, ProfessionalHistoryFormData } from './schema'
import { revalidatePath } from 'next/cache'

export async function addProfessionalHistory(formData: ProfessionalHistoryFormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autorizado' }

    const result = professionalHistorySchema.safeParse(formData)
    if (!result.success) return { error: 'Dados inválidos' }

    // [L7] Tratamento rigoroso de Datas e Timezones
    // Assuming frontend sends Date object, Zod parses it.

    const techStackArray = formData.techStack
        ? formData.techStack.split(',').map(tag => tag.trim()).filter(tag => tag.length > 0)
        : []

    const { error } = await supabase.from('professional_history').insert({
        profile_id: user.id,
        company_name: formData.companyName,
        role_title: formData.roleTitle,
        start_date: formData.startDate.toISOString().split('T')[0], // YYYY-MM-DD
        end_date: formData.endDate ? formData.endDate.toISOString().split('T')[0] : null,
        is_current: formData.isCurrent,
        tech_stack: techStackArray,
        salary_range: formData.salaryRange,
    })

    if (error) {
        console.error('Error adding professional history:', error)
        return { error: 'Erro ao adicionar registro' }
    }

    revalidatePath('/profile')
    return { success: true }
}

export async function deleteProfessionalHistory(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autorizado' }

    const { error } = await supabase.from('professional_history')
        .delete()
        .eq('id', id)
        .eq('profile_id', user.id)

    if (error) {
        return { error: 'Erro ao remover registro' }
    }

    revalidatePath('/profile')
    return { success: true }
}
