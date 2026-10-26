import vine from '@vinejs/vine'

const targetTypes = ['expense_category', 'wallet'] as const
const periods = ['weekly', 'monthly', 'yearly'] as const

function createBudgetSchema() {
  return vine.object({
    name: vine.string().minLength(2),
    targetType: vine.enum(targetTypes),
    expenseCategoryId: vine.number().positive().nullable().optional(),
    walletId: vine.number().positive().nullable().optional(),
    amount: vine.number().withoutDecimals().positive(),
    period: vine.enum(periods),
    alertThreshold: vine.number().withoutDecimals().min(1).max(100).optional(),
  })
}

function updateBudgetSchema() {
  return vine.object({
    name: vine.string().minLength(2).optional(),
    targetType: vine.enum(targetTypes).optional(),
    expenseCategoryId: vine.number().positive().nullable().optional(),
    walletId: vine.number().positive().nullable().optional(),
    amount: vine.number().withoutDecimals().positive().optional(),
    period: vine.enum(periods).optional(),
    alertThreshold: vine.number().withoutDecimals().min(1).max(100).optional(),
  })
}

export const createBudgetValidator = vine.create(createBudgetSchema())

export const updateBudgetValidator = vine.create(updateBudgetSchema())

export const deleteMassBudgetValidator = vine.create(
  vine.object({
    ids: vine.array(vine.number().positive()).minLength(1),
  })
)
