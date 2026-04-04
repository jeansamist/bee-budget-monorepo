import vine from '@vinejs/vine'

function createExpenseCategorySchema() {
  return vine.object({
    name: vine.string().minLength(3),
    icon: vine.string().nullable().optional(),
    color: vine.string().minLength(3),
    defaultWalletTypeId: vine.number().positive().nullable().optional(),
    defaultContactId: vine.number().positive().nullable().optional(),
  })
}

function updateExpenseCategorySchema() {
  return vine.object({
    name: vine.string().minLength(3).optional(),
    icon: vine.string().nullable().optional(),
    color: vine.string().minLength(3).optional(),
    defaultWalletTypeId: vine.number().positive().nullable().optional(),
    defaultContactId: vine.number().positive().nullable().optional(),
  })
}

export const createExpenseCategoryValidator = vine.create(createExpenseCategorySchema())

export const updateExpenseCategoryValidator = vine.create(updateExpenseCategorySchema())

export const createMassExpenseCategoryValidator = vine.create(
  vine.object({
    items: vine.array(createExpenseCategorySchema()).minLength(1),
  })
)

export const updateMassExpenseCategoryValidator = vine.create(
  vine.object({
    items: vine
      .array(
        vine.object({
          id: vine.number().positive(),
          ...updateExpenseCategorySchema().getProperties(),
        })
      )
      .minLength(1),
  })
)

export const deleteMassExpenseCategoryValidator = vine.create(
  vine.object({
    ids: vine.array(vine.number().positive()).minLength(1),
  })
)
