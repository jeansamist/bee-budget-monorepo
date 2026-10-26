import { z } from "zod/v3"

const optionalNullableNumber = z.preprocess((value) => {
  if (value === "" || value === undefined || value === "null") return null
  return value
}, z.coerce.number().positive().nullable().optional())

export const budgetTargetTypeSchema = z.enum(["expense_category", "wallet"])
export const budgetPeriodSchema = z.enum(["weekly", "monthly", "yearly"])

export const createBudgetSchema = z
  .object({
    name: z.string().min(2).trim(),
    targetType: budgetTargetTypeSchema,
    expenseCategoryId: optionalNullableNumber,
    walletId: optionalNullableNumber,
    amount: z.coerce.number().int().positive(),
    period: budgetPeriodSchema,
    alertThreshold: z.coerce.number().int().min(1).max(100),
  })
  .refine(
    (budget) =>
      budget.targetType === "wallet"
        ? Boolean(budget.walletId)
        : Boolean(budget.expenseCategoryId),
    { path: ["targetType"], message: "Choose what this budget applies to" }
  )
export type CreateBudgetSchema = z.infer<typeof createBudgetSchema>
export type CreateBudgetSchemaInput = z.input<typeof createBudgetSchema>

export type UpdateBudgetSchema = Partial<CreateBudgetSchema>
