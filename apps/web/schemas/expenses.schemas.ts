import { z } from "zod/v3"

const toDateString = (value: Date) => {
  const offset = value.getTimezoneOffset()
  return new Date(value.getTime() - offset * 60_000).toISOString().split("T")[0]
}

const optionalNullableNumber = z.preprocess((value) => {
  if (value === "" || value === undefined || value === "null") return null
  return value
}, z.coerce.number().positive().nullable().optional())

const optionalFeeNumber = z.preprocess((value) => {
  if (value === "" || value === undefined) return null
  return value
}, z.coerce.number().min(0).nullable().optional())

export const createExpenseSchema = z.object({
  name: z.string().min(3).trim(),
  description: z.string().min(2).trim(),
  amount: z.coerce.number().positive(),
  fees: optionalFeeNumber,
  expenseCategoryId: z.coerce.number().positive(),
  walletId: z.coerce.number().positive(),
  date: z.preprocess((value) => {
    if (value instanceof Date) return toDateString(value)
    return value
  }, z.string().min(1)),
  toContactId: optionalNullableNumber,
})
export type CreateExpenseSchema = z.infer<typeof createExpenseSchema>
export type CreateExpenseSchemaInput = z.input<typeof createExpenseSchema>

export const updateExpenseSchema = createExpenseSchema.partial()
export type UpdateExpenseSchema = z.infer<typeof updateExpenseSchema>

export const updateMassExpenseSchema = updateExpenseSchema.extend({
  id: z.number().positive(),
})
export type UpdateMassExpenseSchema = z.infer<typeof updateMassExpenseSchema>
