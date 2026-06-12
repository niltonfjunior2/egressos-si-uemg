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

    const { data, error } = await supabase.auth.signInWithPassword(formData)

    if (error) {
        return { error: 'Credenciais inválidas' }
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', data.user.id)
        .single()

    if (profile && ['administrador', 'coordenador', 'professor'].includes(profile.role)) {
        revalidatePath('/', 'layout')
        redirect('/admin')
    } else {
        console.log('Login redirect: role didnt match or profile null', profile)
    }

    revalidatePath('/', 'layout')
    redirect('/profile')
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
                role: formData.role,
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
            alternative_email: formData.alternativeEmail,
            role: formData.role, // User selected role
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
    redirect('/profile')
}

export async function signout() {
    const supabase = await createClient()
    await supabase.auth.signOut()
    revalidatePath('/', 'layout')
    redirect('/')
}

// Imports for recovery
import { createAdminClient } from '@/lib/supabase/admin'
import { getServerBaseUrl } from '@/utils/url'
import { sendEmail } from '@/lib/brevo'
import { getPasswordRecoveryEmailHtml } from '@/lib/email-templates'

export async function recoverPassword(formData: FormData) {
    const inputEmail = formData.get('email') as string
    const adminDb = createAdminClient()

    // Buscar perfil do usuário (suporta entrada tanto do email institucional quanto do alternativo)
    const { data: profile } = await adminDb
        .from('profiles')
        .select('email, alternative_email')
        .or(`email.eq.${inputEmail},alternative_email.eq.${inputEmail}`)
        .single()

    // Por questões de segurança, se o usuário não for encontrado, ainda retornamos sucesso 
    // para não vazar a existência de e-mails, mas não fazemos nada.
    if (!profile) return { success: true }

    const authEmail = profile.email || inputEmail
    const destinationEmail = profile.alternative_email || profile.email || inputEmail

    // O link apontará diretamente para a página /reset, sem passar por callbacks de API
    const baseUrl = await getServerBaseUrl()
    const callbackUrl = `${baseUrl}reset`

    const { data, error } = await adminDb.auth.admin.generateLink({
        type: 'recovery',
        email: authEmail,
        options: {
            redirectTo: callbackUrl
        }
    })

    if (error) return { error: error.message }

    // Enviar o link de recuperação via Brevo para o email destino (preferencialmente o alternativo)
    try {
        await sendEmail({
            toEmail: destinationEmail,
            subject: 'Recuperação de Senha - Sistema UEMG',
            htmlContent: getPasswordRecoveryEmailHtml(data.properties.action_link)
        })
    } catch (emailError) {
        console.error("Erro ao enviar e-mail de recuperação:", emailError);
        return { error: 'Falha ao enviar e-mail de recuperação. Tente novamente mais tarde.' }
    }

    return { success: true }
}
