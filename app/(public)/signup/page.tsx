import { SignupForm } from "@/components/auth/signup-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import { Home } from "lucide-react"

export default function SignupPage() {
    return (
        <div className="relative flex min-h-screen w-full items-center justify-center px-4 overflow-hidden bg-slate-950">
            {/* Background Effects */}
            <div className="absolute inset-0 hero-gradient z-0"></div>
            <div className="absolute top-0 left-0 w-1/2 h-1/2 bg-blue-500/10 blur-[120px] rounded-full -translate-y-1/2 -translate-x-1/2"></div>

            <div className="relative z-10 w-full max-w-sm space-y-4 py-8">
                <div className="text-center mb-6">
                    <Link href="/" className="inline-flex items-center text-slate-400 hover:text-white transition-colors mb-4">
                        <Home className="mr-2 h-4 w-4" />
                        Voltar para o Início
                    </Link>
                </div>

                <Card className="glass-card border-none text-white shadow-2xl backdrop-blur-md bg-white/5">
                    <CardHeader className="space-y-1 text-center">
                        <CardTitle className="text-2xl font-bold">Criar Conta</CardTitle>
                        <CardDescription className="text-slate-400">
                            Cadastre-se para acessar a rede de egressos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <SignupForm />
                        <div className="text-center text-sm space-y-2">
                            <div>
                                <Link href="/recover" className="text-slate-400 hover:text-white transition-colors">
                                    Esqueceu sua senha?
                                </Link>
                            </div>
                            <div className="text-slate-500">
                                Já tem uma conta?{" "}
                                <Link href="/login" className="text-primary hover:text-primary/80 font-medium underline-offset-4 hover:underline">
                                    Entrar
                                </Link>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <div className="text-center">
                    <p className="text-xs text-slate-600">
                        © 2026 Egressos Sistemas de Informação - UEMG Carangola
                    </p>
                </div>
            </div>
        </div>
    )
}
