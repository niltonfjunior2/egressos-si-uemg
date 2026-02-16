"use client"

import { useEffect } from "react"
import { Button } from "@/components/ui/button"

export default function Error({
    error,
    reset,
}: {
    error: Error & { digest?: string }
    reset: () => void
}) {
    useEffect(() => {
        // Log the error to an error reporting service
        console.error(error)
    }, [error])

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4">
            <h1 className="text-4xl font-bold mb-4">Algo deu errado!</h1>
            <p className="text-muted-foreground max-w-md mb-8">
                Encontramos um erro inesperado. Tente recarregar a página ou voltar mais tarde.
            </p>
            <div className="flex gap-4">
                <Button onClick={() => reset()}>Tentar novamente</Button>
                <Button variant="outline" onClick={() => window.location.href = "/"}>
                    Ir para o Início
                </Button>
            </div>
        </div>
    )
}
