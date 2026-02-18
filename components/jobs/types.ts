export type Job = {
    id: string
    title: string
    company: string
    location: string
    description: string
    link_url: string
    type: "estagio" | "emprego" | "trainee" | "freelance" | "projeto_pesquisa" | "monitoria"
    work_mode: "presencial" | "remoto" | "hibrido"
    expires_at?: string | null
    created_at: string
    author_id: string
}
