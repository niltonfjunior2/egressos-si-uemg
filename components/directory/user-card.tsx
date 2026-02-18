"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Linkedin, Github, User, Mail, Phone, Globe, BookOpen } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"

// Types based on the action return
interface UserProfile {
    id: string
    full_name: string
    social_name?: string | null
    avatar_url: string | null
    linkedin_url: string | null
    github_url: string | null
    is_open_to_mentoring: boolean
    currentJob?: {
        role_title: string
        company_name: string
        tech_stack?: string[] | null
    }
    academicStatus: string
    email?: string
    mobile_phone?: string | null
    social_media_url?: string | null
    lattes_url?: string | null
}

interface UserCardProps {
    profile: UserProfile
}

export function UserCard({ profile }: UserCardProps) {
    const displayName = profile.social_name || profile.full_name
    const initials = displayName ? displayName.slice(0, 2).toUpperCase() : "??"

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">

                <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold truncate" title={displayName}>
                        {displayName}
                    </span>
                    <span className="text-xs text-muted-foreground truncate">
                        {profile.currentJob
                            ? `${profile.currentJob.role_title} @ ${profile.currentJob.company_name}`
                            : "Disponível para oportunidades"
                        }
                    </span>
                </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col gap-3 pt-2">
                <div className="flex flex-wrap gap-2">
                    {profile.academicStatus !== 'N/A' && (
                        <Badge variant="secondary" className="text-xs">
                            {profile.academicStatus.toUpperCase()}
                        </Badge>
                    )}
                    {profile.is_open_to_mentoring && (
                        <Badge className="text-sm bg-green-600 hover:bg-green-700 text-white border-none px-3 py-1">
                            Mentor
                        </Badge>
                    )}
                </div>



                <Dialog>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm" className="w-full mt-2">
                            Ver mais informações de contato
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Contatos de {displayName}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 pt-4">
                            {profile.email && (
                                <div className="flex items-center gap-3">
                                    <div className="bg-primary/10 p-2 rounded-full">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="flex flex-col">
                                        <span className="text-xs text-muted-foreground">E-mail</span>
                                        <a href={`mailto:${profile.email}`} className="text-sm font-medium hover:underline">
                                            {profile.email}
                                        </a>
                                    </div>
                                </div>
                            )}
                            <div className="flex flex-wrap gap-2 mt-2">
                                {profile.linkedin_url && (
                                    <Link href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Linkedin className="h-4 w-4 text-blue-600" /> LinkedIn
                                        </Button>
                                    </Link>
                                )}
                                {profile.github_url && (
                                    <Link href={profile.github_url} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Github className="h-4 w-4" /> GitHub
                                        </Button>
                                    </Link>
                                )}
                                {profile.social_media_url && (
                                    <Link href={profile.social_media_url} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <Globe className="h-4 w-4 text-pink-600" /> Rede Social
                                        </Button>
                                    </Link>
                                )}
                                {profile.lattes_url && (
                                    <Link href={profile.lattes_url} target="_blank" rel="noopener noreferrer">
                                        <Button variant="outline" size="sm" className="gap-2">
                                            <BookOpen className="h-4 w-4" /> Currículo Lattes
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </DialogContent>
                </Dialog>
            </CardContent>
        </Card >
    )
}
