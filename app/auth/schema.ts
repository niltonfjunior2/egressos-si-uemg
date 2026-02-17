import { z } from "zod"

export const loginSchema = z.object({
    email: z.string().email("Email inválido"),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
})

export const signupSchema = z.object({
    email: z.string().email("Email inválido"),
    fullName: z.string().min(2, "Nome deve ter no mínimo 2 caracteres"),
    role: z.enum(["aluno", "egresso"] as const, {
        message: "Selecione uma opção",
    }),
    password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
    confirmPassword: z.string().min(6, "A senha deve ter no mínimo 6 caracteres"),
}).refine((data) => data.password === data.confirmPassword, {
    message: "As senhas não conferem",
    path: ["confirmPassword"],
})

export type LoginFormData = z.infer<typeof loginSchema>
export type SignupFormData = z.infer<typeof signupSchema>
