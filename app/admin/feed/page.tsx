import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Check, X, Clock } from "lucide-react"
import { approvePost, rejectPost } from "./actions"

export default async function AdminFeedPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) redirect('/login')

    // Fetch pending posts
    const { data: pendingPosts, error } = await supabase
        .from('feed_posts')
        .select(`
            id,
            content,
            status,
            created_at,
            author_id,
            profiles:author_id (
                full_name,
                role
            )
        `)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching pending posts:', error)
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Moderação de Feed</h2>
                <p className="text-muted-foreground">Aprove ou rejeite publicações da comunidade.</p>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Todas as Publicações</CardTitle>
                    <CardDescription>
                        Visualizando {pendingPosts?.length || 0} publicações.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        {pendingPosts && pendingPosts.length > 0 ? (
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {pendingPosts.map((post: any) => (
                                    <div key={post.id} className="border rounded-lg p-4 space-y-3 bg-white dark:bg-slate-900 shadow-sm flex flex-col h-full">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center text-primary text-xs font-bold">
                                                    {post.profiles?.full_name?.charAt(0)}
                                                </div>
                                                <div>
                                                    <p className="text-sm font-semibold leading-none">{post.profiles?.full_name}</p>
                                                    <p className="text-xs text-muted-foreground capitalize">{post.profiles?.role}</p>
                                                </div>
                                            </div>
                                            {post.status === 'approved' && (
                                                <Badge variant="outline" className="text-green-600 border-green-600 bg-green-50">
                                                    <Check size={12} className="mr-1" /> Aprovado
                                                </Badge>
                                            )}
                                            {post.status === 'pending' && (
                                                <Badge variant="outline" className="text-amber-500 border-amber-500 bg-amber-50">
                                                    <Clock size={12} className="mr-1" /> Pendente
                                                </Badge>
                                            )}
                                            {post.status === 'rejected' && (
                                                <Badge variant="outline" className="text-red-500 border-red-500 bg-red-50">
                                                    <X size={12} className="mr-1" /> Rejeitado
                                                </Badge>
                                            )}
                                        </div>

                                        <div className="text-sm text-slate-700 dark:text-slate-300 flex-grow min-h-[80px]">
                                            {post.content}
                                        </div>

                                        <div className="text-xs text-muted-foreground border-t pt-2">
                                            {new Date(post.created_at).toLocaleString('pt-BR')}
                                        </div>

                                        <div className="flex gap-2 pt-2 mt-auto">
                                            <form action={async () => {
                                                'use server'
                                                await approvePost(post.id)
                                            }} className="w-full">
                                                <Button size="sm" className="w-full bg-green-600 hover:bg-green-700 text-white" type="submit">
                                                    <Check size={16} className="mr-1" /> Aprovar
                                                </Button>
                                            </form>
                                            <form action={async () => {
                                                'use server'
                                                await rejectPost(post.id)
                                            }} className="w-full">
                                                <Button size="sm" variant="destructive" className="w-full" type="submit">
                                                    <X size={16} className="mr-1" /> Rejeitar
                                                </Button>
                                            </form>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="text-center py-12 text-muted-foreground">
                                <Check className="mx-auto h-12 w-12 text-green-500 mb-4 opacity-50" />
                                <h3 className="text-lg font-medium text-slate-900 dark:text-slate-100">Tudo limpo!</h3>
                                <p>Não há publicações pendentes de aprovação no momento.</p>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    )
}
