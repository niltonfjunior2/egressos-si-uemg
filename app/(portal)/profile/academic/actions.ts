'use server'

import { createClient } from '@/utils/supabase/server'
import { academicRecordSchema, AcademicRecordFormData } from './schema'
import { revalidatePath } from 'next/cache'

export async function addAcademicRecord(formData: AcademicRecordFormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autorizado' }

    const result = academicRecordSchema.safeParse(formData)
    if (!result.success) return { error: 'Dados inválidos' }

    const { error } = await supabase.from('academic_records').insert({
        profile_id: user.id,
        entry_year: formData.entryYear,
        graduation_year: formData.graduationYear || null,
        student_id_code: formData.studentIdCode,
        status: formData.status,
    })

    if (error) {
        console.error('Error adding academic record:', error)
        return { error: 'Erro ao adicionar registro' }
    }

    revalidatePath('/profile')
    return { success: true }
}

export async function deleteAcademicRecord(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autorizado' }

    const { error } = await supabase.from('academic_records')
        .delete()
        .eq('id', id)
        .eq('profile_id', user.id) // Security check

    if (error) {
        return { error: 'Erro ao remover registro' }
    }

    revalidatePath('/profile')
    return { success: true }
}
