"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Trash2, Briefcase } from "lucide-react"
import { deleteProfessionalHistory } from "@/app/(portal)/profile/professional/actions"
import { toast } from "sonner"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { ProfessionalHistoryForm } from "./professional-form"
import { useState } from "react"
import { Loader2 } from "lucide-react"
import { format } from "date-fns"
import { ptBR } from "date-fns/locale"

// Define simplified type for prop
type ProfessionalRecord = {
    id: string
    company_name: string
    role_title: string
    start_date: string
    end_date: string | null
    is_current: boolean
    tech_stack: string[] | null
}

interface ProfessionalListProps {
    records: ProfessionalRecord[]
}

export function ProfessionalList({ records }: ProfessionalListProps) {
    const [open, setOpen] = useState(false)
    const [deletingId, setDeletingId] = useState<string | null>(null)

    async function handleDelete(id: string) {
        if (confirm("Tem certeza que deseja remover este registro?")) {
            setDeletingId(id)
            const result = await deleteProfessionalHistory(id)
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
                <h3 className="text-lg font-medium">Histórico Profissional</h3>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                            <Briefcase className="mr-2 h-4 w-4" />
                            Adicionar Experiência
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Adicionar Experiência</DialogTitle>
                            <DialogDescription>
                                Compartilhe sua trajetória profissional.
                            </DialogDescription>
                        </DialogHeader>
                        <ProfessionalHistoryForm onSuccess={() => setOpen(false)} />
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
                                <div>
                                    <CardTitle className="text-base font-semibold">
                                        {record.role_title}
                                    </CardTitle>
                                    <div className="text-sm font-medium text-muted-foreground">{record.company_name}</div>
                                </div>
                                {record.is_current && (
                                    <Badge>Atual</Badge>
                                )}
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-sm text-muted-foreground mb-2">
                                {format(new Date(record.start_date), "MMM yyyy", { locale: ptBR })} -
                                {record.is_current ? " Presente" : (record.end_date ? ` ${format(new Date(record.end_date), "MMM yyyy", { locale: ptBR })}` : "")}
                            </div>

                            {record.tech_stack && record.tech_stack.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-2">
                                    {record.tech_stack.map((tech, i) => (
                                        <Badge key={i} variant="outline" className="text-xs font-normal">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            )}

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
