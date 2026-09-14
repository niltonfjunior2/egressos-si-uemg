import { createClient } from '@/utils/supabase/server'
import type { User } from '@supabase/supabase-js'

export type UserRole = 'aluno' | 'egresso' | 'professor' | 'coordenador' | 'administrador'

export interface ProfileRecord {
    id: string
    full_name: string
    role: UserRole
    email?: string | null
    alternative_email?: string | null
    [key: string]: any
}

export interface AuthContext {
    user: User
    profile: ProfileRecord
    supabase: Awaited<ReturnType<typeof createClient>>
}

/**
 * Retorna o contexto de autenticação completo (usuário, perfil e client Supabase)
 * ou null caso o usuário não esteja logado ou não possua perfil ativo.
 */
export async function getAuthContext(): Promise<AuthContext | null> {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    if (!profile) return null

    return { user, profile: profile as ProfileRecord, supabase }
}

/**
 * Helper puro que verifica se a role é administrativa (administrador ou coordenador).
 */
export function isAdminOrCoord(role?: string | null): boolean {
    return !!role && (role === 'administrador' || role === 'coordenador')
}

/**
 * Helper puro que verifica se a role é do corpo docente/gestão.
 */
export function isStaff(role?: string | null): boolean {
    return !!role && ['administrador', 'coordenador', 'professor'].includes(role)
}

/**
 * Verifica se o usuário autenticado atual possui privilégios de administrador ou coordenador.
 */
export async function checkAdminAccess(): Promise<boolean> {
    const ctx = await getAuthContext()
    return !!ctx && isAdminOrCoord(ctx.profile.role)
}

/**
 * Garante que a requisição possui usuário autenticado, lançando exceção caso contrário.
 */
export async function requireAuth(): Promise<AuthContext> {
    const ctx = await getAuthContext()
    if (!ctx) {
        throw new Error('Não autorizado: sessão ausente ou inválida.')
    }
    return ctx
}

/**
 * Garante que a requisição é de administrador ou coordenador, lançando exceção caso contrário.
 */
export async function requireAdminOrCoord(): Promise<AuthContext> {
    const ctx = await getAuthContext()
    if (!ctx || !isAdminOrCoord(ctx.profile.role)) {
        throw new Error('Acesso negado: privilégios insuficientes de administrador/coordenador.')
    }
    return ctx
}
