import vine from '@vinejs/vine'

export const createIncomeValidator = vine.create(
  vine.object({
    name: vine.string().minLength(3),
    description: vine.string().minLength(2),
    amount: vine.number().positive(),
    incomeCategoryId: vine.number().positive(),
    date: vine.date().beforeOrEqual('today'),
  })
)

export const updateIncomeValidator = vine.create(
  vine.object({
    name: vine.string().minLength(3).optional(),
    description: vine.string().minLength(2).optional(),
    amount: vine.number().positive().optional(),
    incomeCategoryId: vine.number().positive().optional(),
    date: vine.date().beforeOrEqual('today').optional(),
  })
)
