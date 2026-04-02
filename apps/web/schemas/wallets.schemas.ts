import { z } from "zod/v3"

export const createWalletSchema = z.object({
  name: z.string().min(3).trim(),
  description: z.string().min(2).trim(),
  walletTypeId: z.number().positive(),
  image: z.string().nullable().optional(),
  amount: z.number(),
})
export type CreateWalletSchema = z.infer<typeof createWalletSchema>

export const updateWalletSchema = createWalletSchema.partial()
export type UpdateWalletSchema = z.infer<typeof updateWalletSchema>

export const updateMassWalletSchema = updateWalletSchema.extend({
  id: z.number().positive(),
})
export type UpdateMassWalletSchema = z.infer<typeof updateMassWalletSchema>
