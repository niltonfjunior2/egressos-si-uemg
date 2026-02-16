'use server'

import { createClient } from '@/utils/supabase/server'
import { postSchema, PostFormData } from './schema'
import { revalidatePath } from 'next/cache'

export async function createPost(formData: PostFormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autorizado' }

    const result = postSchema.safeParse(formData)
    if (!result.success) return { error: 'Conteúdo inválido' }

    const { error } = await supabase.from('feed_posts').insert({
        profile_id: user.id,
        content: formData.content,
        is_pinned: false, // Default
    })

    if (error) {
        console.error('Error creating post:', error)
        return { error: 'Erro ao criar postagem' }
    }

    revalidatePath('/feed')
    revalidatePath('/') // Update landing page feed too
    return { success: true }
}

export async function deletePost(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autorizado' }

    // Check ownership or admin status (admin check simplified for now, assuming only owner can delete)
    // In a real app, I'd fetch the post first to check author, or rely on RLS. 
    // RLS is safer. I'll trust RLS to block if not owner.

    const { error } = await supabase.from('feed_posts')
        .delete()
        .eq('id', id)
        .eq('profile_id', user.id) // Enforce ownership here as extra safety, though RLS should handle

    if (error) {
        return { error: 'Erro ao remover postagem' }
    }

    revalidatePath('/feed')
    revalidatePath('/')
    return { success: true }
}
