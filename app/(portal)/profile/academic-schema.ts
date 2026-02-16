import { z } from "zod"

export const academicRecordSchema = z.object({
    id: z.string().optional(),
    institutionName: z.string().min(2, "Nome da instituição obrigatório"),
    courseName: z.string().min(2, "Nome do curso obrigatório"),
    entryYear: z.coerce.number().min(1900).max(new Date().getFullYear()),
    graduationYear: z.coerce.number().min(1900).max(new Date().getFullYear() + 10).optional().or(z.literal(0)),
    status: z.enum(["cursando", "formado", "rancado", "desligado"]),
})

export type AcademicRecordFormData = z.infer<typeof academicRecordSchema>
