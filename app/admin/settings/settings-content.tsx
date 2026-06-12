"use client"

import { useState, useTransition } from "react"
import { Switch } from "@/components/ui/switch"
import { ShieldAlert } from "lucide-react"
import { toggleGlobalElectionMode } from "./actions"
// If you have a toast hook, it can be imported here, e.g. import { useToast } from "@/components/ui/use-toast" or similar.

interface SettingsContentProps {
    initialElectionMode: boolean
}

export function SettingsContent({ initialElectionMode }: SettingsContentProps) {
    const [isPending, startTransition] = useTransition()
    const [isElectionMode, setIsElectionMode] = useState(initialElectionMode)

    const handleToggle = () => {
        const nextState = !isElectionMode
        // Optimistic update
        setIsElectionMode(nextState)
        
        startTransition(async () => {
            try {
                await toggleGlobalElectionMode(nextState)
            } catch (error) {
                // Revert if error
                setIsElectionMode(!nextState)
                console.error(error)
                alert("Falha ao alterar o modo.")
            }
        })
    }

    return (
        <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
                <div className="flex items-start gap-4">
                    <div className="p-3 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-xl shrink-0">
                        <ShieldAlert className="h-6 w-6" />
                    </div>
                    <div className="flex-1">
                        <div className="flex items-center justify-between">
                            <div>
                                <h2 className="text-xl font-bold text-slate-800 dark:text-white">Vedação Eleitoral</h2>
                                <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
                                    Ative esta opção durante o período eleitoral para substituir a landing page oficial por uma versão minimalista e descaracterizada, em conformidade com as exigências legais.
                                </p>
                            </div>
                            <div className="ml-4">
                                <Switch 
                                    checked={isElectionMode}
                                    onCheckedChange={handleToggle}
                                    disabled={isPending}
                                    className="data-[state=checked]:bg-red-600"
                                />
                            </div>
                        </div>
                        
                        {isElectionMode && (
                            <div className="mt-4 p-4 bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800/50 rounded-lg">
                                <p className="text-sm text-amber-800 dark:text-amber-300 font-medium">
                                    ⚠️ O modo de vedação eleitoral está ativo. Visitantes não autenticados verão a landing page descaracterizada.
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    )
}
