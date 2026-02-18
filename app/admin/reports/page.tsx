'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDown, Loader2 } from "lucide-react"
import { generatePDIReport } from "./actions"
import { useState } from "react"
import { toast } from "sonner"

export default function ReportsPage() {
    const [loading, setLoading] = useState(false)

    async function handleExportPDI() {
        setLoading(true)
        try {
            const { csv, error } = await generatePDIReport()

            if (error) {
                toast.error(error)
                return
            }

            if (csv) {
                // Trigger Download
                const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
                const url = URL.createObjectURL(blob)
                const link = document.createElement('a')
                link.href = url
                link.setAttribute('download', `relatorio_pdi_${new Date().toISOString().split('T')[0]}.csv`)
                document.body.appendChild(link)
                link.click()
                document.body.removeChild(link)
                toast.success("Relatório gerado com sucesso!")
            }
        } catch (e) {
            console.error(e)
            toast.error("Erro ao gerar relatório.")
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Relatórios & Compliance</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Gere evidências para o CEE/MG e análises estratégicas para o NDE.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FileDown className="mr-2 h-5 w-5 text-blue-600" />
                            Relatório PDI (Art. 21)
                        </CardTitle>
                        <CardDescription>
                            Lista consolidada de empresas contratantes e tecnologias mais demandadas pelo mercado.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleExportPDI}
                            disabled={loading}
                            className="w-full"
                        >
                            {loading ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Gerando...
                                </>
                            ) : (
                                "Exportar CSV"
                            )}
                        </Button>
                    </CardContent>
                </Card>

                <Card className="opacity-75 relative overflow-hidden">
                    <div className="absolute inset-0 bg-gray-100/50 dark:bg-slate-900/50 z-10 flex items-center justify-center">
                        <span className="bg-yellow-100 text-yellow-800 text-xs font-bold px-2 py-1 rounded">Em Breve</span>
                    </div>
                    <CardHeader>
                        <CardTitle>Censo Completo (MEC)</CardTitle>
                        <CardDescription>
                            Exportação de todos os dados de egressos formatados para o Censo da Educação Superior.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button disabled variant="outline" className="w-full">Exportar XML</Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
