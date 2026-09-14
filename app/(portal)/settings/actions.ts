'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

const updateSecuritySchema = z.object({
    email: z.string().email("Email institucional inválido"),
    password: z.string().min(6, "A nova senha deve possuir no mínimo 6 caracteres").optional().or(z.literal('')),
})

export async function updateAccountSecurity(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Usuário não autenticado' }
    }

    const rawData = {
        email: formData.get('email'),
        password: formData.get('password') || undefined,
    }

    const validated = updateSecuritySchema.safeParse(rawData)
    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    const { email, password } = validated.data

    const updates: Parameters<typeof supabase.auth.updateUser>[0] = { email }
    if (password) {
        updates.password = password
    }

    const { error } = await supabase.auth.updateUser(updates)

    if (error) {
        console.error('Error updating user credentials:', error)
        return { error: error.message }
    }

    // Update email in profiles table if changed
    if (email !== user.email) {
        const { error: profileError } = await supabase
            .from('profiles')
            .update({ email })
            .eq('id', user.id)

        if (profileError) {
            console.error('Error updating profile email:', profileError)
        }
    }

    revalidatePath('/settings')
    revalidatePath('/(portal)', 'layout')
    return { success: true }
}
