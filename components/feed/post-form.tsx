"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"
import { postSchema, PostFormData } from "@/app/feed/schema"
import { createPost } from "@/app/feed/actions"
import { useTransition } from "react"
import { toast } from "sonner"
import { Loader2, Send } from "lucide-react"

export function PostForm() {
    const [isPending, startTransition] = useTransition()

    const form = useForm<PostFormData>({
        resolver: zodResolver(postSchema),
        defaultValues: {
            content: "",
        },
    })

    async function onSubmit(values: PostFormData) {
        startTransition(async () => {
            const result = await createPost(values)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Post publicado!")
                form.reset()
            }
        })
    }

    return (
        <div className="mb-6 rounded-lg border bg-card text-card-foreground shadow-sm">
            <div className="p-4">
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="content"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            placeholder="O que você está pensando? Compartilhe com a rede..."
                                            className="resize-y min-h-[200px]"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={isPending || !form.formState.isValid}>
                                {isPending ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Publicando...
                                    </>
                                ) : (
                                    <>
                                        <Send className="mr-2 h-4 w-4" />
                                        Publicar
                                    </>
                                )}
                            </Button>
                        </div>
                    </form>
                </Form>
            </div>
        </div>
    )
}
