
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import { CheckCircle2, ChevronRight, ChevronLeft, ShieldCheck, Plus, Trash2 } from "lucide-react";

import { updateProfile } from "@/app/(portal)/profile/actions";
import { addAcademicRecord } from "@/app/(portal)/profile/academic/actions";
import { addProfessionalHistory } from "@/app/(portal)/profile/professional/actions";
import { addEducationHistory, deleteEducationHistory } from "@/app/(portal)/profile/education/actions";
import { submitSurvey } from "@/app/(portal)/profile/survey/actions";
import { Checkbox } from "@/components/ui/checkbox";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

// Define strict types for the steps
type Step = 1 | 2 | 3 | 4 | 5;

// Props
interface ProfileWizardProps {
    user: any; // Add user prop type
    initialProfile: any;
    initialAcademic: any[];
    initialProfessional: any[];
    initialEducation: any[];
    initialSurvey: any;
}

export function ProfileWizard({
    user,
    initialProfile,
    initialAcademic,
    initialProfessional,
    initialEducation = [],
    initialSurvey
}: ProfileWizardProps) {
    const router = useRouter();
    const [step, setStep] = useState<Step>(1);
    const [loading, setLoading] = useState(false);

    // --- State Management ---

    // Step 1: Personal
    const [personalData, setPersonalData] = useState({
        // Pre-fill from Profile OR User Metadata
        fullName: initialProfile?.full_name || user?.user_metadata?.full_name || user?.user_metadata?.name || "",
        linkedinUrl: initialProfile?.linkedin_url || "",
        graduationYear: initialAcademic?.find((a: any) => a.status === 'formado')?.graduation_year?.toString() || "",
    });

    // Step 2: Professional (Focus on ADDING current/latest role)
    const [professionalData, setProfessionalData] = useState({
        companyName: "",
        roleTitle: "",
        startDate: "",
        isCurrent: true,
        salaryRange: "",
    });

    // Step 3: Education (Manage List + Add New)
    const [educationList, setEducationList] = useState<any[]>(initialEducation || []);
    const [newEducation, setNewEducation] = useState({
        institutionName: "",
        courseName: "",
        degreeType: "Especialização",
        status: "concluido",
    });
    const [isAddingEducation, setIsAddingEducation] = useState(false);

    // Step 4: Survey
    const [surveyData, setSurveyData] = useState({
        missingTechnologies: initialSurvey?.missing_technologies || "",
        mostUsefulAreas: initialSurvey?.most_useful_areas || [] as string[],
        softSkillsDesired: initialSurvey?.soft_skills_desired || [] as string[],
        methodologyPriority: initialSurvey?.methodology_priority || [] as string[],
        employabilityImpact: initialSurvey?.employability_impact?.toString() || "3",
        // Helper states for "Other" inputs
        otherUsefulArea: "",
        otherSoftSkill: "",
        otherMethodology: "",
    });

    // Step 5: Suggestions
    const [suggestions, setSuggestions] = useState(initialSurvey?.suggestions || "");


    // --- Actions ---

    // Generic Toggle Helper for Checkboxes w/ "Other"
    const toggleSelection = (
        list: string[],
        setList: (l: string[]) => void,
        item: string
    ) => {
        if (list.includes(item)) {
            setList(list.filter((i) => i !== item));
        } else {
            setList([...list, item]);
        }
    };

    const handleNext = async () => {
        setLoading(true);
        let success = false;

        try {
            if (step === 1) {
                // Update Profile & Academic
                const profileRes = await updateProfile({
                    fullName: personalData.fullName,
                    linkedinUrl: personalData.linkedinUrl,
                    isOpenToMentoring: initialProfile?.is_open_to_mentoring || false,
                } as any);

                if (profileRes.error) throw new Error(profileRes.error);

                if (personalData.graduationYear) {
                    await addAcademicRecord({
                        entryYear: parseInt(personalData.graduationYear) - 4, // Estimate
                        graduationYear: parseInt(personalData.graduationYear),
                        status: "formado",
                        studentIdCode: "",
                    } as any);
                }
                success = true;

            } else if (step === 2) {
                // Add Professional Record (only if filled)
                if (professionalData.companyName && professionalData.roleTitle) {
                    await addProfessionalHistory({
                        companyName: professionalData.companyName,
                        roleTitle: professionalData.roleTitle,
                        startDate: new Date(professionalData.startDate),
                        isCurrent: true,
                        salaryRange: professionalData.salaryRange,
                    } as any);
                }
                success = true;

            } else if (step === 3) {
                // Education is handled via explicit "Add" button usually, 
                // but if they filled the form and clicked connect, we save it?
                // Let's enforce using the "Adicionar" button for explicit adding, 
                // and Next just moves forward.
                success = true;

            } else if (step === 4) {
                // Validation for "Outro"
                if (surveyData.mostUsefulAreas.includes("Outro") && !surveyData.otherUsefulArea.trim()) {
                    toast.error("Por favor, especifique qual outra área foi útil.");
                    setLoading(false);
                    return;
                }
                if (surveyData.softSkillsDesired.includes("Outro") && !surveyData.otherSoftSkill.trim()) {
                    toast.error("Por favor, especifique qual outra competência.");
                    setLoading(false);
                    return;
                }
                if (surveyData.methodologyPriority.includes("Outro") && !surveyData.otherMethodology.trim()) {
                    toast.error("Por favor, especifique o que sugere na metodologia.");
                    setLoading(false);
                    return;
                }

                // Save Survey Step 4
                await submitSurvey({
                    missingTechnologies: surveyData.missingTechnologies,
                    mostUsefulAreas: [
                        ...surveyData.mostUsefulAreas.filter(i => i !== 'Outro'),
                        surveyData.mostUsefulAreas.includes('Outro') ? surveyData.otherUsefulArea : ""
                    ].filter(Boolean),
                    softSkillsDesired: [
                        ...surveyData.softSkillsDesired.filter(i => i !== 'Outro'),
                        surveyData.softSkillsDesired.includes('Outro') ? surveyData.otherSoftSkill : ""
                    ].filter(Boolean),
                    methodologyPriority: [
                        ...surveyData.methodologyPriority.filter(i => i !== 'Outro'),
                        surveyData.methodologyPriority.includes('Outro') ? surveyData.otherMethodology : ""
                    ].filter(Boolean),
                    employabilityImpact: parseInt(surveyData.employabilityImpact),
                    suggestions: suggestions
                });
                success = true;
            } else if (step === 5) {
                // Save Survey Final (Suggestions)
                await submitSurvey({
                    missingTechnologies: surveyData.missingTechnologies,
                    mostUsefulAreas: [
                        ...surveyData.mostUsefulAreas.filter(i => i !== 'Outro'),
                        surveyData.mostUsefulAreas.includes('Outro') ? surveyData.otherUsefulArea : ""
                    ].filter(Boolean),
                    softSkillsDesired: [
                        ...surveyData.softSkillsDesired.filter(i => i !== 'Outro'),
                        surveyData.softSkillsDesired.includes('Outro') ? surveyData.otherSoftSkill : ""
                    ].filter(Boolean),
                    methodologyPriority: [
                        ...surveyData.methodologyPriority.filter(i => i !== 'Outro'),
                        surveyData.methodologyPriority.includes('Outro') ? surveyData.otherMethodology : ""
                    ].filter(Boolean),
                    employabilityImpact: parseInt(surveyData.employabilityImpact),
                    suggestions: suggestions
                });
                success = true;
            }

            if (success) {
                if (step < 5) {
                    setStep((s) => (s + 1) as Step);
                } else {
                    toast.success("Perfil atualizado com sucesso!");
                    router.push("/feed");
                }
            }
        } catch (error: any) {
            toast.error(error.message || "Erro ao salvar dados.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddEducation = async () => {
        if (!newEducation.institutionName || !newEducation.courseName) {
            toast.error("Preencha a instituição e o curso/título.");
            return;
        }
        setLoading(true);
        try {
            // Optimistic update or fetch?
            const res = await addEducationHistory({
                institutionName: newEducation.institutionName,
                courseName: newEducation.courseName,
                degreeType: newEducation.degreeType,
                status: newEducation.status as any
            });

            if (res.success && (res as any).data) {
                // Update local list immediately
                const newRecord = (res as any).data;
                setEducationList(prev => [...prev, newRecord]);
                toast.success("Formação adicionada!");
                setNewEducation({ institutionName: "", courseName: "", degreeType: "Especialização", status: "concluido" });
                setIsAddingEducation(false);
            } else {
                console.error("Erro ao adicionar:", res);
                toast.error("Erro ao adicionar formação. Tente novamente.");
            }
            router.refresh(); // Refresh props as backup
        } catch (e) {
            toast.error("Erro ao adicionar formação.");
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteEducation = async (id: string) => {
        if (!id) return;
        setLoading(true);
        try {
            await deleteEducationHistory(id);
            setEducationList(educationList.filter(e => e.id !== id));
            toast.success("Registro removido.");
            router.refresh();
        } catch (e) {
            toast.error("Erro ao remover.");
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="max-w-4xl mx-auto py-8">
            <Card className="border-t-4 border-t-primary shadow-lg">
                <CardHeader>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <CardTitle className="text-2xl">Atualização de Perfil</CardTitle>
                            <CardDescription>Mantenha seus dados atualizados para fortalecer nossa rede.</CardDescription>
                        </div>
                        <span className="text-sm font-bold bg-muted px-3 py-1 rounded-full">Passo {step} de 5</span>
                    </div>
                    <Progress value={(step / 5) * 100} className="h-2" />
                </CardHeader>
                <CardContent className="py-6 space-y-6">

                    {/* LGPD Notice - Step 1 */}
                    {step === 1 && (
                        <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900">
                            <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                            <AlertTitle className="text-blue-800 dark:text-blue-300">Seus dados estão seguros</AlertTitle>
                            <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm text-justify">
                                Todas as informações coletadas são confidenciais e utilizadas exclusivamente para fins estatísticos e de acompanhamento do curso de Sistemas de Informação da UEMG, em rigorosa conformidade com a LGPD (Lei Geral de Proteção de Dados).
                            </AlertDescription>
                        </Alert>
                    )}

                    {step === 1 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-lg font-semibold">Dados Pessoais</h3>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Nome Completo</Label>
                                    <Input
                                        value={personalData.fullName}
                                        onChange={(e) => setPersonalData({ ...personalData, fullName: e.target.value })}
                                        placeholder="Seu nome completo"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Ano de Graduação</Label>
                                    <Input
                                        type="number"
                                        value={personalData.graduationYear}
                                        onChange={(e) => setPersonalData({ ...personalData, graduationYear: e.target.value })}
                                        placeholder="Ex: 2025"
                                    />
                                    <p className="text-xs text-muted-foreground">Se ainda não se formou, deixe em branco.</p>
                                </div>
                                <div className="space-y-2 md:col-span-2">
                                    <Label>LinkedIn (URL)</Label>
                                    <Input
                                        value={personalData.linkedinUrl}
                                        onChange={(e) => setPersonalData({ ...personalData, linkedinUrl: e.target.value })}
                                        placeholder="https://linkedin.com/in/seu-perfil"
                                    />
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 2 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <h3 className="text-lg font-semibold">Experiência Profissional Atual</h3>
                            <p className="text-sm text-muted-foreground">Conte-nos onde você está trabalhando atualmente.</p>

                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Empresa</Label>
                                    <Input
                                        value={professionalData.companyName}
                                        onChange={(e) => setProfessionalData({ ...professionalData, companyName: e.target.value })}
                                        placeholder="Nome da empresa"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Cargo</Label>
                                    <Input
                                        value={professionalData.roleTitle}
                                        onChange={(e) => setProfessionalData({ ...professionalData, roleTitle: e.target.value })}
                                        placeholder="Ex: Desenvolvedor, Analista..."
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Data de Início</Label>
                                    <Input
                                        type="date"
                                        value={professionalData.startDate}
                                        onChange={(e) => setProfessionalData({ ...professionalData, startDate: e.target.value })}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label>Faixa Salarial (Confidencial)</Label>
                                    <Select
                                        value={professionalData.salaryRange}
                                        onValueChange={(val) => setProfessionalData({ ...professionalData, salaryRange: val })}
                                    >
                                        <SelectTrigger>
                                            <SelectValue placeholder="Selecione..." />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="<2k">Até R$ 2.000</SelectItem>
                                            <SelectItem value="2k-5k">R$ 2.000 - R$ 5.000</SelectItem>
                                            <SelectItem value="5k-8k">R$ 5.000 - R$ 8.000</SelectItem>
                                            <SelectItem value="8k-12k">R$ 8.000 - R$ 12.000</SelectItem>
                                            <SelectItem value="12k-15k">R$ 12.000 - R$ 15.000</SelectItem>
                                            <SelectItem value=">15k">Acima de R$ 15.000</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                        </div>
                    )}

                    {step === 3 && (
                        <div className="space-y-4 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="flex justify-between items-center">
                                <h3 className="text-lg font-semibold">Formação Complementar</h3>
                                <Button size="sm" variant="outline" onClick={() => setIsAddingEducation(!isAddingEducation)}>
                                    <Plus className="w-4 h-4 mr-2" /> Adicionar Nova
                                </Button>
                            </div>

                            {/* List of existing education */}
                            {educationList.length > 0 ? (
                                <div className="space-y-2">
                                    {educationList.map((edu: any) => (
                                        <div key={edu.id} className="flex justify-between items-center p-3 bg-muted/50 rounded-md">
                                            <div>
                                                <p className="font-medium text-sm">{edu.course_name}</p>
                                                <p className="text-xs text-muted-foreground">{edu.institution_name} • {edu.degree_type}</p>
                                            </div>
                                            <Button size="icon" variant="ghost" className="h-8 w-8 text-destructive" onClick={() => handleDeleteEducation(edu.id)}>
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground italic">Nenhuma formação complementar registrada.</p>
                            )}

                            {/* Add Form */}
                            {isAddingEducation && (
                                <div className="border rounded-lg p-4 bg-slate-50 dark:bg-slate-900 mt-4">
                                    <h4 className="text-sm font-medium mb-3">Nova Formação</h4>
                                    <div className="grid gap-3">
                                        <Input
                                            placeholder="Instituição (Ex: UFMG, UEMG, Alura...)"
                                            value={newEducation.institutionName}
                                            onChange={(e) => setNewEducation({ ...newEducation, institutionName: e.target.value })}
                                        />
                                        <Input
                                            placeholder="Curso / Título (Ex: MBA em Gestão, AWS Cloud, Certificação SCRUM...)"
                                            value={newEducation.courseName}
                                            onChange={(e) => setNewEducation({ ...newEducation, courseName: e.target.value })}
                                        />
                                        <Select
                                            value={newEducation.degreeType}
                                            onValueChange={(val) => setNewEducation({ ...newEducation, degreeType: val })}
                                        >
                                            <SelectTrigger><SelectValue /></SelectTrigger>
                                            <SelectContent>
                                                <SelectItem value="Especialização">Especialização / MBA</SelectItem>
                                                <SelectItem value="Mestrado">Mestrado</SelectItem>
                                                <SelectItem value="Doutorado">Doutorado</SelectItem>
                                                <SelectItem value="Certificação">Certificação</SelectItem>
                                                <SelectItem value="Outro">Outro</SelectItem>
                                            </SelectContent>
                                        </Select>
                                        <div className="flex justify-end gap-2 mt-2">
                                            <Button size="sm" variant="ghost" onClick={() => setIsAddingEducation(false)}>Cancelar</Button>
                                            <Button size="sm" onClick={handleAddEducation} disabled={loading}>Salvar</Button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}

                    {step === 4 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="space-y-1">
                                <h3 className="text-lg font-semibold">Pesquisa de Impacto do Curso</h3>
                                <p className="text-sm text-muted-foreground">Ajude-nos a melhorar a grade curricular.</p>
                            </div>

                            {/* Q1: Missing Tech */}
                            <div className="space-y-2">
                                <Label>Quais tecnologias/práticas o mercado exigiu que não vimos no curso?</Label>
                                <Textarea
                                    value={surveyData.missingTechnologies}
                                    onChange={(e) => setSurveyData({ ...surveyData, missingTechnologies: e.target.value })}
                                    placeholder="Ex: Docker, Cloud, React..."
                                />
                            </div>

                            <Separator />

                            {/* Q2: Useful Areas */}
                            <div className="space-y-3">
                                <Label>Quais eixos do curso foram mais úteis para você?</Label>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {[
                                        "Desenvolvimento de Software",
                                        "Gestão e Negócios",
                                        "Infraestrutura e Redes",
                                        "Matemática e Teoria",
                                        "Banco de Dados",
                                        "Outro"
                                    ].map((item) => (
                                        <div key={item} className="flex flex-col">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`area-${item}`}
                                                    checked={surveyData.mostUsefulAreas.includes(item)}
                                                    onCheckedChange={() => toggleSelection(surveyData.mostUsefulAreas, (l) => setSurveyData({ ...surveyData, mostUsefulAreas: l }), item)}
                                                    className="border-slate-400 dark:border-slate-500"
                                                />
                                                <Label htmlFor={`area-${item}`} className="font-normal">{item}</Label>
                                            </div>
                                            {item === "Outro" && surveyData.mostUsefulAreas.includes("Outro") && (
                                                <Input
                                                    placeholder="Qual outra área?"
                                                    value={surveyData.otherUsefulArea}
                                                    onChange={(e) => setSurveyData({ ...surveyData, otherUsefulArea: e.target.value })}
                                                    className="mt-2 ml-6 w-[90%]"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Q3: Soft Skills */}
                            <div className="space-y-3">
                                <Label>Qual competência comportamental deveria ser mais estimulada?</Label>
                                <div className="grid gap-2 sm:grid-cols-2">
                                    {[
                                        "Liderança e Gestão",
                                        "Comunicação e Oratória",
                                        "Inglês Técnico",
                                        "Metodologias Ágeis",
                                        "Inteligência Emocional",
                                        "Outro"
                                    ].map((item) => (
                                        <div key={item} className="flex flex-col">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`soft-${item}`}
                                                    checked={surveyData.softSkillsDesired.includes(item)}
                                                    onCheckedChange={() => toggleSelection(surveyData.softSkillsDesired, (l) => setSurveyData({ ...surveyData, softSkillsDesired: l }), item)}
                                                    className="border-slate-400 dark:border-slate-500"
                                                />
                                                <Label htmlFor={`soft-${item}`} className="font-normal">{item}</Label>
                                            </div>
                                            {item === "Outro" && surveyData.softSkillsDesired.includes("Outro") && (
                                                <Input
                                                    placeholder="Qual outra competência?"
                                                    value={surveyData.otherSoftSkill}
                                                    onChange={(e) => setSurveyData({ ...surveyData, otherSoftSkill: e.target.value })}
                                                    className="mt-2 ml-6 w-[90%]"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Q4: Methodology */}
                            <div className="space-y-3">
                                <Label>O que você priorizaria na metodologia de ensino?</Label>
                                <div className="space-y-2">
                                    {[
                                        "Mais aulas práticas em laboratório",
                                        "Mais projetos reais com empresas",
                                        "Mais base teórica e científica",
                                        "Outro"
                                    ].map((item) => (
                                        <div key={item} className="flex flex-col">
                                            <div className="flex items-center space-x-2">
                                                <Checkbox
                                                    id={`meth-${item}`}
                                                    checked={surveyData.methodologyPriority.includes(item)}
                                                    onCheckedChange={() => toggleSelection(surveyData.methodologyPriority, (l) => setSurveyData({ ...surveyData, methodologyPriority: l }), item)}
                                                    className="border-slate-400 dark:border-slate-500"
                                                />
                                                <Label htmlFor={`meth-${item}`} className="font-normal">{item}</Label>
                                            </div>
                                            {item === "Outro" && surveyData.methodologyPriority.includes("Outro") && (
                                                <Input
                                                    placeholder="O que você sugere?"
                                                    value={surveyData.otherMethodology}
                                                    onChange={(e) => setSurveyData({ ...surveyData, otherMethodology: e.target.value })}
                                                    className="mt-2 ml-6 w-[90%]"
                                                />
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <Separator />

                            {/* Q5: Employability */}
                            <div className="space-y-4">
                                <Label>O quanto o "Nome da UEMG" influenciou sua contratação atual?</Label>
                                <div className="flex flex-col gap-2">
                                    <div className="flex justify-between text-xs text-muted-foreground w-full max-w-sm">
                                        <span>Pouca influência</span>
                                        <span>Decisiva</span>
                                    </div>
                                    <RadioGroup
                                        value={surveyData.employabilityImpact}
                                        onValueChange={(val) => setSurveyData({ ...surveyData, employabilityImpact: val })}
                                        className="flex max-w-sm justify-between"
                                    >
                                        {[1, 2, 3, 4, 5].map((val) => (
                                            <div key={val} className="flex flex-col items-center gap-1">
                                                <RadioGroupItem value={val.toString()} id={`imp-${val}`} className="border-slate-400 dark:border-slate-500" />
                                                <Label htmlFor={`imp-${val}`} className="text-xs">{val}</Label>
                                            </div>
                                        ))}
                                    </RadioGroup>
                                </div>
                            </div>

                        </div>
                    )}

                    {step === 5 && (
                        <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-300">
                            <div className="text-center space-y-2">
                                <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
                                <h3 className="text-xl font-bold">Último passo!</h3>
                                <p className="text-muted-foreground">Algo mais que queira nos dizer?</p>
                            </div>

                            <div className="space-y-2">
                                <Label>Sugestões, Críticas ou Elogios (Opcional)</Label>
                                <Textarea
                                    rows={5}
                                    placeholder="Espaço livre para você..."
                                    value={suggestions}
                                    onChange={(e) => setSuggestions(e.target.value)}
                                />
                            </div>

                            <Alert className="bg-blue-50 dark:bg-blue-950/30 border-blue-200 dark:border-blue-900 mt-6">
                                <ShieldCheck className="h-4 w-4 text-blue-600 dark:text-blue-400" />
                                <AlertTitle className="text-blue-800 dark:text-blue-300">Confidencialidade Garantida</AlertTitle>
                                <AlertDescription className="text-blue-700 dark:text-blue-400 text-sm text-justify">
                                    Reforçamos que seus dados são tratados com sigilo absoluto, respeitando sua privacidade e a LGPD. Obrigado por colaborar com a melhoria do nosso curso!
                                </AlertDescription>
                            </Alert>
                        </div>
                    )}

                </CardContent>
                <CardFooter className="flex justify-between border-t p-6 bg-muted/20">
                    <Button variant="outline" onClick={() => setStep((s) => Math.max(1, s - 1) as Step)} disabled={step === 1}>
                        <ChevronLeft className="w-4 h-4 mr-2" /> Voltar
                    </Button>
                    <Button onClick={handleNext} disabled={loading} className="w-32">
                        {step === 5 ? "Finalizar" : "Próximo"} <ChevronRight className="w-4 h-4 ml-2" />
                    </Button>
                </CardFooter>
            </Card>
        </div>
    );
}
