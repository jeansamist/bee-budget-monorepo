import { ExpenseSchema, IncomeSchema, InternalTransferSchema } from '#database/schema'
import ExpenseCategoryRepository from '#repositories/expense_category_repository'
import ExpenseRepository from '#repositories/expense_repository'
import IncomeCategoryRepository from '#repositories/income_category_repository'
import IncomeRepository from '#repositories/income_repository'
import InternalTransferRepository from '#repositories/internal_transfer_repository'
import WalletRepository from '#repositories/wallet_repository'
import {
  buildInternalTransferExpenseDescription,
  buildInternalTransferIncomeDescription,
  buildInternalTransferName,
  INTERNAL_TRANSFER_EXPENSE_CATEGORY_NAME,
  INTERNAL_TRANSFER_INCOME_CATEGORY_NAME,
} from '#utils/internal_transfer'
import { ModelProps } from '#utils/generics'
import { httpError } from '#utils/http_error'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'
import { DateTime } from 'luxon'

type CreateInternalTransferPayload = {
  amount: number
  fee?: number | null
  sourceWalletId: number
  targetWalletId: number
  date: DateTime
  description?: string | null
}

type UpdateInternalTransferPayload = Partial<CreateInternalTransferPayload>
type MassUpdateInternalTransferPayload = UpdateInternalTransferPayload & { id: number }

@inject()
export class InternalTransferService {
  constructor(
    private readonly repository: InternalTransferRepository,
    private readonly walletRepository: WalletRepository,
    private readonly expenseRepository: ExpenseRepository,
    private readonly incomeRepository: IncomeRepository,
    private readonly expenseCategoryRepository: ExpenseCategoryRepository,
    private readonly incomeCategoryRepository: IncomeCategoryRepository,
    private readonly ctx: HttpContext
  ) {}

  private get userId() {
    return this.ctx.auth.user!.id
  }

  private getTransferTotal(amount: number, fee: number | null | undefined) {
    return amount + (fee ?? 0)
  }

  private mergeDelta(balanceDeltas: Map<number, number>, walletId: number, delta: number) {
    balanceDeltas.set(walletId, (balanceDeltas.get(walletId) ?? 0) + delta)
  }

  private checkOwnership(transfer: InternalTransferSchema) {
    if (transfer.userId !== this.userId) {
      throw httpError(403, 'You are not allowed to access this internal transfer')
    }
  }

  private async getOwnedWallet(walletId: number) {
    const wallet = await this.walletRepository.findById(walletId)
    if (wallet.userId !== this.userId) {
      throw httpError(422, 'The selected wallet is invalid')
    }
    return wallet
  }

  private ensureWalletsAreDifferent(sourceWalletId: number, targetWalletId: number) {
    if (sourceWalletId === targetWalletId) {
      throw httpError(422, 'Source and target wallets must be different')
    }
  }

  private async getTransferCategories() {
    const [incomeCategory, expenseCategory] = await Promise.all([
      this.incomeCategoryRepository.findByNameForUser(
        this.userId,
        INTERNAL_TRANSFER_INCOME_CATEGORY_NAME
      ),
      this.expenseCategoryRepository.findByNameForUser(
        this.userId,
        INTERNAL_TRANSFER_EXPENSE_CATEGORY_NAME
      ),
    ])

    if (!incomeCategory || !incomeCategory.isSystem) {
      throw httpError(500, 'Missing internal transfer income category')
    }

    if (!expenseCategory || !expenseCategory.isSystem) {
      throw httpError(500, 'Missing internal transfer expense category')
    }

    return { incomeCategory, expenseCategory }
  }

  private async getWalletMap(walletIds: number[]) {
    const uniqueWalletIds = [...new Set(walletIds)]
    const wallets = await Promise.all(
      uniqueWalletIds.map((walletId) => this.getOwnedWallet(walletId))
    )
    return new Map(wallets.map((wallet) => [wallet.id, wallet]))
  }

  private ensureWalletBalancesRemainPositive(
    walletsById: Map<number, Awaited<ReturnType<InternalTransferService['getOwnedWallet']>>>,
    balanceDeltas: Map<number, number>
  ) {
    for (const [walletId, delta] of balanceDeltas.entries()) {
      const wallet = walletsById.get(walletId)
      if (!wallet) continue
      const nextAmount = wallet.amount + delta
      if (nextAmount < 0) {
        throw httpError(422, `Insufficient funds in wallet ${wallet.name}`)
      }
    }
  }

