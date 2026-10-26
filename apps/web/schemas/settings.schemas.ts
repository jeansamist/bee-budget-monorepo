import { z } from "zod/v3"

export const profileSchema = z.object({
  firstName: z.string().min(2).trim(),
  lastName: z.string().min(2).trim(),
  avatar: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.string().url().optional()
  ),
})
export type ProfileSchema = z.infer<typeof profileSchema>
export type ProfileSchemaInput = z.input<typeof profileSchema>

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1),
    newPassword: z.string().min(8),
    confirmPassword: z.string().min(8),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords don't match",
  })
export type ChangePasswordSchema = z.infer<typeof changePasswordSchema>
