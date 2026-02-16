import { SignupForm } from "@/components/auth/signup-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function SignupPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Cadastrar</CardTitle>
                    <CardDescription>
                        Crie sua conta para acessar a rede de egressos.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <SignupForm />
                    <div className="mt-4 text-center text-sm">
                        Já tem uma conta?{" "}
                        <Link href="/login" className="underline">
                            Entrar
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
