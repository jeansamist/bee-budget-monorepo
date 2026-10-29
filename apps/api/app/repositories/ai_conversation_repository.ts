import AiConversation from '#models/ai_conversation'
import { type ModelProps } from '#utils/generics'
import type { AiConversationSchema } from '#database/schema'

export default class AiConversationRepository {
  private model = AiConversation

  get getModel(): typeof AiConversation {
    return this.model
  }

  async create(data: ModelProps<AiConversationSchema> & { id: string }): Promise<AiConversation> {
    const conversation = new this.model()
    conversation.fill(data)
    await conversation.save()
    return conversation
  }

  async update(
    conversation: AiConversation,
    data: Partial<ModelProps<AiConversationSchema>>
  ): Promise<AiConversation> {
    return conversation.merge(data).save()
  }

  async delete(conversation: AiConversation): Promise<void> {
    await conversation.delete()
  }

  async findById(id: string): Promise<AiConversation | null> {
    return this.model.find(id)
  }

  /**
   * Newest first, without the messages: the list only shows titles.
   */
  async findAllByUserId(userId: number): Promise<AiConversation[]> {
    return this.model
      .query()
      .where('user_id', userId)
      .select(['id', 'title', 'provider', 'model', 'user_id', 'created_at', 'updated_at'])
      .orderBy('updated_at', 'desc')
  }
}
