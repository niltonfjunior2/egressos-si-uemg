"use client"

import { UserCard } from "./user-card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useState, useTransition } from "react"
import { Search } from "lucide-react"
import { searchProfiles } from "@/app/directory/actions" // We'll call this client-side for search? Or server action?
// Better: Server Action executed via transition or useEffect.
// Actually, `searchProfiles` is a server action. We can call it directly.

interface DirectoryListProps {
    initialProfiles: any[]
}

export function DirectoryList({ initialProfiles }: DirectoryListProps) {
    const [profiles, setProfiles] = useState(initialProfiles)
    const [query, setQuery] = useState("")
    const [isPending, startTransition] = useTransition()

    function handleSearch(e: React.FormEvent) {
        e.preventDefault()
        startTransition(async () => {
            const result = await searchProfiles(query)
            if (result?.data) {
                setProfiles(result.data)
            }
        })
    }

    return (
        <div className="space-y-6">
            <form onSubmit={handleSearch} className="flex gap-2 max-w-md mx-auto md:mx-0">
                <div className="relative flex-1">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="search"
                        placeholder="Buscar por nome..."
                        className="pl-8"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                </div>
                <Button type="submit" disabled={isPending}>
                    {isPending ? "Buscando..." : "Buscar"}
                </Button>
            </form>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {profiles.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground py-10">
                        Nenhum perfil encontrado.
                    </div>
                ) : (
                    profiles.map((profile) => (
                        <UserCard key={profile.id} profile={profile} />
                    ))
                )}
            </div>
        </div>
    )
}
