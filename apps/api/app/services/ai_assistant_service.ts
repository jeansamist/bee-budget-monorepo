import Contact from '#models/contact'
import Expense from '#models/expense'
import ExpenseCategory from '#models/expense_category'
import Income from '#models/income'
import IncomeCategory from '#models/income_category'
import { type AiProviderName } from '#models/ai_provider'
import { AiConversationService } from '#services/ai_conversation_service'
import { AiProviderService } from '#services/ai_provider_service'
import { BudgetService } from '#services/budget_service'
import { REPORT_TYPES, ReportService } from '#services/report_service'
import { TransactionAnalyticsService } from '#services/transaction_analytics_service'
import { WalletAnalyticsService } from '#services/wallet_analytics_service'
import { WalletService } from '#services/wallet_service'
import {
  AiWriteToolsService,
  PLAN_TOOL_NAME,
  ROLLBACK_MARKER,
  WRITE_TOOL_NAMES,
  writeTargetOf,
  type PlanStep,
} from '#services/ai_write_tools_service'
import WalletType from '#models/wallet_type'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import {
  convertToModelMessages,
  createIdGenerator,
  createUIMessageStreamResponse,
  getToolName,
  isToolUIPart,
  isStepCount,
  streamText,
  toUIMessageStream,
  tool,
  TypeValidationError,
  validateUIMessages,
  type UIMessage,
} from 'ai'
import type { LucidModel, ModelQueryBuilderContract } from '@adonisjs/lucid/types/model'
import { DateTime } from 'luxon'
import { z } from 'zod'

const MAX_STEPS = 16

/**
 * "en" -> "English", falling back to English for an unknown locale.
 */
function languageName(locale: string) {
  try {
    return new Intl.DisplayNames(['en'], { type: 'language' }).of(locale) ?? 'English'
  } catch {
    return 'English'
  }
}

/**
 * The plan steps left once a change matching one of them ran.
 */
function consume(steps: PlanStep[], target: ReturnType<typeof writeTargetOf>) {
  if (!target) return steps
  const index = steps.findIndex(
    (step) => step.action === target.action && step.entity === target.entity
  )
  return index === -1 ? steps : steps.filter((_, stepIndex) => stepIndex !== index)
}

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the YYYY-MM-DD format')
const period = z.enum(['daily', 'weekly', 'monthly', 'yearly'])
const cell = z.union([z.string(), z.number(), z.null()])
const series = z.array(z.object({ label: z.string(), amount: z.number() }))

/**
 * Output schemas: every tool result is parsed with them, so the model (and the
 * chat UI) always get the same, documented shape.
 */
const walletsOutput = z.object({
  totalBalance: z.number(),
  wallets: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      type: z.string().nullable(),
      balance: z.number(),
      monthlyEvolutionPercent: z.number(),
    })
  ),
})

const walletTypesOutput = z.object({
  walletTypes: z.array(z.object({ id: z.number(), name: z.string() })),
})

const categoryItem = z.object({ id: z.number(), name: z.string(), isSystem: z.boolean() })
const categoriesOutput = z.object({
  incomeCategories: z.array(categoryItem),
  expenseCategories: z.array(categoryItem),
})

const contactsOutput = z.object({
  contacts: z.array(
    z.object({ id: z.number(), name: z.string(), type: z.string(), email: z.string().nullable() })
  ),
})

const budgetsOutput = z.object({
  budgets: z.array(
    z.object({
      id: z.number(),
      name: z.string(),
      targetType: z.string(),
      expenseCategoryId: z.number().nullable(),
      walletId: z.number().nullable(),
      period: z.string(),
      amount: z.number(),
      spent: z.number(),
      remaining: z.number(),
      progress: z.number(),
      status: z.enum(['ok', 'warning', 'exceeded']),
      periodStart: z.string().nullable(),
      periodEnd: z.string().nullable(),
    })
  ),
})

const transactionsOutput = z.object({
  count: z.number(),
  total: z.number(),
  truncated: z.boolean(),
  transactions: z.array(
    z.object({
      id: z.number(),
      kind: z.enum(['income', 'expense']),
      date: z.string().nullable(),
      name: z.string(),
      description: z.string().nullable(),
      amount: z.number(),
      fees: z.number(),
      category: z.string().nullable(),
      wallet: z.string().nullable(),
      contact: z.string().nullable(),
      isInternalTransfer: z.boolean(),
    })
  ),
})

