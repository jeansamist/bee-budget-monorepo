"use client"

import { useApp } from "@/contexts/app.context"
import { displayName, formatAmount } from "@/lib/format"
import { useI18n } from "@/lib/i18n/client"
import { Button } from "@bee-budget/ui/button"
import { getToolName, isToolUIPart, type UIMessage } from "ai"
import { Check, LoaderCircle, TriangleAlert, X } from "lucide-react"

const READ_TOOL_LABELS = {
  getWallets: "app.ai.tools.getWallets",
  getWalletTypes: "app.ai.tools.getWalletTypes",
  getCategories: "app.ai.tools.getCategories",
  getContacts: "app.ai.tools.getContacts",
  getBudgets: "app.ai.tools.getBudgets",
  searchTransactions: "app.ai.tools.searchTransactions",
  getReport: "app.ai.tools.getReport",
  getIncomeExpenseTrend: "app.ai.tools.getIncomeExpenseTrend",
  getWalletAnalytics: "app.ai.tools.getWalletAnalytics",
} as const

type Entity =
  | "expense"
  | "income"
  | "internal_transfer"
  | "budget"
  | "wallet"
  | "wallet_type"
  | "contact"
  | "expense_category"
  | "income_category"

const SAVE_TOOL_ENTITIES: Record<string, Entity> = {
  saveExpense: "expense",
  saveIncome: "income",
  saveInternalTransfer: "internal_transfer",
  saveBudget: "budget",
  saveWallet: "wallet",
  saveWalletType: "wallet_type",
  saveContact: "contact",
}

type ToolInput = Record<string, unknown> & {
  id?: number
  kind?: "income" | "expense"
  entity?: Entity
  summary?: string
}

type WriteOutput = {
  action: "created" | "updated" | "deleted"
  entity: Entity
  id: number
  name: string | null
}

export type ApprovalResponse = { id: string; approved: boolean }

/** Which record a write tool touches, or null for a read tool. */
export function writeTarget(toolName: string, input: ToolInput | undefined) {
  if (toolName === "deleteRecord") {
    return input?.entity ? { entity: input.entity, action: "delete" } : null
  }
  if (toolName === "saveCategory") {
    return {
      entity: (input?.kind === "income"
        ? "income_category"
        : "expense_category") as Entity,
      action: input?.id ? "update" : "create",
    }
  }
  const entity = SAVE_TOOL_ENTITIES[toolName]
  if (!entity) return null
  return { entity, action: input?.id ? "update" : "create" }
}

const AMOUNT_FIELDS = new Set(["amount", "fees", "fee"])
const HIDDEN_FIELDS = new Set(["id", "kind", "entity", "summary"])

/** The proposed values, with ids shown as the names the user knows. */
function useFieldValues(input: ToolInput) {
  const t = useI18n()
  const {
    wallets,
    walletTypes,
    contacts,
    incomeCategories,
    expenseCategories,
  } = useApp()
  const nameOf = (items: { id: number; name: string }[], id: unknown): string =>
    displayName(items.find((item) => item.id === id)?.name) || `#${id}`
  const resolvers: Record<string, (value: unknown) => string> = {
    walletId: (id) => nameOf(wallets, id),
    sourceWalletId: (id) => nameOf(wallets, id),
    targetWalletId: (id) => nameOf(wallets, id),
    walletTypeId: (id) => nameOf(walletTypes, id),
    defaultWalletTypeId: (id) => nameOf(walletTypes, id),
    toContactId: (id) => nameOf(contacts, id),
    fromContactId: (id) => nameOf(contacts, id),
    defaultContactId: (id) => nameOf(contacts, id),
    incomeCategoryId: (id) => nameOf(incomeCategories, id),
    expenseCategoryId: (id) => nameOf(expenseCategories, id),
  }

  return Object.entries(input)
    .filter(
      ([key, value]) =>
        !HIDDEN_FIELDS.has(key) && value !== undefined && value !== null
    )
    .map(([key, value]) => ({
      key,
      label: t(`app.ai.fields.${key}` as "app.ai.fields.name") || key,
      value: resolvers[key]
        ? resolvers[key](value)
        : AMOUNT_FIELDS.has(key) && typeof value === "number"
          ? formatAmount(value)
          : String(value),
    }))
}

