'use server'

import { createClient } from '@/utils/supabase/server'
import { loginSchema, signupSchema, LoginFormData, SignupFormData } from './schema'
import { redirect } from 'next/navigation'
import { revalidatePath } from 'next/cache'

export async function login(formData: LoginFormData) {
    const supabase = await createClient()

    // Validate data
    const result = loginSchema.safeParse(formData)
    if (!result.success) {
        return { error: 'Dados inválidos' }
    }

    const { error } = await supabase.auth.signInWithPassword(formData)

    if (error) {
        return { error: 'Credenciais inválidas' }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signup(formData: SignupFormData) {
    const supabase = await createClient()

    // Validate data
    const result = signupSchema.safeParse(formData)
    if (!result.success) {
        return { error: 'Dados inválidos' }
    }

    const { data, error } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
            data: {
                full_name: formData.fullName,
            },
        },
    })

    if (error) {
        // [L4] Handle unique constraint error or auth specific errors
        // Supabase Auth returns explicit error messages
        if (error.code === 'user_already_exists' || error.message.includes('already registered')) {
            return { error: 'Este email já está cadastrado.' }
        }
        return { error: error.message }
    }

    // Create Profile manually if trigger doesn't exist (Safety net)
    if (data.user) {
        const { error: profileError } = await supabase.from('profiles').insert({
            id: data.user.id,
            full_name: formData.fullName,
            email: formData.email,
            role: 'aluno', // Default role
        })

        if (profileError) {
            // Check for duplicate key if trigger already ran
            if (profileError.code !== '23505') {
                console.error('Error creating profile:', profileError)
                // Don't fail the request if profile creation fails, but log it.
                // The user is created in Auth, so they can login.
                // Ideally we would rollback but we can't delete auth user easily here without admin key.
            }
        }
    }

    revalidatePath('/', 'layout')
    redirect('/')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/login')
}

// Imports for recovery
import { createAdminClient } from '@/lib/supabase/admin'
import { getServerBaseUrl } from '@/utils/url'

export async function recoverPassword(formData: FormData) {
    const email = formData.get('email') as string
    const adminDb = createAdminClient()

    // O link apontará diretamente para a página /reset, sem passar por callbacks de API
    const baseUrl = await getServerBaseUrl()
    const callbackUrl = `${baseUrl}reset`

    const { error } = await adminDb.auth.resetPasswordForEmail(email, {
        redirectTo: callbackUrl
    })

    if (error) return { error: error.message }
    return { success: true }
}