const reportOutput = z.object({
  type: z.enum(REPORT_TYPES),
  from: z.string(),
  to: z.string(),
  columns: z.array(z.object({ key: z.string(), kind: z.string() })),
  rows: z.array(z.record(z.string(), cell)),
  totals: z.record(z.string(), z.number()),
  truncated: z.boolean(),
})

const trendOutput = z.object({
  period,
  incomes: z.object({ total: z.number(), data: series }),
  expenses: z.object({ total: z.number(), data: series }),
  fees: z.object({ total: z.number(), data: series }),
})

const categoryStat = z.object({
  id: z.number(),
  name: z.string(),
  total: z.number(),
  count: z.number(),
})
const walletAnalyticsOutput = z.object({
  wallet: z.object({ id: z.number(), name: z.string(), balance: z.number() }),
  period,
  chartData: z.array(z.object({ label: z.string(), incomes: z.number(), expenses: z.number() })),
  incomeCategoryBreakdown: z.array(categoryStat),
  expenseCategoryBreakdown: z.array(categoryStat),
})

// Keeps tool results small enough for the model's context
const MAX_ROWS = 200

export type AiChatPayload = {
  // Conversation id, created by the chat UI for a new chat
  id: string
  // Locale of the app (e.g. "en"): the assistant writes in its language
  locale?: string
  provider: AiProviderName
  model: string
  trigger: 'submit-message' | 'regenerate-message'
  // The last message of the chat (new, retried or approved): the rest of the
  // history is loaded from the database
  message?: unknown
}

@inject()
export class AiAssistantService {
  constructor(
    private readonly ctx: HttpContext,
    private readonly aiProviderService: AiProviderService,
    private readonly aiConversationService: AiConversationService,
    private readonly walletService: WalletService,
    private readonly budgetService: BudgetService,
    private readonly reportService: ReportService,
    private readonly transactionAnalyticsService: TransactionAnalyticsService,
    private readonly walletAnalyticsService: WalletAnalyticsService,
    private readonly aiWriteToolsService: AiWriteToolsService
  ) {}

  private get user() {
    return this.ctx.auth.user!
  }

  /**
   * Tools over the user's own data: reads run freely, changes wait for the
   * user's approval. They go through the same services as the API, so
   * ownership checks apply.
   */
  private buildTools() {
    return { ...this.buildReadTools(), ...this.aiWriteToolsService.buildTools() }
  }

