export type Post = {
    id: string
    content: string
    created_at: string
    profile_id: string
    profiles: {
        full_name: string
        avatar_url: string | null
    } | null
}
