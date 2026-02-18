"use client"

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { MapPin, Building2, Globe, Trash2, Loader2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import Link from "next/link"
import { deleteJob } from "@/app/jobs/actions"
import { toast } from "sonner"
import { useState } from "react"

import { Job } from "./types"

interface JobCardProps {
    job: Job
    currentUserId?: string
}

export function JobCard({ job, currentUserId }: JobCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const isOwner = currentUserId === job.author_id

    async function handleDelete() {
        if (!confirm("Remover esta vaga?")) return
        setIsDeleting(true)
        const result = await deleteJob(job.id)
        setIsDeleting(false)
        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success("Vaga removida")
        }
    }

    const typeLabels: Record<string, string> = {
        estagio: "Estágio",
        emprego: "Emprego",
        trainee: "Trainee",
        freelance: "Freelance",
        projeto_pesquisa: "Projeto de Pesquisa"
    }

    return (
        <Card className="h-full flex flex-col relative group">
            <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-lg">{job.title}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                            <Building2 className="h-3 w-3" /> {job.company}
                        </CardDescription>
                    </div>
                    <div className="flex flex-col gap-1 items-end">
                        <Badge variant="outline">
                            {typeLabels[job.type] || job.type}
                        </Badge>
                        <Badge variant={job.work_mode === 'remoto' ? 'default' : 'secondary'}>
                            {job.work_mode?.toUpperCase() || "PRESENCIAL"}
                        </Badge>
                        {job.expires_at && new Date(job.expires_at) < new Date() && (
                            <Badge variant="destructive">EXPIRADA</Badge>
                        )}
                    </div>
                </div>
                {isOwner && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                )}
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-4">
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                        <MapPin className="h-3 w-3" /> {job.location}
                    </span>
                    <span>•</span>
                    <span suppressHydrationWarning>
                        {formatDistanceToNow(new Date(job.created_at), { addSuffix: true, locale: ptBR })}
                    </span>
                </div>

                <p className="text-sm line-clamp-3 text-muted-foreground">
                    {job.description}
                </p>

                <div className="mt-auto pt-2">
                    <Link href={job.link_url} target="_blank" rel="noopener noreferrer" className="w-full">
                        <Button className="w-full" variant="outline">
                            <Globe className="mr-2 h-4 w-4" />
                            Candidatar-se
                        </Button>
                    </Link>
                </div>
            </CardContent>
        </Card>
    )
}
