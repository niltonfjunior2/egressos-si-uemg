import { FeedList } from "@/components/feed/feed-list"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Post } from "@/components/feed/types"

export default async function FeedPage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch posts with author profiles
    const { data: posts } = await supabase
        .from('feed_posts')
        .select(`
      id,
      content,
      created_at,
      profile_id,
      profiles (
        full_name,
        avatar_url
      )
    `)
        .order('created_at', { ascending: false })
        .limit(20)

    return (
        <div className="container mx-auto py-10 px-4">
            <h1 className="text-3xl font-bold mb-6 text-center md:text-left">Feed de Notícias</h1>
            <FeedList posts={(posts || []) as unknown as Post[]} currentUserId={user.id} />
        </div>
    )
}
