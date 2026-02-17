import { z } from "zod"

export const surveySchema = z.object({
    missingTechnologies: z.string().optional(),
    mostUsefulAreas: z.array(z.string()).optional(), // Checkbox array
    softSkillsDesired: z.array(z.string()).optional(), // Checkbox array
    methodologyPriority: z.array(z.string()).optional(), // Checkbox array
    employabilityImpact: z.coerce.number().min(1).max(5).optional(), // 1-5
    suggestions: z.string().optional(),
})

export type SurveyFormData = z.infer<typeof surveySchema>
