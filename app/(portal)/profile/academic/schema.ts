import { z } from "zod"

export const academicRecordSchema = z.object({
    id: z.string().optional(),
    entryYear: z.coerce.number().min(2000, "Ano inválido").max(new Date().getFullYear(), "Ano futuro não permitido"),
    graduationYear: z.coerce.number().min(2000).max(new Date().getFullYear() + 10).optional().or(z.literal(0)),
    studentIdCode: z.string().optional(),
    status: z.enum(["cursando", "formado", "trancado", "desligado"]),
})

export type AcademicRecordFormData = z.infer<typeof academicRecordSchema>
