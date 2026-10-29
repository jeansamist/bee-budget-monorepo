"use server"

import { tuyau } from "@/lib/api"
import type {
  AiProvider,
  AiProviderModels,
  AiProviderName,
  ApiResponse,
} from "@/types"

export const getAiProviders = async (): Promise<ApiResponse<AiProvider[]>> => {
  const [data, error] = await tuyau.api.ai.providers({}).safe()
  return (error ? error.response : data) as ApiResponse<AiProvider[]>
}

export const saveAiProvider = async (payload: {
  provider: AiProviderName
  apiKey: string
}): Promise<ApiResponse<AiProvider>> => {
  const [data, error] = await tuyau.api.ai
    .saveProvider({ body: payload })
    .safe()
  return (error ? error.response : data) as ApiResponse<AiProvider>
}

export const deleteAiProvider = async (
  provider: AiProviderName
): Promise<ApiResponse<null>> => {
  const [data, error] = await tuyau.api.ai
    .deleteProvider({ params: { provider } })
    .safe()
  return (error ? error.response : data) as ApiResponse<null>
}

export const getAiModels = async (): Promise<
  ApiResponse<AiProviderModels[]>
> => {
  const [data, error] = await tuyau.api.ai.models({}).safe()
  return (error ? error.response : data) as ApiResponse<AiProviderModels[]>
}
