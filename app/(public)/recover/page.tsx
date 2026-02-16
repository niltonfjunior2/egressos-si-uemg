"use client"

import { useState, useTransition } from "react"
import { recoverPassword } from "@/app/auth/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { ArrowLeft, Mail, Loader2 } from "lucide-react"
import { toast } from "sonner"

export default function RecoverPage() {
    const [isPending, startTransition] = useTransition()
    const [isSubmitted, setIsSubmitted] = useState(false)

    async function handleSubmit(formData: FormData) {
        startTransition(async () => {
            const result = await recoverPassword(formData)

            if (result?.error) {
                toast.error(result.error)
            } else {
                setIsSubmitted(true)
                toast.success("Link de recuperação enviado!")
            }
        })
    }

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center px-4 overflow-hidden bg-slate-950">
            {/* Background Effects */}
            <div className="absolute inset-0 hero-gradient z-0"></div>
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 w-full max-w-sm space-y-4">
                <div className="text-center mb-6">
                    <Link href="/login" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-4">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Voltar para o Login
                    </Link>
                </div>

                <Card className="glass-card border-none text-white shadow-2xl backdrop-blur-md bg-white/5">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">Recuperar Acesso</CardTitle>
                        <CardDescription className="text-slate-400">
                            Digite seu email para receber um link de redefinição de senha.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        {isSubmitted ? (
                            <div className="text-center space-y-4 py-8">
                                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <Mail className="h-8 w-8 text-green-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg text-green-400">Email Enviado!</h3>
                                    <p className="text-sm text-slate-400">
                                        Verifique sua caixa de entrada (e spam) para redefinir sua senha.
                                    </p>
                                </div>
                                <Button className="w-full bg-slate-800 hover:bg-slate-700" asChild>
                                    <Link href="/login">Voltar ao Login</Link>
                                </Button>
                            </div>
                        ) : (
                            <form action={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="email" className="text-slate-300">Email</Label>
                                    <Input
                                        id="email"
                                        name="email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        required
                                        className="bg-slate-900/50 border-slate-700 text-white placeholder:text-slate-500 focus-visible:ring-primary"
                                    />
                                </div>
                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isPending}>
                                    {isPending ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Enviando...
                                        </>
                                    ) : (
                                        "Enviar Link de Recuperação"
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>

                <div className="text-center">
                    <p className="text-xs text-slate-600">
                        © 2024 Sistemas de Informação - UEMG Carangola
                    </p>
                </div>
            </div>
        </div>
    )
}
