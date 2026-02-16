"use client"

import { JobCard } from "./job-card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { JobForm } from "./job-form"
import { useState } from "react"
import { Job } from "./types"

interface JobListProps {
    jobs: Job[]
    currentUserId?: string
}

export function JobList({ jobs, currentUserId }: JobListProps) {
    const [open, setOpen] = useState(false)

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Vagas Recentes</h2>
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            Anunciar Vaga
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
                        <DialogHeader>
                            <DialogTitle>Anunciar Nova Vaga</DialogTitle>
                            <DialogDescription>
                                Compartilhe uma oportunidade com a rede de egressos.
                            </DialogDescription>
                        </DialogHeader>
                        <JobForm onSuccess={() => setOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {jobs.length === 0 ? (
                    <div className="col-span-full text-center text-muted-foreground py-10">
                        Nenhuma vaga disponível no momento.
                    </div>
                ) : (
                    jobs.map((job) => (
                        <JobCard key={job.id} job={job} currentUserId={currentUserId} />
                    ))
                )}
            </div>
        </div>
    )
}
