"use client"

import { FeedList } from "@/components/feed/feed-list"
import { Post } from "@/components/feed/types"
import { Job } from "@/components/jobs/types"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { MentorCard } from "./mentor-card"
import { JobCard } from "./job-card"
import { ScrollArea, ScrollBar } from "@/components/ui/scroll-area"
import { ArrowRight, MapPin, Building2, Briefcase, Globe } from "lucide-react"
import { useState } from "react"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

interface FeedSectionProps {
    posts: Post[]
    mentors: any[]
    jobs: Job[]
}

export function FeedSection({ posts, mentors, jobs }: FeedSectionProps) {
    const [selectedPost, setSelectedPost] = useState<Post | null>(null)
    const [selectedJob, setSelectedJob] = useState<Job | null>(null)
    const [selectedMentor, setSelectedMentor] = useState<any | null>(null)

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
                                        onClick={() => setSelectedMentor(mentor)}
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
                                        expires_at={job.expires_at}
                                        onClick={() => setSelectedJob(job)}
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

                        {/* Feed Layout */}
                        <div className="grid md:grid-cols-3 gap-6">
                            {posts.slice(0, 3).map((post) => (
                                <div
                                    key={post.id}
                                    className="h-full cursor-pointer hover:scale-[1.02] transition-transform duration-200"
                                    onClick={() => setSelectedPost(post)}
                                >
                                    <div className="bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 h-full flex flex-col hover:shadow-md transition-shadow">
                                        <div className="flex items-center gap-3 mb-4">
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
                                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-primary font-medium">
                                            Ler mais
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>

            {/* Post Dialog */}
            <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
                            <span>{selectedPost?.profiles?.full_name}</span>
                            <span className="text-xs font-normal text-slate-500">
                                {selectedPost && new Date(selectedPost.created_at).toLocaleDateString('pt-BR')}
                            </span>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="mt-4 space-y-4">
                        <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                            {selectedPost?.content}
                        </div>
                    </div>
                </DialogContent>
            </Dialog>

            {/* Job Dialog */}
            <Dialog open={!!selectedJob} onOpenChange={(open) => !open && setSelectedJob(null)}>
                <DialogContent className="sm:max-w-2xl">
                    <DialogHeader>
                        <DialogTitle className="text-xl font-bold">{selectedJob?.title}</DialogTitle>
                        <DialogDescription className="flex items-center gap-2">
                            <Building2 className="h-4 w-4" /> {selectedJob?.company}
                        </DialogDescription>
                    </DialogHeader>

                    <div className="flex flex-wrap gap-2 my-2">
                        {selectedJob && (
                            <>
                                <Badge variant="secondary">{selectedJob.type.replace('_', ' ')}</Badge>
                                <Badge variant="outline">{selectedJob.work_mode.toUpperCase()}</Badge>
                                {selectedJob.location && (
                                    <Badge variant="outline" className="flex items-center gap-1">
                                        <MapPin className="h-3 w-3" /> {selectedJob.location}
                                    </Badge>
                                )}
                            </>
                        )}
                    </div>

                    <div className="mt-4 max-h-[60vh] overflow-y-auto">
                        <h4 className="font-semibold mb-2">Descrição da Vaga</h4>
                        <div className="text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed text-sm">
                            {selectedJob?.description}
                        </div>
                    </div>

                    <DialogFooter className="mt-6 flex sm:justify-between items-center gap-4">
                        <div className="text-xs text-slate-500">
                            Publicado em {selectedJob && new Date(selectedJob.created_at).toLocaleDateString('pt-BR')}
                        </div>
                        {selectedJob?.link_url && (
                            <Link href={selectedJob.link_url} target="_blank" rel="noopener noreferrer">
                                <Button className="w-full sm:w-auto">
                                    <Globe className="mr-2 h-4 w-4" />
                                    Candidatar-se
                                </Button>
                            </Link>
                        )}
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Mentor Dialog */}
            <Dialog open={!!selectedMentor} onOpenChange={(open) => !open && setSelectedMentor(null)}>
                <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center text-primary font-bold text-xl">
                                {selectedMentor?.full_name?.charAt(0)}
                            </div>
                            <div>
                                <div className="text-xl font-bold">{selectedMentor?.full_name}</div>
                                <div className="text-sm text-slate-500 font-normal">Egresso de Sistemas de Informação</div>
                            </div>
                        </DialogTitle>
                    </DialogHeader>

                    <div className="mt-4 space-y-6">
                        {selectedMentor?.professional_history?.[0] && (
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <h4 className="font-semibold text-sm mb-2 text-primary uppercase tracking-wider">Atuação Profissional</h4>
                                <div>
                                    <p className="font-bold text-lg">{selectedMentor.professional_history[0].role_title}</p>
                                    <p className="text-slate-600 dark:text-slate-300 flex items-center gap-2 mt-1">
                                        <Building2 className="h-4 w-4" />
                                        {selectedMentor.professional_history[0].company_name}
                                    </p>
                                </div>
                            </div>
                        )}

                        {selectedMentor?.education_history?.length > 0 && (
                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-lg">
                                <h4 className="font-semibold text-sm mb-2 text-primary uppercase tracking-wider">Formação Acadêmica</h4>
                                {selectedMentor.education_history.map((edu: any, index: number) => (
                                    <div key={index} className={index > 0 ? "mt-3 pt-3 border-t border-slate-200 dark:border-slate-700" : ""}>
                                        <p className="font-bold text-sm">{edu.degree_type}</p>
                                        <p className="text-slate-600 dark:text-slate-300 text-sm">{edu.course_name}</p>
                                    </div>
                                ))}
                            </div>
                        )}

                        {selectedMentor?.professional_history?.[0]?.tech_stack?.length > 0 && (
                            <div>
                                <h4 className="font-semibold text-sm mb-3 text-primary uppercase tracking-wider">Stack Tecnológico</h4>
                                <div className="flex flex-wrap gap-2">
                                    {selectedMentor.professional_history[0].tech_stack.map((tech: string) => (
                                        <Badge key={tech} variant="secondary" className="px-3 py-1">
                                            {tech}
                                        </Badge>
                                    ))}
                                </div>
                            </div>
                        )}

                        <DialogFooter className="sm:justify-center pt-2">
                            <Link href="/login" className="w-full">
                                <Button className="w-full" variant="default">
                                    Conectar-se com {selectedMentor?.full_name?.split(' ')[0]}
                                </Button>
                            </Link>
                        </DialogFooter>
                    </div>
                </DialogContent>
            </Dialog>
        </section>
    )
}
