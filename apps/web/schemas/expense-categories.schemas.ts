import { z } from "zod/v3"

export const createExpenseCategorySchema = z.object({
  name: z.string().min(3).trim(),
  icon: z.string().nullable().optional(),
  color: z.string().min(3).trim(),
  defaultWalletTypeId: z.number().positive().nullable().optional(),
  defaultContactId: z.number().positive().nullable().optional(),
})
export type CreateExpenseCategorySchema = z.infer<typeof createExpenseCategorySchema>

export const updateExpenseCategorySchema = createExpenseCategorySchema.partial()
export type UpdateExpenseCategorySchema = z.infer<typeof updateExpenseCategorySchema>

export const updateMassExpenseCategorySchema = updateExpenseCategorySchema.extend({
  id: z.number().positive(),
})
export type UpdateMassExpenseCategorySchema = z.infer<typeof updateMassExpenseCategorySchema>
