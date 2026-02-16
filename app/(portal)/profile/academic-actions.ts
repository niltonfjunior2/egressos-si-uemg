'use server'

import { createClient } from '@/utils/supabase/server'
import { academicRecordSchema, AcademicRecordFormData } from './academic-schema'
import { revalidatePath } from 'next/cache'

export async function addAcademicRecord(formData: AcademicRecordFormData) {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) return { error: 'Não autorizado' }

    const result = academicRecordSchema.safeParse(formData)
    if (!result.success) return { error: 'Dados inválidos' }

    // Map to DB schema (academic_records table based on creating `education_history`? 
    // Wait, Project DNA has `academic_records` for UEMG link and `education_history` for others.
    // The schema.sql in previous turns supports both. 
    // I will assume `academic_records` is strictly for UEMG linking if possible, 
    // but looking at `AcademicRecordFormData` I made it generic.
    // Actually, DNA says: 
    // - CRUD de `academic_records` (Vínculo com a UEMG).
    // - CRUD de `education_history` (Pós-graduação, etc.).

    // Let's implement `education_history` first as a generic "Formation" tab, 
    // and keep `academic_records` maybe for the official UEMG record if needed.
    // However, the user asked for "Academic Records CRUD". Let's stick to `education_history` for general CV 
    // and use `academic_records` table if the user identifies as UEMG student?

    // Let's check schema.sql again to be sure.
    // academic_records: profile_id, entry_year, graduation_year, student_id_code, status. (No institution name! It assumes UEMG)
    // education_history: profile_id, institution_name, degree_type, course_name, status.

    // My schema above had 'institutionName'. So I am mixing them up.
    // I should implement `education_history` for the "CV" part.
    // The `academic_records` seems to be the "official" registry.

    // I will rename the files to `education-schema.ts` and `education-actions.ts` to be correct with DB.
    // And I will map to `education_history`.

    const { error } = await supabase.from('education_history').insert({
        profile_id: user.id,
        institution_name: formData.institutionName,
        course_name: formData.courseName,
        degree_type: 'Bacharelado', // Defaulting for now or add to schema
        status: 'concluido', // Simplified for now, need to fix schema mapping
    })

    // WAIT. I need to redo the schema to match `education_history` table better.
    // Table: institution_name, degree_type, course_name, status (em_andamento, concluido, interrompido)

    return { error: 'Schema mismatch' }
}
