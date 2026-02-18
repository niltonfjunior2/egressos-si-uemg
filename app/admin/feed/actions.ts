'use server'

import { createClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'

export async function getPosts(page = 1, limit = 20) {
    const supabase = await createClient()

    const { data: posts, count, error } = await supabase
        .from('feed_posts')
        .select(`
            id,
            content,
            is_pinned,
            created_at,
            author_id,
            profiles:author_id ( full_name, role )
        `, { count: 'exact' })
        .order('is_pinned', { ascending: false })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

    if (error) {
        console.error('Error fetching posts:', error)
        return { posts: [], count: 0, error: 'Erro ao buscar posts.' }
    }

    return { posts, count }
}

export async function togglePin(id: string, currentStatus: boolean) {
    const supabase = await createClient()

    // RBAC Check (Optional since only admins should call this server action, but good practice)
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { error: "Não autorizado" }

    const { error } = await supabase
        .from('feed_posts')
        .update({ is_pinned: !currentStatus })
        .eq('id', id)

    if (error) return { error: "Erro ao atualizar post." }

    revalidatePath('/admin/feed')
    revalidatePath('/') // Revalidate landing page too
    return { success: true }
}

export async function deletePost(id: string) {
    const supabase = await createClient()

    const { error } = await supabase
        .from('feed_posts')
        .delete()
        .eq('id', id)

    if (error) return { error: "Erro ao excluir post." }

    revalidatePath('/admin/feed')
    revalidatePath('/')
    return { success: true }
}
