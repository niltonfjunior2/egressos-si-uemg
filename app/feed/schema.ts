import { z } from "zod"

export const postSchema = z.object({
    content: z.string().min(1, "O conteúdo não pode ser vazio").max(500, "Máximo de 500 caracteres"),
})

export type PostFormData = z.infer<typeof postSchema>
