"use client"

import { writeTarget, type ApprovalResponse } from "@/components/ai/tool-step"
import { useI18n } from "@/lib/i18n/client"
import { cn } from "@bee-budget/functions"
import { Button } from "@bee-budget/ui/button"
import { getToolName, isToolUIPart, type UIMessage } from "ai"
import {
  Brain,
  Check,
  ChevronDown,
  ListChecks,
  LoaderCircle,
  Pencil,
  Plus,
  Search,
  Trash2,
  TriangleAlert,
  X,
  type LucideIcon,
} from "lucide-react"
import { AnimatePresence, motion } from "motion/react"
import { useState } from "react"

type Part = UIMessage["parts"][number]
type ToolPart = Extract<Part, { toolCallId: string }>

const ease = [0.22, 1, 0.36, 1] as const

export const PLAN_TOOL = "proposePlan"

type PlanStep = {
  action: "use" | "create" | "update" | "delete"
  entity: string
  label: string
}

type StepStatus = "pending" | "running" | "done" | "error" | "declined"

const ACTION_STYLES: Record<
  PlanStep["action"],
  { icon: LucideIcon; className: string }
> = {
  use: { icon: Search, className: "bg-muted text-muted-foreground" },
  create: {
    icon: Plus,
    className: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400",
  },
  update: {
    icon: Pencil,
    className: "bg-amber-500/15 text-amber-600 dark:text-amber-400",
  },
  delete: { icon: Trash2, className: "bg-destructive/15 text-destructive" },
}

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

export const isPlanPart = (part: Part): part is ToolPart =>
  isToolUIPart(part) && getToolName(part) === PLAN_TOOL

export const isWriteToolPart = (part: Part): part is ToolPart =>
  isToolUIPart(part) &&
  writeTarget(getToolName(part), part.input as never) !== null

/**
 * Pairs each create/update/delete step of a plan with the tool call that ran
 * it (same record type and action, in order). Returns the pairs and the calls
 * the plan doesn't cover, which keep their own approval card.
 */
export function matchPlan(parts: Part[]) {
  const assigned = new Map<number, ToolPart>()
  const covered = new Set<string>()
  parts.forEach((part, index) => {
    if (!isPlanPart(part) || !part.approval?.approved) return
    const steps = ((part.input as { steps?: PlanStep[] })?.steps ??
      []) as PlanStep[]
    const writes = parts
      .slice(index + 1)
      .filter(isWriteToolPart)
      .filter((write) => !covered.has(write.toolCallId))
    steps.forEach((step, stepIndex) => {
      if (step.action === "use") return
      const match = writes.find((write) => {
        const target = writeTarget(getToolName(write), write.input as never)
        return (
          !covered.has(write.toolCallId) &&
          target?.entity === step.entity &&
          target.action === step.action
        )
      })
      if (!match) return
      covered.add(match.toolCallId)
      assigned.set(stepIndex, match)
    })
  })
  return { assigned, covered }
}

function stepStatus(
  step: PlanStep,
  approved: boolean,
  call: ToolPart | undefined
): StepStatus {
  if (!approved) return "pending"
  if (step.action === "use") return "done"
  if (!call) return "pending"
  switch (call.state) {
    case "output-available":
      return "done"
    case "output-error":
      return "error"
    case "output-denied":
      return "declined"
    default:
      return "running"
  }
}

function StatusIcon({ status }: { status: StepStatus }) {
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span
        key={status}
        initial={{ scale: 0.4, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.4, opacity: 0 }}
        transition={{ duration: 0.2, ease }}
        className="flex size-5 shrink-0 items-center justify-center"
      >
        {status === "done" && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-primary-foreground">
            <Check className="size-3" strokeWidth={3} />
          </span>
        )}
        {status === "running" && (
          <LoaderCircle className="size-4 animate-spin text-primary" />
        )}
        {status === "pending" && (
          <span className="size-2 rounded-full bg-muted-foreground/40" />
        )}
        {status === "error" && (
          <TriangleAlert className="size-4 text-destructive" />
        )}
        {status === "declined" && (
          <X className="size-4 text-muted-foreground" />
        )}
      </motion.span>
    </AnimatePresence>
  )
}

