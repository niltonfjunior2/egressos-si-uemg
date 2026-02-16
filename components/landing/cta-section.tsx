import Link from "next/link"
import { LogIn } from "lucide-react"

export function CtaSection() {
    return (
        <section className="py-24 bg-white dark:bg-slate-900 overflow-hidden relative">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="bg-slate-50 dark:bg-slate-800 rounded-3xl p-8 md:p-16 text-center border border-slate-100 dark:border-slate-700 shadow-2xl overflow-hidden relative">
                    {/* Glow Effects */}
                    <div className="absolute -top-10 -right-10 w-40 h-40 bg-primary/10 rounded-full blur-3xl"></div>
                    <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-landing-secondary/10 rounded-full blur-3xl"></div>

                    <h2 className="text-3xl md:text-5xl font-extrabold mb-6 text-slate-900 dark:text-white leading-tight">
                        Pronto para dar o próximo passo na sua carreira?
                    </h2>

                    <p className="text-lg text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto">
                        Faça parte da maior comunidade tecnológica da região e aproveite todos os recursos que a UEMG preparou para você.
                    </p>

                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Link href="/signup" className="bg-primary text-white px-10 py-4 rounded-xl font-bold text-lg hover:bg-opacity-90 shadow-xl shadow-primary/30 transition-all flex items-center justify-center gap-2">
                            <LogIn className="h-6 w-6" />
                            Começar Agora
                        </Link>
                    </div>
                </div>
            </div>
        </section>
    )
}
