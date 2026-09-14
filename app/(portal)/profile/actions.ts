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

    // Buscar perfil atual para validação de integridade de papéis (Zero Trust)
    const { data: currentProfile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    // Regra Zero Trust: O usuário comum NUNCA pode se auto-promover para administrador, coordenador ou professor.
    // A única transição discente permitida pelo próprio usuário é de 'aluno' para 'egresso'.
    let targetRole = currentProfile?.role
    if (result.data.role === 'egresso' && currentProfile?.role === 'aluno') {
        targetRole = 'egresso'
    }

    const { error } = await supabase.from('profiles').upsert({
        id: user.id,
        full_name: result.data.fullName,
        social_name: result.data.socialName,
        mobile_phone: result.data.mobilePhone,
        linkedin_url: result.data.linkedinUrl,
        github_url: result.data.githubUrl,
        social_media_url: result.data.socialMediaUrl,
        lattes_url: result.data.lattesUrl,
        is_open_to_mentoring: result.data.isOpenToMentoring,
        role: targetRole,
        updated_at: new Date().toISOString(),
    })

    if (error) {
        return { error: 'Erro ao atualizar perfil' }
    }

    revalidatePath('/profile')
    revalidatePath('/(portal)', 'layout')
    return { success: true }
}
