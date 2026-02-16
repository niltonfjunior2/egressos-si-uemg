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
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { academicRecordSchema, AcademicRecordFormData } from "@/app/(portal)/profile/academic/schema"
import { addAcademicRecord } from "@/app/(portal)/profile/academic/actions"
import { useTransition } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

interface AcademicRecordFormProps {
    onSuccess?: () => void
}

export function AcademicRecordForm({ onSuccess }: AcademicRecordFormProps) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<AcademicRecordFormData>({
        resolver: zodResolver(academicRecordSchema) as any,
        defaultValues: {
            entryYear: new Date().getFullYear(),
            graduationYear: 0,
            studentIdCode: "",
            status: "cursando",
        },
    })

    async function onSubmit(values: AcademicRecordFormData) {
        startTransition(async () => {
            const result = await addAcademicRecord(values)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Registro adicionado!")
                form.reset()
                onSuccess?.()
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="entryYear"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ano de Entrada</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name="graduationYear"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Ano de Conclusão</FormLabel>
                                <FormControl>
                                    <Input type="number" {...field} value={field.value || ''} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>
                <FormField
                    control={form.control}
                    name="studentIdCode"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Matrícula (Opcional)</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: 123456" {...field} value={field.value || ''} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="status"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Status</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione o status" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="cursando">Cursando</SelectItem>
                                    <SelectItem value="formado">Formado</SelectItem>
                                    <SelectItem value="trancado">Trancado</SelectItem>
                                    <SelectItem value="desligado">Desligado</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Adicionando...
                        </>
                    ) : (
                        "Adicionar Registro"
                    )}
                </Button>
            </form>
        </Form>
    )
}
