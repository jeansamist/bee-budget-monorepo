import AiProvider from '#models/ai_provider'
import { type ModelProps } from '#utils/generics'
import type { AiProviderSchema } from '#database/schema'

export default class AiProviderRepository {
  private model = AiProvider

  get getModel(): typeof AiProvider {
    return this.model
  }

  async upsert(
    userId: number,
    provider: string,
    data: Omit<ModelProps<AiProviderSchema>, 'userId' | 'provider'>
  ): Promise<AiProvider> {
    return this.model.updateOrCreate({ userId, provider }, data)
  }

  async delete(aiProvider: AiProvider): Promise<void> {
    await aiProvider.delete()
  }

  async findByUserIdAndProvider(userId: number, provider: string) {
    return this.model.query().where('user_id', userId).where('provider', provider).first()
  }

  async findAllByUserId(userId: number): Promise<AiProvider[]> {
    return this.model.query().where('user_id', userId).orderBy('created_at', 'asc')
  }
}
