import { Briefcase, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface JobCardProps {
    title: string
    company: string | null
    type: string
    work_mode: string | null
    location: string | null
}

export function JobCard({ title, company, type, work_mode, location }: JobCardProps) {
    return (
        <div className="flex-shrink-0 w-[280px] p-6 bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:border-primary/20 transition-all group">
            <div className="flex items-start justify-between mb-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-slate-700 rounded-lg flex items-center justify-center text-primary">
                    <Briefcase size={20} />
                </div>
                <Badge variant="secondary" className="text-xs font-normal">
                    {type.replace('_', ' ')}
                </Badge>
            </div>

            <h4 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1 group-hover:text-primary transition-colors">
                {title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                {company || 'Confidencial'}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                <MapPin size={12} />
                <span className="truncate">
                    {work_mode === 'remoto' ? 'Remoto' : location || 'Localização não informada'}
                </span>
            </div>
        </div>
    )
}
