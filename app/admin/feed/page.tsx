import { getPosts, togglePin, deletePost } from './actions'
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Pin, PinOff, Trash2 } from "lucide-react"
import { redirect } from 'next/navigation'
import { createClient } from "@/utils/supabase/server"

export default async function FeedPage({
    searchParams,
}: {
    searchParams: { [key: string]: string | string[] | undefined }
}) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) redirect('/login')

    // RBAC
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || !['administrador', 'coordenador'].includes(profile.role)) {
        redirect('/admin')
    }

    const page = typeof searchParams.page === 'string' ? parseInt(searchParams.page) : 1
    const { posts, count } = await getPosts(page)

    // Actions
    async function togglePinAction(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        const status = formData.get('status') === 'true'
        await togglePin(id, status)
    }

    async function deletePostAction(formData: FormData) {
        'use server'
        const id = formData.get('id') as string
        await deletePost(id)
    }

    return (
        <div className="space-y-8">
            <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Gerenciamento do Feed</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Modere postagens e destaque notícias importantes.
                </p>
            </div>

            <div className="grid gap-4">
                {posts && posts.length > 0 ? (
                    posts.map((post: any) => (
                        <div key={post.id} className={`bg-white dark:bg-slate-900 p-4 rounded-lg border ${post.is_pinned ? 'border-admin-primary/50 shadow-md' : 'border-gray-200 dark:border-slate-800 shadow-sm'} flex flex-col md:flex-row gap-4 items-start md:items-center`}>
                            <div className="flex-1 space-y-2">
                                <div className="flex items-center gap-2">
                                    <Badge variant={post.is_pinned ? "default" : "secondary"} className={post.is_pinned ? "bg-admin-primary" : ""}>
                                        {post.is_pinned ? <><Pin className="w-3 h-3 mr-1" /> Fixado</> : "Normal"}
                                    </Badge>
                                    <span className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                                        {post.profiles?.full_name}
                                    </span>
                                    <span className="text-xs text-gray-400">
                                        {new Date(post.created_at).toLocaleString()}
                                    </span>
                                </div>
                                <p className="text-gray-800 dark:text-gray-200 text-sm">
                                    {post.content}
                                </p>
                            </div>

                            <div className="flex gap-2">
                                <form action={togglePinAction}>
                                    <input type="hidden" name="id" value={post.id} />
                                    <input type="hidden" name="status" value={String(post.is_pinned)} />
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        title={post.is_pinned ? "Desafixar" : "Fixar no topo"}
                                        className={post.is_pinned ? "border-admin-primary text-admin-primary hover:bg-admin-primary/10" : ""}
                                    >
                                        {post.is_pinned ? <PinOff className="w-4 h-4" /> : <Pin className="w-4 h-4" />}
                                    </Button>
                                </form>

                                <form action={deletePostAction}>
                                    <input type="hidden" name="id" value={post.id} />
                                    <Button size="sm" variant="ghost" className="text-destructive hover:bg-destructive/10" title="Excluir">
                                        <Trash2 className="w-4 h-4" />
                                    </Button>
                                </form>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-10 text-gray-500 bg-white dark:bg-slate-900 rounded-lg border border-dashed">
                        Nenhuma postagem encontrada.
                    </div>
                )}
            </div>
        </div>
    )
}
