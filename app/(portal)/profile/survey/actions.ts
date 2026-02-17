'use server'

import { createClient } from "@/utils/supabase/server"
import { revalidatePath } from "next/cache"
import { surveySchema, SurveyFormData } from "./schema"

export async function submitSurvey(formData: SurveyFormData) {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        return { error: "Usuário não autenticado" }
    }

    const result = surveySchema.safeParse(formData)

    if (!result.success) {
        return { error: "Dados inválidos: " + result.error.issues[0].message }
    }

    const data = result.data

    const { error } = await supabase
        .from('profile_surveys')
        .upsert({
            profile_id: user.id,
            missing_technologies: data.missingTechnologies,
            most_useful_areas: data.mostUsefulAreas,
            soft_skills_desired: data.softSkillsDesired,
            methodology_priority: data.methodologyPriority,
            employability_impact: data.employabilityImpact,
            suggestions: data.suggestions,
            updated_at: new Date().toISOString()
        }, { onConflict: 'profile_id' })

    if (error) {
        console.error("Error submitting survey:", error)
        return { error: "Erro ao salvar pesquisa: " + error.message }
    }

    revalidatePath('/profile')
    return { success: true }
}
