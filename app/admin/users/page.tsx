import { getUsers, deleteUser, resetPassword } from './actions'
import { UserFormDialog } from './user-form-dialog'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { calculateProfileStats } from "@/hooks/use-profile-completion"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { MoreHorizontal, Trash2, KeyRound, Search, Filter } from "lucide-react"
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from "@/utils/supabase/server"

// Quick client component for search/filter interaction would be better, but we can do simple server search with query params for now.
// Or we can client-side filter since list might be small? 
// Let's implement Server Side Pagination/Search via URL Params.

export default async function UsersPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    // RBAC Check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'administrador') {
        redirect('/admin')
    }

    const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
    const search = typeof searchParams.search === 'string' ? searchParams.search : ''
    const role = typeof searchParams.role === 'string' ? searchParams.role : 'all'

    const { users, count, error } = await getUsers(page, 10, search, role)

    // Helper for delete action (Server Action Wrapper)
    async function deleteUserAction(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        await deleteUser(id)
    }

    // Role colors
    const roleColors: Record<string, string> = {
        'administrador': 'bg-admin-primary',
        'coordenador': 'bg-purple-600',
        'professor': 'bg-blue-600',
        'egresso': 'bg-green-600',
        'aluno': 'bg-slate-500',
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gerenciamento de Usuários</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Total de {count || 0} usuários registrados.
                    </p>
                </div>
                <UserFormDialog />
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col sm:flex-row gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <form>
                        <Input
                            name="search"
                            defaultValue={search}
                            placeholder="Buscar por nome ou email..."
                            className="pl-9 bg-gray-50 dark:bg-slate-800 w-full"
                        />
                        {/* Hidden input to keep role filter if searching */}
                        {role !== 'all' && <input type="hidden" name="role" value={role} />}
                    </form>
                </div>
                <div className="flex gap-2">
                    {/* Check current role and highlight button */}
                    <Link href={`/admin/users?role=all&search=${search}`}>
                        <Button variant={role === 'all' ? "default" : "outline"} size="sm">Todos</Button>
                    </Link>
                    <Link href={`/admin/users?role=egresso&search=${search}`}>
                        <Button variant={role === 'egresso' ? "default" : "outline"} size="sm">Egressos</Button>
                    </Link>
                    <Link href={`/admin/users?role=professor&search=${search}`}>
                        <Button variant={role === 'professor' ? "default" : "outline"} size="sm">Professores</Button>
                    </Link>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>


                            <TableHead>Nome</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead>Cadastro</TableHead>
                            <TableHead>Status Perfil</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users && users.length > 0 ? (
                            users.map((user: any) => {
                                const stats = calculateProfileStats(user, user.academic_records, user.professional_history)
                                let statusColor = "bg-red-500"
                                if (stats.score >= 50) statusColor = "bg-yellow-500"
                                if (stats.score >= 100) statusColor = "bg-green-500"

                                return (
                                    <TableRow key={user.id}>
                                        <TableCell className="font-medium">{user.full_name}</TableCell>
                                        <TableCell>{user.email}</TableCell>
                                        <TableCell>
                                            <Badge className={`${roleColors[user.role] || 'bg-gray-500'} hover:opacity-90`}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(user.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                <Progress value={stats.score} className="w-16 h-2" indicatorClassName={statusColor} />
                                                <span className="text-xs text-muted-foreground">{stats.score}%</span>
                                            </div>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <UserFormDialog
                                                    userToEdit={user}
                                                    triggerArg={
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                            <span className="sr-only">Menu</span>
                                                        </Button>
                                                    }
                                                />

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <KeyRound className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Segurança</DropdownMenuLabel>
                                                        <DropdownMenuItem
                                                            className="text-destructive cursor-pointer"
                                                        // Ideally create a specific dialog for reset password. 
                                                        // For now, I'll allow deleting via this menu or a separate Delete Dialog.
                                                        // Let's implement real Delete here.
                                                        >
                                                            <form action={deleteUserAction} className="w-full">
                                                                <input type="hidden" name="id" value={user.id} />
                                                                <button type="submit" className="flex items-center w-full">
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Excluir Usuário
                                                                </button>
                                                            </form>
                                                        </DropdownMenuItem>
                                                    </DropdownMenuContent>
                                                </DropdownMenu>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell colSpan={5} className="h-24 text-center">
                                    Nenhum usuário encontrado.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