function ApprovalCard({
  title,
  input,
  onRespond,
  disabled,
}: {
  title: string
  input: ToolInput
  onRespond: (approved: boolean) => void
  disabled?: boolean
}) {
  const t = useI18n()
  const fields = useFieldValues(input)
  return (
    <div className="space-y-3 rounded-2xl border p-4">
      <p className="font-medium">{title}</p>
      {input.summary && (
        <p className="text-muted-foreground">{input.summary}</p>
      )}
      {fields.length > 0 && (
        <dl className="grid grid-cols-[auto_minmax(0,1fr)] gap-x-4 gap-y-1">
          {fields.map((field) => (
            <div key={field.key} className="contents">
              <dt className="text-muted-foreground">{field.label}</dt>
              <dd className="break-words">{field.value}</dd>
            </div>
          ))}
        </dl>
      )}
      <div className="flex gap-2">
        <Button size="sm" disabled={disabled} onClick={() => onRespond(true)}>
          <Check />
          {t("app.ai.approval.approve")}
        </Button>
        <Button
          size="sm"
          variant="outline"
          disabled={disabled}
          onClick={() => onRespond(false)}
        >
          <X />
          {t("app.ai.approval.decline")}
        </Button>
      </div>
    </div>
  )
}

export function ToolStep({
  part,
  onApproval,
  disabled,
}: {
  part: UIMessage["parts"][number]
  onApproval: (response: ApprovalResponse) => void
  disabled?: boolean
}) {
  const t = useI18n()
  if (!isToolUIPart(part)) return null
  const name = getToolName(part)
  const input = (part.input ?? {}) as ToolInput
  const target = writeTarget(name, input)

  if (!target) {
    const label = READ_TOOL_LABELS[name as keyof typeof READ_TOOL_LABELS]
    return (
      <p className="flex items-center gap-2 text-xs text-muted-foreground">
        {part.state === "output-available" ? (
          <Check className="size-3.5" />
        ) : part.state === "output-error" ? (
          <TriangleAlert className="size-3.5 text-destructive" />
        ) : (
          <LoaderCircle className="size-3.5 animate-spin" />
        )}
        {label ? t(label) : name}
      </p>
    )
  }

  const entity = t(`app.ai.entities.${target.entity}`)
  const title = t(
    `app.ai.approval.${target.action}` as "app.ai.approval.create",
    {
      entity,
    }
  )

  switch (part.state) {
    case "input-streaming":
    case "input-available":
      return (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <LoaderCircle className="size-3.5 animate-spin" />
          {title}
        </p>
      )
    case "approval-requested":
      return (
        <ApprovalCard
          title={title}
          input={input}
          disabled={disabled || part.approval.isAutomatic}
          onRespond={(approved) =>
            onApproval({ id: part.approval.id, approved })
          }
        />
      )
    case "approval-responded":
      return (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <LoaderCircle className="size-3.5 animate-spin" />
          {part.approval.approved
            ? t("app.ai.approval.running", { title })
            : t("app.ai.approval.declined", { title })}
        </p>
      )
    case "output-available": {
      const output = part.output as WriteOutput
      return (
        <p className="flex items-center gap-2 rounded-xl bg-muted/60 px-3 py-2 text-xs">
          <Check className="size-3.5 text-primary" />
          {t(`app.ai.approval.done.${output.action}`, {
            entity,
            name: output.name ? displayName(output.name) : `#${output.id}`,
          })}
        </p>
      )
    }
    case "output-denied":
      return (
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <X className="size-3.5" />
          {t("app.ai.approval.declined", { title })}
        </p>
      )
    case "output-error":
      return (
        <p className="flex items-start gap-2 text-xs text-destructive">
          <TriangleAlert className="mt-0.5 size-3.5 shrink-0" />
          {title} · {part.errorText}
        </p>
      )
  }
}
