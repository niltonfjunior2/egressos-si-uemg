'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { updateProfileStats, changePassword } from './actions'
import { toast } from "sonner"
import { User, Lock, Key } from "lucide-react"

export default function AdminProfilePage({ user, profile }: { user: any, profile: any }) {
    const [loading, setLoading] = useState(false)

    async function handleProfileUpdate(formData: FormData) {
        setLoading(true)
        const result = await updateProfileStats(formData)
        setLoading(false)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success("Dados do perfil atualizados.")
        }
    }

    async function handlePasswordChange(formData: FormData) {
        setLoading(true)
        const result = await changePassword(formData)
        setLoading(false)

        if (result?.error) {
            toast.error(result.error)
        } else {
            toast.success("Senha alterada com sucesso.")
            // Reset form manually or redirect
            const form = document.getElementById('password-form') as HTMLFormElement
            form?.reset()
        }
    }

    return (
        <div className="max-w-4xl mx-auto space-y-8">
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Meu Perfil</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">Gerencie suas informações pessoais e credenciais de acesso.</p>
            </div>

            <div className="grid gap-8 md:grid-cols-2">
                {/* Personal Info */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <User className="mr-2 h-5 w-5 text-admin-primary" />
                            Dados Pessoais
                        </CardTitle>
                        <CardDescription>
                            Informações básicas do administrador.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form action={handleProfileUpdate} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email de Acesso</Label>
                                <Input id="email" value={user.email} disabled className="bg-gray-100 dark:bg-slate-800" />
                                <p className="text-xs text-muted-foreground">O email não pode ser alterado por aqui.</p>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="fullName">Nome Completo</Label>
                                <Input
                                    id="fullName"
                                    name="fullName"
                                    defaultValue={profile?.full_name || ''}
                                    placeholder="Seu nome completo"
                                    required
                                />
                            </div>
                            <Button type="submit" className="w-full bg-admin-primary hover:bg-admin-primary/90" disabled={loading}>
                                {loading ? "Salvando..." : "Salvar Alterações"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>

                {/* Password Change */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Lock className="mr-2 h-5 w-5 text-admin-accent" />
                            Segurança
                        </CardTitle>
                        <CardDescription>
                            Redefina sua senha de administrador.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form id="password-form" action={handlePasswordChange} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Nova Senha</Label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="password"
                                        name="password"
                                        type="password"
                                        placeholder="Mínimo 6 caracteres"
                                        className="pl-9"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirmar Nova Senha</Label>
                                <div className="relative">
                                    <Key className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                                    <Input
                                        id="confirmPassword"
                                        name="confirmPassword"
                                        type="password"
                                        placeholder="Repita a senha"
                                        className="pl-9"
                                        required
                                        minLength={6}
                                    />
                                </div>
                            </div>
                            <Button type="submit" variant="destructive" className="w-full bg-admin-accent hover:bg-admin-accent/90" disabled={loading}>
                                {loading ? "Alterando..." : "Alterar Senha"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
