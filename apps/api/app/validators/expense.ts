import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

function expenseDateField() {
  return vine
    .date({
      formats: ['iso8601', 'YYYY-MM-DD'],
    })
    .beforeOrEqual('today')
    .transform((value) => (DateTime.isDateTime(value) ? value : DateTime.fromJSDate(value as Date)))
}

function createExpenseSchema() {
  return vine.object({
    name: vine.string().minLength(3),
    description: vine.string().minLength(2),
    amount: vine.number().positive(),
    fees: vine.number().min(0).nullable().optional(),
    expenseCategoryId: vine.number().positive(),
    walletId: vine.number().positive(),
    date: expenseDateField(),
    toContactId: vine.number().positive().nullable().optional(),
  })
}

function updateExpenseSchema() {
  return vine.object({
    name: vine.string().minLength(3).optional(),
    description: vine.string().minLength(2).optional(),
    amount: vine.number().positive().optional(),
    fees: vine.number().min(0).nullable().optional(),
    expenseCategoryId: vine.number().positive().optional(),
    walletId: vine.number().positive().optional(),
    date: expenseDateField().optional(),
    toContactId: vine.number().positive().nullable().optional(),
  })
}

export const createExpenseValidator = vine.create(createExpenseSchema())

export const updateExpenseValidator = vine.create(
  vine.object({
    ...updateExpenseSchema().getProperties(),
  })
)

export const createMassExpenseValidator = vine.create(
  vine.object({
    items: vine.array(createExpenseSchema()).minLength(1),
  })
)

export const updateMassExpenseValidator = vine.create(
  vine.object({
    items: vine
      .array(
        vine.object({
          id: vine.number().positive(),
          ...updateExpenseSchema().getProperties(),
        })
      )
      .minLength(1),
  })
)

export const deleteMassExpenseValidator = vine.create(
  vine.object({
    ids: vine.array(vine.number().positive()).minLength(1),
  })
)
