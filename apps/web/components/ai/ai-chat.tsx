"use client"

import { useApp } from "@/contexts/app.context"
import { AI_PROVIDER_DETAILS } from "@/lib/ai-providers"
import {
  useCurrentLocale,
  useCurrentLocaleUrl,
  useI18n,
} from "@/lib/i18n/client"
import { ConversationList } from "@/components/ai/conversation-list"
import {
  ActivityTrail,
  isPlanPart,
  isWriteToolPart,
  matchPlan,
  PlanCard,
} from "@/components/ai/agent-parts"
import { ToolStep, type ApprovalResponse } from "@/components/ai/tool-step"
import {
  deleteAiConversation,
  getAiConversations,
  getAiModels,
} from "@/services/ai.services"
import type { AiConversation, AiProviderModels, AiProviderName } from "@/types"
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
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@bee-budget/ui/sheet"
import {
  DefaultChatTransport,
  generateId,
  getToolName,
  isToolUIPart,
  lastAssistantMessageIsCompleteWithApprovalResponses,
  type UIMessage,
} from "ai"
import {
  ArrowUp,
  History,
  LoaderCircle,
  RotateCcw,
  Sparkles,
  Square,
  TriangleAlert,
} from "lucide-react"
import { motion } from "motion/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useEffect, useRef, useState, type FormEvent } from "react"
import { Streamdown } from "streamdown"

const MODEL_STORAGE_KEY = "bee-budget:ai-model"

type ModelChoice = { provider: AiProviderName; model: string }

type MessagePart = UIMessage["parts"][number]

type Segment =
  | { kind: "text"; text: string }
  | { kind: "activity"; parts: MessagePart[] }
  | { kind: "plan"; part: Extract<MessagePart, { toolCallId: string }> }
  | { kind: "tool"; part: Extract<MessagePart, { toolCallId: string }> }

const SUGGESTIONS = [
  "app.ai.suggestions.month",
  "app.ai.suggestions.budgets",
  "app.ai.suggestions.categories",
  "app.ai.suggestions.save",
  "app.ai.suggestions.sms",
] as const

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

/**
 * Grouped by provider. Picks the conversation's model, else the last one
 * used, when it is still available.
 */
