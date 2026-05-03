import { z } from "zod/v3"

const optionalNullableNumber = z.preprocess((value) => {
  if (value === "" || value === undefined || value === "null") return null
  return value
}, z.coerce.number().positive().nullable().optional())

const optionalNullableString = z.preprocess((value) => {
  if (value === "" || value === undefined) return null
  return value
}, z.string().nullable().optional())

export const createIncomeCategorySchema = z.object({
  name: z.string().min(3).trim(),
  icon: optionalNullableString,
  color: z.string().min(3).trim(),
  defaultWalletTypeId: optionalNullableNumber,
  defaultContactId: optionalNullableNumber,
})
export type CreateIncomeCategorySchema = z.infer<typeof createIncomeCategorySchema>
export type CreateIncomeCategorySchemaInput = z.input<typeof createIncomeCategorySchema>

export const updateIncomeCategorySchema = createIncomeCategorySchema.partial()
export type UpdateIncomeCategorySchema = z.infer<typeof updateIncomeCategorySchema>

export const updateMassIncomeCategorySchema = updateIncomeCategorySchema.extend({
  id: z.number().positive(),
})
export type UpdateMassIncomeCategorySchema = z.infer<typeof updateMassIncomeCategorySchema>
