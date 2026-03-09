'use server'

import { createClient, createAdminClient } from '@/utils/supabase/server'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

// Types based on DB schema
const jobSchema = z.object({
    title: z.string().min(3, "Título é obrigatório"),
    description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
    company: z.string().min(2, "Empresa é obrigatória"),
    location: z.string().optional(),
    type: z.enum(['estagio', 'emprego', 'trainee', 'monitoria', 'freelance', 'projeto_pesquisa', 'pj']),
    work_mode: z.enum(['presencial', 'remoto', 'hibrido']),
    link_url: z.string().url("URL inválida").optional().or(z.literal('')),
    contact_info: z.string().optional().or(z.literal('')),
    expires_at: z.string().optional().or(z.literal('')),
})

const updateJobSchema = jobSchema.extend({
    id: z.string().uuid(),
    status: z.enum(['aberta', 'preenchida', 'cancelada']).optional(),
})

export async function getJobs(page = 1, limit = 10, search = '') {
    const supabase = await createClient()

    // Get current user to check role
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return { jobs: [], count: 0, error: 'Não autenticado' }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()
    const isAdminOrCoord = profile && ['administrador', 'coordenador'].includes(profile.role)

    let query = supabase
        .from('opportunities')
        .select('*, profiles(full_name, email)', { count: 'exact' })
        .order('created_at', { ascending: false })
        .range((page - 1) * limit, page * limit - 1)

    // RBAC: If not admin/coord, show only own jobs
    if (!isAdminOrCoord) {
        query = query.eq('author_id', user.id)
    }

    if (search) {
        query = query.or(`title.ilike.%${search}%,company.ilike.%${search}%`)
    }

    const { data: jobs, count, error } = await query

    if (error) {
        console.error('Error fetching jobs:', error)
        return { jobs: [], count: 0, error: 'Erro ao buscar vagas.' }
    }

    return { jobs, count, userRole: profile?.role } // Return role to help UI decision making if needed
}

export async function createJob(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Usuário não autenticado' }

    const rawData = {
        title: formData.get('title'),
        description: formData.get('description'),
        company: formData.get('company'),
        location: formData.get('location'),
        type: formData.get('type'),
        work_mode: formData.get('work_mode'),
        link_url: formData.get('link_url'),
        contact_info: formData.get('contact_info'),
        expires_at: formData.get('expires_at'),
    }

    const validated = jobSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    const { error } = await supabase
        .from('opportunities')
        .insert({
            ...validated.data,
            author_id: user.id,
            status: 'aberta'
        })

    if (error) {
        return { error: 'Erro ao criar vaga: ' + error.message }
    }

    revalidatePath('/admin/jobs')
    return { success: 'Vaga criada com sucesso!' }
}

export async function updateJob(formData: FormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Usuário não autenticado' }

    const rawData = {
        id: formData.get('id'),
        title: formData.get('title'),
        description: formData.get('description'),
        company: formData.get('company'),
        location: formData.get('location'),
        type: formData.get('type'),
        work_mode: formData.get('work_mode'),
        link_url: formData.get('link_url'),
        contact_info: formData.get('contact_info'),
        expires_at: formData.get('expires_at'),
        status: formData.get('status'),
    }

    const validated = updateJobSchema.safeParse(rawData)

    if (!validated.success) {
        return { error: validated.error.issues[0].message }
    }

    // RBAC Check for Update
    // Fetch job to check author
    const { data: existingJob } = await supabase.from('opportunities').select('author_id').eq('id', validated.data.id).single()
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

    const isAdminOrCoord = profile && ['administrador', 'coordenador'].includes(profile.role)

    if (!existingJob) return { error: 'Vaga não encontrada' }

    if (!isAdminOrCoord && existingJob.author_id !== user.id) {
        return { error: 'Você não tem permissão para editar esta vaga.' }
    }

    // Use admin client if the user is admin/coord to bypass RLS "silent block" on update
    // Default RLS might block updates on records they don't own, even if their UI allows it
    const db = isAdminOrCoord ? createAdminClient() : supabase;

    const { data: updatedJob, error } = await db
        .from('opportunities')
        .update({
            title: validated.data.title,
            description: validated.data.description,
            company: validated.data.company,
            location: validated.data.location,
            type: validated.data.type,
            work_mode: validated.data.work_mode,
            link_url: validated.data.link_url,
            contact_info: validated.data.contact_info,
            expires_at: validated.data.expires_at || null,
            status: validated.data.status, // Allow status update
        })
        .eq('id', validated.data.id)
        .select()
        .single()

    if (error) {
        return { error: 'Erro ao atualizar vaga: ' + error.message }
    }

    if (!updatedJob) {
        return { error: 'A atualização falhou silenciosamente. Verifique as permissões (RLS).' }
    }

    revalidatePath('/admin/jobs')
    return { success: 'Vaga atualizada com sucesso!' }
}

export async function deleteJob(id: string) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Usuário não autenticado' }

    // RBAC Check
    const { data: existingJob } = await supabase.from('opportunities').select('author_id').eq('id', id).single()
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single()

    const isAdminOrCoord = profile && ['administrador', 'coordenador'].includes(profile.role)

    if (!existingJob) return { error: 'Vaga não encontrada' }

    if (!isAdminOrCoord && existingJob.author_id !== user.id) {
        return { error: 'Você não tem permissão para excluir esta vaga.' }
    }

    const { error } = await supabase
        .from('opportunities')
        .delete()
        .eq('id', id)

    if (error) {
        return { error: 'Erro ao excluir vaga: ' + error.message }
    }

    revalidatePath('/admin/jobs')
    return { success: 'Vaga excluída com sucesso!' }
}
