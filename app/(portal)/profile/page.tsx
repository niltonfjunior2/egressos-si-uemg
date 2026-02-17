import { ProfileView } from "@/components/profile/profile-view"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"

export default async function ProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    // Fetch all profile data
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    const { data: academic } = await supabase
        .from('academic_records')
        .select('*')
        .eq('profile_id', user.id)

    const { data: professional } = await supabase
        .from('professional_history')
        .select('*')
        .eq('profile_id', user.id)
        .order('is_current', { ascending: false })
        .order('end_date', { ascending: false })

    const { data: education } = await supabase
        .from('education_history')
        .select('*')
        .eq('profile_id', user.id)

    const { data: survey } = await supabase
        .from('profile_surveys')
        .select('*')
        .eq('profile_id', user.id)
        .single()

    // Ensure email is available for display
    if (profile && !profile.email && user.email) {
        profile.email = user.email;
    }
    // If profile is null but we have user, create a temporary object for display
    const displayProfile = profile || {
        id: user.id,
        email: user.email,
        full_name: user?.user_metadata?.full_name,
        social_name: user?.user_metadata?.full_name // fallback
    };

    return (
        <div className="container mx-auto py-10 max-w-4xl">
            <div className="mb-6">
                <h1 className="text-3xl font-bold tracking-tight">Meu Perfil</h1>
                <p className="text-muted-foreground">
                    Visualize como seu perfil aparece para outros usuários e empresas.
                </p>
            </div>

            <ProfileView
                profile={displayProfile}
                academic={academic || []}
                professional={professional || []}
                education={education || []}
                survey={survey}
            />
        </div>
    )
}
