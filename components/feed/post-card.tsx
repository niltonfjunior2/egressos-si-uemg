"use client"

import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"
import { deletePost } from "@/app/feed/actions"
import { toast } from "sonner"
import { useState } from "react"
import { Loader2 } from "lucide-react"

import { Post } from "./types"

interface PostCardProps {
    post: Post
    currentUserId?: string
}

export function PostCard({ post, currentUserId }: PostCardProps) {
    const [isDeleting, setIsDeleting] = useState(false)

    async function handleDelete() {
        if (!confirm("Remover esta postagem?")) return

        setIsDeleting(true)
        const result = await deletePost(post.id)
        setIsDeleting(false)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success("Postagem removida")
        }
    }

    const authorName = post.profiles?.social_name || post.profiles?.full_name || "Usuário Desconhecido"
    const initials = authorName.slice(0, 2).toUpperCase()
    const isAuthor = currentUserId === post.author_id

    return (
        <Card className="mb-4">
            <CardHeader className="flex flex-row items-center gap-4 p-4 pb-2">
                <Avatar>
                    <AvatarImage src={post.profiles?.avatar_url || ""} />
                    <AvatarFallback>{initials}</AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                    <span className="font-semibold text-sm">{authorName}</span>
                    <span className="text-xs text-muted-foreground" suppressHydrationWarning>
                        {formatDistanceToNow(new Date(post.created_at), { addSuffix: true, locale: ptBR })}
                    </span>
                </div>
                {isAuthor && (
                    <Button
                        variant="ghost"
                        size="icon"
                        className="ml-auto h-8 w-8 text-muted-foreground hover:text-destructive"
                        onClick={handleDelete}
                        disabled={isDeleting}
                    >
                        {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                    </Button>
                )}
            </CardHeader>
            <CardContent className="p-4 pt-2">
                <p className="whitespace-pre-wrap text-sm">{post.content}</p>
            </CardContent>
        </Card>
    )
}
