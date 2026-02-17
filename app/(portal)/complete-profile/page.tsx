
import { Metadata } from "next";
import { ProfileWizard } from "@/components/profile-completion/profile-wizard";
import { createClient } from "@/utils/supabase/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
    title: "Completar Perfil | Egressos SI UEMG",
};

export default async function CompleteProfilePage() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
        redirect("/auth/login");
    }

    // Fetch all related data to pre-fill the wizard
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

    const { data: academic } = await supabase
        .from('academic_records')
        .select('*')
        .eq('profile_id', user.id);

    const { data: professional } = await supabase
        .from('professional_history')
        .select('*')
        .eq('profile_id', user.id);

    const { data: education } = await supabase
        .from('education_history')
        .select('*')
        .eq('profile_id', user.id);

    const { data: survey } = await supabase
        .from('profile_surveys')
        .select('*')
        .eq('profile_id', user.id)
        .single();

    return (
        <div className="container py-8">
            <ProfileWizard
                user={user}
                initialProfile={profile}
                initialAcademic={academic || []}
                initialProfessional={professional || []}
                initialEducation={education || []}
                initialSurvey={survey}
            />
        </div>
    );
}
