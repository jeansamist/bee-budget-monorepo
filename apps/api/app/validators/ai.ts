import { AI_PROVIDERS } from '#models/ai_provider'
import vine from '@vinejs/vine'

export const saveAiProviderValidator = vine.create(
  vine.object({
    provider: vine.enum(AI_PROVIDERS),
    apiKey: vine.string().trim().minLength(10),
  })
)

export const aiChatValidator = vine.create(
  vine.object({
    id: vine.string().regex(/^[\w-]{1,64}$/),
    provider: vine.enum(AI_PROVIDERS),
    model: vine.string().trim().minLength(1),
    trigger: vine.enum(['submit-message', 'regenerate-message'] as const),
    locale: vine
      .string()
      .regex(/^[a-z]{2}(-[A-Z]{2})?$/)
      .optional(),
    // The new UI message, checked against the tools by the AI SDK
    message: vine.any().optional(),
  })
)
