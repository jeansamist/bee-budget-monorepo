import { type AiProviderName } from '#models/ai_provider'
import AiProviderRepository from '#repositories/ai_provider_repository'
import { httpError } from '#utils/http_error'
import { createAnthropic } from '@ai-sdk/anthropic'
import { createGoogle } from '@ai-sdk/google'
import { createMistral } from '@ai-sdk/mistral'
import { createOpenAI } from '@ai-sdk/openai'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import encryption from '@adonisjs/core/services/encryption'
import { z } from 'zod'

export type AiModel = { id: string; name: string }

/**
 * Each provider lists its models in its own shape. These schemas keep only
 * what we need and drop models that can't chat with tools (embeddings,
 * images, audio...).
 */
const openAiModels = z.object({
  data: z.array(z.object({ id: z.string(), created: z.number().optional() })),
})
const anthropicModels = z.object({
  data: z.array(z.object({ id: z.string(), display_name: z.string().optional() })),
})
const googleModels = z.object({
  models: z.array(
    z.object({
      name: z.string(),
      displayName: z.string().optional(),
      supportedGenerationMethods: z.array(z.string()).optional(),
    })
  ),
})
const mistralModels = z.object({
  data: z.array(
    z.object({
      id: z.string(),
      name: z.string().nullish(),
      created: z.number().optional(),
      capabilities: z
        .object({
          completion_chat: z.boolean().optional(),
          function_calling: z.boolean().optional(),
        })
        .optional(),
    })
  ),
})

const NON_CHAT_MODEL =
  /(audio|realtime|transcribe|tts|image|search|instruct|embed|moderation|whisper|dall-e|davinci|babbage|codex|ocr|veo|live|computer-use|batch)/

const MODEL_LISTERS: Record<AiProviderName, (apiKey: string) => Promise<AiModel[]>> = {
  async openai(apiKey) {
    const body = await fetchJson('https://api.openai.com/v1/models', {
      Authorization: `Bearer ${apiKey}`,
    })
    return openAiModels
      .parse(body)
      .data.filter(({ id }) => /^(gpt-|o\d|chatgpt)/.test(id) && !NON_CHAT_MODEL.test(id))
      .sort((a, b) => (b.created ?? 0) - (a.created ?? 0))
      .map(({ id }) => ({ id, name: id }))
  },
  async anthropic(apiKey) {
    const body = await fetchJson('https://api.anthropic.com/v1/models?limit=100', {
      'x-api-key': apiKey,
      'anthropic-version': '2023-06-01',
    })
    // Already newest first
    return anthropicModels
      .parse(body)
      .data.map(({ id, display_name: name }) => ({ id, name: name ?? id }))
  },
  async google(apiKey) {
    const body = await fetchJson(
      'https://generativelanguage.googleapis.com/v1beta/models?pageSize=1000',
      { 'x-goog-api-key': apiKey }
    )
    return googleModels
      .parse(body)
      .models.filter(
        ({ name, supportedGenerationMethods }) =>
          name.includes('gemini') &&
          !NON_CHAT_MODEL.test(name) &&
          supportedGenerationMethods?.includes('generateContent')
      )
      .map(({ name, displayName }) => {
        const id = name.replace(/^models\//, '')
        return { id, name: displayName ?? id }
      })
      .sort((a, b) => b.id.localeCompare(a.id, undefined, { numeric: true }))
  },
  async mistral(apiKey) {
    const body = await fetchJson('https://api.mistral.ai/v1/models', {
      Authorization: `Bearer ${apiKey}`,
    })
    const seen = new Set<string>()
    return mistralModels
      .parse(body)
      .data.filter(
        ({ id, capabilities }) =>
          capabilities?.completion_chat && capabilities.function_calling && !NON_CHAT_MODEL.test(id)
      )
      .sort((a, b) => (b.created ?? 0) - (a.created ?? 0))
      .filter(({ id }) => !seen.has(id) && seen.add(id))
      .map(({ id }) => ({ id, name: id }))
  },
}

async function fetchJson(url: string, headers: Record<string, string>) {
  const response = await fetch(url, { headers, signal: AbortSignal.timeout(10_000) })
  if (response.status === 401 || response.status === 403) {
    throw httpError(422, 'This API key was rejected by the provider')
  }
  if (!response.ok) {
    throw httpError(502, 'The provider could not be reached, try again later')
  }
  return response.json()
}

@inject()
export class AiProviderService {
  constructor(
    private readonly repository: AiProviderRepository,
    private readonly ctx: HttpContext
  ) {}

  private get userId() {
    return this.ctx.auth.user!.id
  }

  async getUserProviders() {
    return this.repository.findAllByUserId(this.userId)
  }

  /**
   * Checks the key against the provider (listing its models) before saving it.
   */
  async saveProvider(provider: AiProviderName, apiKey: string) {
    await MODEL_LISTERS[provider](apiKey)
    return this.repository.upsert(this.userId, provider, {
      apiKey: encryption.encrypt(apiKey),
      keyHint: apiKey.slice(-4),
    })
  }

  async deleteProvider(provider: string) {
    const aiProvider = await this.repository.findByUserIdAndProvider(this.userId, provider)
    if (!aiProvider) throw httpError(404, 'This provider is not connected')
    await this.repository.delete(aiProvider)
  }

  private async getApiKey(provider: AiProviderName) {
    const aiProvider = await this.repository.findByUserIdAndProvider(this.userId, provider)
    const apiKey = aiProvider && encryption.decrypt<string>(aiProvider.apiKey)
    if (!apiKey) throw httpError(404, 'Add an API key for this provider first')
    return apiKey
  }

  /**
   * Models of every connected provider. A provider that fails (revoked key,
   * outage) comes back with an error instead of failing the whole list.
   */
  async getAvailableModels() {
    const providers = await this.getUserProviders()
    return Promise.all(
      providers.map(async ({ provider }) => {
        const name = provider as AiProviderName
        try {
          const models = await MODEL_LISTERS[name](await this.getApiKey(name))
          return { provider: name, models, error: null }
        } catch (error) {
          return { provider: name, models: [], error: (error as Error).message }
        }
      })
    )
  }

  async getLanguageModel(provider: AiProviderName, modelId: string) {
    const apiKey = await this.getApiKey(provider)
    switch (provider) {
      case 'openai':
        return createOpenAI({ apiKey })(modelId)
      case 'anthropic':
        return createAnthropic({ apiKey })(modelId)
      case 'google':
        return createGoogle({ apiKey })(modelId)
      case 'mistral':
        return createMistral({ apiKey })(modelId)
    }
  }
}
