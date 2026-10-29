import type { AiProviderName } from "@/types"

export const AI_PROVIDER_DETAILS: Record<
  AiProviderName,
  { label: string; keysUrl: string; keyPlaceholder: string }
> = {
  openai: {
    label: "OpenAI",
    keysUrl: "https://platform.openai.com/api-keys",
    keyPlaceholder: "sk-...",
  },
  anthropic: {
    label: "Anthropic (Claude)",
    keysUrl: "https://console.anthropic.com/settings/keys",
    keyPlaceholder: "sk-ant-...",
  },
  google: {
    label: "Google (Gemini)",
    keysUrl: "https://aistudio.google.com/apikey",
    keyPlaceholder: "AIza...",
  },
  mistral: {
    label: "Mistral",
    keysUrl: "https://console.mistral.ai/api-keys",
    keyPlaceholder: "",
  },
}
