import { AiConversationSchema } from '#database/schema'
import { belongsTo } from '@adonisjs/lucid/orm'
import { type BelongsTo } from '@adonisjs/lucid/types/relations'
import type { UIMessage } from 'ai'
import User from './user.ts'

export default class AiConversation extends AiConversationSchema {
  // Ids come from the chat UI, not from the database
  static selfAssignPrimaryKey = true

  @belongsTo(() => User)
  declare user: BelongsTo<typeof User>

  get uiMessages(): UIMessage[] {
    return JSON.parse(this.messages)
  }
}
