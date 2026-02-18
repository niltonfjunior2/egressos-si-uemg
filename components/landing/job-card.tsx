import { Briefcase, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"

interface JobCardProps {
    title: string
    company: string | null
    type: string
    work_mode: string | null
    location: string | null
    expires_at?: string | null
    onClick?: () => void
}

export function JobCard({ title, company, type, work_mode, location, expires_at, onClick }: JobCardProps) {
    return (
        <div
            onClick={onClick}
            className="flex-shrink-0 w-[300px] cursor-pointer bg-slate-100 dark:bg-slate-800 p-6 rounded-xl border border-slate-200 dark:border-slate-700 hover:shadow-lg hover:scale-[1.02] transition-all duration-200 flex flex-col h-auto min-h-[220px]"
        >
            <div className="flex items-start justify-between mb-4">
                <Badge variant="secondary" className="text-xs font-normal">
                    {type.replace('_', ' ')}
                </Badge>
                {expires_at && new Date(expires_at) < new Date() && (
                    <Badge variant="destructive" className="ml-2 text-[10px] px-1 py-0 h-5">EXPIRADA</Badge>
                )}
            </div>

            <h4 className="font-bold text-slate-900 dark:text-white mb-1 line-clamp-1">
                {title}
            </h4>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-4 line-clamp-1">
                {company || 'Confidencial'}
            </p>

            <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-auto">
                <MapPin size={12} />
                <span className="truncate">
                    {work_mode === 'remoto' ? 'Remoto' : location || 'Localização não informada'}
                </span>
            </div>

            <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700 text-xs text-primary font-medium">
                Ver detalhes
            </div>
        </div>
    )
}
