"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Loader2, AlertTriangle, CheckCircle2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
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
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { updateAccountSecurity } from "@/app/(portal)/settings/actions"

const securitySchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres").optional().or(z.literal("")),
    confirmPassword: z.string().optional().or(z.literal("")),
}).refine((data) => {
    if (data.password && data.password !== data.confirmPassword) {
        return false
    }
    return true
}, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
})

type SecurityFormValues = z.infer<typeof securitySchema>

interface SecurityFormProps {
    initialEmail: string
}

export function SecurityForm({ initialEmail }: SecurityFormProps) {
    const [isLoading, setIsLoading] = useState(false)

    const form = useForm<SecurityFormValues>({
        resolver: zodResolver(securitySchema),
        defaultValues: {
            email: initialEmail,
            password: "",
            confirmPassword: "",
        },
    })

    async function onSubmit(data: SecurityFormValues) {
        setIsLoading(true)

        const formData = new FormData()
        formData.append("email", data.email)
        if (data.password) {
            formData.append("password", data.password)
        }

        const result = await updateAccountSecurity(formData)

        setIsLoading(false)

        if (result?.error) {
            toast.error("Erro ao atualizar", {
                description: result.error,
            })
        } else {
            toast.success("Atualizado com sucesso!", {
                description: "Suas informações de segurança foram atualizadas. Se você alterou seu e-mail, verifique sua caixa de entrada para confirmar.",
            })
            form.reset({
                email: data.email,
                password: "",
                confirmPassword: "",
            })
        }
    }

    return (
        <Card>
            <CardHeader>
                <CardTitle>Segurança da Conta</CardTitle>
                <CardDescription>
                    Atualize seu e-mail e senha de acesso ao portal.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <Alert variant="destructive" className="mb-6 bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/20 dark:border-amber-900/50 dark:text-amber-200">
                    <AlertTriangle className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                    <AlertTitle className="font-bold text-amber-800 dark:text-amber-300">AVISO IMPORTANTE</AlertTitle>
                    <AlertDescription className="font-medium mt-1">
                        Se você alterar seu e-mail, o novo e-mail informado será usado para acessar o portal. Certifique-se de digitar um e-mail válido que você tenha acesso.
                    </AlertDescription>
                </Alert>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>E-mail de Acesso</FormLabel>
                                    <FormControl>
                                        <Input {...field} type="email" />
                                    </FormControl>
                                    <FormDescription>
                                        Este é o e-mail que você usará para fazer login.
                                    </FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />

                        <div className="space-y-4">
                            <h3 className="text-sm font-medium text-muted-foreground pt-2 border-t">Alterar Senha (Opcional)</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <FormField
                                    control={form.control}
                                    name="password"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Nova Senha</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="password" placeholder="Deixe em branco para manter a atual" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />

                                <FormField
                                    control={form.control}
                                    name="confirmPassword"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Confirmar Nova Senha</FormLabel>
                                            <FormControl>
                                                <Input {...field} type="password" placeholder="Confirme a nova senha" />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            </div>
                        </div>

                        <div className="flex justify-end">
                            <Button type="submit" disabled={isLoading}>
                                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Salvar Alterações
                            </Button>
                        </div>
                    </form>
                </Form>
            </CardContent>
        </Card>
    )
}
