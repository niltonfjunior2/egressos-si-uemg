import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import AdminProfilePage from "./admin-profile-client"

export default async function Page() {
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

    return <AdminProfilePage user={user} profile={profile} />
}
