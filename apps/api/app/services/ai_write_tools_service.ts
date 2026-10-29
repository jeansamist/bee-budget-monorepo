import { BudgetService } from '#services/budget_service'
import { ContactService } from '#services/contact_service'
import { ExpenseCategoryService } from '#services/expense_category_service'
import { ExpenseService } from '#services/expense_service'
import { IncomeCategoryService } from '#services/income_category_service'
import { IncomeService } from '#services/income_service'
import { InternalTransferService } from '#services/internal_transfer_service'
import { WalletService } from '#services/wallet_service'
import { WalletTypeService } from '#services/wallet_type_service'
import { createBudgetValidator, updateBudgetValidator } from '#validators/budget'
import { createContactValidator, updateContactValidator } from '#validators/contact'
import { createExpenseValidator, updateExpenseValidator } from '#validators/expense'
import {
  createExpenseCategoryValidator,
  updateExpenseCategoryValidator,
} from '#validators/expense_category'
import { createIncomeValidator, updateIncomeValidator } from '#validators/income'
import {
  createIncomeCategoryValidator,
  updateIncomeCategoryValidator,
} from '#validators/income_category'
import {
  createInternalTransferValidator,
  updateInternalTransferValidator,
} from '#validators/internal_transfer'
import { createWalletValidator, updateWalletValidator } from '#validators/wallet'
import { createWalletTypeValidator, updateWalletTypeValidator } from '#validators/wallet_type'
import { inject } from '@adonisjs/core'
import { errors } from '@vinejs/vine'
import { tool } from 'ai'
import { DateTime } from 'luxon'
import { z } from 'zod'

