import { z } from "zod/v3"

export const createWalletTypeSchema = z.object({
  name: z.string().min(2).trim(),
  color: z.string().min(3).trim(),
  icon: z.string().nullable().optional(),
})
export type CreateWalletTypeSchema = z.infer<typeof createWalletTypeSchema>

export const updateWalletTypeSchema = createWalletTypeSchema.partial()
export type UpdateWalletTypeSchema = z.infer<typeof updateWalletTypeSchema>

export const updateMassWalletTypeSchema = updateWalletTypeSchema.extend({
  id: z.number().positive(),
})
export type UpdateMassWalletTypeSchema = z.infer<typeof updateMassWalletTypeSchema>
