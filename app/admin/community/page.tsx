import { FeedList } from "@/components/feed/feed-list"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Post } from "@/components/feed/types"

export default async function AdminCommunityPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Role check to ensure only authorized users access this page
    const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

    if (!profile || !['administrador', 'coordenador', 'professor'].includes(profile.role)) {
        redirect('/admin')
    }

    // Fetch posts with author profiles
    const { data: posts, error } = await supabase
        .from('feed_posts')
        .select(`
      id,
      content,
      created_at,
      status,
      author_id,
      profiles:author_id (
        full_name,
        social_name
      )
    `)
        .eq('status', 'approved') // Only show approved posts in community view? Or all? Usually feed shows approved.
        .order('created_at', { ascending: false })
        .limit(20)

    if (error) {
        console.error('Error fetching posts:', error)
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">Comunidade</h2>
                <p className="text-muted-foreground">Acompanhe as novidades e interaja com a comunidade acadêmica.</p>
            </div>

            <FeedList posts={(posts || []) as unknown as Post[]} currentUserId={user.id} />
        </div>
    )
}
