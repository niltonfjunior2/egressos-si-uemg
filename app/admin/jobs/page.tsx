import { getJobs, deleteJob } from './actions'
import { JobFormDialog } from './job-form-dialog'
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
import { MoreHorizontal, Trash2, MapPin, Building2, Search, ExternalLink } from "lucide-react"
import Link from 'next/link'

export default async function JobsPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
    const search = typeof searchParams.search === 'string' ? searchParams.search : ''

    const { jobs, count, userRole, error } = await getJobs(page, 10, search)

    // Determine if user can edit/delete ANY job
    const canManageAll = ['administrador', 'coordenador'].includes(userRole || '')

    async function deleteJobAction(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        await deleteJob(id)
    }

    const typeColors: Record<string, string> = {
        'estagio': 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300',
        'emprego': 'text-blue-600 bg-blue-100 dark:bg-blue-900/30 dark:text-blue-300',
        'trainee': 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300',
        'freelance': 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300',
        'projeto_pesquisa': 'text-pink-600 bg-pink-100 dark:bg-pink-900/30 dark:text-pink-300',
    }

    const statusColors: Record<string, string> = {
        'aberta': 'bg-green-500',
        'preenchida': 'bg-gray-500',
        'cancelada': 'bg-red-500',
    }

    return (
        <div className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gerenciamento de Vagas</h2>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                        {canManageAll ? 'Visualizando todas as vagas do sistema.' : 'Visualizando suas vagas cadastradas.'}
                    </p>
                </div>
                <JobFormDialog />
            </div>

            {/* Search Bar */}
            <div className="bg-white dark:bg-slate-900 p-4 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
                    <form>
                        <Input
                            name="search"
                            defaultValue={search}
                            placeholder="Buscar por cargo ou empresa..."
                            className="pl-9 bg-gray-50 dark:bg-slate-800 w-full"
                        />
                    </form>
                </div>
            </div>

            {/* Jobs Table */}
            <div className="bg-white dark:bg-slate-900 rounded-lg border border-gray-200 dark:border-slate-800 shadow-sm overflow-hidden">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Cargo / Empresa</TableHead>
                            <TableHead>Tipo</TableHead>
                            <TableHead>Local / Modelo</TableHead>
                            {/* Show Author column only for admins/coordinators who see all */}
                            {canManageAll && <TableHead>Postado Por</TableHead>}
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Ações</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {jobs && jobs.length > 0 ? (
                            jobs.map((job: any) => (
                                <TableRow key={job.id}>
                                    <TableCell>
                                        <div className="font-medium">{job.title}</div>
                                        <div className="text-sm text-gray-500 flex items-center gap-1">
                                            <Building2 className="h-3 w-3" /> {job.company}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className={`border-0 ${typeColors[job.type] || 'bg-gray-100 text-gray-600'}`}>
                                            {job.type.replace('_', ' ')}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col text-sm text-gray-500">
                                            {job.location && (
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-3 w-3" /> {job.location}
                                                </span>
                                            )}
                                            <span className="text-xs uppercase tracking-wide opacity-75">{job.work_mode}</span>
                                        </div>
                                    </TableCell>
                                    {canManageAll && (
                                        <TableCell>
                                            <div className="text-sm">
                                                {job.profiles?.full_name || 'Desconhecido'}
                                            </div>
                                            <div className="text-xs text-gray-400">
                                                {new Date(job.created_at).toLocaleDateString()}
                                            </div>
                                        </TableCell>
                                    )}
                                    <TableCell>
                                        <Badge className={`${statusColors[job.status] || 'bg-gray-500'} capitalize`}>
                                            {job.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <div className="flex justify-end gap-2">
                                            <JobFormDialog
                                                jobToEdit={job}
                                                triggerArg={
                                                    <Button variant="ghost" size="icon" className="h-8 w-8">
                                                        <MoreHorizontal className="h-4 w-4" />
                                                        <span className="sr-only">Editar</span>
                                                    </Button>
                                                }
                                            />

                                            <DropdownMenu>
                                                <DropdownMenuTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </DropdownMenuTrigger>
                                                <DropdownMenuContent align="end">
                                                    <DropdownMenuLabel>Confirmar Exclusão</DropdownMenuLabel>
                                                    <DropdownMenuItem className="text-destructive cursor-pointer" asChild>
                                                        <form action={deleteJobAction} className="w-full">
                                                            <input type="hidden" name="id" value={job.id} />
                                                            <button type="submit" className="w-full text-left">
                                                                Excluir Vaga
                                                            </button>
                                                        </form>
                                                    </DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-24 text-center">
                                    Nenhuma vaga encontrada.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}
