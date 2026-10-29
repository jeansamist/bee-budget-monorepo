import type AiProvider from '#models/ai_provider'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class AiProviderTransformer extends BaseTransformer<AiProvider> {
  toObject() {
    // The API key itself never leaves the server
    return this.pick(this.resource, ['id', 'provider', 'keyHint', 'createdAt', 'updatedAt'])
  }
}
