import { Badge } from "@/components/ui/badge"

interface MentorCardProps {
    full_name: string
    role_title?: string
    company_name?: string
    tech_stack?: string[]
}

export function MentorCard({ full_name, role_title, company_name, tech_stack }: MentorCardProps) {
    return (
        <div className="flex-shrink-0 w-[240px] p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-primary/20 transition-all text-center group flex flex-col h-full">
            <h4 className="font-bold text-slate-900 dark:text-white mb-2 line-clamp-1">
                {full_name}
            </h4>

            <div className="text-sm text-slate-500 dark:text-slate-400 h-10 line-clamp-2 mb-4">
                {role_title ? (
                    <>
                        {role_title}
                        {company_name && <span className="block text-xs opacity-75">at {company_name}</span>}
                    </>
                ) : (
                    "Egresso de SI"
                )}
            </div>

            {tech_stack && tech_stack.length > 0 ? (
                <div className="flex flex-wrap justify-center gap-1 mt-auto">
                    {tech_stack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-[10px] px-2 py-0.5">
                            {tech}
                        </Badge>
                    ))}
                    {tech_stack.length > 3 && (
                        <span className="text-[10px] text-slate-400 flex items-center">+{tech_stack.length - 3}</span>
                    )}
                </div>
            ) : (
                <div className="mt-auto h-6"></div>
            )}
        </div>
    )
}
