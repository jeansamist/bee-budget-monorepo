import { AiProviderSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import User from './user.ts'

export const AI_PROVIDERS = ['openai', 'anthropic', 'google', 'mistral'] as const

export type AiProviderName = (typeof AI_PROVIDERS)[number]

export default class AiProvider extends AiProviderSchema {
  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>
}
