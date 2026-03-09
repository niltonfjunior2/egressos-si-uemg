"use client"

import { useState, useTransition } from "react"
import { Button } from "@/components/ui/button"
import { Check, X, Loader2 } from "lucide-react"
import { toast } from "sonner"
import { approvePost, rejectPost } from "./actions"

interface PostApprovalButtonProps {
    postId: string
    action: 'approve' | 'reject'
}

export function PostApprovalButton({ postId, action }: PostApprovalButtonProps) {
    const [isPending, startTransition] = useTransition()

    const handleAction = () => {
        startTransition(async () => {
            const result = action === 'approve'
                ? await approvePost(postId)
                : await rejectPost(postId)

            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success(action === 'approve' ? "Postagem aprovada" : "Postagem rejeitada")
            }
        })
    }

    if (action === 'approve') {
        return (
            <Button
                size="sm"
                className="w-full bg-green-600 hover:bg-green-700 text-white"
                onClick={handleAction}
                disabled={isPending}
            >
                {isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <Check size={16} className="mr-1" />}
                Aprovar
            </Button>
        )
    }

    return (
        <Button
            size="sm"
            variant="destructive"
            className="w-full"
            onClick={handleAction}
            disabled={isPending}
        >
            {isPending ? <Loader2 className="mr-1 h-4 w-4 animate-spin" /> : <X size={16} className="mr-1" />}
            Rejeitar
        </Button>
    )
}
