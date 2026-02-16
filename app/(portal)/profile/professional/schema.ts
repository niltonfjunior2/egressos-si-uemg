import { z } from "zod"

export const professionalHistorySchema = z.object({
    id: z.string().optional(),
    companyName: z.string().min(2, "Nome da empresa obrigatório"),
    roleTitle: z.string().min(2, "Cargo obrigatório"),
    startDate: z.date(),
    endDate: z.date().optional(),
    isCurrent: z.boolean(),
    techStack: z.string().optional(), // We'll handle array splitting in the action or refine later
    salaryRange: z.enum(['<2k', '2k-5k', '5k-8k', '8k-12k', '12k-15k', '>15k']).optional(),
}).refine((data) => {
    if (!data.isCurrent && !data.endDate) {
        return false
    }
    return true
}, {
    message: "Data de término obrigatória se não for atual",
    path: ["endDate"],
})

export type ProfessionalHistoryFormData = z.infer<typeof professionalHistorySchema>
