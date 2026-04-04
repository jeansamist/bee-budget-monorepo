import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

function incomeDateField() {
  return vine
    .date({
      formats: ['iso8601', 'YYYY-MM-DD'],
    })
    .beforeOrEqual('today')
    .transform((value) => (DateTime.isDateTime(value) ? value : DateTime.fromJSDate(value as Date)))
}

function createIncomeSchema() {
  return vine.object({
    name: vine.string().minLength(3),
    description: vine.string().minLength(2),
    amount: vine.number().positive(),
    incomeCategoryId: vine.number().positive(),
    walletId: vine.number().positive(),
    date: incomeDateField(),
    fromContactId: vine.number().positive().nullable().optional(),
  })
}

function updateIncomeSchema() {
  return vine.object({
    name: vine.string().minLength(3).optional(),
    description: vine.string().minLength(2).optional(),
    amount: vine.number().positive().optional(),
    incomeCategoryId: vine.number().positive().optional(),
    walletId: vine.number().positive().optional(),
    date: incomeDateField().optional(),
    fromContactId: vine.number().positive().nullable().optional(),
  })
}

export const createIncomeValidator = vine.create(
  createIncomeSchema()
)

export const updateIncomeValidator = vine.create(
  vine.object({
    ...updateIncomeSchema().getProperties(),
  })
)

export const createMassIncomeValidator = vine.create(
  vine.object({
    items: vine.array(createIncomeSchema()).minLength(1),
  })
)

export const updateMassIncomeValidator = vine.create(
  vine.object({
    items: vine
      .array(
        vine.object({
          id: vine.number().positive(),
          ...updateIncomeSchema().getProperties(),
        })
      )
      .minLength(1),
  })
)

export const deleteMassIncomeValidator = vine.create(
  vine.object({
    ids: vine.array(vine.number().positive()).minLength(1),
  })
)
