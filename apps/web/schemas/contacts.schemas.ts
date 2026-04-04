import { z } from "zod/v3"

export const contactTypeSchema = z.enum(["person", "entreprise", "other"])
export type ContactType = z.infer<typeof contactTypeSchema>

export const createContactSchema = z.object({
  name: z.string().min(2).trim(),
  image: z.string().nullable().optional(),
  color: z.string().min(3).trim(),
  type: contactTypeSchema,
  phoneNumber: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  comments: z.string().nullable().optional(),
})
export type CreateContactSchema = z.infer<typeof createContactSchema>

export const updateContactSchema = createContactSchema.partial()
export type UpdateContactSchema = z.infer<typeof updateContactSchema>

export const updateMassContactSchema = updateContactSchema.extend({
  id: z.number().positive(),
})
export type UpdateMassContactSchema = z.infer<typeof updateMassContactSchema>
