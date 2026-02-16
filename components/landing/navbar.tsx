"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X } from "lucide-react"
import { Button } from "@/components/ui/button"

export function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false)

    const toggleMenu = () => setIsMenuOpen(!isMenuOpen)

    return (
        <nav className="fixed w-full z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    <Link href="/" className="flex items-center gap-3 hover:opacity-90 transition-opacity">
                        <img
                            alt="UEMG Carangola Logo"
                            className="h-10 w-auto"
                            src="/logo_uemg.png"
                        />
                        <div className="hidden md:block">
                            <span className="text-sm font-bold tracking-tight text-primary uppercase block leading-none">Sistemas de</span>
                            <span className="text-sm font-bold tracking-tight text-primary uppercase block">Informação</span>
                        </div>
                    </Link>

                    {/* Desktop Menu */}
                    <div className="hidden md:flex items-center space-x-4">
                        <Link href="/" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white font-medium transition-colors">
                            Início
                        </Link>
                        <Link href="#beneficios" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white font-medium transition-colors">
                            Benefícios
                        </Link>
                        <Link href="#comunidade" className="text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white font-medium transition-colors mr-4">
                            Comunidade
                        </Link>

                        <Button asChild variant="outline" className="border-primary text-primary hover:bg-primary/10 rounded-full px-6">
                            <Link href="/login">
                                Entrar
                            </Link>
                        </Button>
                        <Button asChild className="bg-primary hover:bg-primary/90 text-white rounded-full px-6 shadow-lg shadow-primary/20">
                            <Link href="/signup">
                                Criar Conta
                            </Link>
                        </Button>
                    </div>

                    {/* Mobile Menu Button */}
                    <div className="md:hidden flex items-center">
                        <button
                            onClick={toggleMenu}
                            className="text-slate-600 dark:text-slate-300 p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-md transition-colors"
                        >
                            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu Dropdown */}
            {isMenuOpen && (
                <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 pt-2 pb-4 space-y-2 shadow-lg">
                    <Link href="/" className="block text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white font-medium py-2" onClick={toggleMenu}>
                        Início
                    </Link>
                    <Link href="#beneficios" className="block text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white font-medium py-2" onClick={toggleMenu}>
                        Benefícios
                    </Link>
                    <Link href="#comunidade" className="block text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-white font-medium py-2" onClick={toggleMenu}>
                        Comunidade
                    </Link>
                    <div className="grid grid-cols-2 gap-2 pt-2">
                        <Button asChild variant="outline" className="w-full border-primary text-primary hover:bg-primary/10 rounded-full">
                            <Link href="/login" onClick={toggleMenu}>
                                Entrar
                            </Link>
                        </Button>
                        <Button asChild className="w-full bg-primary hover:bg-primary/90 text-white rounded-full">
                            <Link href="/signup" onClick={toggleMenu}>
                                Criar Conta
                            </Link>
                        </Button>
                    </div>
                </div>
            )}
        </nav>
    )
}
