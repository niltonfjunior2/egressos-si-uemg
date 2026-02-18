import { createClient, createAdminClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Users, Briefcase, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react"

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

    // 3. Empregabilidade (Egressos formados com emprego atual)
    // Fetch unique profile_ids from professional_history with is_current=true
    const { data: employedProfiles } = await adminSupabase
        .from('professional_history')
        .select('profile_id, salary_range')
        .eq('is_current', true)

    // Filter employed profiles that are in the graduate set
    const employedGraduates = employedProfiles?.filter(p => graduateIds.has(p.profile_id)) || []

    // Count unique employed graduates
    const uniqueEmployedGraduates = new Set(employedGraduates.map(p => p.profile_id)).size

    const employmentRate = totalGraduates ? Math.round((uniqueEmployedGraduates / totalGraduates) * 100) : 0

    // 4. Salary Distribution (from Employed Graduates)
    const salaryDistribution: Record<string, number> = {}
    employedGraduates.forEach(p => {
        if (p.salary_range) {
            salaryDistribution[p.salary_range] = (salaryDistribution[p.salary_range] || 0) + 1
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
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-admin-primary bg-admin-primary/10">
                                    Taxa de Empregabilidade
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-admin-primary">
                                    {employmentRate}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-slate-700">
                            <div
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-admin-primary transition-all duration-500"
                                style={{ width: `${employmentRate}%` }}
                            ></div>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4 mt-2">
                        <div>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{totalGraduates || 0}</p>
                            <p className="text-xs text-gray-500">Total de Formados</p>
                        </div>
                        <div>
                            <p className="text-2xl font-bold text-slate-800 dark:text-white">{continuingEducation || 0}</p>
                            <p className="text-xs text-gray-500">Educação Continuada</p>
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
                            <span className="text-xs font-bold bg-green-100 dark:bg-green-900/30 px-2 py-1 rounded">Média</span>
                        </div>
                    </div>
                    <div className="space-y-4 flex-1">
                        {/* Render simple bars for top 3 ranges */}
                        {Object.entries(salaryDistribution)
                            .sort(([, a], [, b]) => b - a)
                            .slice(0, 3)
                            .map(([range, count]) => {
                                const percentage = Math.round((count / (uniqueEmployedGraduates || 1)) * 100)
                                return (
                                    <div key={range}>
                                        <div className="flex justify-between text-xs mb-1">
                                            <span className="font-semibold">{range}</span>
                                            <span className="text-gray-500">{count} egressos ({percentage}%)</span>
                                        </div>
                                        <div className="w-full bg-gray-100 dark:bg-slate-800 rounded-full h-2">
                                            <div className="bg-green-500 h-2 rounded-full" style={{ width: `${percentage}%` }}></div>
                                        </div>
                                    </div>
                                )
                            })}
                        {Object.keys(salaryDistribution).length === 0 && (
                            <p className="text-sm text-gray-500 text-center py-4">Sem dados salariais suficientes.</p>
                        )}
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
                                <div className="w-full bg-admin-primary/20 rounded-t-lg relative transition-all hover:bg-admin-primary/30" style={{ height: `${item.height * 2}px`, maxHeight: '200px', minHeight: '10px' }}>
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
            </div>
        </div>
    )
}
