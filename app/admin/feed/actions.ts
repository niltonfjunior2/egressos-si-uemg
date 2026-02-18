'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function approvePost(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autorizado' }

    // Verify if user is admin or coordinator
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'administrador' && profile?.role !== 'coordenador') {
        return { error: 'Permissão negada' }
    }

    const { data, error } = await supabase
        .from('feed_posts')
        .update({ status: 'approved' })
        .eq('id', id)
        .select()

    if (error) {
        console.error('Error approving post:', error)
        return { error: 'Erro ao aprovar postagem' }
    }

    if (!data || data.length === 0) {
        return { error: 'Postagem não encontrada ou permissão negada' }
    }

    revalidatePath('/admin/feed')
    revalidatePath('/')
    return { success: true }
}

export async function rejectPost(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autorizado' }

    // Verify if user is admin or coordinator
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (profile?.role !== 'administrador' && profile?.role !== 'coordenador') {
        return { error: 'Permissão negada' }
    }

    const { data, error } = await supabase
        .from('feed_posts')
        .update({ status: 'rejected' })
        .eq('id', id)
        .select()

    if (error) {
        console.error('Error rejecting post:', error)
        return { error: 'Erro ao rejeitar postagem' }
    }

    if (!data || data.length === 0) {
        return { error: 'Postagem não encontrada ou permissão negada' }
    }

    revalidatePath('/admin/feed')
    revalidatePath('/')
    return { success: true }
}
