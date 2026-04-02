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

export const createIncomeValidator = vine.create(
  vine.object({
    name: vine.string().minLength(3),
    description: vine.string().minLength(2),
    amount: vine.number().positive(),
    incomeCategoryId: vine.number().positive(),
    walletTypeId: vine.number().positive(),
    walletId: vine.number().positive(),
    date: incomeDateField(),
  })
)

export const updateIncomeValidator = vine.create(
  vine.object({
    name: vine.string().minLength(3).optional(),
    description: vine.string().minLength(2).optional(),
    amount: vine.number().positive().optional(),
    incomeCategoryId: vine.number().positive().optional(),
    walletTypeId: vine.number().positive().optional(),
    walletId: vine.number().positive().optional(),
    date: incomeDateField().optional(),
  })
)
