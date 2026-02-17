
import { z } from "zod"

export const educationHistorySchema = z.object({
    id: z.string().optional(),
    institutionName: z.string().min(2, "Instituição obrigatória"),
    degreeType: z.string().min(2, "Tipo de grau obrigatório"), // e.g. Pós-graduação, MBA, Mestrado
    courseName: z.string().min(2, "Nome do curso obrigatório"),
    status: z.enum(["em_andamento", "concluido", "interrompido"]),
    startDate: z.date().optional(), // Not in schema.sql explicitly but good to have? Schema has created_at only.
    // prompt says: institution_name, degree_type, course_name, status. 
    // And Created_at.
    // The HTML has "Instituição e Título" as one field? No, "Instituição e Título" label, input placeholder "MBA em Gestão...".
    // I'll stick to the schema columns.
})

export type EducationHistoryFormData = z.infer<typeof educationHistorySchema>
