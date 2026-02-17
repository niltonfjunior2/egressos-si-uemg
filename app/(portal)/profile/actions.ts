'use server'

import { createClient } from '@/utils/supabase/server'
import { profileSchema, ProfileFormData } from './schema'
import { revalidatePath } from 'next/cache'

export async function updateProfile(formData: ProfileFormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return { error: 'Usuário não autenticado' }
    }

    const result = profileSchema.safeParse(formData)
    if (!result.success) {
        return { error: 'Dados inválidos' }
    }

    const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: formData.fullName,
        social_name: formData.socialName,
        mobile_phone: formData.mobilePhone,
        linkedin_url: formData.linkedinUrl,
        github_url: formData.githubUrl,
        social_media_url: formData.socialMediaUrl,
        lattes_url: formData.lattesUrl,
        is_open_to_mentoring: formData.isOpenToMentoring,
        updated_at: new Date().toISOString(),
    })

    if (error) {
        return { error: 'Erro ao atualizar perfil' }
    }

    revalidatePath('/profile')
    revalidatePath('/(portal)', 'layout')
    return { success: true }
}
