import { z } from "zod/v3"

export const createInternalTransferSchema = z.object({
  amount: z.number().positive(),
  fee: z.number().min(0).nullable().optional(),
  sourceWalletId: z.number().positive(),
  targetWalletId: z.number().positive(),
  date: z.string().min(1),
  description: z.string().min(2).trim().nullable().optional(),
})
export type CreateInternalTransferSchema = z.infer<
  typeof createInternalTransferSchema
>

export const updateInternalTransferSchema = createInternalTransferSchema.partial()
export type UpdateInternalTransferSchema = z.infer<
  typeof updateInternalTransferSchema
>

export const updateMassInternalTransferSchema =
  updateInternalTransferSchema.extend({
    id: z.number().positive(),
  })
export type UpdateMassInternalTransferSchema = z.infer<
  typeof updateMassInternalTransferSchema
>