  private async applyWalletDeltas(
    walletsById: Map<number, Awaited<ReturnType<InternalTransferService['getOwnedWallet']>>>,
    balanceDeltas: Map<number, number>,
    trx: TransactionClientContract
  ) {
    for (const [walletId, delta] of balanceDeltas.entries()) {
      if (delta === 0) continue
      const wallet = walletsById.get(walletId)
      if (!wallet) continue
      wallet.useTransaction(trx)
      wallet.amount += delta
      await wallet.save()
    }
  }

  async createInternalTransfer(data: CreateInternalTransferPayload) {
    this.ensureWalletsAreDifferent(data.sourceWalletId, data.targetWalletId)

    const [walletsById, { incomeCategory, expenseCategory }] = await Promise.all([
      this.getWalletMap([data.sourceWalletId, data.targetWalletId]),
      this.getTransferCategories(),
    ])

    const sourceWallet = walletsById.get(data.sourceWalletId)!
    const targetWallet = walletsById.get(data.targetWalletId)!
    const transferName = buildInternalTransferName(sourceWallet.name, targetWallet.name)
    const transferTotal = this.getTransferTotal(data.amount, data.fee)
    const balanceDeltas = new Map<number, number>()
    this.mergeDelta(balanceDeltas, sourceWallet.id, -transferTotal)
    this.mergeDelta(balanceDeltas, targetWallet.id, data.amount)
    this.ensureWalletBalancesRemainPositive(walletsById, balanceDeltas)

    return db.transaction(async (trx) => {
      await this.applyWalletDeltas(walletsById, balanceDeltas, trx)

      const transfer = await this.repository.create(
        {
          name: transferName,
          description: data.description ?? null,
          amount: data.amount,
          fee: data.fee ?? null,
          sourceWalletId: sourceWallet.id,
          targetWalletId: targetWallet.id,
          linkedExpenseId: null,
          linkedIncomeId: null,
          date: data.date,
          userId: this.userId,
        } as ModelProps<InternalTransferSchema>,
        trx
      )

      const expense = await this.expenseRepository.create(
        {
          name: transferName,
          description: buildInternalTransferExpenseDescription(data.description, targetWallet.name),
          amount: data.amount,
          fees: data.fee ?? null,
          expenseCategoryId: expenseCategory.id,
          walletId: sourceWallet.id,
          toContactId: null,
          internalTransferId: transfer.id,
          date: data.date,
          userId: this.userId,
        } as ModelProps<ExpenseSchema>,
        trx
      )

      const income = await this.incomeRepository.create(
        {
          name: transferName,
          description: buildInternalTransferIncomeDescription(data.description, sourceWallet.name),
          amount: data.amount,
          incomeCategoryId: incomeCategory.id,
          walletId: targetWallet.id,
          fromContactId: null,
          internalTransferId: transfer.id,
          date: data.date,
          userId: this.userId,
        } as ModelProps<IncomeSchema>,
        trx
      )

      return this.repository.update(
        transfer,
        {
          linkedExpenseId: expense.id,
          linkedIncomeId: income.id,
        } as Partial<ModelProps<InternalTransferSchema>>,
        trx
      )
    })
  }

