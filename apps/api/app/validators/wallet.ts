import vine from '@vinejs/vine'

function createWalletSchema() {
  return vine.object({
    name: vine.string().minLength(3),
    description: vine.string().minLength(2),
    walletTypeId: vine.number().positive(),
    image: vine.string().nullable().optional(),
    amount: vine.number(),
  })
}

function updateWalletSchema() {
  return vine.object({
    name: vine.string().minLength(3).optional(),
    description: vine.string().minLength(2).optional(),
    walletTypeId: vine.number().positive().optional(),
    image: vine.string().nullable().optional(),
    amount: vine.number().optional(),
  })
}

export const createWalletValidator = vine.create(createWalletSchema())

export const updateWalletValidator = vine.create(updateWalletSchema())

export const createMassWalletValidator = vine.create(
  vine.object({
    items: vine.array(createWalletSchema()).minLength(1),
  })
)

export const updateMassWalletValidator = vine.create(
  vine.object({
    items: vine
      .array(
        vine.object({
          id: vine.number().positive(),
          ...updateWalletSchema().getProperties(),
        })
      )
      .minLength(1),
  })
)

export const deleteMassWalletValidator = vine.create(
  vine.object({
    ids: vine.array(vine.number().positive()).minLength(1),
  })
)
