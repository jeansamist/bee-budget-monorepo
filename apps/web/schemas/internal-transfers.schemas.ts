import { z } from "zod/v3"

const toDateString = (value: Date) => {
  const offset = value.getTimezoneOffset()
  return new Date(value.getTime() - offset * 60_000).toISOString().split("T")[0]
}

const optionalFeeNumber = z.preprocess((value) => {
  if (value === "" || value === undefined) return null
  return value
}, z.coerce.number().min(0).nullable().optional())

const optionalDescription = z.preprocess((value) => {
  if (typeof value === "string" && value.trim() === "") return null
  return value
}, z.string().min(2).trim().nullable().optional())

const internalTransferSchemaFields = {
  amount: z.coerce.number().positive(),
  fee: optionalFeeNumber,
  sourceWalletId: z.coerce.number().positive(),
  targetWalletId: z.coerce.number().positive(),
  date: z.preprocess((value) => {
    if (value instanceof Date) return toDateString(value)
    return value
  }, z.string().min(1)),
  description: optionalDescription,
}

export const createInternalTransferSchema = z
  .object(internalTransferSchemaFields)
  .refine((data) => data.sourceWalletId !== data.targetWalletId, {
    message: "Source and target wallets must be different",
    path: ["targetWalletId"],
  })
export type CreateInternalTransferSchema = z.infer<
  typeof createInternalTransferSchema
>
export type CreateInternalTransferSchemaInput = z.input<
  typeof createInternalTransferSchema
>

const updateInternalTransferSchemaBase = z
  .object(internalTransferSchemaFields)
  .partial()

export const updateInternalTransferSchema = updateInternalTransferSchemaBase.refine(
  (data) =>
    data.sourceWalletId === undefined ||
    data.targetWalletId === undefined ||
    data.sourceWalletId !== data.targetWalletId,
  {
    message: "Source and target wallets must be different",
    path: ["targetWalletId"],
  }
)
export type UpdateInternalTransferSchema = z.infer<
  typeof updateInternalTransferSchema
>

export const updateMassInternalTransferSchema =
  updateInternalTransferSchemaBase
    .extend({
      id: z.number().positive(),
    })
    .refine(
      (data) =>
        data.sourceWalletId === undefined ||
        data.targetWalletId === undefined ||
        data.sourceWalletId !== data.targetWalletId,
      {
        message: "Source and target wallets must be different",
        path: ["targetWalletId"],
      }
    )
export type UpdateMassInternalTransferSchema = z.infer<
  typeof updateMassInternalTransferSchema
>
