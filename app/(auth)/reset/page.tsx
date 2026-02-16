'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/utils/supabase/client'
import { useRouter } from 'next/navigation'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "sonner"
import { Loader2, Lock, CheckCircle } from "lucide-react"

export default function ResetPage() {
    const [isLoading, setIsLoading] = useState(false)
    const [isRestoringSession, setIsRestoringSession] = useState(true)
    const [isSuccess, setIsSuccess] = useState(false)
    const router = useRouter()

    // Instância única do cliente Supabase para o componente
    const [supabase] = useState(() => createClient())

    // 1. Lógica de Restauração de Sessão
    useEffect(() => {
        const restoreSession = async () => {
            // Verifica se é um fluxo implícito (tokens no hash)
            const hasHash = window.location.hash && window.location.hash.includes('access_token')

            if (hasHash) {
                setIsRestoringSession(true) // Bloqueia UI

                try {
                    // Parse manual para garantir captura
                    const params = new URLSearchParams(window.location.hash.substring(1))
                    const access_token = params.get('access_token')
                    const refresh_token = params.get('refresh_token')

                    if (access_token && refresh_token) {
                        // Força a sessão manualmente
                        await supabase.auth.setSession({ access_token, refresh_token })
                    }
                } catch (e) {
                    console.error('Erro ao processar hash:', e)
                    toast.error("Erro ao processar link de recuperação.")
                }
            }

            // Verifica estado atual
            const { data: { session } } = await supabase.auth.getSession()

            if (session) {
                setIsRestoringSession(false)
            } else {
                // Se ainda não tem sessão, aguarda evento do Supabase
                const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
                    if (event === 'SIGNED_IN' || event === 'PASSWORD_RECOVERY' || session) {
                        setIsRestoringSession(false)
                    }
                })

                // Timeout de segurança (5s) para não travar a tela
                if (hasHash) {
                    setTimeout(() => {
                        setIsRestoringSession(false)
                        // If still loading after timeout with hash, likely failed or slow
                    }, 5000)
                } else {
                    setIsRestoringSession(false)
                }

                return () => subscription.unsubscribe()
            }
        }
        restoreSession()
    }, [supabase])

    // 2. Handler do Formulário
    async function handleSubmit(formData: FormData) {
        setIsLoading(true)
        const password = formData.get('password') as string
        const confirmPassword = formData.get('confirmPassword') as string

        if (password !== confirmPassword) {
            toast.error("As senhas não coincidem.")
            setIsLoading(false)
            return
        }

        if (password.length < 6) {
            toast.error("A senha deve ter pelo menos 6 caracteres.")
            setIsLoading(false)
            return
        }

        // Verificação de Segurança Extra
        const { data: { session } } = await supabase.auth.getSession()
        if (!session) {
            toast.error('Sessão expirada ou inválida. Solicite o link novamente.')
            setIsLoading(false)
            return
        }

        // Update direto no cliente
        const { error } = await supabase.auth.updateUser({ password })

        if (error) {
            toast.error(error.message)
        } else {
            setIsSuccess(true)
            toast.success("Senha atualizada com sucesso!")
            setTimeout(() => {
                router.push('/login')
            }, 3000)
        }
        setIsLoading(false)
    }

    if (isRestoringSession) {
        return (
            <div className="flex h-screen w-full items-center justify-center bg-slate-950 text-white">
                <div className="flex flex-col items-center gap-4">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                    <p>Verificando link de segurança...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="relative flex min-h-screen w-full items-center justify-center px-4 overflow-hidden bg-slate-950">
            {/* Background Effects */}
            <div className="absolute inset-0 hero-gradient z-0"></div>

            <div className="relative z-10 w-full max-w-sm">
                <Card className="glass-card border-none text-white shadow-2xl backdrop-blur-md bg-white/5">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">Redefinir Senha</CardTitle>
                        <CardDescription className="text-slate-400">
                            Crie uma nova senha para sua conta.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {isSuccess ? (
                            <div className="text-center space-y-4 py-4">
                                <div className="mx-auto w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center">
                                    <CheckCircle className="h-8 w-8 text-green-400" />
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-semibold text-lg text-green-400">Sucesso!</h3>
                                    <p className="text-sm text-slate-400">
                                        Sua senha foi alterada. Redirecionando para login...
                                    </p>
                                </div>
                            </div>
                        ) : (
                            <form action={handleSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="password" className="text-slate-300">Nova Senha</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="password"
                                            name="password"
                                            type="password"
                                            placeholder="******"
                                            required
                                            className="pl-9 bg-slate-900/50 border-slate-700 text-white focus-visible:ring-primary"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="confirmPassword" className="text-slate-300">Confirmar Nova Senha</Label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                                        <Input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type="password"
                                            placeholder="******"
                                            required
                                            className="pl-9 bg-slate-900/50 border-slate-700 text-white focus-visible:ring-primary"
                                        />
                                    </div>
                                </div>
                                <Button type="submit" className="w-full bg-primary hover:bg-primary/90" disabled={isLoading}>
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Atualizando...
                                        </>
                                    ) : (
                                        "Salvar Nova Senha"
                                    )}
                                </Button>
                            </form>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
