import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { createClient } from "@/utils/supabase/server"
import { FeedList } from "@/components/feed/feed-list" // Reusing FeedList component, but readonly
import { Post } from "@/components/feed/types"
import { Footer } from "@/components/footer"

export default async function Home() {
  const supabase = await createClient()

  // Fetch latest 3 posts for public view
  const { data: posts } = await supabase
    .from('feed_posts')
    .select(`
      id,
      content,
      created_at,
      profile_id,
      profiles (
        full_name,
        avatar_url
      )
    `)
    .order('created_at', { ascending: false })
    .limit(3)

  return (
    <div className="flex min-h-screen flex-col">
      <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container flex h-14 items-center">
          <div className="mr-4 hidden md:flex">
            <Link className="mr-6 flex items-center space-x-2" href="/">
              <span className="hidden font-bold sm:inline-block">
                SGE - UEMG Carangola
              </span>
            </Link>
          </div>
          <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
            <nav className="flex items-center space-x-2">
              <Link href="/login">
                <Button variant="ghost">Entrar</Button>
              </Link>
              <Link href="/signup">
                <Button>Criar Conta</Button>
              </Link>
            </nav>
          </div>
        </div>
      </header>
      <main className="flex-1">
        <section className="space-y-6 pb-8 pt-6 md:pb-12 md:pt-10 lg:py-32">
          <div className="container flex max-w-[64rem] flex-col items-center gap-4 text-center">
            <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl">
              Acompanhamento de Egressos Sistemas de Informação
            </h1>
            <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
              Conecte-se com colegas, encontre oportunidades de carreira e mantenha seu vínculo com a UEMG.
            </p>
            <div className="space-x-4">
              <Link href="/signup">
                <Button size="lg">Começar Agora</Button>
              </Link>
              <Link href="/login">
                <Button variant="outline" size="lg">
                  Já tenho conta
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Public Feed Section */}
        <section className="container py-8 md:py-12 lg:py-24 bg-slate-50 dark:bg-slate-900/50">
          <div className="mx-auto flex max-w-[58rem] flex-col items-center justify-center gap-4 text-center">
            <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
              Últimas Atualizações
            </h2>
            <p className="max-w-[85%] leading-normal text-muted-foreground sm:text-lg sm:leading-7">
              Fique por dentro do que está acontecendo na nossa comunidade.
            </p>
          </div>
          <div className="mx-auto mt-8 max-w-2xl">
            <FeedList posts={posts as unknown as Post[]} readonly={true} />
            <div className="mt-8 text-center">
              <Link href="/signup">
                <Button variant="secondary">Ver mais</Button>
              </Link>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}
