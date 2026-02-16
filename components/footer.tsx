import Link from "next/link"

export function Footer() {
    return (
        <footer className="w-full border-t bg-background py-6 text-center text-sm md:text-left">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-14 md:flex-row">
                <p className="text-muted-foreground">
                    &copy; {new Date().getFullYear()} EGRESSOS SISTEMAS DE INFORMACAO - UEMG Carangola. Desenvolvido por alunos do curso de Sistemas de Informação.
                </p>
                <div className="flex gap-4">
                    <Link href="https://uemg.br" target="_blank" className="text-muted-foreground hover:underline">
                        UEMG Oficial
                    </Link>
                    <Link href="https://github.com/niltonfjunior2/egressos-si-uemg" target="_blank" className="text-muted-foreground hover:underline">
                        GitHub
                    </Link>
                </div>
            </div>
        </footer>
    )
}
