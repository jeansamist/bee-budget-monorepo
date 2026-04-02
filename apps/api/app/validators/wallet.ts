import vine from '@vinejs/vine'

export const createWalletValidator = vine.create(
  vine.object({
    name: vine.string().minLength(3),
    description: vine.string().minLength(2),
    walletTypeId: vine.number().positive(),
    image: vine.string().nullable().optional(),
    amount: vine.number(),
  })
)

export const updateWalletValidator = vine.create(
  vine.object({
    name: vine.string().minLength(3).optional(),
    description: vine.string().minLength(2).optional(),
    walletTypeId: vine.number().positive().optional(),
    image: vine.string().nullable().optional(),
    amount: vine.number().optional(),
  })
)
