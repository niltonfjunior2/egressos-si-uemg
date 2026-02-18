import { getUsers, deleteUser } from './actions'
import { UserFormDialog } from './user-form-dialog'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { MoreHorizontal, Trash2, KeyRound, Search, Briefcase, GraduationCap } from "lucide-react"
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { createClient } from "@/utils/supabase/server"

export default async function UsersPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || profile.role !== 'administrador') redirect('/admin')

    const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
    const search = typeof searchParams.search === 'string' ? searchParams.search : ''
    const role = typeof searchParams.role === 'string' ? searchParams.role : 'all'
    const status = typeof searchParams.status === 'string' ? searchParams.status : 'all'
    const graduationYear = typeof searchParams.graduationYear === 'string' ? searchParams.graduationYear : 'all'
    const mentoring = typeof searchParams.mentoring === 'string' ? searchParams.mentoring : 'all'

    const { users, count, error } = await getUsers(page, 10, {
        search,
        role,
        status,
        graduationYear,
        mentoring
    })

    // Helper for delete action
    async function deleteUserAction(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        await deleteUser(id)
    }

    const roleColors: Record<string, string> = {
        'administrador': 'bg-admin-primary',
        'coordenador': 'bg-purple-600',
        'professor': 'bg-blue-600',
        'egresso': 'bg-green-600',
        'aluno': 'bg-slate-500',
    }

    // Generate years for filter (2018 to current + 1)
    const currentYear = new Date().getFullYear()
    const years = Array.from({ length: currentYear - 2018 + 2 }, (_, i) => (2018 + i).toString())

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gerenciamento de Egressos</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        Total de {count || 0} usuários registrados.
                    </p>
                </div>
                <UserFormDialog />
            </div>

            {/* Filters Bar */}
            <div className="flex flex-col gap-4 bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm">
                <div className="flex flex-col md:flex-row gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                        <form>
                            <Input
                                name="search"
                                defaultValue={search}
                                placeholder="Buscar por nome ou email..."
                                className="pl-9 bg-gray-50 dark:bg-slate-800 w-full"
                            />
                            {role !== 'all' && <input type="hidden" name="role" value={role} />}
                        </form>
                    </div>

                    <div className="flex gap-2 min-w-[200px]">
                        {/* We need client interaction for these selects to update URL or use Forms */}
                        {/* For simplicity in server components without client hooks, simple links or forms works. 
                             Using a Form with auto-submit on change is best for Server Components, but requires Client Wrapper.
                             I'll simply use Links for the pill buttons (Role) and maybe a clear filter button.
                             To keep it simple: Just render Links for filters or use a form with a "Filtrar" button?
                             "Filtrar" button is safest for Server Components.
                         */}
                        <form className="flex gap-2 items-center flex-wrap">
                            <input type="hidden" name="search" value={search} />
                            <input type="hidden" name="role" value={role} />

                            <select
                                name="graduationYear"
                                defaultValue={graduationYear}
                                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="all">Todos os Anos</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>

                            <select
                                name="status"
                                defaultValue={status}
                                className="h-10 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                            >
                                <option value="all">Todos Status</option>
                                <option value="formado">Formado</option>
                                <option value="cursando">Cursando</option>
                                <option value="trancado">Trancado</option>
                                <option value="desistente">Desistente</option>
                            </select>

                            <Button type="submit" variant="secondary">Filtrar</Button>
                        </form>
                    </div>
                </div>

                <div className="flex gap-2 overflow-x-auto pb-2">
                    <Link href={`/admin/users?role=all&search=${search}`}>
                        <Button variant={role === 'all' ? "default" : "outline"} size="sm">Todos</Button>
                    </Link>
                    <Link href={`/admin/users?role=egresso&search=${search}`}>
                        <Button variant={role === 'egresso' ? "default" : "outline"} size="sm">Egressos</Button>
                    </Link>
                    <Link href={`/admin/users?role=professor&search=${search}`}>
                        <Button variant={role === 'professor' ? "default" : "outline"} size="sm">Professores</Button>
                    </Link>
                    <Link href={`/admin/users?role=aluno&search=${search}`}>
                        <Button variant={role === 'aluno' ? "default" : "outline"} size="sm">Alunos</Button>
                    </Link>
                </div>
            </div>

            {/* Users Table */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Nome / Email</TableHead>
                            <TableHead>Função</TableHead>
                            <TableHead>Formação</TableHead>
                            <TableHead>Carreira Atual</TableHead>
                            <TableHead>Mentoria</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {users && users.length > 0 ? (
                            users.map((user: any) => {
                                const academic = user.academic_records
                                const job = user.current_job

                                return (
                                    <TableRow key={user.id}>
                                        <TableCell>
                                            <div className="flex flex-col">
                                                <span className="font-medium text-gray-900 dark:text-gray-100">{user.full_name}</span>
                                                <span className="text-xs text-gray-500">{user.email}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Badge className={`${roleColors[user.role] || 'bg-gray-500'} hover:opacity-90`}>
                                                {user.role}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            {academic ? (
                                                <div className="flex flex-col">
                                                    <div className="flex items-center text-sm">
                                                        <GraduationCap className="w-3 h-3 mr-1 text-gray-400" />
                                                        <span>{academic.graduation_year || '-'}</span>
                                                    </div>
                                                    <span className={`text-[10px] uppercase font-bold ${academic.status === 'formado' ? 'text-green-600' : 'text-yellow-600'}`}>
                                                        {academic.status}
                                                    </span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {job ? (
                                                <div className="flex flex-col max-w-[200px]">
                                                    <span className="text-sm font-medium truncate">{job.role_title}</span>
                                                    <span className="text-xs text-gray-500 truncate">{job.company_name}</span>
                                                </div>
                                            ) : (
                                                <span className="text-gray-400 text-xs text-center block">Sem registro</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {user.is_open_to_mentoring ? (
                                                <Badge variant="outline" className="border-green-500 text-green-600 bg-green-50">Mentor</Badge>
                                            ) : (
                                                <span className="text-gray-300">-</span>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Link href={`/admin/users/${user.id}`}>
                                                    <Button variant="outline" size="sm" className="h-8 text-xs border-blue-600 text-blue-600 hover:bg-blue-50">
                                                        Ver Detalhes
                                                    </Button>
                                                </Link>

                                                <DropdownMenu>
                                                    <DropdownMenuTrigger asChild>
                                                        <Button variant="ghost" size="icon" className="h-8 w-8">
                                                            <MoreHorizontal className="h-4 w-4" />
                                                        </Button>
                                                    </DropdownMenuTrigger>
                                                    <DropdownMenuContent align="end">
                                                        <DropdownMenuLabel>Ações</DropdownMenuLabel>
                                                        <DropdownMenuItem className="text-destructive">
                                                            <form action={deleteUserAction} className="w-full">
                                                                <input type="hidden" name="id" value={user.id} />
                                                                <button type="submit" className="flex items-center w-full">
                                                                    <Trash2 className="mr-2 h-4 w-4" />
                                                                    Excluir
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
                                <TableCell colSpan={6} className="h-24 text-center">
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
