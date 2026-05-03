import { z } from "zod/v3"

const optionalNullableNumber = z.preprocess((value) => {
  if (value === "" || value === undefined || value === "null") return null
  return value
}, z.coerce.number().positive().nullable().optional())

const optionalNullableString = z.preprocess((value) => {
  if (value === "" || value === undefined) return null
  return value
}, z.string().nullable().optional())

export const createExpenseCategorySchema = z.object({
  name: z.string().min(3).trim(),
  icon: optionalNullableString,
  color: z.string().min(3).trim(),
  defaultWalletTypeId: optionalNullableNumber,
  defaultContactId: optionalNullableNumber,
})
export type CreateExpenseCategorySchema = z.infer<typeof createExpenseCategorySchema>
export type CreateExpenseCategorySchemaInput = z.input<typeof createExpenseCategorySchema>

export const updateExpenseCategorySchema = createExpenseCategorySchema.partial()
export type UpdateExpenseCategorySchema = z.infer<typeof updateExpenseCategorySchema>

export const updateMassExpenseCategorySchema = updateExpenseCategorySchema.extend({
  id: z.number().positive(),
})
export type UpdateMassExpenseCategorySchema = z.infer<typeof updateMassExpenseCategorySchema>
