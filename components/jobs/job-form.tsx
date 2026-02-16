"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { jobSchema, JobFormData } from "@/app/jobs/schema"
import { createJob } from "@/app/jobs/actions"
import { useTransition } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface JobFormProps {
    onSuccess?: () => void
}

export function JobForm({ onSuccess }: JobFormProps) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<JobFormData>({
        resolver: zodResolver(jobSchema),
        defaultValues: {
            type: "presencial",
        },
    })

    async function onSubmit(values: JobFormData) {
        startTransition(async () => {
            const result = await createJob(values)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Vaga publicada!")
                form.reset()
                onSuccess?.()
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Título da Vaga</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Desenvolvedor Frontend React" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="company"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Empresa</FormLabel>
                                <FormControl>
                                    <Input placeholder="Nome da empresa" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="type"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Modelo</FormLabel>
                                <Select onValueChange={field.onChange} defaultValue={field.value}>
                                    <FormControl>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione" />
                                        </SelectTrigger>
                                    </FormControl>
                                    <SelectContent>
                                        <SelectItem value="presencial">Presencial</SelectItem>
                                        <SelectItem value="remoto">Remoto</SelectItem>
                                        <SelectItem value="hibrido">Híbrido</SelectItem>
                                    </SelectContent>
                                </Select>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="location"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Localização</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Carangola, MG (ou Remoto)" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="applicationUrl"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Link para Candidatura</FormLabel>
                            <FormControl>
                                <Input placeholder="https://..." {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Descrição</FormLabel>
                            <FormControl>
                                <Textarea
                                    placeholder="Descreva a vaga, requisitos e benefícios..."
                                    className="min-h-[100px]"
                                    {...field}
                                />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Publicando...
                        </>
                    ) : (
                        "Publicar Vaga"
                    )}
                </Button>
            </form>
        </Form>
    )
}
