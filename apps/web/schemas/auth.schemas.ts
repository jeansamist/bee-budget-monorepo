import { z } from "zod/v3"

export const signUpSchema = z.object({
  firstName: z.string().min(1).trim(),
  lastName: z.string().min(1).trim(),
  email: z.string().email().trim(),
  password: z.string().min(8),
})
export type SignUpSchema = z.infer<typeof signUpSchema>
