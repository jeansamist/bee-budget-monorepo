import vine from '@vinejs/vine'

export const createIncomeCategoryValidator = vine.create(
  vine.object({
    name: vine.string().minLength(3),
    icon: vine.string().nullable().optional(),
    color: vine.string().minLength(3),
    defaultWalletTypeId: vine.number().positive().nullable().optional(),
  })
)

export const updateIncomeCategoryValidator = vine.create(
  vine.object({
    name: vine.string().minLength(3).optional(),
    icon: vine.string().nullable().optional(),
    color: vine.string().minLength(3).optional(),
    defaultWalletTypeId: vine.number().positive().nullable().optional(),
  })
)
