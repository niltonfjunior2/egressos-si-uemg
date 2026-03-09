'use client'

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createJob, updateJob } from './actions'
import { toast } from "sonner"
import { Plus, Pencil } from "lucide-react"

export function JobFormDialog({ jobToEdit, triggerArg }: { jobToEdit?: any, triggerArg?: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Controlled states for Selects
    const [type, setType] = useState(jobToEdit?.type || 'estagio')
    const [workMode, setWorkMode] = useState(jobToEdit?.work_mode || 'presencial')
    const [status, setStatus] = useState(jobToEdit?.status || 'aberta')

    async function handleSubmit(formData: FormData) {
        setLoading(true)

        // The Select components are controlled by state and have a name attribute,
        // so their values are already in FormData if the user changes them.
        // However, if the user doesn't change them, the default value might not be in FormData
        // depending on the Radix UI Select implementation.
        // It's safer to explicitly set them from our React state to guarantee they are sent.
        formData.set('type', type)
        formData.set('work_mode', workMode)

        if (jobToEdit) {
            formData.set('id', jobToEdit.id)
            formData.set('status', status)
            
            const result = await updateJob(formData)
            setLoading(false)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success(result?.success || 'Vaga atualizada com sucesso!')
                setOpen(false)
            }
        } else {
            const result = await createJob(formData)
            setLoading(false)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success(result?.success || 'Vaga criada com sucesso!')
                setOpen(false)
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerArg ? triggerArg : (
                    <Button className="bg-admin-primary hover:bg-admin-primary/90">
                        <Plus className="mr-2 h-4 w-4" /> Nova Vaga
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>{jobToEdit ? 'Editar Vaga' : 'Nova Vaga'}</DialogTitle>
                    <DialogDescription>
                        {jobToEdit ? 'Atualize os detalhes da vaga.' : 'Preencha os dados da nova oportunidade.'}
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Título da Vaga *</Label>
                            <Input id="title" name="title" defaultValue={jobToEdit?.title} required placeholder="Ex: Desenvolvedor Front-end" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="company">Empresa *</Label>
                            <Input id="company" name="company" defaultValue={jobToEdit?.company} required placeholder="Nome da empresa" />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Descrição *</Label>
                        <Textarea id="description" name="description" defaultValue={jobToEdit?.description} required placeholder="Detalhes da vaga, requisitos, etc..." className="h-32" />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="type">Tipo de Vaga *</Label>
                            <Select onValueChange={setType} defaultValue={type} name="type">
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="estagio">Estágio</SelectItem>
                                    <SelectItem value="emprego">Emprego</SelectItem>
                                    <SelectItem value="trainee">Trainee</SelectItem>
                                    <SelectItem value="monitoria">Monitoria</SelectItem>
                                    <SelectItem value="freelance">Freelance</SelectItem>
                                    <SelectItem value="pj">Contratação PJ</SelectItem>
                                    <SelectItem value="projeto_pesquisa">Projeto de Pesquisa</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="work_mode">Modelo de Trabalho *</Label>
                            <Select onValueChange={setWorkMode} defaultValue={workMode} name="work_mode">
                                <SelectTrigger>
                                    <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="presencial">Presencial</SelectItem>
                                    <SelectItem value="remoto">Remoto</SelectItem>
                                    <SelectItem value="hibrido">Híbrido</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="location">Localização</Label>
                            <Input id="location" name="location" defaultValue={jobToEdit?.location} placeholder="Ex: Carangola, MG" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="expires_at">Data de Expiração</Label>
                            <Input
                                id="expires_at"
                                name="expires_at"
                                type="date"
                                defaultValue={jobToEdit?.expires_at ? new Date(jobToEdit.expires_at).toISOString().split('T')[0] : ''}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="link_url">Link da Vaga / Inscrição</Label>
                            <Input id="link_url" name="link_url" type="url" defaultValue={jobToEdit?.link_url} placeholder="https://..." />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="contact_info">Contato</Label>
                        <Input id="contact_info" name="contact_info" defaultValue={jobToEdit?.contact_info} placeholder="Nome do responsável ou email para contato" />
                    </div>

                    {jobToEdit && (
                        <div className="space-y-2 border-t pt-4">
                            <Label htmlFor="status">Status da Vaga</Label>
                            <Select onValueChange={setStatus} defaultValue={status} name="status">
                                <SelectTrigger>
                                    <SelectValue placeholder="Status..." />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="aberta">Aberta</SelectItem>
                                    <SelectItem value="preenchida">Preenchida</SelectItem>
                                    <SelectItem value="cancelada">Cancelada</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    )}

                    <DialogFooter className="mt-4">
                        <Button type="submit" disabled={loading} className="bg-admin-primary hover:bg-admin-primary/90 w-full md:w-auto">
                            {loading ? 'Salvando...' : 'Salvar Vaga'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
