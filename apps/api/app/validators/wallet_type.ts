import vine from '@vinejs/vine'

export const createWalletTypeValidator = vine.create(
  vine.object({
    name: vine.string().minLength(2),
    color: vine.string().minLength(3),
    icon: vine.string().nullable().optional(),
  })
)

export const updateWalletTypeValidator = vine.create(
  vine.object({
    name: vine.string().minLength(2).optional(),
    color: vine.string().minLength(3).optional(),
    icon: vine.string().nullable().optional(),
  })
)
