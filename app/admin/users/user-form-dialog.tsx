'use client'

import { useState, useEffect } from 'react'
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { createUser, updateUser } from './actions'
import { toast } from "sonner"
import { Plus, Pencil } from "lucide-react"

export function UserFormDialog({ userToEdit, triggerArg }: { userToEdit?: any, triggerArg?: React.ReactNode }) {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)

    // Form States
    const [role, setRole] = useState(userToEdit?.role || 'aluno')

    async function handleSubmit(formData: FormData) {
        setLoading(true)

        // Append role manually since Select might not be caught by native FormData efficiently if controlled 
        // (Actually native FormData works fine with hidden input or name on select if simple, but Select shadcn is distinct)
        formData.set('role', role)

        if (userToEdit) {
            formData.append('id', userToEdit.id)
            const result = await updateUser(formData)
            setLoading(false)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)
                setOpen(false)
            }
        } else {
            const result = await createUser(formData)
            setLoading(false)
            if (result?.error) {
                toast.error(result.error)
            } else {
                toast.success(result.success)
                setOpen(false)
            }
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {triggerArg ? triggerArg : (
                    <Button className="bg-admin-primary hover:bg-admin-primary/90">
                        <Plus className="mr-2 h-4 w-4" /> Novo Usuário
                    </Button>
                )}
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>{userToEdit ? 'Editar Usuário' : 'Novo Usuário'}</DialogTitle>
                    <DialogDescription>
                        {userToEdit ? 'Atualize os dados do usuário aqui.' : 'Adicione um novo usuário ao sistema. Ele terá acesso imediato.'}
                    </DialogDescription>
                </DialogHeader>
                <form action={handleSubmit} className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="fullName" className="text-right">
                            Nome
                        </Label>
                        <Input
                            id="fullName"
                            name="fullName"
                            defaultValue={userToEdit?.full_name}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            defaultValue={userToEdit?.email}
                            className="col-span-3"
                            required
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="alternativeEmail" className="text-right">
                            Email Alternativo
                        </Label>
                        <Input
                            id="alternativeEmail"
                            name="alternativeEmail"
                            type="email"
                            defaultValue={userToEdit?.alternative_email}
                            className="col-span-3"
                            placeholder="Opcional"
                        />
                    </div>

                    {!userToEdit && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Senha
                            </Label>
                            <Input
                                id="password"
                                name="password"
                                type="password"
                                className="col-span-3"
                                placeholder="Mínimo 6 dígitos"
                                required
                            />
                        </div>
                    )}

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="role" className="text-right">
                            Função
                        </Label>
                        <Select onValueChange={setRole} defaultValue={role} name="role">
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Selecione a função" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="aluno">Aluno</SelectItem>
                                <SelectItem value="egresso">Egresso</SelectItem>
                                <SelectItem value="professor">Professor</SelectItem>
                                <SelectItem value="coordenador">Coordenador</SelectItem>
                                <SelectItem value="administrador">Administrador</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <DialogFooter>
                        <Button type="submit" disabled={loading} className="bg-admin-primary hover:bg-admin-primary/90">
                            {loading ? 'Salvando...' : 'Salvar'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    )
}
