import { z } from "zod/v3"

const optionalNullableString = z.preprocess((value) => {
  if (value === "" || value === undefined) return null
  return value
}, z.string().nullable().optional())

export const createWalletSchema = z.object({
  name: z.string().min(3).trim(),
  description: z.string().min(2).trim(),
  walletTypeId: z.coerce.number().positive(),
  image: optionalNullableString,
  amount: z.coerce.number(),
})
export type CreateWalletSchema = z.infer<typeof createWalletSchema>
export type CreateWalletSchemaInput = z.input<typeof createWalletSchema>

export const updateWalletSchema = createWalletSchema.partial()
export type UpdateWalletSchema = z.infer<typeof updateWalletSchema>

export const updateMassWalletSchema = updateWalletSchema.extend({
  id: z.number().positive(),
})
export type UpdateMassWalletSchema = z.infer<typeof updateMassWalletSchema>