  async updateInternalTransfer(id: number, data: UpdateInternalTransferPayload) {
    const transfer = await this.repository.findById(id)
    this.checkOwnership(transfer)

    const nextSourceWalletId = data.sourceWalletId ?? transfer.sourceWalletId
    const nextTargetWalletId = data.targetWalletId ?? transfer.targetWalletId
    this.ensureWalletsAreDifferent(nextSourceWalletId, nextTargetWalletId)

    const nextAmount = data.amount ?? transfer.amount
    const nextFee = data.fee !== undefined ? data.fee : transfer.fee
    const nextDate = data.date ?? transfer.date
    const nextDescription = data.description !== undefined ? data.description : transfer.description

    const [walletsById, { incomeCategory, expenseCategory }] = await Promise.all([
      this.getWalletMap([
        transfer.sourceWalletId,
        transfer.targetWalletId,
        nextSourceWalletId,
        nextTargetWalletId,
      ]),
      this.getTransferCategories(),
    ])

    const nextSourceWallet = walletsById.get(nextSourceWalletId)!
    const nextTargetWallet = walletsById.get(nextTargetWalletId)!
    const nextName = buildInternalTransferName(nextSourceWallet.name, nextTargetWallet.name)

    const balanceDeltas = new Map<number, number>()
    this.mergeDelta(
      balanceDeltas,
      transfer.sourceWalletId,
      this.getTransferTotal(transfer.amount, transfer.fee)
    )
    this.mergeDelta(balanceDeltas, transfer.targetWalletId, -transfer.amount)
    this.mergeDelta(balanceDeltas, nextSourceWalletId, -this.getTransferTotal(nextAmount, nextFee))
    this.mergeDelta(balanceDeltas, nextTargetWalletId, nextAmount)
    this.ensureWalletBalancesRemainPositive(walletsById, balanceDeltas)

    return db.transaction(async (trx) => {
      await this.applyWalletDeltas(walletsById, balanceDeltas, trx)

      if (transfer.linkedExpenseId) {
        const expense = await this.expenseRepository.findById(transfer.linkedExpenseId)
        await this.expenseRepository.update(
          expense,
          {
            name: nextName,
            description: buildInternalTransferExpenseDescription(
              nextDescription,
              nextTargetWallet.name
            ),
            amount: nextAmount,
            fees: nextFee,
            expenseCategoryId: expenseCategory.id,
            walletId: nextSourceWalletId,
            toContactId: null,
            internalTransferId: transfer.id,
            date: nextDate,
          } as Partial<ModelProps<ExpenseSchema>>,
          trx
        )
      }

      if (transfer.linkedIncomeId) {
        const income = await this.incomeRepository.findById(transfer.linkedIncomeId)
        await this.incomeRepository.update(
          income,
          {
            name: nextName,
            description: buildInternalTransferIncomeDescription(
              nextDescription,
              nextSourceWallet.name
            ),
            amount: nextAmount,
            incomeCategoryId: incomeCategory.id,
            walletId: nextTargetWalletId,
            fromContactId: null,
            internalTransferId: transfer.id,
            date: nextDate,
          } as Partial<ModelProps<IncomeSchema>>,
          trx
        )
      }

      return this.repository.update(
        transfer,
        {
          name: nextName,
          description: nextDescription ?? null,
          amount: nextAmount,
          fee: nextFee ?? null,
          sourceWalletId: nextSourceWalletId,
          targetWalletId: nextTargetWalletId,
          date: nextDate,
        } as Partial<ModelProps<InternalTransferSchema>>,
        trx
      )
    })
  }

  async deleteInternalTransfer(id: number) {
    const transfer = await this.repository.findById(id)
    this.checkOwnership(transfer)

    const walletsById = await this.getWalletMap([transfer.sourceWalletId, transfer.targetWalletId])
    const balanceDeltas = new Map<number, number>()
    this.mergeDelta(
      balanceDeltas,
      transfer.sourceWalletId,
      this.getTransferTotal(transfer.amount, transfer.fee)
    )
    this.mergeDelta(balanceDeltas, transfer.targetWalletId, -transfer.amount)
    this.ensureWalletBalancesRemainPositive(walletsById, balanceDeltas)

    return db.transaction(async (trx) => {
      await this.applyWalletDeltas(walletsById, balanceDeltas, trx)

      if (transfer.linkedExpenseId) {
        const expense = await this.expenseRepository.findById(transfer.linkedExpenseId)
        await this.expenseRepository.delete(expense, trx)
      }

      if (transfer.linkedIncomeId) {
        const income = await this.incomeRepository.findById(transfer.linkedIncomeId)
        await this.incomeRepository.delete(income, trx)
      }

      return this.repository.delete(transfer, trx)
    })
  }

  async getInternalTransferById(id: number) {
    const transfer = await this.repository.findById(id)
    this.checkOwnership(transfer)
    return transfer
  }

  async getAllUserInternalTransfers() {
    return this.repository.findAllByUserId(this.userId)
  }

  async getPaginatedUserInternalTransfers(page: number, perPage: number) {
    return this.repository.paginateByUserId(this.userId, page, perPage)
  }

  async createMassInternalTransfers(items: CreateInternalTransferPayload[]) {
    const transfers = []
    for (const item of items) {
      transfers.push(await this.createInternalTransfer(item))
    }
    return transfers
  }

  async updateMassInternalTransfers(items: MassUpdateInternalTransferPayload[]) {
    const transfers = []
    for (const item of items) {
      const { id, ...data } = item
      transfers.push(await this.updateInternalTransfer(id, data))
    }
    return transfers
  }

  async deleteMassInternalTransfers(ids: number[]) {
    for (const id of ids) {
      await this.deleteInternalTransfer(id)
    }
  }
}
