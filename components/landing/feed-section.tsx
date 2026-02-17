import { FeedList } from "@/components/feed/feed-list"
import { Post } from "@/components/feed/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MentorCard } from "./mentor-card"
import { JobCard } from "./job-card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ArrowRight } from "lucide-react"

interface FeedSectionProps {
    posts: Post[]
    mentors: any[]
    jobs: any[]
}

export function FeedSection({ posts, mentors, jobs }: FeedSectionProps) {
    return (
        <section className="py-24 bg-white dark:bg-slate-900/50" id="comunidade">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-16 space-y-4">
                    <h2 className="text-primary font-bold uppercase tracking-widest text-sm">Comunidade Ativa</h2>
                    <h3 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white">Conexões que Transformam</h3>
                    <div className="w-20 h-1.5 bg-secondary mx-auto rounded-full"></div>
                </div>

                <div className="space-y-16">
                    {/* Row 1: Mentors */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <span className="bg-primary/10 text-primary p-2 rounded-lg">🎓</span>
                                Mentores Disponíveis
                            </h4>
                            <Link href="/signup" className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
                                MOSTRAR MAIS MENTORES <ArrowRight size={16} />
                            </Link>
                        </div>

                        <ScrollArea className="w-full whitespace-nowrap pb-4">
                            <div className="flex w-max space-x-4 p-1">
                                {mentors.map((mentor) => (
                                    <MentorCard
                                        key={mentor.id}
                                        full_name={mentor.full_name}
                                        role_title={mentor.professional_history?.[0]?.role_title}
                                        company_name={mentor.professional_history?.[0]?.company_name}
                                        tech_stack={mentor.professional_history?.[0]?.tech_stack}
                                    />
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>

                    {/* Row 2: Jobs */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <span className="bg-secondary/10 text-secondary p-2 rounded-lg">💼</span>
                                Vagas Recentes
                            </h4>
                            <Link href="/signup" className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
                                MOSTRAR MAIS VAGAS <ArrowRight size={16} />
                            </Link>
                        </div>

                        <ScrollArea className="w-full whitespace-nowrap pb-4">
                            <div className="flex w-max space-x-4 p-1">
                                {jobs.map((job) => (
                                    <JobCard
                                        key={job.id}
                                        title={job.title}
                                        company={job.company}
                                        type={job.type}
                                        location={job.location}
                                        work_mode={job.work_mode}
                                    />
                                ))}
                            </div>
                            <ScrollBar orientation="horizontal" />
                        </ScrollArea>
                    </div>

                    {/* Row 3: Feed News */}
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h4 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                                <span className="bg-green-500/10 text-green-600 p-2 rounded-lg">📰</span>
                                Notícias da Comunidade
                            </h4>
                            <Link href="/signup" className="text-sm font-semibold text-primary hover:text-primary/80 flex items-center gap-1">
                                MOSTRAR MAIS NOTÍCIAS <ArrowRight size={16} />
                            </Link>
                        </div>

                        {/* Feed Layout - Using FeedList but constrained */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {posts.slice(0, 3).map((post) => (
                                <div key={post.id} className="h-full">
                                    {/* We need a simplified card for the landing page or reuse regular items. 
                                         Since FeedList is a list, let's just display them properly.
                                         Actually, the requirement says "Each message will be a card". 
                                         FeedList renders a vertical list. We might want to render cards horizontally here.
                                         But FeedList is complex. Let's make a mini-card wrapper or use the logic here.
                                     */}
                                    <div className="bg-white dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full flex flex-col hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center font-bold text-slate-600">
                                                {post.profiles?.full_name?.charAt(0) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-sm">{post.profiles?.full_name}</p>
                                                <p className="text-xs text-slate-500">
                                                    {new Date(post.created_at).toLocaleDateString('pt-BR')}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm line-clamp-4 flex-grow">
                                            {post.content}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}
