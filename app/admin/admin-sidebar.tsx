'use client'

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { signout } from "@/app/auth/actions"
import {
    LayoutDashboard,
    User,
    Briefcase,
    Calendar,
    BarChart3,
    LogOut,
    MessageSquare,
    Settings
} from "lucide-react"
import { cn } from "@/lib/utils"

export function AdminSidebar({ role }: { role: string }) {
    const pathname = usePathname()

    const isActive = (path: string) => pathname === path

    return (
        <aside className="fixed inset-y-0 left-0 z-20 w-64 bg-admin-primary text-white shadow-xl flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 -translate-x-full">
            <div className="p-6">
                {/* Logo Area */}
                <div className="flex flex-col items-center">
                    <Image
                        src="/logo_uemg_2.png"
                        alt="Logo UEMG"
                        width={128}
                        height={64}
                        className="h-16 w-auto mx-auto object-contain"
                    />
                    <p className="text-center text-xs mt-4 font-medium tracking-widest opacity-80 uppercase border-t border-white/20 pt-2 w-full">
                        Sistemas de Informação
                    </p>
                </div>
            </div>

            <nav className="flex-1 px-4 py-4 space-y-1 overflow-y-auto">
                <Link
                    href="/admin"
                    className={cn(
                        "flex items-center px-4 py-3 rounded-lg transition-colors group",
                        isActive("/admin")
                            ? "bg-white/10 border-l-4 border-white rounded-l-none"
                            : "hover:bg-white/10"
                    )}
                >
                    <LayoutDashboard className="mr-3 h-5 w-5 opacity-80 group-hover:opacity-100" />
                    <span className="font-medium">Painel Geral</span>
                </Link>

                {role === 'administrador' && (
                    <Link
                        href="/admin/users"
                        className={cn(
                            "flex items-center px-4 py-3 rounded-lg transition-colors group",
                            isActive("/admin/users")
                                ? "bg-white/10 border-l-4 border-white rounded-l-none"
                                : "hover:bg-white/10"
                        )}
                    >
                        <User className="mr-3 h-5 w-5 opacity-80 group-hover:opacity-100" />
                        <span className="font-medium">Gerenciar Usuários</span>
                    </Link>
                )}
                <Link
                    href="/admin/jobs"
                    className={cn(
                        "flex items-center px-4 py-3 rounded-lg transition-colors group",
                        isActive("/admin/jobs")
                            ? "bg-white/10 border-l-4 border-white rounded-l-none"
                            : "hover:bg-white/10"
                    )}
                >
                    <Briefcase className="mr-3 h-5 w-5 opacity-80 group-hover:opacity-100" />
                    <span className="font-medium">Vagas</span>
                </Link>
                {/*
                <Link
                    href="/admin/events"
                    className={cn(
                        "flex items-center px-4 py-3 rounded-lg transition-colors group",
                        isActive("/admin/events")
                            ? "bg-white/10 border-l-4 border-white rounded-l-none"
                            : "hover:bg-white/10"
                    )}
                >
                    <Calendar className="mr-3 h-5 w-5 opacity-80 group-hover:opacity-100" />
                    <span className="font-medium">Eventos</span>
                </Link>
                */}


                {['administrador', 'coordenador'].includes(role) && (
                    <Link
                        href="/admin/reports"
                        className={cn(
                            "flex items-center px-4 py-3 rounded-lg transition-colors group",
                            isActive("/admin/reports")
                                ? "bg-white/10 border-l-4 border-white rounded-l-none"
                                : "hover:bg-white/10"
                        )}
                    >
                        <BarChart3 className="mr-3 h-5 w-5 opacity-80 group-hover:opacity-100" />
                        <span className="font-medium">Relatórios</span>
                    </Link>
                )}

                {role === 'administrador' && (
                    <Link
                        href="/admin/settings"
                        className={cn(
                            "flex items-center px-4 py-3 rounded-lg transition-colors group",
                            isActive("/admin/settings")
                                ? "bg-white/10 border-l-4 border-white rounded-l-none"
                                : "hover:bg-white/10"
                        )}
                    >
                        <Settings className="mr-3 h-5 w-5 opacity-80 group-hover:opacity-100" />
                        <span className="font-medium">Configurações</span>
                    </Link>
                )}
            </nav>

            <div className="p-4 border-t border-white/10 space-y-2">
                <Link
                    href="/admin/profile"
                    className={cn(
                        "flex items-center w-full px-4 py-3 rounded-lg hover:bg-white/10 transition-colors group",
                        isActive("/admin/profile") && "bg-white/10 border-l-4 border-white rounded-l-none"
                    )}
                >
                    <div className="mr-3 h-5 w-5 flex items-center justify-center bg-white/20 rounded-full text-[10px] font-bold text-white opacity-80 group-hover:opacity-100">
                        A
                    </div>
                    <span className="font-medium">Meu Perfil</span>
                </Link>

                <form action={signout}>
                    <button className="flex items-center w-full px-4 py-3 text-white/80 hover:text-white transition-colors">
                        <LogOut className="mr-3 h-5 w-5 text-admin-accent" />
                        <span className="font-medium">Sair do Painel</span>
                    </button>
                </form>
            </div>
        </aside>
    )
}
