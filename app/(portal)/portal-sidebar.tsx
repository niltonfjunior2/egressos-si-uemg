'use client'

import Link from "next/link"
import { usePathname } from "next/navigation"
import { signout } from "@/app/auth/actions"
import {
    LayoutDashboard,
    User,
    Briefcase,
    Search,
    LogOut,

    Settings,
    UserCog
} from "lucide-react"
import { cn } from "@/lib/utils"

export function PortalSidebar({ user }: { user: any }) {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <aside className="fixed inset-y-0 left-0 z-20 w-64 bg-slate-900 text-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 -translate-x-full">
            <div className="p-6">
                {/* Logo Area */}
                <div className="flex flex-col items-center">
                    <img
                        alt="Logo UEMG"
                        className="h-16 w-auto mx-auto object-contain bg-white rounded-full p-1"
                        src="/logo_uemg_2.png"
                    />
                    <p className="text-center text-xs mt-4 font-medium tracking-widest opacity-80 uppercase border-t border-white/20 pt-2 w-full">
                        Sistemas de Informação
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">


                <Link
                    href="/profile"
                    className={cn(
                        "flex items-center px-4 py-3 rounded-lg transition-colors group",
                        isActive("/profile")
                            ? "bg-white/10 border-l-4 border-blue-500 rounded-l-none"
                            : "hover:bg-white/10"
                    )}
                >
                    <User className="mr-3 h-5 w-5 opacity-80 group-hover:opacity-100" />
                    <span className="font-medium">Meu Perfil</span>
                </Link>
                <Link
                    href="/directory"
                    className={cn(
                        "flex items-center px-4 py-3 rounded-lg transition-colors group",
                        isActive("/directory")
                            ? "bg-white/10 border-l-4 border-blue-500 rounded-l-none"
                            : "hover:bg-white/10"
                    )}
                >
                    <Search className="mr-3 h-5 w-5 opacity-80 group-hover:opacity-100" />
                    <span className="font-medium">Diretório</span>
                </Link>
                <Link
                    href="/jobs"
                    className={cn(
                        "flex items-center px-4 py-3 rounded-lg transition-colors group",
                        isActive("/jobs")
                            ? "bg-white/10 border-l-4 border-blue-500 rounded-l-none"
                            : "hover:bg-white/10"
                    )}
                >
                    <Briefcase className="mr-3 h-5 w-5 opacity-80 group-hover:opacity-100" />
                    <span className="font-medium">Vagas</span>
                </Link>

                <Link
                    href="/coordinator"
                    className={cn(
                        "flex items-center px-4 py-3 rounded-lg transition-colors group",
                        isActive("/coordinator")
                            ? "bg-white/10 border-l-4 border-blue-500 rounded-l-none"
                            : "hover:bg-white/10"
                    )}
                >
                    <UserCog className="mr-3 h-5 w-5 opacity-80 group-hover:opacity-100" />
                    <span className="font-medium">Coordenação</span>
                </Link>

                <Link
                    href="/settings"
                    className={cn(
                        "flex items-center px-4 py-3 rounded-lg transition-colors group",
                        isActive("/settings")
                            ? "bg-white/10 border-l-4 border-blue-500 rounded-l-none"
                            : "hover:bg-white/10"
                    )}
                >
                    <Settings className="mr-3 h-5 w-5 opacity-80 group-hover:opacity-100" />
                    <span className="font-medium">Configurações</span>
                </Link>
            </nav>

            <div className="p-4 border-t border-white/10 space-y-2">
                <form action={signout}>
                    <button className="flex items-center w-full px-4 py-3 text-white/80 hover:text-white transition-colors">
                        <LogOut className="mr-3 h-5 w-5 text-red-400" />
                        <span className="font-medium">Sair</span>
                    </button>
                </form>
            </div>
        </aside>
    )
}
