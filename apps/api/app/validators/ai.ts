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
    provider: vine.enum(AI_PROVIDERS),
    model: vine.string().trim().minLength(1),
    // UI messages from the chat, checked against the tools by the AI SDK
    messages: vine.array(vine.any()).minLength(1),
  })
)
