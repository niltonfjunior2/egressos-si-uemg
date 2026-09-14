import { z } from "zod"

export const profileSchema = z.object({
    fullName: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    socialName: z.string().optional(),
    mobilePhone: z.string().optional(),
    linkedinUrl: z.string().url("URL inválida").optional().or(z.literal("")),
    githubUrl: z.string().url("URL inválida").optional().or(z.literal("")),
    socialMediaUrl: z.string().url("URL inválida").optional().or(z.literal("")),
    lattesUrl: z.string().url("URL inválida").optional().or(z.literal("")),
    isOpenToMentoring: z.boolean(),
    // Apenas roles de discentes permitidas no portal. Cargos de gestão/docência são restritos ao Admin.
    role: z.enum(["aluno", "egresso"]).optional(),
})

export type ProfileFormData = z.infer<typeof profileSchema>
