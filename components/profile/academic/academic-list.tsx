"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, GraduationCap } from "lucide-react"
import { deleteAcademicRecord } from "@/app/(portal)/profile/academic/actions"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { AcademicRecordForm } from "./academic-form"
import { useState } from "react"
import { Loader2 } from "lucide-react"

// Define simplified type for prop
type AcademicRecord = {
    id: string
    entry_year: number
    graduation_year: number | null
    status: string
    student_id_code: string | null
}

interface AcademicListProps {
    records: AcademicRecord[]
}

export function AcademicList({ records }: AcademicListProps) {
    const [open, setOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    async function handleDelete(id: string) {
        if (confirm("Tem certeza que deseja remover este registro?")) {
            setDeletingId(id)
            const result = await deleteAcademicRecord(id)
            setDeletingId(null)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success("Registro removido")
            }
        }
    }

    return (
        <div className="space-y-4">
            <div className="flex justify-between items-center">
                <h3 className="text-lg font-medium">Vínculo com UEMG</h3>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <GraduationCap className="mr-2 h-4 w-4" />
                            Adicionar Vínculo
                        </Button>
                    </DialogTrigger>
                    <DialogContent>
                        <DialogHeader>
                            <DialogTitle>Adicionar Vínculo Acadêmico</DialogTitle>
                            <DialogDescription>
                                Informe os dados do seu vínculo com o curso de Sistemas de Informação.
                            </DialogDescription>
                        </DialogHeader>
                        <AcademicRecordForm onSuccess={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid gap-4">
                {records.length === 0 && (
                    <p className="text-muted-foreground text-sm">Nenhum registro encontrado.</p>
                )}
                {records.map((record) => (
                    <Card key={record.id} className="relative group">
                        <CardHeader className="pb-2">
                            <div className="flex justify-between items-start">
                                <CardTitle className="text-base font-semibold">
                                    Sistemas de Informação
                                </CardTitle>
                                <Badge variant={record.status === 'formado' ? 'default' : 'secondary'}>
                                    {record.status.toUpperCase()}
                                </Badge>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground grid grid-cols-2 gap-2">
                                <div>Entrada: <span className="text-foreground">{record.entry_year}</span></div>
                                <div>Conclusão: <span className="text-foreground">{record.graduation_year || '-'}</span></div>
                                {record.student_id_code && (
                                    <div className="col-span-2">Matrícula: <span className="font-mono text-foreground">{record.student_id_code}</span></div>
                                )}
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                disabled={deletingId === record.id}
                                className="absolute top-2 right-2 h-8 w-8 text-muted-foreground hover:text-destructive opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => handleDelete(record.id)}
                            >
                                {deletingId === record.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                            </Button>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </div>
    )
}
