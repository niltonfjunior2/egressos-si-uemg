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
    FormDescription,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"
import { CalendarIcon, Loader2 } from "lucide-react"
import { professionalHistorySchema, ProfessionalHistoryFormData } from "@/app/(portal)/profile/professional/schema"
import { addProfessionalHistory } from "@/app/(portal)/profile/professional/actions"
import { useTransition } from "react"
import { toast } from "sonner"

interface ProfessionalHistoryFormProps {
    onSuccess?: () => void
}

export function ProfessionalHistoryForm({ onSuccess }: ProfessionalHistoryFormProps) {
    const [isPending, startTransition] = useTransition()

    const form = useForm<ProfessionalHistoryFormData>({
        resolver: zodResolver(professionalHistorySchema) as any,
        defaultValues: {
            companyName: "",
            roleTitle: "",
            isCurrent: false,
            techStack: "",
        },
    })

    // Watch isCurrent to conditionally require endDate
    const isCurrent = form.watch("isCurrent")

    async function onSubmit(values: ProfessionalHistoryFormData) {
        startTransition(async () => {
            const result = await addProfessionalHistory(values)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Experiência adicionada!")
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
                    name="companyName"
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
                    name="roleTitle"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Cargo</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: Desenvolvedor Fullstack" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <div className="grid grid-cols-2 gap-4">
                    <FormField
                        control={form.control}
                        name="startDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Data de Início</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: ptBR })
                                                ) : (
                                                    <span>Selecione uma data</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />

                    <FormField
                        control={form.control}
                        name="endDate"
                        render={({ field }) => (
                            <FormItem className="flex flex-col">
                                <FormLabel>Data de Término</FormLabel>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <FormControl>
                                            <Button
                                                variant={"outline"}
                                                disabled={isCurrent}
                                                className={cn(
                                                    "w-full pl-3 text-left font-normal",
                                                    !field.value && "text-muted-foreground"
                                                )}
                                            >
                                                {field.value ? (
                                                    format(field.value, "PPP", { locale: ptBR })
                                                ) : (
                                                    <span>{isCurrent ? "Atual" : "Selecione uma data"}</span>
                                                )}
                                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                                            </Button>
                                        </FormControl>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar
                                            mode="single"
                                            selected={field.value}
                                            onSelect={field.onChange}
                                            disabled={(date) =>
                                                date > new Date() || date < new Date("1900-01-01")
                                            }
                                            initialFocus
                                        />
                                    </PopoverContent>
                                </Popover>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                </div>

                <FormField
                    control={form.control}
                    name="isCurrent"
                    render={({ field }) => (
                        <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                            <div className="space-y-0.5">
                                <FormLabel className="text-base">Trabalho Atual</FormLabel>
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

                <FormField
                    control={form.control}
                    name="salaryRange"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Faixa Salarial (Privado)</FormLabel>
                            <Select onValueChange={field.onChange} defaultValue={field.value}>
                                <FormControl>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Selecione a faixa (Opcional)" />
                                    </SelectTrigger>
                                </FormControl>
                                <SelectContent>
                                    <SelectItem value="<2k">Menos de R$ 2.000</SelectItem>
                                    <SelectItem value="2k-5k">R$ 2.000 - R$ 5.000</SelectItem>
                                    <SelectItem value="5k-8k">R$ 5.000 - R$ 8.000</SelectItem>
                                    <SelectItem value="8k-12k">R$ 8.000 - R$ 12.000</SelectItem>
                                    <SelectItem value="12k-15k">R$ 12.000 - R$ 15.000</SelectItem>
                                    <SelectItem value=">15k">Acima de R$ 15.000</SelectItem>
                                </SelectContent>
                            </Select>
                            <FormDescription>Usado apenas para estatísticas anônimas do curso.</FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />

                <FormField
                    control={form.control}
                    name="techStack"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Tecnologias (separadas por vírgula)</FormLabel>
                            <FormControl>
                                <Input placeholder="Ex: React, Node.js, SQL" {...field} value={field.value || ''} />
                            </FormControl>
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
                        "Adicionar Experiência"
                    )}
                </Button>
            </form>
        </Form>
    )
}
