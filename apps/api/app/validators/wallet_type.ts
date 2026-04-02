import vine from '@vinejs/vine'

function createWalletTypeSchema() {
  return vine.object({
    name: vine.string().minLength(2),
    color: vine.string().minLength(3),
    icon: vine.string().nullable().optional(),
  })
}

function updateWalletTypeSchema() {
  return vine.object({
    name: vine.string().minLength(2).optional(),
    color: vine.string().minLength(3).optional(),
    icon: vine.string().nullable().optional(),
  })
}

export const createWalletTypeValidator = vine.create(
  createWalletTypeSchema()
)

export const updateWalletTypeValidator = vine.create(
  updateWalletTypeSchema()
)

export const createMassWalletTypeValidator = vine.create(
  vine.object({
    items: vine.array(createWalletTypeSchema()).minLength(1),
  })
)

export const updateMassWalletTypeValidator = vine.create(
  vine.object({
    items: vine
      .array(
        vine.object({
          id: vine.number().positive(),
          ...updateWalletTypeSchema().getProperties(),
        })
      )
      .minLength(1),
  })
)

export const deleteMassWalletTypeValidator = vine.create(
  vine.object({
    ids: vine.array(vine.number().positive()).minLength(1),
  })
)
