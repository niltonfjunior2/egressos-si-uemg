import { createClient, createAdminClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Users, Briefcase, Calendar, CheckCircle, Clock, AlertTriangle, BookOpen, Star, Lightbulb, TrendingUp, MessageSquare } from "lucide-react"

export default async function AdminDashboard() {
    const supabase = await createClient()
    const adminSupabase = createAdminClient()

    const { data: { user } } = await supabase.auth.getUser()
    const userName = user?.user_metadata?.full_name || "Administrador"
    const firstName = userName.split(" ")[0]

    // 1. Total Egressos (Formados)
    const { data: graduatesData } = await adminSupabase
        .from('academic_records')
        .select('profile_id, graduation_year')
        .eq('status', 'formado')

    const totalGraduates = graduatesData?.length || 0

    // Set of graduate IDs - MOVED UP for reuse
    const graduateIds = new Set(graduatesData?.map(r => r.profile_id))

    // 2. Egressos em Educação Continuada
    // Fetch all education history relative to graduates
    const { data: educationData } = await adminSupabase
        .from('education_history')
        .select('profile_id, status, degree_type')

    // Filter logic:
    // 1. Must be a graduate (profile_id in graduateIds)
    // 2. Has ANY record in education_history (implies continuing education)

    const continuingEducationProfiles = educationData?.filter(r =>
        graduateIds.has(r.profile_id)
    )

    // Count unique profiles
    const continuingEducation = new Set(continuingEducationProfiles?.map(r => r.profile_id)).size

    // 3. Empregabilidade — busca todos os profiles por role para cálculo separado
    const { data: egressoProfiles } = await adminSupabase
        .from('profiles')
        .select('id')
        .eq('role', 'egresso')

    const { data: alunoProfiles } = await adminSupabase
        .from('profiles')
        .select('id')
        .eq('role', 'aluno')

    const egressoIds = new Set(egressoProfiles?.map(p => p.id) || [])
    const alunoIds = new Set(alunoProfiles?.map(p => p.id) || [])

    // Busca todos os empregos ativos
    const { data: employedProfiles } = await adminSupabase
        .from('professional_history')
        .select('profile_id, salary_range')
        .eq('is_current', true)

    // Filtra por role
    const employedEgressos = new Set(
        employedProfiles?.filter(p => egressoIds.has(p.profile_id)).map(p => p.profile_id) || []
    )
    const employedAlunos = new Set(
        employedProfiles?.filter(p => alunoIds.has(p.profile_id)).map(p => p.profile_id) || []
    )

    const egressoEmploymentRate = egressoIds.size ? Math.round((employedEgressos.size / egressoIds.size) * 100) : 0
    const alunoEmploymentRate = alunoIds.size ? Math.round((employedAlunos.size / alunoIds.size) * 100) : 0

    // Para compatibilidade com o cálculo de salários (usa egressos empregados)
    const employedGraduates = employedProfiles?.filter(p => egressoIds.has(p.profile_id)) || []
    const uniqueEmployedGraduates = employedEgressos.size

    // 4. Salary Distribution
    const egressoSalaryDistribution: Record<string, number> = {}
    employedGraduates.forEach(p => {
        if (p.salary_range) {
            egressoSalaryDistribution[p.salary_range] = (egressoSalaryDistribution[p.salary_range] || 0) + 1
        }
    })

    const employedStudents = employedProfiles?.filter(p => alunoIds.has(p.profile_id)) || []
    const alunoSalaryDistribution: Record<string, number> = {}
    employedStudents.forEach(p => {
        if (p.salary_range) {
            alunoSalaryDistribution[p.salary_range] = (alunoSalaryDistribution[p.salary_range] || 0) + 1
        }
    })

    // 5. Graduation Evolution (Graph)
    const graduationEvolution: Record<string, number> = {}
    graduatesData?.forEach(r => {
        if (r.graduation_year) {
            graduationEvolution[r.graduation_year] = (graduationEvolution[r.graduation_year] || 0) + 1
        }
    })

    // Sort years and prepare for graph
    const years = Object.keys(graduationEvolution).sort()
    // Take last 5 years or all if less
    const recentYears = years.slice(-5)
    const graphData = recentYears.map(year => ({
        year,
        count: graduationEvolution[year],
        // Mocking a target or previous year comparison since we don't have historical snapshots easily
        // Let's just show the raw count for now
        height: Math.min(100, (graduationEvolution[year] / (Math.max(...Object.values(graduationEvolution)) || 1)) * 100)
    }))


    // Fetch Open Jobs Count
    const { count: openJobs } = await adminSupabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aberta')

    // ── SURVEY DATA ──────────────────────────────────────────────────────────
    const { data: surveyData } = await adminSupabase
        .from('profile_surveys')
        .select('missing_technologies, most_useful_areas, soft_skills_desired, methodology_priority, employability_impact, suggestions')

    const totalProfiles = egressoIds.size + alunoIds.size
    const surveyResponseCount = surveyData?.length || 0
    const surveyResponseRate = totalProfiles > 0 ? Math.round((surveyResponseCount / totalProfiles) * 100) : 0

    // Average employability impact (1–5)
    const validImpacts = (surveyData ?? [])
        .map(s => s.employability_impact)
        .filter((v): v is number => v != null)
    const avgImpact = validImpacts.length > 0
        ? Math.round((validImpacts.reduce((a, b) => a + b, 0) / validImpacts.length) * 10) / 10
        : null

    // Helper: count occurrences of items across array columns
    function aggregateArrayField(arrays: (string[] | null)[]): [string, number][] {
        const counter: Record<string, number> = {}
        arrays.forEach(arr => {
            if (!arr) return
            arr.forEach(item => { if (item) counter[item] = (counter[item] || 0) + 1 })
        })
        return Object.entries(counter).sort(([, a], [, b]) => b - a)
    }

    const topUsefulAreas = aggregateArrayField(
        (surveyData ?? []).map(s => s.most_useful_areas as string[] | null)
    ).slice(0, 5)

    const topSoftSkills = aggregateArrayField(
        (surveyData ?? []).map(s => s.soft_skills_desired as string[] | null)
    ).slice(0, 8)

    const topMethodologies = aggregateArrayField(
        (surveyData ?? []).map(s => s.methodology_priority as string[] | null)
    ).slice(0, 6)

    // Missing technologies: tokenize free-text, count word frequency
    const stopWords = new Set(['de', 'do', 'da', 'e', 'a', 'o', 'em', 'com', 'para', 'mais', 'que', 'não', 'como', 'uma', 'um', 'na', 'no', 'os', 'as'])
    const techCounter: Record<string, number> = {}
        ; (surveyData ?? []).forEach(s => {
            if (!s.missing_technologies) return
                ; (s.missing_technologies.toLowerCase().split(/[\s,;./\-\n]+/) as string[])
                    .filter((w: string) => w.length > 2 && !stopWords.has(w))
                    .forEach((w: string) => { techCounter[w] = (techCounter[w] || 0) + 1 })
        })
    const topMissingTechs = Object.entries(techCounter).sort(([, a], [, b]) => b - a).slice(0, 12)
    const maxTechCount = topMissingTechs[0]?.[1] || 1

    // Recent non-trivial suggestions (last 3)
    const recentSuggestions = (surveyData ?? [])
        .filter(s => s.suggestions && s.suggestions.trim().length > 10)
        .slice(-3)
        .reverse()
        .map(s => s.suggestions as string)

    return (
        <div className="space-y-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Bem-vindo de volta, {firstName}!</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Veja o que está acontecendo na comunidade de SI da UEMG Carangola hoje.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* System Overview Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col justify-between">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200">Visão Geral do Curso</h3>
                        <Users className="text-admin-primary h-6 w-6" />
                    </div>

                    {/* Taxa de Empregabilidade - Egressos */}
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-admin-primary bg-admin-primary/10">
                                Empregabilidade Egressos
                            </span>
                            <span className="text-xs font-semibold text-admin-primary">
                                {egressoEmploymentRate}%
                            </span>
                        </div>
                        <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200 dark:bg-slate-700">
                            <div
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-admin-primary transition-all duration-500"
                                style={{ width: `${egressoEmploymentRate}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">{employedEgressos.size} de {egressoIds.size} egressos empregados</p>
                    </div>

                    {/* Taxa de Empregabilidade - Alunos */}
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-blue-600 bg-blue-100 dark:bg-blue-900/20 dark:text-blue-400">
                                Empregabilidade Alunos
                            </span>
                            <span className="text-xs font-semibold text-blue-600 dark:text-blue-400">
                                {alunoEmploymentRate}%
                            </span>
                        </div>
                        <div className="overflow-hidden h-2 mb-1 text-xs flex rounded bg-gray-200 dark:bg-slate-700">
                            <div
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-blue-500 transition-all duration-500"
                                style={{ width: `${alunoEmploymentRate}%` }}
                            ></div>
                        </div>
                        <p className="text-xs text-gray-400 mb-4">{employedAlunos.size} de {alunoIds.size} alunos empregados</p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{egressoIds.size}</p>
                            <p className="text-xs text-gray-500">Total de Egressos</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{alunoIds.size}</p>
                            <p className="text-xs text-gray-500">Total de Alunos</p>
                        </div>
                    </div>

                    <Link href="/admin/users?status=formado" className="w-full mt-6 py-2.5 bg-admin-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all text-center text-sm">
                        Ver Egressos
                    </Link>
                </div>

                {/* Pendências / Jobs Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200">Vagas e Oportunidades</h3>
                        <Briefcase className="text-admin-accent h-6 w-6" />
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center text-center space-y-2">
                        <div className="bg-admin-accent/10 p-4 rounded-full mb-2">
                            <Briefcase className="h-8 w-8 text-admin-accent" />
                        </div>
                        <h4 className="text-3xl font-bold text-slate-800 dark:text-white">{openJobs || 0}</h4>
                        <p className="text-sm text-gray-500">Vagas Abertas no momento</p>
                    </div>
                    <Link href="/admin/jobs" className="w-full mt-4 text-admin-primary font-semibold text-sm hover:underline text-center">
                        Gerenciar Vagas
                    </Link>
                </div>

                {/* Salary Estimates Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200">Salários Estimados</h3>
                        <div className="text-green-500">
                            <span className="text-xs font-bold bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">Distribuição</span>
                        </div>
                    </div>

                    <div className="space-y-6 flex-1 overflow-y-auto max-h-[300px] pr-2 custom-scrollbar">
                        {/* Egressos Section */}
                        <div>
                            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-admin-primary"></div>
                                Egressos
                            </h4>
                            <div className="space-y-3">
                                {Object.entries(egressoSalaryDistribution)
                                    .sort(([, a], [, b]) => b - a)
                                    .slice(0, 3)
                                    .map(([range, count]) => {
                                        const percentage = Math.round((count / (employedEgressos.size || 1)) * 100)
                                        return (
                                            <div key={range}>
                                                <div className="flex justify-between text-[10px] mb-1">
                                                    <span className="font-semibold text-gray-700 dark:text-gray-300">{range}</span>
                                                    <span className="text-gray-500">{percentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5">
                                                    <div className="bg-admin-primary h-1.5 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                {Object.keys(egressoSalaryDistribution).length === 0 && (
                                    <p className="text-[10px] text-gray-500 italic">Sem dados suficientes para egressos.</p>
                                )}
                            </div>
                        </div>

                        {/* Alunos Section */}
                        <div className="pt-2 border-t border-gray-100 dark:border-slate-800">
                            <h4 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-3 flex items-center gap-2">
                                <div className="w-2 h-2 rounded-full bg-blue-500"></div>
                                Alunos
                            </h4>
                            <div className="space-y-3">
                                {Object.entries(alunoSalaryDistribution)
                                    .sort(([, a], [, b]) => b - a)
                                    .slice(0, 3)
                                    .map(([range, count]) => {
                                        const percentage = Math.round((count / (employedAlunos.size || 1)) * 100)
                                        return (
                                            <div key={range}>
                                                <div className="flex justify-between text-[10px] mb-1">
                                                    <span className="font-semibold text-gray-700 dark:text-gray-300">{range}</span>
                                                    <span className="text-gray-500">{percentage}%</span>
                                                </div>
                                                <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-1.5">
                                                    <div className="bg-blue-500 h-1.5 rounded-full transition-all" style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </div>
                                        )
                                    })}
                                {Object.keys(alunoSalaryDistribution).length === 0 && (
                                    <p className="text-[10px] text-gray-500 italic">Sem dados suficientes para alunos.</p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Evolution Chart Section */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">Evolução de Formandos</h3>
                            <p className="text-sm text-gray-500">Histórico de conclusões de curso por ano</p>
                        </div>
                    </div>

                    {/* The Chart */}
                    <div className="h-64 w-full flex items-end justify-around pb-4 border-b border-gray-100 dark:border-slate-800 space-x-2">
                        {graphData.length > 0 ? graphData.map((item) => (
                            <div key={item.year} className="flex flex-col items-center w-full max-w-[60px] group">
                                <div className="w-full bg-admin-primary rounded-t-lg relative transition-all hover:opacity-80" style={{ height: `${item.height * 2}px`, maxHeight: '200px', minHeight: '10px' }}>
                                    <div className="absolute -top-6 left-1/2 transform -translate-x-1/2 text-xs font-bold text-admin-primary opacity-0 group-hover:opacity-100 transition-opacity">
                                        {item.count}
                                    </div>
                                </div>
                                <span className="text-[10px] mt-2 text-gray-400 font-bold uppercase">{item.year}</span>
                            </div>
                        )) : (
                            <div className="w-full h-full flex items-center justify-center text-gray-400">
                                Sem dados históricos de formaturas.
                            </div>
                        )}
                    </div>
                </div>

                {/* ── SEÇÃO: INSIGHTS DO QUESTIONÁRIO ──────────────────────────────── */}
                <div className="lg:col-span-3 mt-2">
                    {/* Section header + coverage bar */}
                    <div className="flex flex-col md:flex-row md:items-center gap-3 mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-admin-primary/10 rounded-lg shrink-0">
                                <BookOpen className="h-5 w-5 text-admin-primary" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-gray-800 dark:text-gray-100">Insights do Questionário Acadêmico</h3>
                                <p className="text-xs text-gray-500">
                                    {surveyResponseCount} de {totalProfiles} usuários responderam &middot; {surveyResponseRate}% de cobertura
                                </p>
                            </div>
                        </div>
                        <div className="hidden md:flex flex-1 items-center gap-2 ml-4">
                            <div className="flex-1 h-2 rounded-full bg-gray-200 dark:bg-slate-700">
                                <div
                                    className="h-2 rounded-full bg-admin-primary transition-all"
                                    style={{ width: `${surveyResponseRate}%` }}
                                />
                            </div>
                            <span className="text-xs font-bold text-admin-primary whitespace-nowrap">{surveyResponseRate}%</span>
                        </div>
                    </div>

                    {surveyResponseCount === 0 ? (
                        <div className="bg-white dark:bg-slate-900 border border-dashed border-gray-300 dark:border-slate-700 rounded-2xl p-10 text-center text-gray-400">
                            Nenhum questionário respondido ainda.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

                            {/* Card 1 – Impacto Percebido na Empregabilidade */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Impacto Percebido na Empregabilidade</h4>
                                    <TrendingUp className="h-5 w-5 text-green-500 shrink-0" />
                                </div>
                                {avgImpact !== null ? (
                                    <div className="flex-1 flex flex-col items-center justify-center gap-2">
                                        <p className="text-5xl font-black text-admin-primary">{avgImpact}</p>
                                        <p className="text-xs text-gray-400">de 5 pontos (média)</p>
                                        <div className="flex gap-1 mt-1">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <Star
                                                    key={i}
                                                    className={`h-5 w-5 ${i <= Math.round(avgImpact)
                                                        ? 'text-yellow-400 fill-yellow-400'
                                                        : 'text-gray-300 dark:text-slate-600'
                                                        }`}
                                                />
                                            ))}
                                        </div>
                                        <p className="text-xs text-gray-400 mt-1">baseado em {validImpacts.length} respostas</p>
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 text-center py-4 flex-1">Sem dados suficientes.</p>
                                )}
                            </div>

                            {/* Card 2 – Tecnologias em Falta (tag cloud) */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Tecnologias em Falta no Currículo</h4>
                                    <Lightbulb className="h-5 w-5 text-amber-500 shrink-0" />
                                </div>
                                {topMissingTechs.length > 0 ? (
                                    <div className="flex-1 flex flex-wrap gap-2 content-start">
                                        {topMissingTechs.map(([tech, count]) => {
                                            const weight = count / maxTechCount
                                            const size = weight > 0.66 ? 'text-sm font-bold' : weight > 0.33 ? 'text-xs font-semibold' : 'text-xs'
                                            const bg = weight > 0.66 ? 'bg-admin-primary text-white' : 'bg-admin-primary/10 text-admin-primary'
                                            return (
                                                <span
                                                    key={tech}
                                                    title={`${count} menção${count > 1 ? 'ões' : ''}`}
                                                    className={`px-2.5 py-1 rounded-full capitalize ${size} ${bg}`}
                                                >
                                                    {tech}
                                                </span>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 text-center py-4 flex-1">Sem dados suficientes.</p>
                                )}
                            </div>

                            {/* Card 3 – Soft Skills Desejadas */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Soft Skills Mais Desejadas</h4>
                                    <CheckCircle className="h-5 w-5 text-purple-500 shrink-0" />
                                </div>
                                {topSoftSkills.length > 0 ? (
                                    <div className="flex-1 space-y-2.5">
                                        {topSoftSkills.map(([skill, count]) => {
                                            const pct = Math.round((count / surveyResponseCount) * 100)
                                            return (
                                                <div key={skill}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{skill}</span>
                                                        <span className="text-gray-400">{pct}%</span>
                                                    </div>
                                                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-slate-800">
                                                        <div className="h-1.5 rounded-full bg-purple-500 transition-all" style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 text-center py-4 flex-1">Sem dados suficientes.</p>
                                )}
                            </div>

                            {/* Card 4 – Prioridade de Metodologias */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Prioridade de Metodologias de Ensino</h4>
                                    <BookOpen className="h-5 w-5 text-teal-500 shrink-0" />
                                </div>
                                {topMethodologies.length > 0 ? (
                                    <div className="flex-1 space-y-2.5">
                                        {topMethodologies.map(([method, count]) => {
                                            const pct = Math.round((count / surveyResponseCount) * 100)
                                            return (
                                                <div key={method}>
                                                    <div className="flex justify-between text-xs mb-1">
                                                        <span className="font-medium text-gray-700 dark:text-gray-300 capitalize">{method}</span>
                                                        <span className="text-gray-400">{pct}%</span>
                                                    </div>
                                                    <div className="h-1.5 rounded-full bg-gray-100 dark:bg-slate-800">
                                                        <div className="h-1.5 rounded-full bg-teal-500 transition-all" style={{ width: `${pct}%` }} />
                                                    </div>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 text-center py-4 flex-1">Sem dados suficientes.</p>
                                )}
                            </div>

                            {/* Card 5 – Áreas Mais Valorizadas */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col">
                                <div className="flex justify-between items-start mb-5">
                                    <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Áreas do Curso Mais Valorizadas pelos Egressos</h4>
                                    <Star className="h-5 w-5 text-admin-primary shrink-0" />
                                </div>
                                {topUsefulAreas.length > 0 ? (
                                    <div className="space-y-3 flex-1">
                                        {topUsefulAreas.map(([area, count]) => {
                                            const pct = Math.round((count / surveyResponseCount) * 100)
                                            return (
                                                <div key={area} className="flex items-center gap-3">
                                                    <span className="text-xs font-medium text-gray-600 dark:text-gray-300 w-44 shrink-0 capitalize truncate" title={area}>{area}</span>
                                                    <div className="flex-1 h-3 rounded-full bg-gray-100 dark:bg-slate-800">
                                                        <div className="h-3 rounded-full bg-admin-primary transition-all" style={{ width: `${pct}%` }} />
                                                    </div>
                                                    <span className="text-xs font-semibold text-gray-500 w-10 text-right shrink-0">{pct}%</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 text-center py-4 flex-1">Sem dados suficientes.</p>
                                )}
                            </div>

                            {/* Card 5 – Sugestões Recentes */}
                            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col">
                                <div className="flex justify-between items-start mb-4">
                                    <h4 className="font-bold text-gray-700 dark:text-gray-200 text-sm">Sugestões Recentes</h4>
                                    <MessageSquare className="h-5 w-5 text-sky-500 shrink-0" />
                                </div>
                                {recentSuggestions.length > 0 ? (
                                    <div className="flex-1 space-y-3">
                                        {recentSuggestions.map((sug, i) => (
                                            <div key={i} className="p-3 bg-gray-50 dark:bg-slate-800 rounded-lg border-l-4 border-admin-primary">
                                                <p className="text-xs text-gray-600 dark:text-gray-300 italic leading-relaxed line-clamp-3">"{sug}"</p>
                                            </div>
                                        ))}
                                    </div>
                                ) : (
                                    <p className="text-sm text-gray-400 text-center py-4 flex-1">Nenhuma sugestão registrada.</p>
                                )}
                            </div>

                        </div>
                    )}
                </div>
                {/* ── FIM: INSIGHTS DO QUESTIONÁRIO ─────────────────────────────── */}

            </div>
        </div>
    )
}
