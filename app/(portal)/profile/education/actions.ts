
'use server'

import { createClient } from '@/utils/supabase/server'
import { educationHistorySchema, EducationHistoryFormData } from './schema'
import { revalidatePath } from 'next/cache'

export async function addEducationHistory(formData: EducationHistoryFormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autorizado' }

    const result = educationHistorySchema.safeParse(formData)
    if (!result.success) return { error: 'Dados inválidos' }

    const { data: insertedData, error } = await supabase.from('education_history').insert({
        profile_id: user.id,
        institution_name: formData.institutionName,
        degree_type: formData.degreeType,
        course_name: formData.courseName,
        status: formData.status,
    }).select().single()

    if (error) {
        console.error('Error adding education history:', error)
        return { error: 'Erro ao adicionar registro' }
    }

    revalidatePath('/profile')
    return { success: true, data: insertedData }
}

export async function deleteEducationHistory(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autorizado' }

    const { error } = await supabase.from('education_history')
        .delete()
        .eq('id', id)
        .eq('profile_id', user.id)

    if (error) {
        return { error: 'Erro ao remover registro' }
    }

    revalidatePath('/profile')
    return { success: true }
}
