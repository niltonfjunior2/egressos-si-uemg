// Manual types since database.types.ts is missing
export interface Profile {
  id: string;
  full_name: string;
  social_name?: string | null;
  mobile_phone?: string | null;
  email?: string | null;
  linkedin_url?: string | null;
  github_url?: string | null;
  social_media_url?: string | null; // Replaces avatar_url
  is_open_to_mentoring?: boolean | null;
  role?: string;
  avatar_url?: string | null; // Keep for legacy if needed, but logic uses social
}

export interface AcademicRecord {
  id: string;
  status: string | null;
  graduation_year: number | null;
  entry_year: number | null;
}

export interface ProfessionalHistory {
  id: string;
  company_name: string;
  role_title: string;
  is_current: boolean | null;
  tech_stack: string[] | null; // Array of strings
}

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
  // +10% Rede Social (was Avatar)
  if (profile.social_media_url) {
    score += 10;
  } else {
    missingFields.push("Rede Social");
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
    (record) => record.status === "formado" && record.graduation_year
  );

  if (hasGraduation) {
    score += 30;
  } else {
    missingFields.push("Registro de Graduação (Formado)");
  }

  // 3. Situação Profissional (40%)
  // Split: 20% for having history, 20% for having tech stack
  if (professional && professional.length > 0) {
    score += 20;

    const hasTechStack = professional.some((p) => p.tech_stack && p.tech_stack.length > 0);
    if (hasTechStack) {
      score += 20;
    } else {
      missingFields.push("Stack Tecnológico");
    }
  } else {
    missingFields.push("Histórico Profissional");
    // If no history, they miss both points naturally, but we explicitly list History.
    // We could list Stack too, but History is the blocker.
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
