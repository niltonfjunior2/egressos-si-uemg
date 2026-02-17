import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { SecurityForm } from "@/components/settings/security-form"
import { Separator } from "@/components/ui/separator"

export default async function SettingsPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <div className="space-y-0.5">
                <h2 className="text-2xl font-bold tracking-tight">Configurações</h2>
                <p className="text-muted-foreground">
                    Gerencie as configurações da sua conta e preferências.
                </p>
            </div>
            <Separator className="my-6" />
            <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
                <aside className="-mx-4 lg:w-1/5">
                    <nav className="flex space-x-2 lg:flex-col lg:space-x-0 lg:space-y-1">
                        <a
                            href="/settings"
                            className="bg-muted hover:bg-muted justify-start inline-flex items-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 h-9 px-4 py-2 w-full text-left"
                        >
                            Segurança
                        </a>
                        {/* More tabs can be added here later */}
                    </nav>
                </aside>
                <div className="flex-1 lg:max-w-2xl">
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium">Segurança</h3>
                            <p className="text-sm text-muted-foreground">
                                Atualize seu e-mail e senha.
                            </p>
                        </div>
                        <Separator />
                        <SecurityForm initialEmail={user.email || ""} />
                    </div>
                </div>
            </div>
        </div>
    )
}
