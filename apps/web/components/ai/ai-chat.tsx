"use client"

import { useApp } from "@/contexts/app.context"
import { AI_PROVIDER_DETAILS } from "@/lib/ai-providers"
import { useCurrentLocaleUrl, useI18n } from "@/lib/i18n/client"
import { getAiModels } from "@/services/ai.services"
import type { AiProviderModels, AiProviderName } from "@/types"
import { useChat } from "@ai-sdk/react"
import { cn } from "@bee-budget/functions"
import { Button } from "@bee-budget/ui/button"
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@bee-budget/ui/empty"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@bee-budget/ui/select"
import { Textarea } from "@bee-budget/ui/textarea"
import {
  DefaultChatTransport,
  getToolName,
  isToolUIPart,
  type UIMessage,
} from "ai"
import {
  ArrowUp,
  Check,
  LoaderCircle,
  Plus,
  RotateCcw,
  Sparkles,
  Square,
  TriangleAlert,
} from "lucide-react"
import Link from "next/link"
import { useEffect, useMemo, useRef, useState, type FormEvent } from "react"
import { Streamdown } from "streamdown"

const MODEL_STORAGE_KEY = "bee-budget:ai-model"

type ModelChoice = { provider: AiProviderName; model: string }

const SUGGESTIONS = [
  "app.ai.suggestions.month",
  "app.ai.suggestions.budgets",
  "app.ai.suggestions.categories",
  "app.ai.suggestions.save",
] as const

const TOOL_LABELS = {
  getWallets: "app.ai.tools.getWallets",
  getCategories: "app.ai.tools.getCategories",
  getContacts: "app.ai.tools.getContacts",
  getBudgets: "app.ai.tools.getBudgets",
  searchTransactions: "app.ai.tools.searchTransactions",
  getReport: "app.ai.tools.getReport",
  getIncomeExpenseTrend: "app.ai.tools.getIncomeExpenseTrend",
  getWalletAnalytics: "app.ai.tools.getWalletAnalytics",
} as const

const toValue = ({ provider, model }: ModelChoice) => `${provider}:${model}`

function fromValue(value: string): ModelChoice {
  const [provider, ...model] = value.split(":")
  return { provider: provider as AiProviderName, model: model.join(":") }
}

function readStoredChoice() {
  try {
    const value = localStorage.getItem(MODEL_STORAGE_KEY)
    return value ? fromValue(value) : null
  } catch {
    return null
  }
}

function storeChoice(choice: ModelChoice) {
  try {
    localStorage.setItem(MODEL_STORAGE_KEY, toValue(choice))
  } catch {
    // Only a convenience: the default model is picked again next time
  }
}

/** Grouped by provider, the last used model when it is still available. */
function useModels() {
  const { aiProviders } = useApp()
  const [providers, setProviders] = useState<AiProviderModels[]>()
  const [choice, setChoice] = useState<ModelChoice | null>(null)
  const providerKey = aiProviders.map((item) => item.provider).join(",")

  useEffect(() => {
    let cancelled = false
    getAiModels().then((result) => {
      if (cancelled) return
      const list = result.success ? (result.data ?? []) : []
      setProviders(list)
      const stored = readStoredChoice()
      const isAvailable = (candidate: ModelChoice | null) =>
        candidate &&
        list.some(
          (item) =>
            item.provider === candidate.provider &&
            item.models.some((model) => model.id === candidate.model)
        )
      const first = list.find((item) => item.models.length > 0)
      setChoice(
        isAvailable(stored)
          ? stored
          : first
            ? { provider: first.provider, model: first.models[0].id }
            : null
      )
    })
    return () => {
      cancelled = true
    }
  }, [providerKey])

  return {
    providers,
    choice,
    setChoice: (next: ModelChoice) => {
      storeChoice(next)
      setChoice(next)
    },
  }
}

function ModelPicker({
  providers,
  choice,
  onChange,
  disabled,
}: {
  providers: AiProviderModels[]
  choice: ModelChoice | null
  onChange: (choice: ModelChoice) => void
  disabled?: boolean
}) {
  const t = useI18n()
  return (
    <Select
      value={choice ? toValue(choice) : undefined}
      onValueChange={(value) => onChange(fromValue(value))}
      disabled={disabled}
    >
      <SelectTrigger
        size="sm"
        className="max-w-64"
        aria-label={t("app.ai.model")}
      >
        <SelectValue placeholder={t("app.ai.model")} />
      </SelectTrigger>
      <SelectContent>
        {providers.map((item) => (
          <SelectGroup key={item.provider}>
            <SelectLabel>
              {AI_PROVIDER_DETAILS[item.provider].label}
              {item.error && ` · ${t("app.ai.providerError")}`}
            </SelectLabel>
            {item.models.map((model) => (
              <SelectItem
                key={model.id}
                value={toValue({ provider: item.provider, model: model.id })}
              >
                {model.name}
              </SelectItem>
            ))}
          </SelectGroup>
        ))}
      </SelectContent>
    </Select>
  )
}

function ToolStep({ part }: { part: UIMessage["parts"][number] }) {
  const t = useI18n()
  if (!isToolUIPart(part)) return null
  const name = getToolName(part) as keyof typeof TOOL_LABELS
  const done = part.state === "output-available"
  const failed = part.state === "output-error"
  return (
    <p className="flex items-center gap-2 text-xs text-muted-foreground">
      {done ? (
        <Check className="size-3.5" />
      ) : failed ? (
        <TriangleAlert className="size-3.5 text-destructive" />
      ) : (
        <LoaderCircle className="size-3.5 animate-spin" />
      )}
      {TOOL_LABELS[name] ? t(TOOL_LABELS[name]) : name}
    </p>
  )
}

