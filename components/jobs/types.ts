export type Job = {
    id: string
    title: string
    company: string
    location: string
    description: string
    application_url: string
    type: "remoto" | "presencial" | "hibrido"
    created_at: string
    profile_id: string
}
