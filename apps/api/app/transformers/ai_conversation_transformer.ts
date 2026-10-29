import type AiConversation from '#models/ai_conversation'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class AiConversationTransformer extends BaseTransformer<AiConversation> {
  toObject() {
    return this.pick(this.resource, ['id', 'title', 'provider', 'model', 'createdAt', 'updatedAt'])
  }
}