export function PlanCard({
  part,
  assigned,
  onApproval,
  disabled,
}: {
  part: ToolPart
  assigned: Map<number, ToolPart>
  onApproval: (response: ApprovalResponse) => void
  disabled?: boolean
}) {
  const t = useI18n()
  const input = (part.input ?? {}) as { title?: string; steps?: PlanStep[] }
  const steps = input.steps ?? []
  const awaiting = part.state === "approval-requested"
  const declined =
    part.state === "output-denied" ||
    (part.state === "approval-responded" && !part.approval.approved)
  const approved = !!part.approval?.approved
  const statuses = steps.map((step, index) =>
    stepStatus(step, approved, assigned.get(index))
  )
  const writeSteps = steps.filter((step) => step.action !== "use").length
  const doneWrites = steps.filter(
    (step, index) => step.action !== "use" && statuses[index] === "done"
  ).length
  const finished = approved && doneWrites === writeSteps
  const failed = statuses.includes("error")
  const progress = writeSteps ? doneWrites / writeSteps : 1

  const badge = declined
    ? t("app.ai.plan.status.declined")
    : awaiting
      ? t("app.ai.plan.status.awaiting")
      : failed
        ? t("app.ai.plan.status.failed")
        : finished
          ? t("app.ai.plan.status.done")
          : approved
            ? t("app.ai.plan.status.running")
            : t("app.ai.plan.status.drafting")

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8, scale: 0.98 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.35, ease }}
      className={cn(
        "overflow-hidden rounded-2xl border bg-card",
        awaiting && "border-primary/60 shadow-[0_0_0_4px] shadow-primary/10",
        declined && "opacity-70"
      )}
    >
      <div className="flex items-start gap-3 p-4 pb-3">
        <span className="flex size-8 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
          <ListChecks className="size-4" />
        </span>
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">
            {t("app.ai.plan.label")}
          </p>
          <p className="font-medium">{input.title}</p>
        </div>
        <span
          className={cn(
            "shrink-0 rounded-full px-2 py-0.5 text-xs",
            awaiting && "animate-pulse bg-primary/15 text-primary",
            finished && !failed && "bg-primary text-primary-foreground",
            failed && "bg-destructive/15 text-destructive",
            !awaiting &&
              !finished &&
              !failed &&
              "bg-muted text-muted-foreground"
          )}
        >
          {badge}
        </span>
      </div>

      {approved && writeSteps > 0 && (
        <div className="mx-4 h-1 overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress * 100}%` }}
            transition={{ duration: 0.5, ease }}
          />
        </div>
      )}

      <ol className="space-y-1 p-2">
        {steps.map((step, index) => {
          const style = ACTION_STYLES[step.action] ?? ACTION_STYLES.use
          const Icon = style.icon
          const status = statuses[index]
          const call = assigned.get(index)
          return (
            <motion.li
              key={index}
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.06, duration: 0.3, ease }}
              className={cn(
                "flex items-center gap-3 rounded-xl px-2 py-1.5",
                status === "running" && "bg-primary/5"
              )}
            >
              <span
                className={cn(
                  "flex size-7 shrink-0 items-center justify-center rounded-lg",
                  style.className
                )}
              >
                <Icon className="size-3.5" />
              </span>
              <div className="min-w-0 flex-1">
                <p
                  className={cn(
                    "text-sm",
                    status === "declined" && "line-through"
                  )}
                >
                  {step.label}
                </p>
                {call?.state === "output-error" && (
                  <p className="text-xs text-destructive">{call.errorText}</p>
                )}
              </div>
              <StatusIcon status={status} />
            </motion.li>
          )
        })}
      </ol>

      <AnimatePresence initial={false}>
        {awaiting && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease }}
            className="border-t"
          >
            <div className="flex flex-wrap items-center gap-2 p-3">
              <p className="min-w-0 flex-1 text-xs text-muted-foreground">
                {t("app.ai.plan.approveHint")}
              </p>
              <Button
                size="sm"
                variant="outline"
                disabled={disabled}
                onClick={() =>
                  onApproval({ id: part.approval.id, approved: false })
                }
              >
                <X />
                {t("app.ai.approval.decline")}
              </Button>
              <Button
                size="sm"
                disabled={disabled}
                onClick={() =>
                  onApproval({ id: part.approval.id, approved: true })
                }
              >
                <Check />
                {t("app.ai.plan.approve")}
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

/**
 * What the assistant did before answering: its reasoning and the data it
 * looked up, as a timeline that stays open while it works.
 */
export function ActivityTrail({
  parts,
  active,
}: {
  parts: Part[]
  active: boolean
}) {
  const t = useI18n()
  const [open, setOpen] = useState<boolean>()
  const expanded = open ?? active
  const lookups = parts.filter(isToolUIPart).length

  return (
    <div className="text-xs">
      <button
        type="button"
        onClick={() => setOpen(!expanded)}
        className="flex items-center gap-2 text-muted-foreground transition-colors hover:text-foreground"
      >
        {active ? (
          <span className="relative flex size-2">
            <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary opacity-75" />
            <span className="relative inline-flex size-2 rounded-full bg-primary" />
          </span>
        ) : (
          <Check className="size-3.5" />
        )}
        {active
          ? t("app.ai.activity.working")
          : t("app.ai.activity.done", { count: lookups })}
        <ChevronDown
          className={cn(
            "size-3.5 transition-transform",
            expanded && "rotate-180"
          )}
        />
      </button>
      <AnimatePresence initial={false}>
        {expanded && (
          <motion.ol
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease }}
            className="mt-2 ml-1 space-y-2 overflow-hidden border-l pl-4"
          >
            {parts.map((part, index) => (
              <motion.li
                key={isToolUIPart(part) ? part.toolCallId : index}
                initial={{ opacity: 0, x: -6 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.25, ease }}
                className="relative text-muted-foreground"
              >
                <span className="absolute top-1.5 -left-[1.31rem] size-1.5 rounded-full bg-border" />
                {part.type === "reasoning" ? (
                  <p className="flex gap-2 italic">
                    <Brain className="mt-0.5 size-3.5 shrink-0" />
                    <span className="line-clamp-4 whitespace-pre-wrap">
                      {part.text}
                    </span>
                  </p>
                ) : isToolUIPart(part) ? (
                  <p className="flex items-center gap-2">
                    {part.state === "output-available" ? (
                      <Search className="size-3.5" />
                    ) : part.state === "output-error" ? (
                      <TriangleAlert className="size-3.5 text-destructive" />
                    ) : (
                      <LoaderCircle className="size-3.5 animate-spin" />
                    )}
                    {t(
                      READ_TOOL_LABELS[
                        getToolName(part) as keyof typeof READ_TOOL_LABELS
                      ] ?? "app.ai.tools.unknown"
                    )}
                  </p>
                ) : null}
              </motion.li>
            ))}
          </motion.ol>
        )}
      </AnimatePresence>
    </div>
  )
}