  private buildReadTools() {
    const userId = this.user.id

    return {
      getWalletTypes: tool({
        description: 'List the wallet types (e.g. Mobile Money, Bank), with their ids.',
        inputSchema: z.object({}),
        outputSchema: walletTypesOutput,
        execute: async () => {
          const walletTypes = await WalletType.query().where('user_id', userId).orderBy('name')
          return walletTypesOutput.parse({
            walletTypes: walletTypes.map(({ id, name }) => ({ id, name })),
          })
        },
      }),

      getWallets: tool({
        description:
          'List the user wallets (cash, bank accounts, mobile money...) with their current balance and the evolution versus last month.',
        inputSchema: z.object({}),
        outputSchema: walletsOutput,
        execute: async () => {
          const wallets = await this.walletService.getAllUserWallets()
          return walletsOutput.parse({
            totalBalance: wallets.reduce((total, wallet) => total + wallet.amount, 0),
            wallets: wallets.map((wallet) => ({
              id: wallet.id,
              name: wallet.name,
              type: wallet.walletType?.name ?? null,
              balance: wallet.amount,
              monthlyEvolutionPercent: wallet.evolution,
            })),
          })
        },
      }),

      getCategories: tool({
        description:
          'List the income and expense categories, with their ids to filter transactions.',
        inputSchema: z.object({}),
        outputSchema: categoriesOutput,
        execute: async () => {
          const [incomeCategories, expenseCategories] = await Promise.all([
            IncomeCategory.query().where('user_id', userId).orderBy('name'),
            ExpenseCategory.query().where('user_id', userId).orderBy('name'),
          ])
          const pick = ({ id, name, isSystem }: IncomeCategory | ExpenseCategory) => ({
            id,
            name,
            isSystem: Boolean(isSystem),
          })
          return categoriesOutput.parse({
            incomeCategories: incomeCategories.map(pick),
            expenseCategories: expenseCategories.map(pick),
          })
        },
      }),

      getContacts: tool({
        description:
          'List the contacts (people or companies) the user receives money from or pays.',
        inputSchema: z.object({}),
        outputSchema: contactsOutput,
        execute: async () => {
          const contacts = await Contact.query().where('user_id', userId).orderBy('name')
          return contactsOutput.parse({
            contacts: contacts.map(({ id, name, type, email }) => ({ id, name, type, email })),
          })
        },
      }),

      getBudgets: tool({
        description:
          'List the budgets with the amount spent in their current period, what remains and their status (ok, warning, exceeded).',
        inputSchema: z.object({}),
        outputSchema: budgetsOutput,
        execute: async () => {
          const paginator = await this.budgetService.getPaginatedUserBudgets(1, MAX_ROWS)
          return budgetsOutput.parse({
            budgets: paginator.all().map((budget) => ({
              id: budget.id,
              name: budget.name,
              targetType: budget.targetType,
              expenseCategoryId: budget.expenseCategoryId,
              walletId: budget.walletId,
              period: budget.period,
              amount: budget.amount,
              spent: budget.spent,
              remaining: budget.remaining,
              progress: budget.progress,
              status: budget.status,
              periodStart: budget.periodStart,
              periodEnd: budget.periodEnd,
            })),
          })
        },
      }),

      searchTransactions: tool({
        description:
          'Search the user incomes and expenses, newest first. Amounts are positive; expenses may have fees. Internal transfers between wallets are excluded unless asked.',
        inputSchema: z.object({
          kind: z.enum(['income', 'expense', 'all']).default('all'),
          from: isoDate.optional().describe('First day included'),
          to: isoDate.optional().describe('Last day included'),
          walletId: z.number().int().optional(),
          categoryId: z
            .number()
            .int()
            .optional()
            .describe('Income or expense category id, matching the kind'),
          contactId: z.number().int().optional(),
          search: z.string().optional().describe('Text matched against the name and description'),
          minAmount: z.number().optional(),
          maxAmount: z.number().optional(),
          includeInternalTransfers: z.boolean().default(false),
          limit: z.number().int().min(1).max(MAX_ROWS).default(50),
        }),
        outputSchema: transactionsOutput,
        execute: async (input) => {
          const applyFilters = <Q extends ModelQueryBuilderContract<LucidModel>>(
            query: Q,
            categoryColumn: string,
            contactColumn: string
          ) =>
            query
              .where('user_id', userId)
              .if(!input.includeInternalTransfers, (q) => q.whereNull('internal_transfer_id'))
              .if(input.from, (q) => q.where('date', '>=', input.from!))
              .if(input.to, (q) => q.where('date', '<=', input.to!))
              .if(input.walletId, (q) => q.where('wallet_id', input.walletId!))
              .if(input.categoryId, (q) => q.where(categoryColumn, input.categoryId!))
              .if(input.contactId, (q) => q.where(contactColumn, input.contactId!))
              .if(input.minAmount !== undefined, (q) => q.where('amount', '>=', input.minAmount!))
              .if(input.maxAmount !== undefined, (q) => q.where('amount', '<=', input.maxAmount!))
              .if(input.search, (q) =>
                q.where((sub) =>
                  sub
                    .whereILike('name', `%${input.search}%`)
                    .orWhereILike('description', `%${input.search}%`)
                )
              )
              .orderBy('date', 'desc')
              .limit(input.limit + 1)

          const [incomes, expenses] = await Promise.all([
            input.kind === 'expense'
              ? []
              : applyFilters(
                  Income.query().preload('incomeCategory').preload('wallet').preload('fromContact'),
                  'income_category_id',
                  'from_contact_id'
                ),
            input.kind === 'income'
              ? []
              : applyFilters(
                  Expense.query().preload('expenseCategory').preload('wallet').preload('toContact'),
                  'expense_category_id',
                  'to_contact_id'
                ),
          ])

          const rows = [
            ...incomes.map((income) => ({
              id: income.id,
              kind: 'income' as const,
              date: income.date?.toISODate() ?? null,
              name: income.name,
              description: income.description,
              amount: income.amount,
              fees: 0,
              category: income.incomeCategory?.name ?? null,
              wallet: income.wallet?.name ?? null,
              contact: income.fromContact?.name ?? null,
              isInternalTransfer: income.internalTransferId !== null,
            })),
            ...expenses.map((expense) => ({
              id: expense.id,
              kind: 'expense' as const,
              date: expense.date?.toISODate() ?? null,
              name: expense.name,
              description: expense.description,
              amount: expense.amount,
              fees: expense.fees ?? 0,
              category: expense.expenseCategory?.name ?? null,
              wallet: expense.wallet?.name ?? null,
              contact: expense.toContact?.name ?? null,
              isInternalTransfer: expense.internalTransferId !== null,
            })),
          ].sort((a, b) => (b.date ?? '').localeCompare(a.date ?? ''))

          const transactions = rows.slice(0, input.limit)
          return transactionsOutput.parse({
            count: transactions.length,
            total: transactions.reduce(
              (total, row) =>
                total + (row.kind === 'income' ? row.amount : -(row.amount + row.fees)),
              0
            ),
            truncated: rows.length > input.limit,
            transactions,
          })
        },
      }),

      getReport: tool({
        description: [
          'Build a report over a date range (defaults to the current month):',
          'transactions (every income and expense), cash_flow (incomes vs expenses per day/month),',
          'expenses_by_category, incomes_by_category, wallets (balance movements per wallet),',
          'contacts (received vs paid per contact), budgets (spent vs budgeted).',
        ].join(' '),
        inputSchema: z.object({
          type: z.enum(REPORT_TYPES),
          from: isoDate.optional(),
          to: isoDate.optional(),
          walletIds: z.array(z.number().int()).optional().describe('Restrict to these wallets'),
        }),
        outputSchema: reportOutput,
        execute: async (input) => {
          const report = await this.reportService.generate(input)
          return reportOutput.parse({
            type: report.type,
            from: report.from,
            to: report.to,
            columns: report.columns,
            rows: report.rows.slice(0, MAX_ROWS),
            totals: report.totals,
            truncated: report.rows.length > MAX_ROWS,
          })
        },
      }),

      getIncomeExpenseTrend: tool({
        description:
          'Incomes, expenses and fees over the last periods (7 days, 8 weeks, 6 months or 5 years), oldest first. Internal transfers are excluded.',
        inputSchema: z.object({ period: period.default('monthly') }),
        outputSchema: trendOutput,
        execute: async ({ period: selected }) =>
          trendOutput.parse(
            await this.transactionAnalyticsService.getTransactionAnalytics(selected)
          ),
      }),

      getWalletAnalytics: tool({
        description:
          'Incomes and expenses of one wallet over the last periods, with its breakdown by category.',
        inputSchema: z.object({ walletId: z.number().int(), period: period.default('monthly') }),
        outputSchema: walletAnalyticsOutput,
        execute: async ({ walletId, period: selected }) => {
          const wallet = await this.walletService.getWalletById(walletId)
          const analytics = await this.walletAnalyticsService.getWalletAnalytics(
            wallet.id,
            selected
          )
          return walletAnalyticsOutput.parse({
            wallet: { id: wallet.id, name: wallet.name, balance: wallet.amount },
            ...analytics,
          })
        },
      }),
    }
  }

