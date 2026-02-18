'use server'

import { createClient } from "@/utils/supabase/server"

export async function generatePDIReport() {
    const supabase = await createClient()

    // 1. Fetch all professional history to aggregate companies and tech
    const { data: history, error } = await supabase
        .from('professional_history')
        .select('company_name, tech_stack, is_current')

    if (error || !history) {
        console.error("Error fetching history for report:", error)
        return { error: "Erro ao buscar dados." }
    }

    // 2. Aggregate Companies
    const companyCounts: Record<string, number> = {}
    history.forEach(h => {
        if (h.company_name) {
            const name = h.company_name.trim()
            companyCounts[name] = (companyCounts[name] || 0) + 1
        }
    })

    const sortedCompanies = Object.entries(companyCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count }))

    // 3. Aggregate Technologies
    const techCounts: Record<string, number> = {}
    history.forEach(h => {
        if (h.tech_stack && Array.isArray(h.tech_stack)) {
            h.tech_stack.forEach((tech: string) => {
                const t = tech.trim()
                techCounts[t] = (techCounts[t] || 0) + 1
            })
        }
    })

    const sortedTech = Object.entries(techCounts)
        .sort(([, a], [, b]) => b - a)
        .map(([name, count]) => ({ name, count }))

    // 4. Generate CSV Content
    // Section 1: Top Companies
    let csv = "RELATÓRIO PDI - EGRESSOS SI UEMG\n"
    csv += `Gerado em: ${new Date().toLocaleString()}\n\n`

    csv += "--- EMPRESAS PARCEIRAS (Top 50) ---\n"
    csv += "Empresa,Quantidade de Egressos\n"
    sortedCompanies.slice(0, 50).forEach(c => {
        csv += `"${c.name}",${c.count}\n`
    })

    csv += "\n--- TECNOLOGIAS MAIS UTILIZADAS ---\n"
    csv += "Tecnologia,Ocorrências\n"
    sortedTech.forEach(t => {
        csv += `"${t.name}",${t.count}\n`
    })

    return { csv }
}
