'use server'

import { createClient } from '@/utils/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const userSchema = z.object({
    email: z.string().email("Email inválido"),
    fullName: z.string().min(3, "Nome completo é obrigatório"),
    role: z.enum(['aluno', 'professor', 'coordenador', 'administrador', 'egresso']),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").optional(),
})

const updateUserSchema = z.object({
    id: z.string(),
    fullName: z.string().min(3, "Nome completo é obrigatório"),
    role: z.enum(['aluno', 'professor', 'coordenador', 'administrador', 'egresso']),
})

export async function getUsers(page = 1, limit = 10, search = '', roleFilter = 'all') {
    const supabase = await createClient()

    let query = supabase
        .from('profiles')
        .select('*', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

    if (search) {
        query = query.or(`full_name.ilike.%${search}%,email.ilike.%${search}%`)
    }

    if (roleFilter && roleFilter !== 'all') {
        query = query.eq('role', roleFilter)
    }

    const { data: users, count, error } = await query

    if (error) {
        console.error('Error fetching users:', error)
        return { users: [], count: 0, error: 'Erro ao buscar usuários.' }
    }

    return { users, count }
}

export async function createUser(formData: FormData) {
    const supabaseAdmin = createAdminClient()

    const email = formData.get('email') as string
    const fullName = formData.get('fullName') as string
    const role = formData.get('role') as any
    const password = formData.get('password') as string

    // Validate
    const validated = userSchema.safeParse({ email, fullName, role, password })

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    if (!password) {
        return { error: 'Senha é obrigatória para novos usuários.' }
    }

    // Create user in Auth (bypassing email confirmation)
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { full_name: fullName }
    })

    if (authError) {
        return { error: 'Erro ao criar usuário: ' + authError.message }
    }

    if (!authData.user) {
        return { error: 'Erro desconhecido ao criar usuário.' }
    }

    // Create Profile (Manual trigger execution basically)
    // We use UPSERT in case the trigger ran but failed partially or succeeds.
    // Actually, usually triggers handle this. But to be safe and ensure ROLE is set correctly:
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .upsert({
            id: authData.user.id,
            email,
            full_name: fullName,
            role,
            is_open_to_mentoring: false // Default
        })

    if (profileError) {
        console.error('Error creating profile:', profileError)
        // If profile creation fails, we might want to delete the auth user or return warning.
        // For now, return error.
        return { error: 'Usuário criado, mas erro ao criar perfil: ' + profileError.message }
    }

    revalidatePath('/admin/users')
    return { success: 'Usuário criado com sucesso!' }
}

export async function updateUser(formData: FormData) {
    const supabaseAdmin = createAdminClient()

    const id = formData.get('id') as string
    const fullName = formData.get('fullName') as string
    const role = formData.get('role') as any

    const validated = updateUserSchema.safeParse({ id, fullName, role })

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    // Update Profile
    const { error: profileError } = await supabaseAdmin
        .from('profiles')
        .update({ full_name: fullName, role })
        .eq('id', id)

    if (profileError) {
        return { error: 'Erro ao atualizar perfil: ' + profileError.message }
    }

    // Update Auth Metadata (Best effort)
    try {
        await supabaseAdmin.auth.admin.updateUserById(id, {
            user_metadata: { full_name: fullName }
        })
    } catch (e) {
        console.error('Error updating auth metadata:', e)
    }

    revalidatePath('/admin/users')
    return { success: 'Usuário atualizado com sucesso!' }
}

export async function deleteUser(id: string) {
    const supabaseAdmin = createAdminClient()

    // Delete from Auth (Should cascade to profiles if DB is set up right, but we can do both)
    const { error } = await supabaseAdmin.auth.admin.deleteUser(id)

    if (error) {
        return { error: 'Erro ao excluir usuário: ' + error.message }
    }

    // Explicitly delete profile if cascade isn't robust
    await supabaseAdmin.from('profiles').delete().eq('id', id)

    revalidatePath('/admin/users')
    return { success: 'Usuário excluído com sucesso!' }
}

export async function resetPassword(id: string, newPassword: string) {
    if (!newPassword || newPassword.length < 6) {
        return { error: 'A nova senha deve ter no mínimo 6 caracteres.' }
    }

    const supabaseAdmin = createAdminClient()

    const { error } = await supabaseAdmin.auth.admin.updateUserById(id, {
        password: newPassword
    })

    if (error) {
        return { error: 'Erro ao redefinir senha: ' + error.message }
    }

    return { success: 'Senha redefinida com sucesso!' }
}
