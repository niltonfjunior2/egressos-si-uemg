'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function updateAccountSecurity(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: 'Usuário não autenticado' }
    }

    const email = formData.get('email') as string
    const password = formData.get('password') as string

    if (!email) {
        return { error: 'Email é obrigatório' }
    }

    const updates: any = { email }
    if (password) {
        updates.password = password
    }

    const { error } = await supabase.auth.updateUser(updates)

    if (error) {
        console.error('Error updating user:', error)
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
            // Non-blocking, but good to know
        }
    }

    revalidatePath('/', 'layout')
    return { success: true }
}
