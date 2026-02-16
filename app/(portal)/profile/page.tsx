import { ProfileForm } from "@/components/profile/profile-form"
import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

export default async function ProfilePage() {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
        redirect('/login')
    }

    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

    // Transform DB data to form data structure
    const initialData = {
        fullName: profile?.full_name || '',
        socialName: profile?.social_name || '',
        linkedinUrl: profile?.linkedin_url || '',
        githubUrl: profile?.github_url || '',
        isOpenToMentoring: profile?.is_open_to_mentoring || false,
    }

    return (
        <div className="container mx-auto py-10">
            <Card className="max-w-2xl mx-auto">
                <CardHeader>
                    <CardTitle>Meu Perfil</CardTitle>
                    <CardDescription>
                        Gerencie suas informações pessoais e visibilidade na rede.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <ProfileForm initialData={initialData} />
                </CardContent>
            </Card>
        </div>
    )
}
