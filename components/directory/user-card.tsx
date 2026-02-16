"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { Linkedin, Github, User } from "lucide-react"

// Types based on the action return
interface UserProfile {
    id: string
    full_name: string
    avatar_url: string | null
    linkedin_url: string | null
    github_url: string | null
    is_open_to_mentoring: boolean
    currentJob?: {
        role_title: string
        company_name: string
    }
    academicStatus: string
}

interface UserCardProps {
    profile: UserProfile
}

export function UserCard({ profile }: UserCardProps) {
    const initials = profile.full_name ? profile.full_name.slice(0, 2).toUpperCase() : "??"

    return (
        <Card className="h-full flex flex-col">
            <CardHeader className="flex flex-row items-center gap-4 pb-2">
                <Avatar className="h-12 w-12">
                    <AvatarImage src={profile.avatar_url || ""} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col overflow-hidden">
                    <span className="font-semibold truncate" title={profile.full_name}>
                        {profile.full_name}
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
                        <Badge variant="outline" className="text-xs border-primary text-primary">
                            Mentor
                        </Badge>
                    )}
                </div>

                <div className="mt-auto flex gap-2 pt-2">
                    {profile.linkedin_url && (
                        <Link href={profile.linkedin_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-[#0077b5]">
                                <Linkedin className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                    {profile.github_url && (
                        <Link href={profile.github_url} target="_blank" rel="noopener noreferrer">
                            <Button variant="ghost" size="icon" className="h-8 w-8 hover:text-black dark:hover:text-white">
                                <Github className="h-4 w-4" />
                            </Button>
                        </Link>
                    )}
                </div>
            </CardContent>
        </Card>
    )
}
