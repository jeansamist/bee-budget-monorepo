import { z } from "zod/v3"

const toDateString = (value: Date) => {
  const offset = value.getTimezoneOffset()
  return new Date(value.getTime() - offset * 60_000).toISOString().split("T")[0]
}

const optionalNullableNumber = z.preprocess((value) => {
  if (value === "" || value === undefined || value === "null") return null
  return value
}, z.coerce.number().positive().nullable().optional())

export const createIncomeSchema = z.object({
  name: z.string().min(3).trim(),
  description: z.string().min(2).trim(),
  amount: z.coerce.number().positive(),
  incomeCategoryId: z.coerce.number().positive(),
  walletId: z.coerce.number().positive(),
  date: z.preprocess((value) => {
    if (value instanceof Date) return toDateString(value)
    return value
  }, z.string().min(1)),
  fromContactId: optionalNullableNumber,
})
export type CreateIncomeSchema = z.infer<typeof createIncomeSchema>
export type CreateIncomeSchemaInput = z.input<typeof createIncomeSchema>

export const updateIncomeSchema = createIncomeSchema.partial()
export type UpdateIncomeSchema = z.infer<typeof updateIncomeSchema>

export const updateMassIncomeSchema = updateIncomeSchema.extend({
  id: z.number().positive(),
})
export type UpdateMassIncomeSchema = z.infer<typeof updateMassIncomeSchema>
