import vine from '@vinejs/vine'

function createContactSchema() {
  return vine.object({
    name: vine.string().minLength(2),
    image: vine.string().nullable().optional(),
    color: vine.string().minLength(3),
    type: vine.enum(['person', 'entreprise', 'other'] as const),
    phoneNumber: vine
      .string()
      .nullable()
      .optional()
      .transform((value) => (value ? value.replace(/\D/g, '') : value)),
    email: vine.string().email().nullable().optional(),
    comments: vine.string().nullable().optional(),
  })
}

function updateContactSchema() {
  return vine.object({
    name: vine.string().minLength(2).optional(),
    image: vine.string().nullable().optional(),
    color: vine.string().minLength(3).optional(),
    type: vine.enum(['person', 'entreprise', 'other'] as const).optional(),
    phoneNumber: vine
      .string()
      .nullable()
      .optional()
      .transform((value) => (value ? value.replace(/\D/g, '') : value)),
    email: vine.string().email().nullable().optional(),
    comments: vine.string().nullable().optional(),
  })
}

export const createContactValidator = vine.create(createContactSchema())

export const updateContactValidator = vine.create(updateContactSchema())

export const createMassContactValidator = vine.create(
  vine.object({
    items: vine.array(createContactSchema()).minLength(1),
  })
)

export const updateMassContactValidator = vine.create(
  vine.object({
    items: vine
      .array(
        vine.object({
          id: vine.number().positive(),
          ...updateContactSchema().getProperties(),
        })
      )
      .minLength(1),
  })
)

export const deleteMassContactValidator = vine.create(
  vine.object({
    ids: vine.array(vine.number().positive()).minLength(1),
  })
)
