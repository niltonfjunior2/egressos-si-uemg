export type Post = {
    id: string
    content: string
    created_at: string
    author_id: string
    profiles: {
        full_name: string
        social_name: string | null
        avatar_url: string | null
    } | null
}
