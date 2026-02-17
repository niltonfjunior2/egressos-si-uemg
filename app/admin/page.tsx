import { createClient } from "@/utils/supabase/server"
import Link from "next/link"
import { Users, Briefcase, Calendar, CheckCircle, Clock, AlertTriangle } from "lucide-react"

export default async function AdminDashboard() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    const userName = user?.user_metadata?.full_name || "Administrador"
    const firstName = userName.split(" ")[0]

    // Fetch stats
    const { count: totalGraduates } = await supabase
        .from('profiles')
        .select('*', { count: 'exact', head: true })
        .eq('role', 'egresso') // Or 'aluno' if no egressos yet

    const { count: openJobs } = await supabase
        .from('opportunities')
        .select('*', { count: 'exact', head: true })
        .eq('status', 'aberta')

    // Mock data for events/system status as they might not have tables yet
    const verifiedUsersPercent = 85

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
                        <h3 className="font-bold text-gray-700 dark:text-gray-200">Visão Geral do Sistema</h3>
                        <Users className="text-admin-primary h-6 w-6" />
                    </div>
                    <div className="relative pt-1">
                        <div className="flex mb-2 items-center justify-between">
                            <div>
                                <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-admin-primary bg-admin-primary/10">
                                    Usuários Verificados
                                </span>
                            </div>
                            <div className="text-right">
                                <span className="text-xs font-semibold inline-block text-admin-primary">
                                    {verifiedUsersPercent}%
                                </span>
                            </div>
                        </div>
                        <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-gray-200 dark:bg-slate-700">
                            <div
                                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-admin-primary transition-all duration-500"
                                style={{ width: `${verifiedUsersPercent}%` }}
                            ></div>
                        </div>
                    </div>
                    <p className="text-sm text-gray-500 mb-4">Total de {totalGraduates || 0} egressos registrados na plataforma.</p>
                    <Link href="/admin/users" className="w-full py-2.5 bg-admin-primary text-white font-semibold rounded-lg hover:bg-opacity-90 transition-all text-center text-sm">
                        Gerenciar Usuários
                    </Link>
                </div>

                {/* Pending Jobs Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200">Vagas Pendentes</h3>
                        <Briefcase className="text-admin-accent h-6 w-6" />
                    </div>
                    <div className="space-y-4 flex-1">
                        {/* Mock pending items */}
                        <div className="flex items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                            <div className="h-10 w-10 bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center rounded-lg text-blue-600 mr-3">
                                <Clock className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold">Estágio em Dev</h4>
                                <p className="text-xs text-gray-500">SoftHouse • 2 dias atrás</p>
                            </div>
                            <button className="text-xs font-medium text-admin-primary hover:underline">Revisar</button>
                        </div>
                        <div className="flex items-center p-3 rounded-xl bg-gray-50 dark:bg-slate-800 border border-gray-100 dark:border-slate-700">
                            <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center rounded-lg text-purple-600 mr-3">
                                <AlertTriangle className="h-5 w-5" />
                            </div>
                            <div className="flex-1">
                                <h4 className="text-sm font-bold">Analista Jr</h4>
                                <p className="text-xs text-gray-500">Banco XPTO • 5 dias atrás</p>
                            </div>
                            <button className="text-xs font-medium text-admin-primary hover:underline">Revisar</button>
                        </div>
                    </div>
                    <Link href="/admin/jobs" className="w-full mt-4 text-admin-primary font-semibold text-sm hover:underline text-center">
                        Ver todas as {openJobs || 0} vagas abertas
                    </Link>
                </div>

                {/* Upcoming Events Card */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800 flex flex-col">
                    <div className="flex justify-between items-start mb-4">
                        <h3 className="font-bold text-gray-700 dark:text-gray-200">Próximos Eventos</h3>
                        <Calendar className="text-orange-500 h-6 w-6" />
                    </div>
                    <div className="space-y-4 flex-1">
                        <div className="flex items-start space-x-3">
                            <div className="bg-admin-primary/10 text-admin-primary p-2 rounded-lg flex flex-col items-center justify-center min-w-[50px]">
                                <span className="text-xs font-bold uppercase leading-none">Abr</span>
                                <span className="text-lg font-bold">15</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">Semana de TI 2024</h4>
                                <p className="text-xs text-gray-500">Campus UEMG Carangola</p>
                            </div>
                        </div>
                        <div className="flex items-start space-x-3">
                            <div className="bg-admin-accent/10 text-admin-accent p-2 rounded-lg flex flex-col items-center justify-center min-w-[50px]">
                                <span className="text-xs font-bold uppercase leading-none">Mai</span>
                                <span className="text-lg font-bold">02</span>
                            </div>
                            <div>
                                <h4 className="text-sm font-bold">Hackathon Regional</h4>
                                <p className="text-xs text-gray-500">Auditório Principal</p>
                            </div>
                        </div>
                    </div>
                    <button className="w-full mt-4 bg-gray-100 dark:bg-slate-800 py-2 rounded-lg text-gray-700 dark:text-gray-300 font-semibold text-sm hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors">
                        Gerenciar Eventos
                    </button>
                </div>

                {/* CSS Bar Chart Section */}
                <div className="lg:col-span-3 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-gray-200 dark:border-slate-800">
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
                        <div>
                            <h3 className="font-bold text-xl text-gray-800 dark:text-gray-100">Egressos no Mercado</h3>
                            <p className="text-sm text-gray-500">Distribuição profissional dos graduados em SI - UEMG</p>
                        </div>
                        <div className="mt-4 md:mt-0 flex space-x-2">
                            <div className="flex items-center">
                                <span className="w-3 h-3 bg-admin-primary rounded-full mr-2"></span>
                                <span className="text-xs text-gray-500">Setor Privado</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-3 h-3 bg-admin-accent rounded-full mr-2"></span>
                                <span className="text-xs text-gray-500">Empreendedorismo</span>
                            </div>
                            <div className="flex items-center">
                                <span className="w-3 h-3 bg-gray-400 rounded-full mr-2"></span>
                                <span className="text-xs text-gray-500">Acadêmico</span>
                            </div>
                        </div>
                    </div>

                    {/* The Chart */}
                    <div className="h-64 w-full flex items-end justify-around pb-4 border-b border-gray-100 dark:border-slate-800 space-x-2">
                        {[
                            { year: '2019', h1: 140, h2: 110 },
                            { year: '2020', h1: 160, h2: 130 },
                            { year: '2021', h1: 180, h2: 155 },
                            { year: '2022', h1: 200, h2: 185 },
                            { year: '2023', h1: '100%', h2: '92%' }
                        ].map((item) => (
                            <div key={item.year} className="flex flex-col items-center w-full max-w-[60px] group">
                                <div className="w-full bg-admin-primary/20 rounded-t-lg relative" style={{ height: typeof item.h1 === 'number' ? `${item.h1}px` : item.h1 }}>
                                    <div
                                        className="absolute bottom-0 w-full bg-admin-primary rounded-t-lg transition-all group-hover:scale-105"
                                        style={{ height: typeof item.h2 === 'number' ? `${item.h2}px` : item.h2 }}
                                    ></div>
                                </div>
                                <span className="text-[10px] mt-2 text-gray-400 font-bold uppercase">{item.year}</span>
                            </div>
                        ))}
                    </div>

                    <div className="mt-6 p-4 bg-admin-primary/5 rounded-xl border border-admin-primary/10 flex items-center justify-between">
                        <div className="flex items-center">
                            <div className="bg-admin-primary/10 p-2 rounded-full mr-3">
                                <CheckCircle className="text-admin-primary h-5 w-5" />
                            </div>
                            <span className="text-sm text-admin-primary font-medium">92% dos egressos de 2023 já estão atuando na área de tecnologia.</span>
                        </div>
                        <button className="text-xs font-bold text-admin-primary hover:underline uppercase tracking-wider">Ver Relatório Completo</button>
                    </div>
                </div>
            </div>
        </div>
    )
}
