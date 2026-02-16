"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { LoginFormData, loginSchema } from "@/app/auth/schema"
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
import { login } from "@/app/auth/actions"
import { useState, useTransition } from "react"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function LoginForm() {
    const [isPending, startTransition] = useTransition()

    const form = useForm<LoginFormData>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: "",
            password: "",
        },
    })

    async function onSubmit(values: LoginFormData) {
        startTransition(async () => {
            const result = await login(values)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Login realizado com sucesso!")
                // Redirect handled by server action
            }
        })
    }

    return (
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Email</FormLabel>
                            <FormControl>
                                <Input placeholder="seu@email.com" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="password"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Senha</FormLabel>
                            <FormControl>
                                <Input type="password" placeholder="******" {...field} />
                            </FormControl>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit" className="w-full" disabled={isPending}>
                    {isPending ? (
                        <>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                            Entrando...
                        </>
                    ) : (
                        "Entrar"
                    )}
                </Button>
            </form>
        </Form>
    )
}