  private buildInstructions(locale = 'en') {
    const now = DateTime.now()
    const language = languageName(locale)
    return [
      'You are the BeeBudget assistant, a personal finance agent inside the BeeBudget app.',
      `You are talking with ${this.user.firstName} ${this.user.lastName}. Today is ${now.toISODate()} (${now.toFormat('cccc')}).`,
      `Always write in ${language}, the language of the app: answers, questions, plan titles and step labels. Do this even when the user pastes a message (an SMS, a receipt) in another language; only keep names and references from it as they are.`,
      'Answer questions about their money using the tools: they read the user data live. Never invent figures; if a tool returns nothing, say so.',
      'Amounts are whole numbers in the user currency (wallets do not store a currency, so do not name one unless the user does).',
      'Internal transfers move money between wallets: they are neither income nor spending.',
      'Be concise and concrete: lead with the answer, then the few figures that support it. Use Markdown tables for comparisons and short lists for advice.',
      '',
      'Changing data (save* and deleteRecord tools) works like this:',
      '1. Break the task down and look up what exists with the read tools (getWallets, getCategories, getContacts, getWalletTypes...). Reuse a matching record instead of creating a duplicate. Never guess an id.',
      '2. Check that every record you will create has what it needs: an income needs an income category and a wallet, an expense needs an expense category and a wallet, a wallet needs a wallet type. When one is missing, add a step that creates it before the step that uses it, or pick the closest existing one.',
      '3. Call proposePlan once with every step in order, including the existing records you use. Ask the user first only when something essential is truly unknown (e.g. the amount, or which of two wallets).',
      '4. Once the plan is approved, run its steps in order, passing the ids returned by earlier steps to the next ones.',
      '5. A workflow is all or nothing: if a step fails, every change it already made is undone automatically (the error says what was rolled back). Stop calling write tools, tell the user what failed in one sentence, and, when you can fix it (e.g. a missing category), call proposePlan again with the whole corrected plan.',
      '6. If the plan or a change is declined, do not retry it; ask what the user wants instead.',
      'When the user pastes a message (e.g. a Mobile Money SMS or a receipt), extract the amount, fees, date, counterpart, the wallet it concerns and whether money came in or went out, then follow these steps.',
      'Always end your turn with a short message to the user: what was done, what failed, or the question you need answered.',
    ].join('\n')
  }

