"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"

export function ElectionHero() {
    return (
        <section className="relative min-h-screen pt-16 flex items-center justify-center overflow-hidden bg-slate-100 dark:bg-slate-900">
            {/* Minimalist Background Effects */}
            <div className="absolute inset-0 z-0 opacity-20">
                <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-300 via-slate-100 to-slate-100 dark:from-slate-800 dark:via-slate-900 dark:to-slate-900"></div>
            </div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-0 text-center flex flex-col items-center justify-center">
                
                <h1 className="text-3xl md:text-5xl font-semibold text-slate-800 dark:text-slate-200 mb-12 tracking-wide uppercase">
                    Portal de Egressos de Sistemas de Informação
                </h1>

                <div className="flex flex-col sm:flex-row items-center gap-6 justify-center w-full max-w-md mx-auto">
                    <Button asChild className="w-full bg-slate-800 hover:bg-slate-700 text-white dark:bg-slate-200 dark:hover:bg-slate-300 dark:text-slate-900 h-14 px-8 rounded-md font-medium text-lg transition-colors">
                        <Link href="/login">
                            ENTRAR
                        </Link>
                    </Button>
                    <Button asChild variant="outline" className="w-full border-slate-300 text-slate-700 hover:bg-slate-200 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800 h-14 px-8 rounded-md font-medium text-lg transition-colors">
                        <Link href="/signup">
                            CRIAR CONTA
                        </Link>
                    </Button>
                </div>

            </div>
        </section>
    )
}
