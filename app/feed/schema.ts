import { z } from "zod"

export const postSchema = z.object({
    content: z.string().min(1, "O conteúdo não pode ser vazio").max(2000, "Máximo de 2000 caracteres"),
})

export type PostFormData = z.infer<typeof postSchema>
