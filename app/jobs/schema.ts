import { z } from "zod"

export const jobSchema = z.object({
    title: z.string().min(2, "Título obrigatório"),
    company: z.string().min(2, "Empresa obrigatória"),
    location: z.string().min(2, "Localização obrigatória"),
    description: z.string().min(10, "Descrição deve ter no mínimo 10 caracteres"),
    applicationUrl: z.string().url("URL inválida"),
    type: z.enum(["remoto", "presencial", "hibrido"]),
})

export type JobFormData = z.infer<typeof jobSchema>
