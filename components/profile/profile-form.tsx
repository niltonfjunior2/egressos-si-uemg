"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { profileSchema, ProfileFormData } from "@/app/(portal)/profile/schema"
import { updateProfile } from "@/app/(portal)/profile/actions"
import { useTransition } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface ProfileFormProps {
    initialData: ProfileFormData
}

export function ProfileForm({ initialData }: ProfileFormProps) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<ProfileFormData>({
        resolver: zodResolver(profileSchema),
        defaultValues: initialData,
    })

    async function onSubmit(values: ProfileFormData) {
        startTransition(async () => {
            const result = await updateProfile(values)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Perfil atualizado com sucesso!")
                // Optional: Reset form to new values (server revalidates page anyway)
                form.reset(values)
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="fullName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome Completo</FormLabel>
                            <FormControl>
                                <Input placeholder="Seu nome completo" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="socialName"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Nome Social (Opcional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Como prefere ser chamado" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="linkedinUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>LinkedIn URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://linkedin.com/in/..." {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="githubUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>GitHub URL</FormLabel>
                            <FormControl>
                                <Input placeholder="https://github.com/..." {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="isOpenToMentoring"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Mentoria</FormLabel>
                                <FormDescription>
                                    Disponível para mentorar outros alunos?
                                </FormDescription>
                            </div>
                            <FormControl>
                                <Switch
                                    checked={field.value}
                                    onCheckedChange={field.onChange}
                                />
                            </FormControl>
                        </FormItem>
                    )}
                />
                <Button type="submit" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Salvando...
                        </>
                    ) : (
                        "Salvar Alterações"
                    )}
                </Button>
            </form>
        </Form>
    )
}
