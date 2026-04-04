import vine from '@vinejs/vine'
import { DateTime } from 'luxon'

function transferDateField() {
  return vine
    .date({
      formats: ['iso8601', 'YYYY-MM-DD'],
    })
    .beforeOrEqual('today')
    .transform((value) => (DateTime.isDateTime(value) ? value : DateTime.fromJSDate(value as Date)))
}

function createInternalTransferSchema() {
  return vine.object({
    amount: vine.number().positive(),
    fee: vine.number().min(0).nullable().optional(),
    sourceWalletId: vine.number().positive(),
    targetWalletId: vine.number().positive(),
    date: transferDateField(),
    description: vine.string().minLength(2).trim().nullable().optional(),
  })
}

function updateInternalTransferSchema() {
  return vine.object({
    amount: vine.number().positive().optional(),
    fee: vine.number().min(0).nullable().optional(),
    sourceWalletId: vine.number().positive().optional(),
    targetWalletId: vine.number().positive().optional(),
    date: transferDateField().optional(),
    description: vine.string().minLength(2).trim().nullable().optional(),
  })
}

export const createInternalTransferValidator = vine.create(createInternalTransferSchema())

export const updateInternalTransferValidator = vine.create(
  vine.object({
    ...updateInternalTransferSchema().getProperties(),
  })
)

export const createMassInternalTransferValidator = vine.create(
  vine.object({
    items: vine.array(createInternalTransferSchema()).minLength(1),
  })
)

export const updateMassInternalTransferValidator = vine.create(
  vine.object({
    items: vine
      .array(
        vine.object({
          id: vine.number().positive(),
          ...updateInternalTransferSchema().getProperties(),
        })
      )
      .minLength(1),
  })
)

export const deleteMassInternalTransferValidator = vine.create(
  vine.object({
    ids: vine.array(vine.number().positive()).minLength(1),
  })
)
