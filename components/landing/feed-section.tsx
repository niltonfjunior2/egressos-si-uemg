import { FeedList } from "@/components/feed/feed-list"
import { Post } from "@/components/feed/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"

interface FeedSectionProps {
    posts: Post[]
}

export function FeedSection({ posts }: FeedSectionProps) {
    return (
        <section className="py-24 bg-white dark:bg-slate-900/50" id="comunidade">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-primary font-bold uppercase tracking-widest text-sm">Comunidade Ativa</h2>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Últimas Atualizações</h3>
                    <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full"></div>
                    <p className="max-w-2xl mx-auto text-slate-600 dark:text-slate-400 leading-relaxed">
                        Fique por dentro do que está acontecendo na nossa comunidade.
                    </p>
                </div>

                <div className="mx-auto max-w-2xl">
                    <FeedList posts={posts} readonly={true} />

                    <div className="mt-12 text-center">
                        <Button asChild variant="outline" className="rounded-full px-8 py-6 text-lg border-primary text-primary hover:bg-primary hover:text-white transition-all">
                            <Link href="/signup">
                                Ver mais publicações
                            </Link>
                        </Button>
                    </div>
                </div>
            </div>
        </section>
    )
}
