import {z} from "zod";

export const LoginSchema = z.object({
    email: z.string().email("O campo deve ser um email válido"),
    password: z.string().min(1, "O campo não pode ser vazio")
})

export type LoginData = z.infer<typeof LoginSchema>

export const RegisterSchema = z.object({
    email: z.string().email("O campo deve ser um email válido"),
    password: z.string().min(1, "O campo não pode ser vazio")
})

export type RegisterData = z.infer<typeof RegisterSchema>