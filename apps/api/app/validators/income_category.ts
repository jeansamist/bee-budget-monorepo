import vine from '@vinejs/vine'

function createIncomeCategorySchema() {
  return vine.object({
    name: vine.string().minLength(3),
    icon: vine.string().nullable().optional(),
    color: vine.string().minLength(3),
    defaultWalletTypeId: vine.number().positive().nullable().optional(),
    defaultContactId: vine.number().positive().nullable().optional(),
  })
}

function updateIncomeCategorySchema() {
  return vine.object({
    name: vine.string().minLength(3).optional(),
    icon: vine.string().nullable().optional(),
    color: vine.string().minLength(3).optional(),
    defaultWalletTypeId: vine.number().positive().nullable().optional(),
    defaultContactId: vine.number().positive().nullable().optional(),
  })
}

export const createIncomeCategoryValidator = vine.create(
  createIncomeCategorySchema()
)

export const updateIncomeCategoryValidator = vine.create(
  updateIncomeCategorySchema()
)

export const createMassIncomeCategoryValidator = vine.create(
  vine.object({
    items: vine.array(createIncomeCategorySchema()).minLength(1),
  })
)

export const updateMassIncomeCategoryValidator = vine.create(
  vine.object({
    items: vine
      .array(
        vine.object({
          id: vine.number().positive(),
          ...updateIncomeCategorySchema().getProperties(),
        })
      )
      .minLength(1),
  })
)

export const deleteMassIncomeCategoryValidator = vine.create(
  vine.object({
    ids: vine.array(vine.number().positive()).minLength(1),
  })
)
