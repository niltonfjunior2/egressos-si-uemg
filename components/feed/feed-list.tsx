import { PostCard } from "@/components/feed/post-card"
import { PostForm } from "@/components/feed/post-form"
import { Post } from "./types"

interface FeedListProps {
    posts: Post[]
    currentUserId?: string
    readonly?: boolean
}

export function FeedList({ posts, currentUserId, readonly = false }: FeedListProps) {
    return (
        <div className="max-w-2xl mx-auto space-y-6">
            {!readonly && <PostForm />}
            <div className="space-y-4">
                {posts.length === 0 ? (
                    <div className="text-center text-muted-foreground py-10">
                        Nenhuma publicação ainda. Seja o primeiro a postar!
                    </div>
                ) : (
                    posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            currentUserId={currentUserId}
                        />
                    ))
                )}
            </div>
        </div>
    )
}
