import vine from '@vinejs/vine'

export const createIncomeCategoryValidator = vine.create(
  vine.object({
    name: vine.string().minLength(3),
    icon: vine.string().nullable(),
    color: vine.string().minLength(3),
  })
)

export const updateIncomeCategoryValidator = vine.create(
  vine.object({
    name: vine.string().minLength(3).optional(),
    icon: vine.string().optional(),
    color: vine.string().minLength(3).optional(),
  })
)
