import { z } from "zod"

export const profileSchema = z.object({
    fullName: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    socialName: z.string().optional(),
    linkedinUrl: z.string().url("URL inválida").optional().or(z.literal("")),
    githubUrl: z.string().url("URL inválida").optional().or(z.literal("")),
    isOpenToMentoring: z.boolean(),
    // Avatar handling requires upload logic, leaving out for MVP initial form
})

export type ProfileFormData = z.infer<typeof profileSchema>
