import Link from "next/link"
import { Button } from "@/components/ui/button"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { signout } from "@/app/auth/actions"

export default async function PortalLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-14 items-center">
                    <div className="mr-4 hidden md:flex">
                        <Link className="mr-6 flex items-center space-x-2" href="/feed">
                            <span className="hidden font-bold sm:inline-block">
                                SGE - Portal
                            </span>
                        </Link>
                        <nav className="flex items-center space-x-6 text-sm font-medium">
                            <Link
                                href="/feed"
                                className="transition-colors hover:text-foreground/80 text-foreground"
                            >
                                Feed
                            </Link>
                            <Link
                                href="/profile"
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                Meu Perfil
                            </Link>
                            <Link
                                href="/directory"
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                Diretório
                            </Link>
                            <Link
                                href="/jobs"
                                className="transition-colors hover:text-foreground/80 text-foreground/60"
                            >
                                Vagas
                            </Link>
                        </nav>
                    </div>
                    <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                        <div className="w-full flex-1 md:w-auto md:flex-none">
                            {/* Search to come */}
                        </div>
                        <nav className="flex items-center">
                            <form action={signout}>
                                <Button variant="ghost" size="sm">
                                    Sair
                                </Button>
                            </form>
                        </nav>
                    </div>
                </div>
            </header>
            <main className="flex-1">{children}</main>
            <Footer />
        </div>
    )
}

import { Footer } from "@/components/footer"
