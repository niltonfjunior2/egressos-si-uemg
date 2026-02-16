import { Users, Briefcase, CalendarCheck } from "lucide-react"

export function BenefitsSection() {
    return (
        <section className="py-24 bg-slate-50 dark:bg-slate-900/50 relative overflow-hidden" id="beneficios">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-primary font-bold uppercase tracking-widest text-sm">Vantagens Exclusivas</h2>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Por que manter seu cadastro ativo?</h3>
                    <div className="w-20 h-1.5 bg-landing-secondary mx-auto rounded-full"></div>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                    {/* Card 1 */}
                    <div className="group p-8 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2">
                        <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <Users size={32} />
                        </div>
                        <h4 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Networking Estratégico</h4>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Conecte-se com profissionais formados na mesma instituição, troque experiências de mercado e expanda sua rede de contatos.
                        </p>
                    </div>

                    {/* Card 2 */}
                    <div className="group p-8 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-landing-secondary/10 transition-all duration-300 hover:-translate-y-2">
                        <div className="w-14 h-14 bg-landing-secondary/10 text-landing-secondary rounded-xl flex items-center justify-center mb-6 group-hover:bg-landing-secondary group-hover:text-white transition-colors duration-300">
                            <Briefcase size={32} />
                        </div>
                        <h4 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Vagas Exclusivas</h4>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Receba anúncios de oportunidades de emprego e parcerias enviadas diretamente por empresas que valorizam a formação UEMG.
                        </p>
                    </div>

                    {/* Card 3 */}
                    <div className="group p-8 bg-white dark:bg-slate-800/50 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 hover:-translate-y-2">
                        <div className="w-14 h-14 bg-primary/10 text-primary rounded-xl flex items-center justify-center mb-6 group-hover:bg-primary group-hover:text-white transition-colors duration-300">
                            <CalendarCheck size={32} />
                        </div>
                        <h4 className="text-xl font-bold mb-4 text-slate-900 dark:text-white">Eventos e Cursos</h4>
                        <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                            Fique por dentro de workshops, palestras e programas de extensão focados na atualização profissional de nossos egressos.
                        </p>
                    </div>
                </div>
            </div>
            {/* Decorative Blob */}
            <div className="absolute top-1/2 left-0 w-64 h-64 bg-landing-secondary/5 blur-[100px] rounded-full"></div>
        </section>
    )
}