function Message({
  message,
  streaming,
}: {
  message: UIMessage
  streaming: boolean
}) {
  if (message.role === "user") {
    return (
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-muted px-4 py-2.5 text-sm whitespace-pre-wrap">
        {message.parts.map((part) => (part.type === "text" ? part.text : null))}
      </div>
    )
  }

  return (
    <div className="min-w-0 space-y-3 text-sm">
      {message.parts.map((part, index) => {
        if (part.type === "text") {
          return (
            <Streamdown
              key={index}
              isAnimating={streaming}
              className="space-y-3 leading-relaxed"
            >
              {part.text}
            </Streamdown>
          )
        }
        return <ToolStep key={index} part={part} />
      })}
    </div>
  )
}

function NoProvider() {
  const t = useI18n()
  const { currentLocaleUrl } = useCurrentLocaleUrl()
  return (
    <Empty className="flex-1">
      <EmptyHeader>
        <EmptyMedia variant="icon">
          <Sparkles />
        </EmptyMedia>
        <EmptyTitle>{t("app.ai.noProvider.title")}</EmptyTitle>
        <EmptyDescription>
          {t("app.ai.noProvider.description")}
        </EmptyDescription>
      </EmptyHeader>
      <EmptyContent>
        <Button asChild>
          <Link href={currentLocaleUrl("/app/integrations")}>
            {t("app.ai.noProvider.action")}
          </Link>
        </Button>
      </EmptyContent>
    </Empty>
  )
}

export function AiChat() {
  const t = useI18n()
  const { aiProviders } = useApp()
  const { providers, choice, setChoice } = useModels()
  const [input, setInput] = useState("")
  const endRef = useRef<HTMLDivElement>(null)
  const transport = useMemo(
    () => new DefaultChatTransport({ api: "/api/ai/chat" }),
    []
  )
  const {
    messages,
    sendMessage,
    regenerate,
    setMessages,
    stop,
    status,
    error,
    clearError,
  } = useChat({ transport })

  const busy = status === "submitted" || status === "streaming"

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" })
  }, [messages])

  if (aiProviders.length === 0) return <NoProvider />

  function send(text: string) {
    if (!choice || !text.trim() || busy) return
    sendMessage({ text: text.trim() }, { body: choice })
    setInput("")
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    send(input)
  }

  const noModels =
    providers !== undefined && providers.every((item) => !item.models.length)

  return (
    <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-4">
      <div className="flex-1 space-y-6 py-6">
        {messages.length === 0 ? (
          <div className="space-y-6 pt-[10vh]">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold">
                {t("app.ai.empty.title")}
              </h2>
              <p className="text-sm text-muted-foreground">
                {t("app.ai.empty.description")}
              </p>
            </div>
            <div className="grid gap-2 sm:grid-cols-2">
              {SUGGESTIONS.map((key) => (
                <button
                  key={key}
                  type="button"
                  disabled={!choice}
                  onClick={() => send(t(key))}
                  className="rounded-2xl border p-3 text-left text-sm transition-colors hover:border-primary disabled:opacity-50"
                >
                  {t(key)}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message, index) => (
            <Message
              key={message.id}
              message={message}
              streaming={
                status === "streaming" && index === messages.length - 1
              }
            />
          ))
        )}

        {status === "submitted" && (
          <LoaderCircle className="size-4 animate-spin text-muted-foreground" />
        )}

        {error && (
          <div className="flex flex-wrap items-center gap-3 rounded-2xl border border-destructive/30 p-3 text-sm">
            <TriangleAlert className="size-4 text-destructive" />
            <p className="min-w-0 flex-1">
              {error.message || t("unknownError")}
            </p>
            <Button
              variant="outline"
              size="sm"
              disabled={!choice}
              onClick={() => {
                clearError()
                regenerate({ body: choice ?? undefined })
              }}
            >
              <RotateCcw />
              {t("app.ai.retry")}
            </Button>
          </div>
        )}
        <div ref={endRef} />
      </div>

      <form
        onSubmit={onSubmit}
        className="sticky bottom-0 space-y-2 bg-background pb-4"
      >
        <div className="rounded-3xl border p-2 focus-within:border-primary">
          <Textarea
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter" && !event.shiftKey) {
                event.preventDefault()
                send(input)
              }
            }}
            placeholder={t("app.ai.placeholder")}
            rows={2}
            className="max-h-48 min-h-0 resize-none border-0 bg-transparent shadow-none focus-visible:ring-0 dark:bg-transparent"
          />
          <div className="flex items-center gap-2">
            {providers ? (
              <ModelPicker
                providers={providers}
                choice={choice}
                onChange={setChoice}
                disabled={busy}
              />
            ) : (
              <LoaderCircle className="ml-2 size-4 animate-spin text-muted-foreground" />
            )}
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={busy || messages.length === 0}
              onClick={() => {
                clearError()
                setMessages([])
              }}
            >
              <Plus />
              {t("app.ai.newChat")}
            </Button>
            <div className="flex-1" />
            {busy ? (
              <Button
                type="button"
                size="icon"
                className="rounded-full"
                aria-label={t("app.ai.stop")}
                onClick={() => stop()}
              >
                <Square className="fill-current" />
              </Button>
            ) : (
              <Button
                type="submit"
                size="icon"
                className="rounded-full"
                aria-label={t("app.ai.send")}
                disabled={!choice || !input.trim()}
              >
                <ArrowUp />
              </Button>
            )}
          </div>
        </div>
        <p
          className={cn(
            "text-center text-xs text-muted-foreground",
            noModels && "text-destructive"
          )}
        >
          {noModels ? t("app.ai.noModels") : t("app.ai.disclaimer")}
        </p>
      </form>
    </div>
  )
}
