
import { createAdminClient } from "@/lib/supabase/admin"
import { NextResponse } from "next/server"

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url)
    const secret = searchParams.get('secret')

    // SECURITY: Block execution in production or without secret
    if (process.env.NODE_ENV !== 'development' && secret !== process.env.SEED_SECRET) {
        return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }

    if (process.env.NODE_ENV === 'development' && secret !== 'dev-secret-123') {
         return NextResponse.json({ error: 'Forbidden.' }, { status: 403 })
    }

    const supabase = createAdminClient()
    const email = 'admin-egressos@uemg.br'
    const password = 'adminegressos'

    // Debug logging
    console.log('Attempting to seed admin...')
    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        console.error('SUPABASE_SERVICE_ROLE_KEY is missing!')
        return NextResponse.json({ error: 'Server configuration error: Service Key missing' }, { status: 500 })
    }

    // 1. Check if user already exists
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers()

    if (listError) {
        console.error('listUsers error:', listError)
        return NextResponse.json({ error: listError.message, details: listError }, { status: 500 })
    }

    const existingUser = users.find(u => u.email === email)
    let userId = existingUser?.id

    // 2. Delete if exists to ensure clean state (optional, or just update password)
    if (userId) {
        const { error: deleteError } = await supabase.auth.admin.deleteUser(userId)
        if (deleteError) {
            return NextResponse.json({ error: `Failed to delete existing user: ${deleteError.message}` }, { status: 500 })
        }
    }

    // 3. Create User with Admin API (auto-confirms email)
    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: {
            full_name: 'Administrador Root'
        }
    })

    if (createError) {
        return NextResponse.json({ error: `Failed to create user: ${createError.message}` }, { status: 500 })
    }

    userId = newUser.user.id

    // 4. Ensure Profile exists with correct role
    // We use upsert to be safe
    const { error: profileError } = await supabase
        .from('profiles')
        .upsert({
            id: userId,
            email,
            full_name: 'Administrador Root',
            role: 'administrador', // PT-BR role
            is_open_to_mentoring: false
        })

    if (profileError) {
        return NextResponse.json({ error: `Failed to create profile: ${profileError.message}` }, { status: 500 })
    }

    return NextResponse.json({
        success: true,
        message: 'Admin user created successfully',
        credentials: { email, password }
    })
}
