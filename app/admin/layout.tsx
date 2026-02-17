
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { signout } from "@/app/auth/actions"
import {
    Menu // Added for mobile if needed
} from "lucide-react"
import { AdminSidebar } from "./admin-sidebar"

export default async function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // RBAC: Verify if user has access to admin panel
    const { data: profile } = await supabase
        .from('profiles')
        .select('role, full_name') // Removed avatar_url as it doesn't exist in schema
        .eq('id', user.id)
        .single()

    if (!profile || !['administrador', 'coordenador', 'professor'].includes(profile.role)) {
        redirect('/feed')
    }

    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
            {/* Sidebar */}
            <AdminSidebar role={profile.role} />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300 ease-in-out">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-8 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold text-primary dark:text-blue-400">
                            Painel Administrativo
                        </h1>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                            Visão Geral
                        </span>
                    </div>

                    <div className="flex items-center space-x-6">

                        <div className="flex items-center space-x-3 border-l pl-6 border-gray-200 dark:border-slate-700">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold">{profile.full_name}</p>
                                <p className="text-xs text-gray-500 capitalize">{profile.role}</p>
                            </div>
                            {/* Avatar Fallback */}
                            <div className="h-10 w-10 rounded-full border-2 border-primary shadow-sm bg-gray-200 overflow-hidden">
                                <div className="h-full w-full flex items-center justify-center text-gray-500 font-bold">
                                    {profile.full_name.charAt(0)}
                                </div>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    {children}
                    <footer className="mt-8 p-6 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-slate-800">
                        &copy; {new Date().getFullYear()} Unidade Carangola - UEMG | Sistemas de Informação.
                    </footer>
                </main>
            </div>
            {/* Mobile Overlay (logic to be implemented with client component if needed) */}
        </div>
    )
}
