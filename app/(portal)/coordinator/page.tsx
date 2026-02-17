import { getCoordinatorProfile } from "./actions"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Linkedin, Github, Mail, Globe, BookOpen } from "lucide-react"

export default async function CoordinatorPage() {
    const { data: coordinator, error } = await getCoordinatorProfile()

    if (error) {
        return (
            <div className="container mx-auto py-10 px-4 text-center text-red-500">
                <p>Erro ao carregar informações do coordenador. Tente novamente mais tarde.</p>
            </div>
        )
    }

    if (!coordinator) {
        return (
            <div className="container mx-auto py-10 px-4 text-center text-muted-foreground">
                <p>Informações do coordenador não encontradas.</p>
            </div>
        )
    }

    const displayName = coordinator.social_name || coordinator.full_name
    const initials = displayName ? displayName.slice(0, 2).toUpperCase() : "??"
    const currentJob = coordinator.professional_history?.find((ph: any) => ph.is_current)

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-slate-800">Coordenação do Curso</h1>

            <div className="max-w-3xl mx-auto">
                <Card>
                    <CardHeader className="flex flex-col sm:flex-row items-center gap-6 pb-6 border-b">
                        <div className="text-center sm:text-left space-y-2">
                            <h2 className="text-2xl font-bold">{displayName}</h2>
                            <div className="flex flex-wrap justify-center sm:justify-start gap-2">
                                <Badge variant="secondary" className="text-sm">
                                    Coordenador(a)
                                </Badge>
                                {currentJob && (
                                    <Badge variant="outline" className="text-sm">
                                        {currentJob.role_title} @ {currentJob.company_name}
                                    </Badge>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent className="pt-6 space-y-6">
                        {/* Contact Info */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Mail className="h-5 w-5 text-primary" /> Contato
                                </h3>
                                <div>
                                    <span className="text-sm text-muted-foreground block">E-mail:</span>
                                    {coordinator.email ? (
                                        <a href={`mailto:${coordinator.email}`} className="text-primary hover:underline font-medium">
                                            {coordinator.email}
                                        </a>
                                    ) : (
                                        <span className="text-muted-foreground">Não informado</span>
                                    )}
                                </div>
                                {/* Phone is intentionally excluded as per requirements */}
                            </div>

                            <div className="space-y-4">
                                <h3 className="font-semibold text-lg flex items-center gap-2">
                                    <Globe className="h-5 w-5 text-primary" /> Redes & Links
                                </h3>
                                <div className="flex flex-wrap gap-2">
                                    {coordinator.linkedin_url && (
                                        <Link href={coordinator.linkedin_url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <Linkedin className="h-4 w-4 text-blue-600" /> LinkedIn
                                            </Button>
                                        </Link>
                                    )}
                                    {coordinator.github_url && (
                                        <Link href={coordinator.github_url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <Github className="h-4 w-4" /> GitHub
                                            </Button>
                                        </Link>
                                    )}
                                    {coordinator.lattes_url && (
                                        <Link href={coordinator.lattes_url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <BookOpen className="h-4 w-4" /> Currículo Lattes
                                            </Button>
                                        </Link>
                                    )}
                                    {coordinator.social_media_url && (
                                        <Link href={coordinator.social_media_url} target="_blank" rel="noopener noreferrer">
                                            <Button variant="outline" size="sm" className="gap-2">
                                                <Globe className="h-4 w-4 text-pink-600" /> Rede Social
                                            </Button>
                                        </Link>
                                    )}
                                    {(!coordinator.linkedin_url && !coordinator.github_url && !coordinator.lattes_url && !coordinator.social_media_url) && (
                                        <span className="text-muted-foreground text-sm italic">Nenhum link cadastrado.</span>
                                    )}
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
