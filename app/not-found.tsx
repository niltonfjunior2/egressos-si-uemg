import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background text-foreground text-center px-4">
            <h1 className="text-6xl font-bold mb-4">404</h1>
            <h2 className="text-2xl font-semibold mb-6">Página não encontrada</h2>
            <p className="text-muted-foreground max-w-md mb-8">
                Desculpe, não conseguimos encontrar a página que você está procurando. Ela pode ter sido removida ou o link pode estar incorreto.
            </p>
            <Link href="/">
                <Button size="lg">Voltar para o Início</Button>
            </Link>
        </div>
    )
}
