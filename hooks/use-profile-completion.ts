
import { Database } from "@/utils/supabase/database.types";

type Profile = Database["public"]["Tables"]["profiles"]["Row"];
type AcademicRecord = Database["public"]["Tables"]["academic_records"]["Row"];
type ProfessionalHistory = Database["public"]["Tables"]["professional_history"]["Row"];

export interface ProfileCompletionStats {
  score: number;
  isComplete: boolean;
  missingFields: string[];
}

export function calculateProfileStats(
  profile: Profile | null,
  academic: AcademicRecord[] | null,
  professional: ProfessionalHistory[] | null
): ProfileCompletionStats {
  let score = 0;
  const missingFields: string[] = [];

  if (!profile) {
    return {
      score: 0,
      isComplete: false,
      missingFields: ["Perfil não carregado"],
    };
  }

  // 1. Identidade (30%)
  // +10% Avatar
  if (profile.avatar_url) {
    score += 10;
  } else {
    missingFields.push("Foto de Perfil");
  }

  // +10% LinkedIn
  if (profile.linkedin_url) {
    score += 10;
  } else {
    missingFields.push("LinkedIn");
  }

  // +10% Mentoria
  if (profile.is_open_to_mentoring !== null && profile.is_open_to_mentoring !== undefined) {
    score += 10;
  } else {
    missingFields.push("Disponibilidade para Mentoria");
  }


  // 2. Vínculo Acadêmico (30%)
  const hasGraduation = academic?.some(
    (record) => record.status === "formado" // && record.graduation_year (implied if Status formed?)
      // Instruction: "status = 'formado' e graduation_year preenchido"
      && record.graduation_year
  );

  if (hasGraduation) {
    score += 30;
  } else {
    missingFields.push("Registro de Graduação (Formado)");
  }

  // 3. Situação Profissional (40%)
  if (professional && professional.length > 0) {
    score += 40;
  } else {
    missingFields.push("Histórico Profissional");
  }

  return {
    score: Math.min(score, 100),
    isComplete: score >= 100,
    missingFields,
  };
}

export function useProfileCompletion(
  profile: Profile | null,
  academic: AcademicRecord[] | null,
  professional: ProfessionalHistory[] | null
): ProfileCompletionStats {
  return calculateProfileStats(profile, academic, professional);
}
