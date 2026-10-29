"use client"

import { Confirm } from "@/components/confirm"
import { useApp } from "@/contexts/app.context"
import { AI_PROVIDER_DETAILS } from "@/lib/ai-providers"
import { useCurrentLocaleUrl, useI18n } from "@/lib/i18n/client"
import { deleteAiProvider, saveAiProvider } from "@/services/ai.services"
import { AI_PROVIDERS, type AiProvider, type AiProviderName } from "@/types"
import { Button } from "@bee-budget/ui/button"
import { Input } from "@bee-budget/ui/input"
import { ArrowRight, ExternalLink, LoaderCircle } from "lucide-react"
import Link from "next/link"
import { useState, type FormEvent } from "react"
import { toast } from "sonner"

function ProviderRow({
  provider,
  connected,
}: {
  provider: AiProviderName
  connected?: AiProvider
}) {
  const t = useI18n()
  const { aiProviders, setAiProviders } = useApp()
  const details = AI_PROVIDER_DETAILS[provider]
  const [editing, setEditing] = useState(false)
  const [apiKey, setApiKey] = useState("")
  const [saving, setSaving] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string>()

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setSaving(true)
    // The API checks the key with the provider before saving it
    const result = await saveAiProvider({ provider, apiKey: apiKey.trim() })
    setSaving(false)
    if (!result.success || !result.data) {
      setErrorMessage(result.message ?? t("unknownError"))
      return
    }
    setAiProviders([
      ...aiProviders.filter((item) => item.provider !== provider),
      result.data,
    ])
    setApiKey("")
    setEditing(false)
    setErrorMessage(undefined)
    toast.success(t("app.integrations.ai.saved", { provider: details.label }))
  }

  async function onRemove() {
    const result = await deleteAiProvider(provider)
    if (!result.success) {
      toast.error(result.message ?? t("unknownError"))
      return
    }
    setAiProviders(aiProviders.filter((item) => item.provider !== provider))
    toast.success(t("app.integrations.ai.removed", { provider: details.label }))
  }

  return (
    <li className="space-y-3 py-4">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        <div className="min-w-0 flex-1 space-y-0.5">
          <p className="text-sm font-medium">{details.label}</p>
          <p className="text-sm text-muted-foreground">
            {connected
              ? t("app.integrations.ai.connected", {
                  hint: connected.keyHint,
                })
              : t("app.integrations.ai.notConnected")}
          </p>
        </div>
        {!editing && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setEditing(true)}
            >
              {connected
                ? t("app.integrations.ai.replaceKey")
                : t("app.integrations.ai.addKey")}
            </Button>
            {connected && (
              <Confirm
                title={t("app.integrations.ai.removeTitle", {
                  provider: details.label,
                })}
                content={t("app.integrations.ai.removeDescription")}
                onConfirm={onRemove}
              >
                <Button variant="ghost" size="sm" className="text-destructive">
                  {t("app.integrations.ai.remove")}
                </Button>
              </Confirm>
            )}
          </div>
        )}
      </div>
      {editing && (
        <form onSubmit={onSubmit} className="space-y-2">
          <div className="flex flex-col gap-2 sm:flex-row">
            <Input
              type="password"
              autoComplete="off"
              autoFocus
              aria-label={t("app.integrations.ai.keyLabel", {
                provider: details.label,
              })}
              placeholder={details.keyPlaceholder}
              value={apiKey}
              onChange={(event) => setApiKey(event.target.value)}
            />
            <div className="flex gap-2">
              <Button
                type="submit"
                disabled={apiKey.trim().length < 10 || saving}
              >
                {t("app.integrations.ai.save")}
                {saving && <LoaderCircle className="animate-spin" />}
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => {
                  setEditing(false)
                  setApiKey("")
                  setErrorMessage(undefined)
                }}
              >
                {t("app.confirm.cancel")}
              </Button>
            </div>
          </div>
          {errorMessage && (
            <p className="text-sm text-destructive">{errorMessage}</p>
          )}
          <a
            href={details.keysUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground underline-offset-4 hover:underline"
          >
            {t("app.integrations.ai.getKey", { provider: details.label })}
            <ExternalLink className="size-3" />
          </a>
        </form>
      )}
    </li>
  )
}

/** API keys for the AI assistant: one per provider, the user picks the model in the chat. */
export function AiProviders() {
  const t = useI18n()
  const { currentLocaleUrl } = useCurrentLocaleUrl()
  const { aiProviders } = useApp()

  return (
    <article className="grid gap-6 rounded-3xl border p-5 sm:p-6 lg:grid-cols-[18rem_minmax(0,1fr)] lg:gap-10">
      <div className="space-y-3">
        <h4 className="text-lg font-semibold">
          {t("app.integrations.ai.title")}
        </h4>
        <p className="text-sm text-muted-foreground">
          {t("app.integrations.ai.description")}
        </p>
        <p className="text-xs text-muted-foreground">
          {t("app.integrations.ai.privacy")}
        </p>
        {aiProviders.length > 0 && (
          <Button asChild variant="outline" size="sm">
            <Link href={currentLocaleUrl("/app/ai")}>
              {t("app.integrations.ai.open")}
              <ArrowRight />
            </Link>
          </Button>
        )}
      </div>
      <ul className="divide-y">
        {AI_PROVIDERS.map((provider) => (
          <ProviderRow
            key={provider}
            provider={provider}
            connected={aiProviders.find((item) => item.provider === provider)}
          />
        ))}
      </ul>
    </article>
  )
}
