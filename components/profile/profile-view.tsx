import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Building2, Calendar, Crown, GraduationCap, Linkedin, Github, Globe, BookOpen, MapPin, Mail, Phone, User, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface ProfileViewProps {
    profile: any;
    academic: any[];
    professional: any[];
    education: any[];
    survey: any;
}

export function ProfileView({ profile, academic, professional, education, survey }: ProfileViewProps) {
    // Helper to format dates
    const formatDate = (dateString: string) => {
        if (!dateString) return "Presente";
        return new Date(dateString).toLocaleDateString('pt-BR', { month: 'short', year: 'numeric' });
    };

    const currentRole = professional?.find((p: any) => p.is_current) || professional?.[0];

    // Deduplication Logic
    // We filter out records that are identical in key fields to previous ones in the list
    const uniqueAcademic = academic?.reduce((acc: any[], current: any) => {
        const x = acc.find(item => item.entry_year === current.entry_year && item.status === current.status);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []) || [];

    const uniqueProfessional = professional?.reduce((acc: any[], current: any) => {
        const x = acc.find(item => item.company_name === current.company_name && item.role_title === current.role_title && item.start_date === current.start_date);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []) || [];

    const uniqueEducation = education?.reduce((acc: any[], current: any) => {
        const x = acc.find(item => item.course_name === current.course_name && item.institution_name === current.institution_name);
        if (!x) {
            return acc.concat([current]);
        } else {
            return acc;
        }
    }, []) || [];


    return (
        <div className="space-y-6">
            {/* Header / Personal Info */}
            <Card>
                <CardHeader className="pb-4">
                    <div className="flex flex-col md:flex-row justify-between gap-4">
                        <div className="flex gap-4 items-start">
                            <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-3xl font-bold uppercase">
                                {profile?.social_name?.[0] || profile?.full_name?.[0] || "U"}
                            </div>
                            <div>
                                <CardTitle className="text-2xl">{profile?.social_name || profile?.full_name}</CardTitle>
                                {profile?.social_name && profile?.social_name !== profile.full_name && (
                                    <p className="text-sm text-muted-foreground mt-1">Nome Completo: {profile.full_name}</p>
                                )}
                                <CardDescription className="text-base mt-2 flex flex-col gap-1">
                                    {currentRole && (
                                        <span className="flex items-center gap-1.5 text-foreground/80 font-medium">
                                            <Building2 className="w-4 h-4" />
                                            {currentRole.role_title} em {currentRole.company_name}
                                        </span>
                                    )}
                                    <span className="flex items-center gap-1.5">
                                        <Mail className="w-4 h-4" /> {profile?.email}
                                    </span>
                                    {profile?.mobile_phone && (
                                        <span className="flex items-center gap-1.5">
                                            <Phone className="w-4 h-4" /> {profile?.mobile_phone}
                                        </span>
                                    )}

                                    <div className="flex flex-wrap gap-3 mt-1 pt-1 border-t border-border/50">
                                        {profile?.linkedin_url && (
                                            <Link href={profile.linkedin_url} target="_blank" className="flex items-center gap-1.5 text-sm text-blue-600 hover:underline">
                                                <Linkedin className="w-4 h-4" /> LinkedIn
                                            </Link>
                                        )}
                                        {profile?.github_url && (
                                            <Link href={profile.github_url} target="_blank" className="flex items-center gap-1.5 text-sm text-foreground hover:underline">
                                                <Github className="w-4 h-4" /> GitHub
                                            </Link>
                                        )}
                                        {profile?.social_media_url && (
                                            <Link href={profile.social_media_url} target="_blank" className="flex items-center gap-1.5 text-sm text-pink-600 hover:underline">
                                                <Globe className="w-4 h-4" /> Rede Social
                                            </Link>
                                        )}
                                        {profile?.lattes_url && (
                                            <Link href={profile.lattes_url} target="_blank" className="flex items-center gap-1.5 text-sm text-foreground hover:underline">
                                                <BookOpen className="w-4 h-4" /> Currículo Lattes
                                            </Link>
                                        )}
                                    </div>
                                </CardDescription>
                            </div>
                        </div>
                        <div className="flex flex-col gap-2 min-w-[140px]">
                            {profile?.is_open_to_mentoring ? (
                                <Badge variant="default" className="w-fit bg-green-600 hover:bg-green-700">
                                    <Crown className="w-3 h-3 mr-1" />
                                    Mentor Disponível
                                </Badge>
                            ) : (
                                <Badge variant="outline" className="w-fit text-muted-foreground">
                                    Mentoria Indisponível
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                {/* Removed CardContent as links are now in Header */}
            </Card>

            {/* Academic Info */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <GraduationCap className="w-5 h-5 text-primary" />
                        Vínculo Acadêmico
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {uniqueAcademic?.length > 0 ? (
                        <div className="space-y-4">
                            {uniqueAcademic.map((record: any) => (
                                <div key={record.id} className="flex justify-between items-start border-b last:border-0 pb-3 last:pb-0">
                                    <div>
                                        <p className="font-semibold">Sistemas de Informação - UEMG</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <Badge variant={record.status === 'formado' ? "default" : "secondary"} className="capitalize">
                                                {record.status}
                                            </Badge>
                                            {record.student_id_code && (
                                                <span className="text-xs text-muted-foreground">Matrícula: {record.student_id_code}</span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="text-right text-sm">
                                        <p>Ingresso: {record.entry_year}</p>
                                        {record.graduation_year && <p className="font-medium text-primary">Conclusão: {record.graduation_year}</p>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">Nenhuma informação acadêmica registrada.</p>
                    )}
                </CardContent>
            </Card>

            {/* Professional History */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <Building2 className="w-5 h-5 text-primary" />
                        Experiência Profissional
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {uniqueProfessional?.length > 0 ? (
                        <div className="space-y-8">
                            {uniqueProfessional.map((role: any) => (
                                <div key={role.id} className="relative pl-4 border-l-2 border-muted pb-1 last:pb-0">
                                    <div className={`absolute -left-[9px] top-0 w-4 h-4 rounded-full border-2 ${role.is_current ? 'bg-primary border-primary' : 'bg-background border-muted-foreground'}`} />
                                    <div className="flex flex-col gap-2">
                                        <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-1">
                                            <div>
                                                <h4 className="font-bold text-base">{role.role_title}</h4>
                                                <p className="text-sm font-medium text-foreground/80">{role.company_name}</p>
                                            </div>
                                            <span className="text-xs text-muted-foreground whitespace-nowrap flex items-center gap-1">
                                                <Calendar className="w-3 h-3" />
                                                {formatDate(role.start_date)} - {role.is_current ? "Atualmente" : formatDate(role.end_date)}
                                            </span>
                                        </div>

                                        {role.salary_range && (
                                            <div className="flex items-center gap-2">
                                                <Badge variant="outline" className="text-[10px] text-muted-foreground border-dashed">
                                                    Faixa: {role.salary_range}
                                                </Badge>
                                            </div>
                                        )}

                                        {/* Tech Stack Display */}
                                        {role.tech_stack && role.tech_stack.length > 0 && (
                                            <div className="mt-1">
                                                <p className="text-xs text-muted-foreground mb-1">Tecnologias:</p>
                                                <div className="flex flex-wrap gap-1">
                                                    {role.tech_stack.map((tech: string, idx: number) => (
                                                        <Badge key={idx} variant="secondary" className="text-[10px] px-2 py-0.5">
                                                            {tech.trim()}
                                                        </Badge>
                                                    ))}
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">Nenhuma experiência profissional registrada.</p>
                    )}
                </CardContent>
            </Card>

            {/* Complementary Education */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-lg">
                        <BookOpen className="w-5 h-5 text-primary" />
                        Formação Complementar
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {uniqueEducation?.length > 0 ? (
                        <div className="grid gap-4 md:grid-cols-2">
                            {uniqueEducation.map((edu: any) => (
                                <div key={edu.id} className="p-4 bg-muted/20 rounded-lg border hover:bg-muted/30 transition-colors">
                                    <h4 className="font-semibold text-sm line-clamp-2" title={edu.course_name}>{edu.course_name}</h4>
                                    <p className="text-xs text-muted-foreground mt-1">{edu.institution_name}</p>
                                    <div className="flex gap-2 mt-3">
                                        <Badge variant="outline" className="text-[10px] bg-background">{edu.degree_type}</Badge>
                                        <Badge variant={edu.status === 'concluido' ? "secondary" : "outline"} className="text-[10px]">
                                            {edu.status?.replace('_', ' ')}
                                        </Badge>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-sm text-muted-foreground italic">Nenhuma formação complementar registrada.</p>
                    )}
                </CardContent>
            </Card>

            {/* Skills & Survey Data */}
            {survey && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-lg">
                            <Crown className="w-5 h-5 text-primary" />
                            Preferências e Habilidades
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-8">
                        <div className="grid gap-8 md:grid-cols-2">

                            {/* Useful Areas */}
                            {survey.most_useful_areas && survey.most_useful_areas.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                                        Áreas de Interesse / Úteis
                                    </h5>
                                    <div className="flex flex-wrap gap-1.5">
                                        {survey.most_useful_areas.map((area: string, i: number) => (
                                            <Badge key={i} variant="secondary" className="px-2 py-1">{area}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Soft Skills */}
                            {survey.soft_skills_desired && survey.soft_skills_desired.length > 0 && (
                                <div>
                                    <h5 className="text-sm font-semibold mb-3 flex items-center gap-2">
                                        <User className="w-4 h-4 text-blue-600" />
                                        Soft Skills Prioritárias
                                    </h5>
                                    <div className="flex flex-wrap gap-1.5">
                                        {survey.soft_skills_desired.map((skill: string, i: number) => (
                                            <Badge key={i} variant="outline" className="border-primary/20 px-2 py-1">{skill}</Badge>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Methodologies */}
                            {survey.methodology_priority && survey.methodology_priority.length > 0 && (
                                <div className="md:col-span-2">
                                    <h5 className="text-sm font-semibold mb-2">Preferências Metodológicas</h5>
                                    <div className="bg-muted/20 p-3 rounded-lg border">
                                        <ul className="space-y-1">
                                            {survey.methodology_priority.map((item: string, i: number) => (
                                                <li key={i} className="text-sm text-foreground/80 flex items-start gap-2">
                                                    <span className="text-primary mt-1">•</span>
                                                    {item}
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                </div>
                            )}

                            {/* Missing Tech */}
                            {survey.missing_technologies && (
                                <div className="md:col-span-2">
                                    <h5 className="text-sm font-semibold mb-2">Tecnologias Faltantes (sentidas no mercado)</h5>
                                    <p className="text-sm text-foreground/90 bg-amber-50 dark:bg-amber-950/20 p-3 rounded-md border border-amber-100 dark:border-amber-900/50">
                                        {survey.missing_technologies}
                                    </p>
                                </div>
                            )}

                            {/* Employability */}
                            {survey.employability_impact && (
                                <div className="md:col-span-2 flex items-center justify-between bg-muted/30 p-4 rounded-lg">
                                    <span className="text-sm font-medium">Impacto do Curso na Empregabilidade</span>
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-bold">{survey.employability_impact} / 5</span>
                                        <div className="flex gap-0.5">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <div key={star} className={`w-2 h-2 rounded-full ${star <= survey.employability_impact ? 'bg-primary' : 'bg-muted-foreground/30'}`} />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        {survey.suggestions && (
                            <>
                                <Separator />
                                <div>
                                    <h5 className="text-sm font-semibold mb-2">Sugestões e Críticas</h5>
                                    <p className="text-sm text-muted-foreground italic border-l-2 border-primary/50 pl-4 py-1">
                                        "{survey.suggestions}"
                                    </p>
                                </div>
                            </>
                        )}
                    </CardContent>
                </Card>
            )}
        </div>
    );
}