  /**
   * Stored history with the new message appended (or, to regenerate, without
   * the last answer). History that no longer matches the tools is dropped
   * rather than blocking the conversation.
   */
  private async buildHistory(
    { id, trigger, message }: AiChatPayload,
    tools: ReturnType<AiAssistantService['buildTools']>
  ) {
    const conversation = await this.aiConversationService.findForChat(id)
    let history = conversation?.uiMessages ?? []

    if (trigger === 'regenerate-message') {
      while (history.at(-1)?.role === 'assistant') history = history.slice(0, -1)
    }
    if (message) {
      const incoming = message as UIMessage
      // A message sent again (retry, or after an approval) replaces the stored one
      history = [...history.filter((item) => item.id !== incoming.id), incoming]
    }

    try {
      return await validateUIMessages({ messages: history, tools })
    } catch (error) {
      if (!(error instanceof TypeValidationError) || !message) throw error
      return validateUIMessages({ messages: [message], tools })
    }
  }

  async chat(payload: AiChatPayload) {
    const { id, provider, model: modelId } = payload
    const model = await this.aiProviderService.getLanguageModel(provider, modelId)
    const tools = this.buildTools()
    const uiMessages = await this.buildHistory(payload, tools)

    const result = streamText({
      model,
      instructions: this.buildInstructions(payload.locale),
      messages: await convertToModelMessages(uiMessages, { tools }),
      tools,
      toolApproval: this.approvalPolicy(uiMessages),
      // One change at a time, in order: a failure can undo exactly what ran before
      toolCallConcurrency: 1,
      stopWhen: isStepCount(MAX_STEPS),
      abortSignal: this.abortSignal(),
    })

    return createUIMessageStreamResponse({
      stream: toUIMessageStream({
        stream: result.stream,
        originalMessages: uiMessages,
        // Stable ids, since the messages are stored
        generateMessageId: createIdGenerator({ prefix: 'msg', size: 16 }),
        // Provider errors (bad model, quota, revoked key) are safe to show to the key owner
        onError: (error) => (error instanceof Error ? error.message : 'Something went wrong'),
        // Also runs when the user stops the answer, which keeps what was written so far
        onEnd: async ({ messages }) => {
          await this.aiConversationService.saveConversation(id, {
            provider,
            model: modelId,
            messages,
          })
        },
      }),
    })
  }

  /**
   * Changes the user approved through a plan run on their own; any other
   * change, and every plan, waits for the user. A plan only covers its own
   * steps: each matching change uses one of them up.
   */
  private approvalPolicy(messages: UIMessage[]) {
    const lastUserIndex = messages.findLastIndex((message) => message.role === 'user')
    const parts = messages.slice(lastUserIndex + 1).flatMap((message) => message.parts)

    let remaining: PlanStep[] = []
    for (const part of parts) {
      if (!isToolUIPart(part)) continue
      const name = getToolName(part)
      if (name === PLAN_TOOL_NAME && part.approval?.approved) {
        remaining = [...((part.input as { steps?: PlanStep[] })?.steps ?? [])]
      } else if (WRITE_TOOL_NAMES.has(name) && part.state === 'output-available') {
        remaining = consume(remaining, writeTargetOf(name, part.input))
      } else if (part.state === 'output-error' && part.errorText.startsWith(ROLLBACK_MARKER)) {
        // A rolled back plan approves nothing anymore: the fix needs a new plan
        remaining = []
      }
    }

    return ({ toolCall }: { toolCall: { toolName: string; input: unknown } }) => {
      if (toolCall.toolName === PLAN_TOOL_NAME) return 'user-approval' as const
      if (!WRITE_TOOL_NAMES.has(toolCall.toolName)) return undefined
      const target = writeTargetOf(toolCall.toolName, toolCall.input)
      const next = consume(remaining, target)
      if (next.length === remaining.length) return 'user-approval' as const
      remaining = next
      return 'approved' as const
    }
  }

  /**
   * Stops generating (and spending the user's tokens) when they close the chat
   * or press stop.
   */
  private abortSignal() {
    const controller = new AbortController()
    this.ctx.response.response.on('close', () => controller.abort())
    return controller.signal
  }
}
