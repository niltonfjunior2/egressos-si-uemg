
"use client";

import Link from "next/link";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { AlertCircle, CheckCircle2, AlertTriangle } from "lucide-react";
import { ProfileCompletionStats } from "@/hooks/use-profile-completion";

interface ProfileScoreCardProps {
    stats: ProfileCompletionStats;
}

export function ProfileScoreCard({ stats }: ProfileScoreCardProps) {
    const { score, isComplete, missingFields } = stats;

    if (isComplete) return null; // Don't show if complete? Or show a mini-version? 
    // Instructions say: "Se Score < 100%: Exibir um 'Card de Pendências'."
    // So if complete, we hide it here.

    // Determine color based on score range
    let colorClass = "bg-red-500";
    let icon = <AlertCircle className="h-5 w-5 text-red-500" />;
    let message = "Faltam dados acadêmicos";

    if (score >= 50) {
        colorClass = "bg-yellow-500";
        icon = <AlertTriangle className="h-5 w-5 text-yellow-500" />;
        message = "Falta pouco! Complete sua foto ou LinkedIn.";
    }

    // Override if missing fields contains critical items

    return (
        <Card className="border-l-4 border-l-primary shadow-sm bg-background/60 backdrop-blur-sm">
            <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-lg font-bold flex items-center gap-2">
                        {icon}
                        Complete seu Perfil
                    </CardTitle>
                    <span className="text-sm font-bold text-muted-foreground">
                        {score}%
                    </span>
                </div>
                <CardDescription>
                    Olá! Para acessar vagas exclusivas e conectar-se com colegas, precisamos completar seu perfil.
                </CardDescription>
            </CardHeader>
            <CardContent className="pb-2">
                <Progress value={score} className="h-2 mb-2" indicatorClassName={colorClass} />
                {missingFields.length > 0 && (
                    <div className="text-xs text-muted-foreground mt-2">
                        <span className="font-semibold">Pendente:</span> {missingFields.join(", ")}
                    </div>
                )}
            </CardContent>
            <CardFooter>
                <Button asChild size="sm" className="w-full sm:w-auto">
                    <Link href="/complete-profile">
                        Completar meu Perfil agora
                    </Link>
                </Button>
            </CardFooter>
        </Card>
    );
}
