import { z } from "zod/v3"

export const contactTypeSchema = z.enum(["person", "entreprise", "other"])
export type ContactType = z.infer<typeof contactTypeSchema>

const optionalNullableString = z.preprocess((value) => {
  if (value === "" || value === undefined) return null
  return value
}, z.string().nullable().optional())

const optionalNullableEmail = z.preprocess((value) => {
  if (value === "" || value === undefined) return null
  return value
}, z.string().email().nullable().optional())

export const createContactSchema = z.object({
  name: z.string().min(2).trim(),
  image: optionalNullableString,
  color: z.string().min(3).trim(),
  type: contactTypeSchema,
  phoneNumber: optionalNullableString,
  email: optionalNullableEmail,
  comments: optionalNullableString,
})
export type CreateContactSchema = z.infer<typeof createContactSchema>
export type CreateContactSchemaInput = z.input<typeof createContactSchema>

export const updateContactSchema = createContactSchema.partial()
export type UpdateContactSchema = z.infer<typeof updateContactSchema>

export const updateMassContactSchema = updateContactSchema.extend({
  id: z.number().positive(),
})
export type UpdateMassContactSchema = z.infer<typeof updateMassContactSchema>
