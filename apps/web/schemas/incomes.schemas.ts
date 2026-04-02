import { z } from "zod/v3"

export const createIncomeSchema = z.object({
  name: z.string().min(3).trim(),
  description: z.string().min(2).trim(),
  amount: z.number().positive(),
  incomeCategoryId: z.number().positive(),
  walletId: z.number().positive(),
  date: z.string().min(1),
})
export type CreateIncomeSchema = z.infer<typeof createIncomeSchema>

export const updateIncomeSchema = createIncomeSchema.partial()
export type UpdateIncomeSchema = z.infer<typeof updateIncomeSchema>

export const updateMassIncomeSchema = updateIncomeSchema.extend({
  id: z.number().positive(),
})
export type UpdateMassIncomeSchema = z.infer<typeof updateMassIncomeSchema>