function useModels(preferred?: ModelChoice) {
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
      const stored = preferred ?? readStoredChoice()
      const isAvailable = (
        candidate: ModelChoice | null
      ): candidate is ModelChoice =>
        !!candidate &&
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
    // The preferred model only matters on the first load
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
        className="max-w-[55vw] min-w-0 sm:max-w-64 [&_[data-slot=select-value]]:truncate"
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

function Message({
  message,
  streaming,
  onApproval,
  busy,
}: {
  message: UIMessage
  streaming: boolean
  onApproval: (response: ApprovalResponse) => void
  busy: boolean
}) {
  if (message.role === "user") {
    return (
      <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-muted px-4 py-2.5 text-sm [overflow-wrap:anywhere] whitespace-pre-wrap">
        {message.parts.map((part) => (part.type === "text" ? part.text : null))}
      </div>
    )
  }

  const { assigned, covered, rollbacks } = matchPlan(message.parts)
  const segments: Segment[] = []
  for (const part of message.parts) {
    if (part.type === "step-start") continue
    if (part.type === "text") {
      if (part.text.trim()) segments.push({ kind: "text", text: part.text })
    } else if (isPlanPart(part)) {
      segments.push({ kind: "plan", part })
    } else if (isWriteToolPart(part)) {
      if (!covered.has(part.toolCallId)) segments.push({ kind: "tool", part })
    } else if (part.type === "reasoning" || isToolUIPart(part)) {
      const last = segments.at(-1)
      if (last?.kind === "activity") last.parts.push(part)
      else segments.push({ kind: "activity", parts: [part] })
    }
  }

  return (
    <div className="min-w-0 space-y-3 text-sm">
      {segments.map((segment, index) => {
        switch (segment.kind) {
          case "text":
            return (
              <Streamdown
                key={index}
                isAnimating={streaming}
                className="min-w-0 space-y-3 leading-relaxed break-words"
              >
                {segment.text}
              </Streamdown>
            )
          case "activity":
            return (
              <ActivityTrail
                key={index}
                parts={segment.parts}
                active={streaming && index === segments.length - 1}
              />
            )
          case "plan":
            return (
              <PlanCard
                key={segment.part.toolCallId}
                part={segment.part}
                assigned={assigned}
                rollbackError={rollbacks.get(segment.part.toolCallId)}
                onApproval={onApproval}
                disabled={busy}
              />
            )
          case "tool":
            return (
              <ToolStep
                key={segment.part.toolCallId}
                part={segment.part}
                onApproval={onApproval}
                disabled={busy}
              />
            )
        }
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

const isWritePart = (part: UIMessage["parts"][number]) =>
  isToolUIPart(part) &&
  part.state === "output-available" &&
  /^(save|delete)/.test(getToolName(part))

/** The model in the picker, read by the transport outside of renders. */
class SelectedModel {
  private choice: ModelChoice | null = null
  get() {
    return this.choice
  }
  set(choice: ModelChoice | null) {
    this.choice = choice
  }
}

/**
 * The API keeps the history: only the new (or approved) message is sent,
 * with the model picked when the request leaves.
 */
function createTransport(selectedModel: SelectedModel, locale: string) {
  return new DefaultChatTransport({
    api: "/api/ai/chat",
    prepareSendMessagesRequest: ({ id, messages, trigger }) => ({
      body: {
        ...selectedModel.get(),
        // The assistant answers in the language of the app
        locale,
        id,
        trigger,
        message: messages.at(-1),
      },
    }),
  })
}

export type AiChatProps = {
  // Saved conversation to continue; a new chat gets its id here
  id?: string
  initialMessages?: UIMessage[]
  initialModel?: ModelChoice
  conversations: AiConversation[]
}

export function AiChat({
  id: conversationId,
  initialMessages,
  initialModel,
  conversations: initialConversations,
}: AiChatProps) {
  const t = useI18n()
  const router = useRouter()
  const { currentLocaleUrl } = useCurrentLocaleUrl()
  // Created once on the client: a page refresh never starts another chat
  const [id] = useState(() => conversationId ?? generateId())
  const { aiProviders } = useApp()
  const { providers, choice, setChoice } = useModels(initialModel)
  const [conversations, setConversations] = useState(initialConversations)
  const [historyOpen, setHistoryOpen] = useState(false)
  const [input, setInput] = useState("")
  const endRef = useRef<HTMLDivElement>(null)
  // Read when a request is sent, including the automatic one after an approval
  const [selectedModel] = useState(() => new SelectedModel())
  useEffect(() => selectedModel.set(choice), [selectedModel, choice])
  const locale = useCurrentLocale()
  const [transport] = useState(() => createTransport(selectedModel, locale))
  const {
    messages,
    sendMessage,
    regenerate,
    stop,
    status,
    error,
    clearError,
    addToolApprovalResponse,
  } = useChat({
    id,
    messages: initialMessages,
    transport,
    // Continue once every proposed change was approved or declined
    sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithApprovalResponses,
    onFinish: async ({ message }) => {
      // The conversation now exists: give it its own URL without remounting
      const url = currentLocaleUrl(`/app/ai/${id}`)
      if (window.location.pathname !== url) {
        window.history.replaceState(null, "", url)
      }
      const result = await getAiConversations()
      if (result.success) setConversations(result.data ?? [])
      // Pages and lists show the records the assistant just changed
      if (message.parts.some(isWritePart)) router.refresh()
    },
  })

  const busy = status === "submitted" || status === "streaming"

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: "end" })
  }, [messages])

  if (aiProviders.length === 0) return <NoProvider />

  function send(text: string) {
    if (!choice || !text.trim() || busy) return
    sendMessage({ text: text.trim() })
    setInput("")
  }

  function onSubmit(event: FormEvent) {
    event.preventDefault()
    send(input)
  }

  async function onDelete(conversationId: string) {
    const result = await deleteAiConversation(conversationId)
    if (!result.success) return
    setConversations((previous) =>
      previous.filter((item) => item.id !== conversationId)
    )
    if (conversationId === id) router.push(currentLocaleUrl("/app/ai"))
  }

  const noModels =
    providers !== undefined && providers.every((item) => !item.models.length)

  const history = (
    <ConversationList
      conversations={conversations}
      activeId={id}
      onDelete={onDelete}
      onNavigate={() => setHistoryOpen(false)}
    />
  )

  return (
    <div className="flex flex-1">
      <aside className="sticky top-0 hidden h-svh w-64 shrink-0 flex-col border-r p-3 lg:flex">
        {history}
      </aside>

      <div className="mx-auto flex w-full max-w-3xl min-w-0 flex-1 flex-col px-3 sm:px-4">
        <div className="flex-1 space-y-6 py-4 sm:py-6">
          {messages.length === 0 ? (
            <div className="space-y-6 pt-[4vh] sm:pt-[10vh]">
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
                    <span className="line-clamp-3">{t(key)}</span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              >
                <Message
                  message={message}
                  streaming={
                    status === "streaming" && index === messages.length - 1
                  }
                  onApproval={addToolApprovalResponse}
                  busy={busy}
                />
              </motion.div>
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
                  regenerate()
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
          className="sticky bottom-0 space-y-2 bg-background pb-[max(1rem,env(safe-area-inset-bottom))]"
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
              className="max-h-48 min-h-0 resize-none border-0 bg-transparent text-base shadow-none focus-visible:ring-0 md:text-sm dark:bg-transparent"
            />
            <div className="flex min-w-0 items-center gap-1 sm:gap-2">
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
              <Sheet open={historyOpen} onOpenChange={setHistoryOpen}>
                <SheetTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="lg:hidden"
                  >
                    <History />
                    <span className="max-sm:sr-only">
                      {t("app.ai.history.title")}
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-[85vw] max-w-xs p-4">
                  <SheetHeader className="p-0">
                    <SheetTitle>{t("app.ai.history.title")}</SheetTitle>
                  </SheetHeader>
                  {history}
                </SheetContent>
              </Sheet>
              <div className="flex-1" />
              {busy ? (
                <Button
                  type="button"
                  size="icon"
                  className="shrink-0 rounded-full"
                  aria-label={t("app.ai.stop")}
                  onClick={() => stop()}
                >
                  <Square className="fill-current" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  className="shrink-0 rounded-full"
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
    </div>
  )
}
