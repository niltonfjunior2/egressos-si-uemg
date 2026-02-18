import { createClient, createAdminClient } from "@/utils/supabase/server"
import { notFound, redirect } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, User, Briefcase, GraduationCap, MapPin, Linkedin, Github, Globe, Calendar, Mail } from "lucide-react"
import Link from "next/link"

export default async function UserDetailsPage({ params }: { params: Promise<{ id: string }> }) {
    // Client for Auth Context (Uses Cookies)
    const supabaseAuth = await createClient()

    // Client for Data Fetching (Bypasses RLS)
    const supabaseAdmin = createAdminClient()

    // RBAC Check
    const { data: currentUser } = await supabaseAuth.auth.getUser()
    if (!currentUser.user) redirect('/login')

    // Fetch current user role to ensure admin
    const { data: adminProfile } = await supabaseAuth.from('profiles').select('role').eq('id', currentUser.user.id).single()
    if (!adminProfile || !['administrador', 'coordenador'].includes(adminProfile.role)) {
        redirect('/feed')
    }

    const { id } = await params

    // Fetch User Data (using Admin Client)
    const { data: profile, error } = await supabaseAdmin
        .from('profiles')
        .select(`
            *,
            academic_records(*),
            professional_history(*),
            education_history(*),
            profile_surveys(*),
            opportunity_interests(
                created_at,
                opportunities(title, company, type)
            )
        `)
        .eq('id', id)
        .single()

    if (error || !profile) {
        return (
            <div className="flex flex-col items-center justify-center p-8 text-center">
                <h1 className="text-2xl font-bold mb-4">Perfil não encontrado</h1>
                <p className="text-gray-500 mb-4">
                    Não foi possível encontrar o usuário com ID {id}.
                </p>
                <Link href="/admin/users">
                    <Button variant="default" className="mt-4">Voltar para lista</Button>
                </Link>
            </div>
        )
    }

    // Sort histories
    const academic = profile.academic_records || []
    const professional = (profile.professional_history || []).sort((a: any, b: any) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
    const education = (profile.education_history || []).sort((a: any, b: any) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime())
    const interests = profile.opportunity_interests || []
    const survey = profile.profile_surveys?.[0] || profile.profile_surveys || null // Handle single vs array depending on relation, though it's 1:1 typically returning array or object in supabase join? .single() on top might not apply to nested. Usually returns array. Let's assume array.

    // Helper to get survey object if it is an array
    const surveyData = Array.isArray(profile.profile_surveys) ? profile.profile_surveys[0] : profile.profile_surveys

    const currentJob = professional.find((p: any) => p.is_current)

    // Calculate time to first job (Regulatory Insight)
    let timeToFirstJob = "N/A"
    if (academic.length > 0 && academic[0].status === 'formado') {
        const gradYear = parseInt(academic[0].graduation_year)
        // Find first professional start date after graduation (or same year)
        const firstJob = [...professional].sort((a: any, b: any) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime())
            .find((p: any) => new Date(p.start_date).getFullYear() >= gradYear)

        if (firstJob) {
            const jobYear = new Date(firstJob.start_date).getFullYear()
            const diff = jobYear - gradYear
            timeToFirstJob = diff <= 0 ? "Imediata (Durante/Logo após)" : `${diff} ano(s)`
        } else {
            timeToFirstJob = "Não registrado ainda"
        }
    }

    return (
        <div className="space-y-8 max-w-5xl mx-auto pb-10 px-4 sm:px-6">
            {/* Header / Nav */}
            <div className="flex items-center space-x-4">
                <Link href="/admin/users">
                    <Button variant="ghost" size="icon">
                        <ArrowLeft className="h-5 w-5" />
                    </Button>
                </Link>
                <div>
                    <h1 className="text-2xl font-bold">{profile.full_name}</h1>
                    {profile.social_name && <p className="text-sm text-gray-500">({profile.social_name})</p>}
                    <p className="text-gray-500 text-sm">Ficha do Egresso • Cadastrado em {new Date(profile.created_at).toLocaleDateString()}</p>
                </div>
            </div>

            {/* Main Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {/* Left Column: Profile Card */}
                <div className="space-y-6">
                    <Card>
                        <CardContent className="pt-6 flex flex-col items-center text-center">
                            <div className="h-24 w-24 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 text-2xl font-bold mb-4 uppercase">
                                {profile.full_name.charAt(0)}
                            </div>
                            <h2 className="font-bold text-xl">{profile.full_name}</h2>
                            <p className="text-gray-500 mb-2">{currentJob ? `${currentJob.role_title} at ${currentJob.company_name}` : 'Sem cargo atual'}</p>

                            <div className="flex gap-2 mb-6">
                                <Badge variant={profile.role === 'egresso' ? 'default' : 'secondary'}>{profile.role}</Badge>
                                {profile.is_open_to_mentoring && <Badge variant="outline" className="border-green-500 text-green-600">Mentor</Badge>}
                            </div>

                            <div className="w-full space-y-3 text-left border-t pt-4">
                                <div className="flex items-center text-sm text-gray-600">
                                    <Mail className="h-4 w-4 mr-3 text-gray-400" />
                                    {profile.email}
                                </div>
                                {profile.mobile_phone && (
                                    <div className="flex items-center text-sm text-gray-600">
                                        <div className="h-4 w-4 mr-3 flex items-center justify-center text-gray-400 font-bold text-[10px]">P</div>
                                        {profile.mobile_phone}
                                    </div>
                                )}

                                <div className="pt-2 space-y-2">
                                    {profile.linkedin_url && (
                                        <a href={profile.linkedin_url} target="_blank" className="flex items-center text-sm text-blue-600 hover:underline">
                                            <Linkedin className="h-4 w-4 mr-3" />
                                            LinkedIn
                                        </a>
                                    )}
                                    {profile.github_url && (
                                        <a href={profile.github_url} target="_blank" className="flex items-center text-sm text-gray-700 hover:underline">
                                            <Github className="h-4 w-4 mr-3" />
                                            GitHub
                                        </a>
                                    )}
                                    {profile.portfolio_url && (
                                        <a href={profile.portfolio_url} target="_blank" className="flex items-center text-sm text-purple-600 hover:underline">
                                            <Globe className="h-4 w-4 mr-3" />
                                            Portfolio
                                        </a>
                                    )}
                                    {profile.lattes_url && (
                                        <a href={profile.lattes_url} target="_blank" className="flex items-center text-sm text-blue-800 hover:underline">
                                            <Globe className="h-4 w-4 mr-3" />
                                            Currículo Lattes
                                        </a>
                                    )}
                                    {profile.social_media_url && (
                                        <a href={profile.social_media_url} target="_blank" className="flex items-center text-sm text-pink-600 hover:underline">
                                            <Globe className="h-4 w-4 mr-3" />
                                            Rede Social (Outros)
                                        </a>
                                    )}
                                </div>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Quick Stats */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-sm uppercase text-gray-500">Insights Regulatórios</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            <div>
                                <p className="text-xs text-gray-500">Tempo até 1º Emprego</p>
                                <p className="font-medium">{timeToFirstJob}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Ano de Graduação</p>
                                <p className="font-medium">{academic[0]?.graduation_year || 'N/A'}</p>
                            </div>
                            <div>
                                <p className="text-xs text-gray-500">Matrícula</p>
                                <p className="font-medium">{academic[0]?.student_id_code || 'N/A'}</p>
                            </div>
                        </CardContent>
                    </Card>
                </div>

                {/* Right Column: Timeline & Info */}
                <div className="md:col-span-2 space-y-6">
                    <Tabs defaultValue="timeline">
                        <TabsList className="w-full justify-start overflow-x-auto">
                            <TabsTrigger value="timeline">Linha do Tempo</TabsTrigger>
                            <TabsTrigger value="interests">Interesses & Vagas</TabsTrigger>
                            <TabsTrigger value="details">Dados Complementares</TabsTrigger>
                        </TabsList>

                        <TabsContent value="timeline" className="space-y-6 mt-4">
                            {/* Professional Timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg">
                                        <Briefcase className="mr-2 h-5 w-5 text-admin-primary" />
                                        Histórico Profissional
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="relative border-l-2 border-slate-200 ml-3 space-y-8 pl-6 pb-2">
                                        {professional.length > 0 ? professional.map((job: any) => (
                                            <div key={job.id} className="relative">
                                                <div className={`absolute -left-[31px] bg-white border-2 h-4 w-4 rounded-full ${job.is_current ? 'border-green-500 bg-green-500' : 'border-slate-300'}`}></div>
                                                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start">
                                                    <div>
                                                        <h4 className="font-bold text-base">{job.role_title}</h4>
                                                        <p className="text-sm text-gray-600 font-medium">{job.company_name}</p>
                                                        {job.salary_range && <p className="text-xs text-gray-500 mt-1">Faixa: {job.salary_range}</p>}
                                                        {job.tech_stack && job.tech_stack.length > 0 && (
                                                            <div className="flex flex-wrap gap-1 mt-2">
                                                                {job.tech_stack.map((t: string) => (
                                                                    <span key={t} className="text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600 border border-slate-200">{t}</span>
                                                                ))}
                                                            </div>
                                                        )}
                                                    </div>
                                                    <div className="text-xs text-gray-400 mt-1 sm:mt-0 font-mono">
                                                        {new Date(job.start_date).getFullYear()} - {job.end_date ? new Date(job.end_date).getFullYear() : 'Atual'}
                                                    </div>
                                                </div>
                                            </div>
                                        )) : (
                                            <p className="text-sm text-gray-500 italic">Nenhum registro profissional.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>

                            {/* Education Timeline */}
                            <Card>
                                <CardHeader>
                                    <CardTitle className="flex items-center text-lg">
                                        <GraduationCap className="mr-2 h-5 w-5 text-blue-600" />
                                        Formação Acadêmica
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {/* UEMG Record (Always assumed exists or fetched) */}
                                        {academic.map((rec: any) => (
                                            <div key={rec.id} className="flex gap-4 p-4 bg-slate-50 rounded-lg">
                                                <div className="bg-white p-2 rounded border h-fit">
                                                    <GraduationCap className="h-6 w-6 text-blue-600" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">Sistemas de Informação</h4>
                                                    <p className="text-sm text-gray-600">UEMG - Universidade do Estado de Minas Gerais</p>
                                                    <div className="flex gap-3 text-xs text-gray-500 mt-2">
                                                        <span className="flex items-center">
                                                            <Calendar className="h-3 w-3 mr-1" />
                                                            {rec.entry_year} - {rec.graduation_year || 'Em andamento'}
                                                        </span>
                                                        <span className={`font-bold px-2 py-0.5 rounded ${rec.status === 'formado' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                                            {rec.status ? rec.status.toUpperCase() : 'N/A'}
                                                        </span>
                                                    </div>
                                                </div>
                                            </div>
                                        ))}

                                        {education.map((edu: any) => (
                                            <div key={edu.id} className="flex gap-4 p-4 border rounded-lg">
                                                <div className="bg-slate-50 p-2 rounded border h-fit">
                                                    <GraduationCap className="h-6 w-6 text-slate-500" />
                                                </div>
                                                <div>
                                                    <h4 className="font-bold">{edu.degree_type} em {edu.course_name}</h4>
                                                    <p className="text-sm text-gray-600">{edu.institution_name}</p>
                                                    <p className="text-xs text-gray-400 mt-1">
                                                        {edu.status}
                                                    </p>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="interests" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Interesse em Vagas</CardTitle>
                                    <CardDescription>Vagas que o aluno demonstrou interesse na plataforma.</CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="space-y-4">
                                        {interests.length > 0 ? interests.map((interest: any) => (
                                            <div key={interest.created_at} className="flex justify-between items-center p-3 border rounded-lg hover:bg-slate-50 transition-colors">
                                                <div>
                                                    <h4 className="font-medium text-sm">{interest.opportunities?.title || 'Vaga desconhecida'}</h4>
                                                    <p className="text-xs text-gray-500">{interest.opportunities?.company} • {interest.opportunities?.type}</p>
                                                </div>
                                                <div className="text-xs text-gray-400">
                                                    {new Date(interest.created_at).toLocaleDateString()}
                                                </div>
                                            </div>
                                        )) : (
                                            <div className="text-center py-8 text-gray-500">
                                                Nenhum interesse registrado.
                                            </div>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </TabsContent>

                        <TabsContent value="details" className="mt-4">
                            <Card>
                                <CardHeader>
                                    <CardTitle>Dados do Questionário (Survey)</CardTitle>
                                </CardHeader>
                                <CardContent>
                                    {surveyData ? (
                                        <div className="space-y-6">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-500 mb-2">Áreas de Interesse / Destaque</h4>
                                                    {surveyData.most_useful_areas && surveyData.most_useful_areas.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {surveyData.most_useful_areas.map((area: string) => (
                                                                <Badge key={area} variant="secondary" className="text-xs">{area}</Badge>
                                                            ))}
                                                        </div>
                                                    ) : <p className="text-sm text-gray-400">Não informado</p>}
                                                </div>

                                                <div>
                                                    <h4 className="text-sm font-bold text-gray-500 mb-2">Soft Skills Desejadas</h4>
                                                    {surveyData.soft_skills_desired && surveyData.soft_skills_desired.length > 0 ? (
                                                        <div className="flex flex-wrap gap-1">
                                                            {surveyData.soft_skills_desired.map((skill: string) => (
                                                                <Badge key={skill} variant="outline" className="text-xs">{skill}</Badge>
                                                            ))}
                                                        </div>
                                                    ) : <p className="text-sm text-gray-400">Não informado</p>}
                                                </div>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-bold text-gray-500 mb-1">Tecnologias que sentiu falta</h4>
                                                <p className="text-sm bg-slate-50 p-3 rounded-md border border-slate-100">
                                                    {surveyData.missing_technologies || "Nenhuma observação."}
                                                </p>
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-bold text-gray-500 mb-1">Metodologias Prioritárias</h4>
                                                {surveyData.methodology_priority && surveyData.methodology_priority.length > 0 ? (
                                                    <p className="text-sm">{surveyData.methodology_priority.join(', ')}</p>
                                                ) : <p className="text-sm text-gray-400">Não informado</p>}
                                            </div>

                                            <div>
                                                <h4 className="text-sm font-bold text-gray-500 mb-1">Sugestões de Melhoria</h4>
                                                <p className="text-sm italic text-gray-600">
                                                    "{surveyData.suggestions || "Nenhuma sugestão."}"
                                                </p>
                                            </div>
                                        </div>
                                    ) : (
                                        <div className="text-center py-8 text-gray-500">
                                            Questionário de perfil ainda não preenchido.
                                        </div>
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    </Tabs>
                </div>
            </div>
        </div>
    )
}
