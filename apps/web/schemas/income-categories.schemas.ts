import { z } from "zod/v3"

export const createIncomeCategorySchema = z.object({
  name: z.string().min(3).trim(),
  icon: z.string().nullable().optional(),
  color: z.string().min(3).trim(),
  defaultWalletTypeId: z.number().positive().nullable().optional(),
})
export type CreateIncomeCategorySchema = z.infer<typeof createIncomeCategorySchema>

export const updateIncomeCategorySchema = createIncomeCategorySchema.partial()
export type UpdateIncomeCategorySchema = z.infer<typeof updateIncomeCategorySchema>

export const updateMassIncomeCategorySchema = updateIncomeCategorySchema.extend({
  id: z.number().positive(),
})
export type UpdateMassIncomeCategorySchema = z.infer<typeof updateMassIncomeCategorySchema>
