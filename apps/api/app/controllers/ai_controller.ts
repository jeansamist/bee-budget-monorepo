import { AiAssistantService } from '#services/ai_assistant_service'
import { AiProviderService } from '#services/ai_provider_service'
import AiProviderTransformer from '#transformers/ai_provider_transformer'
import { ApiResponse } from '#utils/api_response'
import { aiChatValidator, saveAiProviderValidator } from '#validators/ai'
import { inject } from '@adonisjs/core'
import type { HttpContext } from '@adonisjs/core/http'
import { Readable } from 'node:stream'
import type { ReadableStream } from 'node:stream/web'

@inject()
export default class AiController {
  constructor(
    protected readonly aiProviderService: AiProviderService,
    protected readonly aiAssistantService: AiAssistantService
  ) {}

  async providers({ serialize, response }: HttpContext) {
    const providers = await this.aiProviderService.getUserProviders()
    const serialized = await serialize(AiProviderTransformer.transform(providers))
    return response.ok(ApiResponse.success(serialized.data, 'AI providers retrieved successfully'))
  }

  async saveProvider({ request, serialize, response }: HttpContext) {
    const { provider, apiKey } = await request.validateUsing(saveAiProviderValidator)
    const aiProvider = await this.aiProviderService.saveProvider(provider, apiKey)
    const serialized = await serialize(AiProviderTransformer.transform(aiProvider))
    return response.ok(ApiResponse.success(serialized.data, 'AI provider saved successfully'))
  }

  async deleteProvider({ params, response }: HttpContext) {
    await this.aiProviderService.deleteProvider(params.provider)
    return response.ok(ApiResponse.success(null, 'AI provider removed successfully'))
  }

  async models({ response }: HttpContext) {
    const models = await this.aiProviderService.getAvailableModels()
    return response.ok(ApiResponse.success(models, 'AI models retrieved successfully'))
  }

  /**
   * Streams the answer with the AI SDK UI message protocol (server-sent events).
   */
  async chat({ request, response }: HttpContext) {
    const payload = await request.validateUsing(aiChatValidator)
    const result = await this.aiAssistantService.chat(payload)

    response.status(result.status)
    result.headers.forEach((value, key) => response.header(key, value))
    response.stream(Readable.fromWeb(result.body as ReadableStream))
  }
}
