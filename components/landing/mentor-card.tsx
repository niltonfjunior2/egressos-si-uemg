import { Badge } from "@/components/ui/badge"

interface MentorCardProps {
    full_name: string
    role?: string
    role_title?: string
    company_name?: string
    tech_stack?: string[]
    onClick?: () => void
}

export function MentorCard({ full_name, role, role_title, company_name, tech_stack, onClick }: MentorCardProps) {
    const displayRole = role 
        ? role.charAt(0).toUpperCase() + role.slice(1) + " de SI"
        : "Egresso de SI"

    return (
        <div
            onClick={onClick}
            className="flex-shrink-0 w-[280px] cursor-pointer bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex flex-col h-auto min-h-[180px]"
        >
            <div className="flex items-center gap-3 mb-4">
                <div>
                    <h4 className="font-bold text-slate-900 dark:text-white line-clamp-1 text-sm">
                        {full_name}
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                        {displayRole}
                    </p>
                </div>
            </div>

            <div className="mb-4 flex-grow space-y-3">
                {role_title && (
                    <div>
                        <p className="font-medium text-slate-800 dark:text-slate-200 text-sm line-clamp-1">{role_title}</p>
                        {company_name && <p className="text-xs text-slate-500 line-clamp-1">{company_name}</p>}
                    </div>
                )}
            </div>

            {tech_stack && tech_stack.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-4">
                    {tech_stack.slice(0, 3).map((tech) => (
                        <Badge key={tech} variant="secondary" className="text-[10px] px-2 py-0.5 font-normal">
                            {tech}
                        </Badge>
                    ))}
                    {tech_stack.length > 3 && (
                        <span className="text-[10px] text-slate-400 flex items-center">+{tech_stack.length - 3}</span>
                    )}
                </div>
            )}

            <div className="mt-auto pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-primary font-medium">
                Ver perfil
            </div>
        </div>
    )
}
