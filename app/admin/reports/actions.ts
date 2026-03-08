'use server'

import { createClient } from "@/utils/supabase/server"

export async function getCompaniesReportData() {
    const supabase = await createClient()

    const { data: history, error } = await supabase
        .from('professional_history')
        .select('company_name')

    if (error || !history) {
        return { error: "Erro ao buscar dados de empresas." }
    }

    const counts: Record<string, number> = {}
    history.forEach(h => {
        if (h.company_name) {
            const name = h.company_name.trim()
            if (name) counts[name] = (counts[name] || 0) + 1
        }
    })

    const sorted = Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count }))

    return { data: sorted }
}

export async function getTechReportData() {
    const supabase = await createClient()

    const { data: history, error } = await supabase
        .from('professional_history')
        .select('tech_stack')

    if (error || !history) {
        return { error: "Erro ao buscar dados de tecnologias." }
    }

    const counts: Record<string, number> = {}
    history.forEach(h => {
        if (h.tech_stack && Array.isArray(h.tech_stack)) {
            h.tech_stack.forEach((tech: string) => {
                const t = tech.trim()
                if (t) counts[t] = (counts[t] || 0) + 1
            })
        }
    })

    const sorted = Object.entries(counts)
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count }))

    return { data: sorted }
}

export async function getCensusReportData() {
    const supabase = await createClient()

    // Query profiles fetching relevant academic data
    const { data: profiles, error } = await supabase
        .from('profiles')
        .select(`
            full_name,
            email,
            role,
            academic_records(entry_year, graduation_year, student_id_code, status)
        `)
        .in('role', ['aluno', 'egresso'])
        .order('full_name', { ascending: true })

    if (error || !profiles) {
        return { error: "Erro ao buscar dados do censo." }
    }

    const reportData = profiles.map(p => {
        const _rawAcademic = Array.isArray(p.academic_records) ? p.academic_records : (p.academic_records ? [p.academic_records] : [])
        // Get the latest/primary academic record based on the UEMG flow we fixed earlier
        const primaryAc = _rawAcademic.sort((a: any, b: any) => new Date(b.created_at || 0).getTime() - new Date(a.created_at || 0).getTime())[0]

        return {
            name: p.full_name,
            email: p.email,
            role: p.role === 'egresso' ? 'Egresso' : 'Aluno',
            status: primaryAc?.status ? primaryAc.status.toUpperCase() : 'N/A',
            entryYear: primaryAc?.entry_year || 'N/A',
            graduationYear: primaryAc?.graduation_year || 'N/A',
            studentId: primaryAc?.student_id_code || 'N/A'
        }
    })

    return { data: reportData }
}
