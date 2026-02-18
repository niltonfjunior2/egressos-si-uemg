"use client"

import Link from "next/link"
import { UserPlus, Briefcase } from "lucide-react"
import { Button } from "@/components/ui/button"

export function HeroSection() {
    return (
        <section className="relative min-h-screen pt-16 flex items-center overflow-hidden bg-slate-950">
            {/* Background Effects */}
            <div className="absolute inset-0 hero-gradient z-0"></div>
            <div className="absolute top-0 right-0 w-1/2 h-1/2 bg-primary/10 blur-[120px] rounded-full -translate-y-1/2 translate-x-1/2"></div>

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-20 lg:py-0">
                <div className="grid lg:grid-cols-2 gap-12 items-center">

                    {/* Text Content */}
                    <div className="space-y-8 text-center lg:text-left">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-primary/20 border border-primary/30 text-blue-400 text-xs font-bold uppercase tracking-widest">
                            <span className="relative flex h-2 w-2">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
                            </span>
                            Plataforma de Egressos
                        </div>

                        <h1 className="text-4xl md:text-6xl font-extrabold text-white leading-tight">
                            Conecte-se ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">Futuro</span> do Nosso Curso
                        </h1>

                        <p className="text-lg text-slate-400 max-w-xl mx-auto lg:mx-0">
                            Mantenha o vínculo com a UEMG Carangola. Acompanhe oportunidades, compartilhe experiências e fortaleça a rede de egressos de Sistemas de Informação.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center gap-4 justify-center lg:justify-start">
                            <Button asChild className="w-full sm:w-auto bg-primary hover:bg-primary/90 text-white h-14 px-8 rounded-xl font-bold text-lg transition-transform hover:scale-105 shadow-2xl shadow-primary/40">
                                <Link href="/signup">
                                    <UserPlus className="mr-2 h-5 w-5" />
                                    Cadastrar Meus Dados
                                </Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full sm:w-auto bg-white/10 hover:bg-white/20 text-white h-14 px-8 rounded-xl font-bold text-lg backdrop-blur-sm border-white/10 hover:border-white/20">
                                <Link href="/jobs">
                                    <Briefcase className="mr-2 h-5 w-5" />
                                    Ver Oportunidades
                                </Link>
                            </Button>
                        </div>

                        {/* Users Stack Voltar com isso quando tiver mais cadastros
                        <div className="flex items-center justify-center lg:justify-start gap-4 pt-4">
                            <div className="flex -space-x-3">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-700 flex items-center justify-center overflow-hidden">
                                        <img
                                            alt={`Alumni ${i}`}
                                            src={`https://ui-avatars.com/api/?name=User+${i}&background=random`}
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                ))}
                            </div>
                            <p className="text-sm text-slate-500 font-medium">Junte-se a +500 egressos já conectados</p>
                        </div>*/}
                    </div>

                    {/* Visual Content */}
                    <div className="relative flex justify-center lg:justify-end hidden md:flex">
                        <div className="relative z-10 w-full max-w-lg lg:max-w-none">
                            <img
                                alt="UEMG Carangola"
                                className="w-full h-auto drop-shadow-[0_0_50px_rgba(48,91,125,0.4)] rounded-2xl"
                                src="/uemg-hero.png"
                            />
                            <div className="absolute inset-0 bg-blue-500/20 blur-[100px] -z-10 rounded-full"></div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