const DEFAULT_COLOR = '#64748B'

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Use the YYYY-MM-DD format')
const color = z.string().regex(/^#[0-9a-fA-F]{6}$/, 'Use a hex color like #2563EB')
const idField = z.number().int().positive()
const updateId = idField
  .optional()
  .describe('Id of the record to update. Leave it out to create a new record.')

const ENTITIES = [
  'expense',
  'income',
  'internal_transfer',
  'budget',
  'wallet',
  'wallet_type',
  'contact',
  'expense_category',
  'income_category',
] as const

type Entity = (typeof ENTITIES)[number]

type WriteAction = 'create' | 'update' | 'delete'

const SAVE_TOOL_ENTITIES: Record<string, Entity> = {
  saveExpense: 'expense',
  saveIncome: 'income',
  saveInternalTransfer: 'internal_transfer',
  saveBudget: 'budget',
  saveWallet: 'wallet',
  saveWalletType: 'wallet_type',
  saveContact: 'contact',
}

/**
 * The record a write tool call touches, to match it against an approved plan.
 */
export function writeTargetOf(
  toolName: string,
  input: unknown
): { entity: Entity; action: WriteAction } | null {
  const values = (input ?? {}) as { id?: number; kind?: string; entity?: Entity }
  if (toolName === 'deleteRecord') {
    return values.entity ? { entity: values.entity, action: 'delete' } : null
  }
  const entity =
    toolName === 'saveCategory'
      ? values.kind === 'income'
        ? 'income_category'
        : 'expense_category'
      : SAVE_TOOL_ENTITIES[toolName]
  if (!entity) return null
  return { entity, action: values.id ? 'update' : 'create' }
}

export const planStep = z.object({
  action: z
    .enum(['use', 'create', 'update', 'delete'])
    .describe('use = an existing record the workflow relies on, nothing is changed'),
  entity: z.enum(ENTITIES),
  label: z.string().describe('What the step does, e.g. "Create the contact Paul Mbarga"'),
})

export type PlanStep = z.infer<typeof planStep>

const writeOutput = z.object({
  action: z.enum(['created', 'updated', 'deleted']),
  entity: z.enum(ENTITIES),
  id: z.number(),
  name: z.string().nullable(),
})

/**
 * Tools the model uses to change data. They all need the user's approval in
 * the chat (see WRITE_TOOL_NAMES) and go through the same validators and
 * services as the app's forms.
 */
export const PLAN_TOOL_NAME = 'proposePlan'

export const WRITE_TOOL_NAMES = new Set([
  'saveExpense',
  'saveIncome',
  'saveInternalTransfer',
  'saveBudget',
  'saveWallet',
  'saveWalletType',
  'saveContact',
  'saveCategory',
  'deleteRecord',
])

/**
 * Validation and service errors become plain sentences the model can act on
 * (fix the input, or explain the problem to the user).
 */
async function run<T>(action: () => Promise<T>) {
  try {
    return await action()
  } catch (error) {
    if (error instanceof errors.E_VALIDATION_ERROR) {
      const messages = (error.messages as { field: string; message: string }[])
        .map(({ field, message }) => `${field}: ${message}`)
        .join('; ')
      throw new Error(`Invalid data. ${messages}`)
    }
    throw error
  }
}

const today = () => DateTime.now().toISODate()!

// How the model can get each id a new record needs
const MISSING_FIELD_HINTS: Record<string, string> = {
  name: 'a short name',
  amount: 'the amount',
  walletId: 'an id from getWallets',
  sourceWalletId: 'an id from getWallets',
  targetWalletId: 'an id from getWallets',
  walletTypeId: 'an id from getWalletTypes, or create one with saveWalletType first',
  incomeCategoryId:
    'an id from getCategories (incomeCategories), or create one with saveCategory (kind "income") first',
  expenseCategoryId:
    'an id from getCategories (expenseCategories), or create one with saveCategory (kind "expense") first',
  targetType: '"expense_category" or "wallet"',
}

/**
 * Says what is missing to create a record, and where to get it, before
 * anything is saved.
 */
function requireForCreate(entity: Entity, data: Record<string, unknown>, fields: string[]) {
  const missing = fields.filter((field) => data[field] === undefined || data[field] === null)
  if (!missing.length) return
  const details = missing
    .map((field) => `${field} (${MISSING_FIELD_HINTS[field] ?? 'required'})`)
    .join(', ')
  throw new Error(
    `Nothing was saved. To create this ${entity.replace('_', ' ')}, also set: ${details}.`
  )
}

/**
 * Starts the error of a write tool when the workflow was rolled back, for the
 * chat UI to show it (see approvalPolicy, PlanCard).
 */
export const ROLLBACK_MARKER = '[rolled back]'

// Deleting these also deletes or unlinks other records: it can't be undone
const IRREVERSIBLE_DELETES = new Set<Entity>([
  'wallet',
  'wallet_type',
  'contact',
  'expense_category',
  'income_category',
])

type EntityRecord = { id: number } & Record<string, unknown>

type JournalEntry = { label: string; undo: () => Promise<unknown> }

/**
 * Picks the fields a record had before an update, to put them back.
 */
function snapshot(record: EntityRecord, keys: string[]) {
  return Object.fromEntries(keys.map((key) => [key, record[key]]))
}

@inject()
export class AiWriteToolsService {
  /**
   * Changes made during this request, undone in reverse order when a later
   * change fails: a workflow is applied completely or not at all.
   */
  private journal: JournalEntry[] = []
  private rolledBack = false

  constructor(
    private readonly expenseService: ExpenseService,
    private readonly incomeService: IncomeService,
    private readonly internalTransferService: InternalTransferService,
    private readonly budgetService: BudgetService,
    private readonly walletService: WalletService,
    private readonly walletTypeService: WalletTypeService,
    private readonly contactService: ContactService,
    private readonly expenseCategoryService: ExpenseCategoryService,
    private readonly incomeCategoryService: IncomeCategoryService
  ) {}

  /**
   * Raw service calls per record type, used to undo changes. They skip the
   * request validators: the values come from the database.
   */
  private get operations(): Record<
    Entity,
    {
      find: (id: number) => Promise<unknown>
      update: (id: number, data: never) => Promise<unknown>
      remove: (id: number) => Promise<unknown>
      recreate?: (record: EntityRecord) => Promise<unknown>
    }
  > {
    return {
      expense: {
        find: (id) => this.expenseService.getExpenseById(id),
        update: (id, data) => this.expenseService.updateExpense(id, data),
        remove: (id) => this.expenseService.deleteExpense(id),
        recreate: (record) =>
          this.expenseService.createExpense(
            snapshot(record, [
              'name',
              'description',
              'amount',
              'fees',
              'expenseCategoryId',
              'walletId',
              'date',
              'toContactId',
            ]) as never
          ),
      },
      income: {
        find: (id) => this.incomeService.getIncomeById(id),
        update: (id, data) => this.incomeService.updateIncome(id, data),
        remove: (id) => this.incomeService.deleteIncome(id),
        recreate: (record) =>
          this.incomeService.createIncome(
            snapshot(record, [
              'name',
              'description',
              'amount',
              'incomeCategoryId',
              'walletId',
              'date',
              'fromContactId',
            ]) as never
          ),
      },
      internal_transfer: {
        find: (id) => this.internalTransferService.getInternalTransferById(id),
        update: (id, data) => this.internalTransferService.updateInternalTransfer(id, data),
        remove: (id) => this.internalTransferService.deleteInternalTransfer(id),
        recreate: (record) =>
          this.internalTransferService.createInternalTransfer(
            snapshot(record, [
              'amount',
              'fee',
              'sourceWalletId',
              'targetWalletId',
              'date',
              'description',
            ]) as never
          ),
      },
      budget: {
        find: (id) => this.budgetService.getBudgetById(id),
        update: (id, data) => this.budgetService.updateBudget(id, data),
        remove: (id) => this.budgetService.deleteBudget(id),
        recreate: (record) =>
          this.budgetService.createBudget(
            snapshot(record, [
              'name',
              'targetType',
              'expenseCategoryId',
              'walletId',
              'amount',
              'period',
              'alertThreshold',
            ]) as never
          ),
      },
      wallet: {
        find: (id) => this.walletService.getWalletById(id),
        update: (id, data) => this.walletService.updateWallet(id, data),
        remove: (id) => this.walletService.deleteWallet(id),
      },
      wallet_type: {
        find: (id) => this.walletTypeService.getWalletTypeById(id),
        update: (id, data) => this.walletTypeService.updateWalletType(id, data),
        remove: (id) => this.walletTypeService.deleteWalletType(id),
      },
      contact: {
        find: (id) => this.contactService.getContactById(id),
        update: (id, data) => this.contactService.updateContact(id, data),
        remove: (id) => this.contactService.deleteContact(id),
      },
      expense_category: {
        find: (id) => this.expenseCategoryService.getExpenseCategoryById(id),
        update: (id, data) => this.expenseCategoryService.updateExpenseCategory(id, data),
        remove: (id) => this.expenseCategoryService.deleteExpenseCategory(id),
      },
      income_category: {
        find: (id) => this.incomeCategoryService.getIncomeCategoryById(id),
        update: (id, data) => this.incomeCategoryService.updateIncomeCategory(id, data),
        remove: (id) => this.incomeCategoryService.deleteIncomeCategory(id),
      },
    }
  }

  /**
   * Runs one change of the workflow and records how to undo it. When it
   * fails, every earlier change of this request is undone first.
   */
  private async apply<T>(
    change: () => Promise<{ result: T; label: string; undo: () => Promise<unknown> }>
  ) {
    if (this.rolledBack) {
      throw new Error(
        `${ROLLBACK_MARKER} Skipped: the workflow was already rolled back after an error.`
      )
    }
    try {
      const { result, label, undo } = await run(change)
      this.journal.push({ label, undo })
      return result
    } catch (error) {
      throw await this.rollback(error as Error)
    }
  }

  private async rollback(error: Error) {
    const entries = this.journal.splice(0).reverse()
    if (!entries.length) return error
    this.rolledBack = true

    const undone: string[] = []
    const failed: string[] = []
    for (const entry of entries) {
      try {
        await entry.undo()
        undone.push(entry.label)
      } catch (undoError) {
        failed.push(`${entry.label} (${(undoError as Error).message})`)
      }
    }

    return new Error(
      [
        `${ROLLBACK_MARKER} ${error.message}`,
        undone.length ? `The workflow was rolled back, undone: ${undone.join('; ')}.` : '',
        failed.length ? `Could not undo: ${failed.join('; ')}.` : '',
        'Fix the problem and propose the whole plan again.',
      ]
        .filter(Boolean)
        .join(' ')
    )
  }

  /**
   * Creates the record when no id is given, updates it otherwise.
   */
  private async save<T extends { id: number }>(
    entity: Entity,
    id: number | undefined,
    create: () => Promise<T>,
    update: (id: number) => Promise<T>,
    nameOf: (record: T) => string | null,
    creation: { data: Record<string, unknown>; required: string[] }
  ) {
    const operations = this.operations[entity]
    const entityName = entity.replace('_', ' ')
    const record = await this.apply(async () => {
      if (!id) {
        requireForCreate(entity, creation.data, creation.required)
        const created = await create()
        return {
          result: created,
          label: `deleted the new ${entityName} "${nameOf(created)}" (#${created.id})`,
          undo: () => operations.remove(created.id),
        }
      }
      const before = (await operations.find(id)) as EntityRecord
      const previous = snapshot(before, Object.keys(creation.data))
      const updated = await update(id)
      return {
        result: updated,
        label: `restored the previous values of ${entityName} "${nameOf(updated)}" (#${id})`,
        undo: () => operations.update(id, previous as never),
      }
    })
    return writeOutput.parse({
      action: id ? 'updated' : 'created',
      entity,
      id: record.id,
      name: nameOf(record),
    })
  }

  private async remove(entity: Entity, id: number) {
    const operations = this.operations[entity]
    const entityName = entity.replace('_', ' ')
    await this.apply(async () => {
      const before = (await operations.find(id)) as EntityRecord
      await operations.remove(id)
      return {
        result: null,
        label: `re-created the deleted ${entityName} "${before.name ?? `#${id}`}"`,
        undo: async () => {
          if (IRREVERSIBLE_DELETES.has(entity) || !operations.recreate) {
            throw new Error(`a deleted ${entityName} cannot be restored`)
          }
          await operations.recreate(before)
        },
      }
    })
    return writeOutput.parse({ action: 'deleted', entity, id, name: null })
  }

  buildTools() {
    return {
      saveExpense: tool({
        description:
          'Create an expense (money spent from a wallet), or update one when id is set. Amounts are positive; fees are extra costs like Mobile Money fees. Required to create: name, amount, expenseCategoryId, walletId.',
        inputSchema: z.object({
          id: updateId,
          name: z.string().min(3).optional(),
          description: z.string().min(2).optional().describe('Defaults to the name'),
          amount: z.number().positive().optional(),
          fees: z.number().min(0).nullable().optional(),
          expenseCategoryId: idField.optional(),
          walletId: idField.optional(),
          date: isoDate.optional().describe('Defaults to today, cannot be in the future'),
          toContactId: idField.nullable().optional().describe('Who was paid'),
        }),
        outputSchema: writeOutput,
        execute: ({ id, ...data }) =>
          this.save(
            'expense',
            id,
            async () =>
              this.expenseService.createExpense(
                await createExpenseValidator.validate({
                  date: today(),
                  description: data.name,
                  ...data,
                })
              ),
            async (recordId) =>
              this.expenseService.updateExpense(
                recordId,
                await updateExpenseValidator.validate(data)
              ),
            (record) => record.name,
            { data, required: ['name', 'amount', 'expenseCategoryId', 'walletId'] }
          ),
      }),

      saveIncome: tool({
        description:
          'Create an income (money received in a wallet), or update one when id is set. Required to create: name, amount, incomeCategoryId, walletId.',
        inputSchema: z.object({
          id: updateId,
          name: z.string().min(3).optional(),
          description: z.string().min(2).optional().describe('Defaults to the name'),
          amount: z.number().positive().optional(),
          incomeCategoryId: idField.optional(),
          walletId: idField.optional(),
          date: isoDate.optional().describe('Defaults to today, cannot be in the future'),
          fromContactId: idField.nullable().optional().describe('Who paid'),
        }),
        outputSchema: writeOutput,
        execute: ({ id, ...data }) =>
          this.save(
            'income',
            id,
            async () =>
              this.incomeService.createIncome(
                await createIncomeValidator.validate({
                  date: today(),
                  description: data.name,
                  ...data,
                })
              ),
            async (recordId) =>
              this.incomeService.updateIncome(recordId, await updateIncomeValidator.validate(data)),
            (record) => record.name,
            { data, required: ['name', 'amount', 'incomeCategoryId', 'walletId'] }
          ),
      }),

      saveInternalTransfer: tool({
        description:
          'Move money between two of the user wallets (not an income or an expense), or update a transfer when id is set. The fee is taken from the source wallet.',
        inputSchema: z.object({
          id: updateId,
          amount: z.number().positive().optional(),
          fee: z.number().min(0).nullable().optional(),
          sourceWalletId: idField.optional(),
          targetWalletId: idField.optional(),
          date: isoDate.optional().describe('Defaults to today'),
          description: z.string().min(2).nullable().optional(),
        }),
        outputSchema: writeOutput,
        execute: ({ id, ...data }) =>
          this.save(
            'internal_transfer',
            id,
            async () =>
              this.internalTransferService.createInternalTransfer(
                await createInternalTransferValidator.validate({ date: today(), ...data })
              ),
            async (recordId) =>
              this.internalTransferService.updateInternalTransfer(
                recordId,
                await updateInternalTransferValidator.validate(data)
              ),
            (record) => record.name,
            { data, required: ['amount', 'sourceWalletId', 'targetWalletId'] }
          ),
      }),

      saveBudget: tool({
        description:
          'Create a spending budget on one expense category or one wallet, or update one when id is set.',
        inputSchema: z.object({
          id: updateId,
          name: z.string().min(2).optional(),
          targetType: z.enum(['expense_category', 'wallet']).optional(),
          expenseCategoryId: idField.nullable().optional(),
          walletId: idField.nullable().optional(),
          amount: z.number().int().positive().optional(),
          period: z.enum(['weekly', 'monthly', 'yearly']).optional(),
          alertThreshold: z
            .number()
            .int()
            .min(1)
            .max(100)
            .optional()
            .describe('Percentage at which the budget is flagged, 80 by default'),
        }),
        outputSchema: writeOutput,
        execute: ({ id, ...data }) =>
          this.save(
            'budget',
            id,
            async () =>
              this.budgetService.createBudget(
                await createBudgetValidator.validate({ period: 'monthly', ...data })
              ),
            async (recordId) =>
              this.budgetService.updateBudget(recordId, await updateBudgetValidator.validate(data)),
            (record) => record.name,
            { data, required: ['name', 'targetType', 'amount'] }
          ),
      }),

      saveWallet: tool({
        description:
          'Create a wallet (cash, bank account, Mobile Money...), or update one when id is set. amount is its current balance.',
        inputSchema: z.object({
          id: updateId,
          name: z.string().min(3).optional(),
          description: z.string().min(2).optional().describe('Defaults to the name'),
          walletTypeId: idField.optional(),
          amount: z.number().optional(),
        }),
        outputSchema: writeOutput,
        execute: ({ id, ...data }) =>
          this.save(
            'wallet',
            id,
            async () =>
              this.walletService.createWallet(
                await createWalletValidator.validate({ description: data.name, ...data })
              ),
            async (recordId) =>
              this.walletService.updateWallet(recordId, await updateWalletValidator.validate(data)),
            (record) => record.name,
            { data, required: ['name', 'walletTypeId', 'amount'] }
          ),
      }),

      saveWalletType: tool({
        description:
          'Create a wallet type (e.g. Mobile Money, Bank), or update one when id is set.',
        inputSchema: z.object({
          id: updateId,
          name: z.string().min(2).optional(),
          color: color.optional(),
          icon: z.string().nullable().optional().describe('A Lucide icon name, e.g. wallet'),
        }),
        outputSchema: writeOutput,
        execute: ({ id, ...data }) =>
          this.save(
            'wallet_type',
            id,
            async () =>
              this.walletTypeService.createWalletType(
                await createWalletTypeValidator.validate({ color: DEFAULT_COLOR, ...data })
              ),
            async (recordId) =>
              this.walletTypeService.updateWalletType(
                recordId,
                await updateWalletTypeValidator.validate(data)
              ),
            (record) => record.name,
            { data, required: ['name'] }
          ),
      }),

      saveContact: tool({
        description:
          'Create a contact (a person or company the user pays or gets paid by), or update one when id is set.',
        inputSchema: z.object({
          id: updateId,
          name: z.string().min(2).optional(),
          type: z.enum(['person', 'entreprise', 'other']).optional(),
          color: color.optional(),
          phoneNumber: z.string().nullable().optional(),
          email: z.string().email().nullable().optional(),
          comments: z.string().nullable().optional(),
        }),
        outputSchema: writeOutput,
        execute: ({ id, ...data }) =>
          this.save(
            'contact',
            id,
            async () =>
              this.contactService.createContact(
                await createContactValidator.validate({
                  color: DEFAULT_COLOR,
                  type: 'person',
                  ...data,
                })
              ),
            async (recordId) =>
              this.contactService.updateContact(
                recordId,
                await updateContactValidator.validate(data)
              ),
            (record) => record.name,
            { data, required: ['name'] }
          ),
      }),

      saveCategory: tool({
        description: 'Create an income or expense category, or update one when id is set.',
        inputSchema: z.object({
          kind: z.enum(['income', 'expense']),
          id: updateId,
          name: z.string().min(2).optional(),
          color: color.optional(),
          icon: z.string().nullable().optional().describe('A Lucide icon name, e.g. bus'),
          defaultWalletTypeId: idField.nullable().optional(),
          defaultContactId: idField.nullable().optional(),
        }),
        outputSchema: writeOutput,
        execute: ({ kind, id, ...data }) =>
          kind === 'income'
            ? this.save(
                'income_category',
                id,
                async () =>
                  this.incomeCategoryService.createIncomeCategory(
                    await createIncomeCategoryValidator.validate({ color: DEFAULT_COLOR, ...data })
                  ),
                async (recordId) =>
                  this.incomeCategoryService.updateIncomeCategory(
                    recordId,
                    await updateIncomeCategoryValidator.validate(data)
                  ),
                (record) => record.name,
                { data, required: ['name'] }
              )
            : this.save(
                'expense_category',
                id,
                async () =>
                  this.expenseCategoryService.createExpenseCategory(
                    await createExpenseCategoryValidator.validate({ color: DEFAULT_COLOR, ...data })
                  ),
                async (recordId) =>
                  this.expenseCategoryService.updateExpenseCategory(
                    recordId,
                    await updateExpenseCategoryValidator.validate(data)
                  ),
                (record) => record.name,
                { data, required: ['name'] }
              ),
      }),

      proposePlan: tool({
        description: [
          'Show the user the workflow you are about to run and wait for their approval.',
          'Call it once, before any save* or deleteRecord tool, with every step in order:',
          'the existing records you will use (found with the read tools) and each record to create, update or delete.',
          'Every new income or expense needs a category and a wallet: list the ones you use, or a step creating them first.',
          'Once approved, run the create, update and delete steps in that order without asking again.',
        ].join(' '),
        inputSchema: z.object({
          title: z.string().describe('The task, e.g. "Record the taxi paid to Paul"'),
          steps: z.array(planStep).min(1).max(20),
        }),
        outputSchema: z.object({ approved: z.literal(true), instructions: z.string() }),
        execute: async () => ({
          approved: true as const,
          instructions:
            'The user approved the plan. Run its create, update and delete steps now, in order.',
        }),
      }),

      deleteRecord: tool({
        description:
          'Delete one record. Deleting a wallet type, wallet, contact or category also deletes or unlinks what depends on it and cannot be undone if the workflow fails: warn the user and put such deletes last in the plan.',
        inputSchema: z.object({
          entity: z.enum(ENTITIES),
          id: idField,
          summary: z
            .string()
            .describe('What is deleted, shown to the user, e.g. "Taxi, 2,000, 12 Oct"'),
        }),
        outputSchema: writeOutput,
        execute: ({ entity, id }) => this.remove(entity, id),
      }),
    }
  }
}
