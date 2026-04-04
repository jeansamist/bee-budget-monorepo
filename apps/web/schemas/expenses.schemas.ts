import { z } from "zod/v3"

export const createExpenseSchema = z.object({
  name: z.string().min(3).trim(),
  description: z.string().min(2).trim(),
  amount: z.number().positive(),
  fees: z.number().min(0).nullable().optional(),
  expenseCategoryId: z.number().positive(),
  walletId: z.number().positive(),
  date: z.string().min(1),
  toContactId: z.number().positive().nullable().optional(),
})
export type CreateExpenseSchema = z.infer<typeof createExpenseSchema>

export const updateExpenseSchema = createExpenseSchema.partial()
export type UpdateExpenseSchema = z.infer<typeof updateExpenseSchema>

export const updateMassExpenseSchema = updateExpenseSchema.extend({
  id: z.number().positive(),
})
export type UpdateMassExpenseSchema = z.infer<typeof updateMassExpenseSchema>
