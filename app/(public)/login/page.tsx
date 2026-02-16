import { LoginForm } from "@/components/auth/login-form"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"

export default function LoginPage() {
    return (
        <div className="flex h-screen w-full items-center justify-center px-4">
            <Card className="mx-auto max-w-sm">
                <CardHeader>
                    <CardTitle className="text-2xl">Login</CardTitle>
                    <CardDescription>
                        Entre com seu email e senha para acessar o sistema.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <LoginForm />
                    <div className="mt-4 text-center text-sm">
                        Não tem uma conta?{" "}
                        <Link href="/signup" className="underline">
                            Cadastre-se
                        </Link>
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
