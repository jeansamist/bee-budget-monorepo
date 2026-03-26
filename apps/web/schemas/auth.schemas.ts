import { z } from "zod"

export const signUpSchema = z.object({
  firstName: z.string().min(1).trim(),
  lastName: z.string().min(1).trim(),
  email: z.email().trim(),
  password: z.string().min(8),
})
export type SignUpSchema = z.infer<typeof signUpSchema>
