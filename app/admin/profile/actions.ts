'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const profileSchema = z.object({
    fullName: z.string().min(3, "Nome completo é obrigatório"),
})

const passwordSchema = z.object({
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "A confirmação de senha é obrigatória"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não coincidem",
    path: ["confirmPassword"],
})

export async function updateProfileStats(formData: FormData) {
    const supabase = await createClient()
    const fullName = formData.get('fullName') as string

    const validated = profileSchema.safeParse({ fullName })

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Usuário não autenticado' }
    }

    // Update public.profiles
    const { error: profileError } = await supabase
        .from('profiles')
        .update({ full_name: fullName })
        .eq('id', user.id)

    if (profileError) {
        return { error: 'Erro ao atualizar perfil: ' + profileError.message }
    }

    // Update auth.users metadata (optional but good practice)
    await supabase.auth.updateUser({
        data: { full_name: fullName }
    })

    revalidatePath('/admin/layout')
    revalidatePath('/admin/profile')

    return { success: 'Perfil atualizado com sucesso!' }
}

export async function changePassword(formData: FormData) {
    const supabase = await createClient()
    const password = formData.get('password') as string
    const confirmPassword = formData.get('confirmPassword') as string

    const validated = passwordSchema.safeParse({ password, confirmPassword })

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    const { error } = await supabase.auth.updateUser({ password })

    if (error) {
        return { error: 'Erro ao alterar senha: ' + error.message }
    }

    return { success: 'Senha alterada com sucesso!' }
}
