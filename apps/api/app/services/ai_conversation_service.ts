import type AiConversation from '#models/ai_conversation'
import AiConversationRepository from '#repositories/ai_conversation_repository'
import { httpError } from '#utils/http_error'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import type { UIMessage } from 'ai'

const TITLE_LENGTH = 80

/**
 * The first thing the user asked, on one line.
 */
function titleFrom(messages: UIMessage[]) {
  const firstUserMessage = messages.find((message) => message.role === 'user')
  const text = (firstUserMessage?.parts ?? [])
    .map((part) => (part.type === 'text' ? part.text : ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim()
  if (!text) return 'New chat'
  return text.length > TITLE_LENGTH ? `${text.slice(0, TITLE_LENGTH - 1)}…` : text
}

@inject()
export class AiConversationService {
  constructor(
    private readonly repository: AiConversationRepository,
    private readonly ctx: HttpContext
  ) {}

  private get userId() {
    return this.ctx.auth.user!.id
  }

  checkOwnership(conversation: AiConversation) {
    if (conversation.userId !== this.userId) {
      throw httpError(403, 'You are not allowed to access this conversation')
    }
  }

  async getUserConversations() {
    return this.repository.findAllByUserId(this.userId)
  }

  async getConversationById(id: string) {
    const conversation = await this.repository.findById(id)
    if (!conversation) throw httpError(404, 'Conversation not found')
    this.checkOwnership(conversation)
    return conversation
  }

  /**
   * The conversation a chat request continues, or null for a new one.
   */
  async findForChat(id: string) {
    const conversation = await this.repository.findById(id)
    if (conversation) this.checkOwnership(conversation)
    return conversation
  }

  async saveConversation(
    id: string,
    data: { provider: string; model: string; messages: UIMessage[] }
  ) {
    const payload = {
      provider: data.provider,
      model: data.model,
      messages: JSON.stringify(data.messages),
      title: titleFrom(data.messages),
    }
    const conversation = await this.findForChat(id)
    if (conversation) return this.repository.update(conversation, payload)
    return this.repository.create({ id, userId: this.userId, ...payload })
  }

  async deleteConversation(id: string) {
    const conversation = await this.getConversationById(id)
    await this.repository.delete(conversation)
  }
}
