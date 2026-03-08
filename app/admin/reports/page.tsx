'use client'

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { FileDown, Loader2, Users } from "lucide-react"
import { getCompaniesReportData, getTechReportData, getCensusReportData } from "./actions"
import { useState } from "react"
import { toast } from "sonner"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

export default function ReportsPage() {
    const [loadingCompanies, setLoadingCompanies] = useState(false)
    const [loadingTech, setLoadingTech] = useState(false)
    const [loadingCensus, setLoadingCensus] = useState(false)

    async function handleExportCompanies() {
        setLoadingCompanies(true)
        try {
            const { data, error } = await getCompaniesReportData()

            if (error || !data) {
                toast.error(error || "Erro ao gerar relatório.")
                return
            }

            const doc = new jsPDF()
            doc.setFontSize(16)
            doc.text("Relatório: Empresas Contratantes", 14, 20)
            doc.setFontSize(10)
            doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 28)

            autoTable(doc, {
                startY: 35,
                head: [['Empresa', 'Quantidade de Egressos']],
                body: data.map(item => [item.name, item.count]),
                theme: 'striped',
                headStyles: { fillColor: [41, 128, 185] }
            })

            doc.save(`empresas_contratantes_${new Date().toISOString().split('T')[0]}.pdf`)
            toast.success("Relatório gerado com sucesso!")
        } catch (e) {
            console.error(e)
            toast.error("Erro ao gerar relatório.")
        } finally {
            setLoadingCompanies(false)
        }
    }

    async function handleExportTech() {
        setLoadingTech(true)
        try {
            const { data, error } = await getTechReportData()

            if (error || !data) {
                toast.error(error || "Erro ao gerar relatório.")
                return
            }

            const doc = new jsPDF()
            doc.setFontSize(16)
            doc.text("Relatório: Tecnologias Mais Demandadas", 14, 20)
            doc.setFontSize(10)
            doc.text(`Gerado em: ${new Date().toLocaleString()}`, 14, 28)

            autoTable(doc, {
                startY: 35,
                head: [['Tecnologia', 'Ocorrências']],
                body: data.map(item => [item.name, item.count]),
                theme: 'striped',
                headStyles: { fillColor: [39, 174, 96] }
            })

            doc.save(`tecnologias_demandadas_${new Date().toISOString().split('T')[0]}.pdf`)
            toast.success("Relatório gerado com sucesso!")
        } catch (e) {
            console.error(e)
            toast.error("Erro ao gerar relatório.")
        } finally {
            setLoadingTech(false)
        }
    }

    async function handleExportCensus() {
        setLoadingCensus(true)
        try {
            const { data, error } = await getCensusReportData()

            if (error || !data) {
                toast.error(error || "Erro ao gerar relatório do censo.")
                return
            }

            // Using landscape orientation for more columns
            const doc = new jsPDF('landscape')
            doc.setFontSize(16)
            doc.text("Censo Completo: Discentes e Egressos SI", 14, 20)
            doc.setFontSize(10)
            doc.text(`Gerado em: ${new Date().toLocaleString()} | Total: ${data.length} registros`, 14, 28)

            autoTable(doc, {
                startY: 35,
                head: [['Nome Completo', 'E-mail', 'Vínculo', 'Matrícula', 'Ingresso', 'Graduação', 'Status']],
                body: data.map(item => [
                    item.name,
                    item.email,
                    item.role,
                    item.studentId,
                    item.entryYear,
                    item.graduationYear,
                    item.status
                ]),
                theme: 'striped',
                headStyles: { fillColor: [142, 68, 173] },
                styles: { fontSize: 8 },
                columnStyles: {
                    0: { cellWidth: 60 },
                    1: { cellWidth: 70 },
                }
            })

            doc.save(`censo_completo_si_${new Date().toISOString().split('T')[0]}.pdf`)
            toast.success("Censo PDF gerado com sucesso!")
        } catch (e) {
            console.error(e)
            toast.error("Erro ao gerar censo.")
        } finally {
            setLoadingCensus(false)
        }
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Relatórios & Compliance</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Companies Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FileDown className="mr-2 h-5 w-5 text-blue-600" />
                            Empresas Contratantes
                        </CardTitle>
                        <CardDescription>
                            Lista consolidada de empresas atuantes com egressos de SI.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleExportCompanies}
                            disabled={loadingCompanies || loadingTech || loadingCensus}
                            className="w-full"
                        >
                            {loadingCompanies ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Gerando PDF...
                                </>
                            ) : (
                                "Exportar PDF"
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Techs Card */}
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <FileDown className="mr-2 h-5 w-5 text-green-600" />
                            Tecnologias Demandadas
                        </CardTitle>
                        <CardDescription>
                            Stack mais utilizada no mercado baseada nos registros.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button
                            onClick={handleExportTech}
                            disabled={loadingTech || loadingCompanies || loadingCensus}
                            variant="secondary"
                            className="w-full"
                        >
                            {loadingTech ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Gerando PDF...
                                </>
                            ) : (
                                "Exportar PDF"
                            )}
                        </Button>
                    </CardContent>
                </Card>

                {/* Census Card */}
                <Card className="border-purple-200 dark:border-purple-900">
                    <CardHeader>
                        <CardTitle className="flex items-center">
                            <Users className="mr-2 h-5 w-5 text-purple-600" />
                            Censo Completo (PDF)
                        </CardTitle>
                        <CardDescription>
                            Relatório panorâmico com matrícula, ingresso e status formativo de alunos e egressos.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button 
                            onClick={handleExportCensus}
                            disabled={loadingCensus || loadingTech || loadingCompanies}
                            variant="outline" 
                            className="w-full text-purple-600 border-purple-200 hover:bg-purple-50 dark:hover:bg-purple-900"
                        >
                            {loadingCensus ? (
                                <>
                                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                    Gerando PDF Paisagem...
                                </>
                            ) : (
                                "Exportar Censo PDF"
                            )}
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
