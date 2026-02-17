import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import Link from "next/link"
import { ProfileScoreCard } from "@/components/profile-completion/profile-score-card"
import { calculateProfileStats } from "@/hooks/use-profile-completion"
import { PortalSidebar } from "./portal-sidebar"

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

    // Fetch data for profile completion calculation
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const { data: academic } = await supabase
        .from('academic_records')
        .select('*')
        .eq('profile_id', user.id)

    const { data: professional } = await supabase
        .from('professional_history')
        .select('*')
        .eq('profile_id', user.id)

    const stats = calculateProfileStats(profile, academic, professional)

    return (
        <div className="flex min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans transition-colors duration-200">
            {/* Sidebar */}
            <PortalSidebar user={user} />

            {/* Main Content Wrapper */}
            <div className="flex-1 flex flex-col md:ml-64 transition-all duration-300 ease-in-out">
                {/* Header */}
                <header className="h-16 bg-white dark:bg-slate-900 border-b border-gray-200 dark:border-slate-800 flex items-center justify-between px-8 shadow-sm">
                    <div className="flex items-center space-x-4">
                        <h1 className="text-xl font-bold text-primary dark:text-blue-400">
                            Portal do Egresso
                        </h1>
                        <span className="text-gray-400">/</span>
                        <span className="text-gray-500 dark:text-gray-400 font-medium text-sm">
                            Visão Geral
                        </span>
                    </div>

                    <div className="flex items-center space-x-6">
                        <div className="flex items-center space-x-3 border-l pl-6 border-gray-200 dark:border-slate-700">
                            <div className="text-right hidden sm:block">
                                <p className="text-sm font-bold">{profile?.social_name || profile?.full_name || user.email}</p>
                                <p className="text-xs text-gray-500 capitalize">{profile?.role || 'Usuário'}</p>
                            </div>
                            {/* Avatar Fallback */}
                            <div className="h-10 w-10 rounded-full border-2 border-primary shadow-sm bg-gray-200 overflow-hidden">
                                {profile?.avatar_url ? (
                                    <img src={profile.avatar_url} alt="Avatar" className="h-full w-full object-cover" />
                                ) : (
                                    <div className="h-full w-full flex items-center justify-center text-gray-500 font-bold">
                                        {(profile?.social_name || profile?.full_name || user.email || 'U').charAt(0).toUpperCase()}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content Area */}
                <main className="flex-1 overflow-y-auto p-8 relative">
                    {!stats.isComplete && (
                        <div className="mb-6">
                            <ProfileScoreCard stats={stats} />
                        </div>
                    )}
                    {children}
                    <footer className="mt-8 p-6 text-center text-xs text-gray-500 dark:text-gray-400 border-t border-gray-200 dark:border-slate-800">
                        &copy; {new Date().getFullYear()} Unidade Carangola - UEMG | Sistemas de Informação.
                    </footer>
                </main>
            </div>
        </div>
    )
}
