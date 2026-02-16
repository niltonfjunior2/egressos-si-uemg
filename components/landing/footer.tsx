import Link from "next/link"
import { Facebook, Instagram, Globe, MapPin, Phone, Mail } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-900 pt-16 pb-8">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid md:grid-cols-4 gap-12 mb-16">
                    {/* Brand Column */}
                    <div className="col-span-1 md:col-span-2 space-y-6">
                        <img
                            alt="Logo Footer"
                            className="h-16 w-auto"
                            src="https://lh3.googleusercontent.com/aida-public/AB6AXuDYtLDVRI77dhjIGh2N6L1ATcNjQbrDfBbTysrMW4IDwNxE_ze9RMLPKsNTmOwU5XuwFao1nCefgJkKGaHPEMS-NxrDbBLrFAElg-rpapUnpnVcCivsQVyf5njCHTopxUWR-J7L7SSXZmOmxg7hGbRuYEYJXB9ebrESoFxwf40fmutwdZLrVpbWuQO9WDiXPcRtqpX6eruxJCnYvAD_l8a0_DZx92cQ8F-V46Z-__i8hGMUxIl_qrpCBNKxP22-Ppt6L7NDDkE3yqpH"
                        />
                        <p className="text-slate-500 dark:text-slate-400 max-w-sm">
                            Plataforma oficial de acompanhamento de egressos do curso de Sistemas de Informação da Universidade do Estado de Minas Gerais - Unidade Carangola.
                        </p>
                        <div className="flex space-x-4">
                            <Link href="#" className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                                <Facebook size={20} />
                            </Link>
                            <Link href="#" className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                                <Instagram size={20} />
                            </Link>
                            <Link href="#" className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-full flex items-center justify-center text-slate-600 dark:text-slate-300 hover:bg-primary hover:text-white transition-all">
                                <Globe size={20} />
                            </Link>
                        </div>
                    </div>

                    {/* Links Column */}
                    <div>
                        <h5 className="text-slate-900 dark:text-white font-bold mb-6">Links Úteis</h5>
                        <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                            <li><Link href="#" className="hover:text-primary transition-colors">Portal da UEMG</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">PPC do Curso</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Extensão Acadêmica</Link></li>
                            <li><Link href="#" className="hover:text-primary transition-colors">Trabalhe Conosco</Link></li>
                        </ul>
                    </div>

                    {/* Contact Column */}
                    <div>
                        <h5 className="text-slate-900 dark:text-white font-bold mb-6">Contato</h5>
                        <ul className="space-y-4 text-slate-500 dark:text-slate-400">
                            <li className="flex items-start gap-3">
                                <MapPin className="text-primary flex-shrink-0" size={20} />
                                <span>Praça dos Estudantes, 23, Carangola - MG</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Phone className="text-primary flex-shrink-0" size={20} />
                                <span>(32) 3741-9450</span>
                            </li>
                            <li className="flex items-center gap-3">
                                <Mail className="text-primary flex-shrink-0" size={20} />
                                <span>si.carangola@uemg.br</span>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="pt-8 border-t border-slate-200 dark:border-slate-800 text-center">
                    <p className="text-slate-500 dark:text-slate-500 text-sm">
                        © 2026 Egressos Sistemas de Informação - UEMG Unidade Carangola. Desenvolvido com foco no futuro.
                    </p>
                </div>
            </div>
        </footer>
    )
}
