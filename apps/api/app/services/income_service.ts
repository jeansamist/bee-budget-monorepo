import { IncomeSchema } from '#database/schema'
import IncomeCategoryRepository from '#repositories/income_category_repository'
import IncomeRepository from '#repositories/income_repository'
import WalletRepository from '#repositories/wallet_repository'
import WalletTypeRepository from '#repositories/wallet_type_repository'
import { ModelProps } from '#utils/generics'
import { httpError } from '#utils/http_error'
import { inject } from '@adonisjs/core'
import { HttpContext } from '@adonisjs/core/http'
import db from '@adonisjs/lucid/services/db'
import { DateTime } from 'luxon'

type CreateIncomePayload = {
  name: string
  description: string
  amount: number
  incomeCategoryId: number
  walletTypeId: number
  walletId: number
  date: DateTime
}

type UpdateIncomePayload = Partial<CreateIncomePayload>

@inject()
export class IncomeService {
  constructor(
    private readonly repository: IncomeRepository,
    private readonly incomeCategoryRepository: IncomeCategoryRepository,
    private readonly walletRepository: WalletRepository,
    private readonly walletTypeRepository: WalletTypeRepository,
    private readonly ctx: HttpContext
  ) {}

  private get userId() {
    return this.ctx.auth.user!.id
  }

  checkOwnership(income: IncomeSchema) {
    if (income.userId !== this.userId) {
      throw httpError(403, 'You are not allowed to access this income')
    }
  }

  private async getOwnedIncomeCategory(incomeCategoryId: number) {
    const incomeCategory = await this.incomeCategoryRepository.findById(incomeCategoryId)
    if (incomeCategory.userId !== this.userId) {
      throw httpError(422, 'The selected income category is invalid')
    }
    return incomeCategory
  }

  private async getOwnedWalletType(walletTypeId: number) {
    const walletType = await this.walletTypeRepository.findById(walletTypeId)
    if (walletType.userId !== this.userId) {
      throw httpError(422, 'The selected wallet type is invalid')
    }
    return walletType
  }

  private async getOwnedWallet(walletId: number) {
    const wallet = await this.walletRepository.findById(walletId)
    if (wallet.userId !== this.userId) {
      throw httpError(422, 'The selected wallet is invalid')
    }
    return wallet
  }

  private async validateWalletSelection({
    walletId,
    walletTypeId,
    incomeCategoryId,
  }: Pick<CreateIncomePayload, 'walletId' | 'walletTypeId' | 'incomeCategoryId'>) {
    const [incomeCategory, walletType, wallet] = await Promise.all([
      this.getOwnedIncomeCategory(incomeCategoryId),
      this.getOwnedWalletType(walletTypeId),
      this.getOwnedWallet(walletId),
    ])

    if (wallet.walletTypeId !== walletType.id) {
      throw httpError(422, 'The selected wallet does not belong to the selected wallet type')
    }

    if (
      incomeCategory.defaultWalletTypeId !== null &&
      incomeCategory.defaultWalletTypeId !== undefined &&
      incomeCategory.defaultWalletTypeId !== walletType.id
    ) {
      throw httpError(422, 'The selected wallet type does not match the category default')
    }

    return { incomeCategory, walletType, wallet }
  }

  private ensureWalletAssignmentPayload(data: UpdateIncomePayload) {
    const hasWalletTypeId = data.walletTypeId !== undefined
    const hasWalletId = data.walletId !== undefined

    if (hasWalletTypeId !== hasWalletId) {
      throw httpError(422, 'walletTypeId and walletId must be provided together')
    }
  }

  async createIncome(data: CreateIncomePayload) {
    const { wallet } = await this.validateWalletSelection(data)

    return db.transaction(async (trx) => {
      wallet.useTransaction(trx)
      wallet.amount += data.amount
      await wallet.save()

      return this.repository.create(
        {
          name: data.name,
          description: data.description,
          amount: data.amount,
          date: data.date,
          incomeCategoryId: data.incomeCategoryId,
          walletId: data.walletId,
          userId: this.userId,
        } as ModelProps<IncomeSchema>,
        trx
      )
    })
  }

  async updateIncome(id: number, data: UpdateIncomePayload) {
    const income = await this.repository.findById(id)
    this.checkOwnership(income)
    this.ensureWalletAssignmentPayload(data)

    const effectiveIncomeCategoryId = data.incomeCategoryId ?? income.incomeCategoryId

    let targetWallet = income.walletId ? await this.getOwnedWallet(income.walletId) : null
    let effectiveWalletTypeId = targetWallet?.walletTypeId

    if (data.walletId !== undefined && data.walletTypeId !== undefined) {
      const { wallet } = await this.validateWalletSelection({
        walletId: data.walletId,
        walletTypeId: data.walletTypeId,
        incomeCategoryId: effectiveIncomeCategoryId,
      })
      targetWallet = wallet
      effectiveWalletTypeId = data.walletTypeId
    } else {
      await this.getOwnedIncomeCategory(effectiveIncomeCategoryId)

      if (!targetWallet || effectiveWalletTypeId === undefined) {
        throw httpError(
          422,
          'This income has no wallet assignment yet. Provide walletTypeId and walletId together'
        )
      }

      const incomeCategory = await this.getOwnedIncomeCategory(effectiveIncomeCategoryId)
      if (
        incomeCategory.defaultWalletTypeId !== null &&
        incomeCategory.defaultWalletTypeId !== undefined &&
        incomeCategory.defaultWalletTypeId !== effectiveWalletTypeId
      ) {
        throw httpError(422, 'The selected wallet type does not match the category default')
      }
    }

    const nextAmount = data.amount ?? income.amount

    return db.transaction(async (trx) => {
      if (!targetWallet) {
        throw httpError(422, 'A wallet is required for this income')
      }

      const currentWallet = income.walletId ? await this.getOwnedWallet(income.walletId) : null

      if (!currentWallet || currentWallet.id === targetWallet.id) {
        targetWallet.useTransaction(trx)
        targetWallet.amount += nextAmount - income.amount
        await targetWallet.save()
      } else {
        currentWallet.useTransaction(trx)
        currentWallet.amount -= income.amount
        await currentWallet.save()

        targetWallet.useTransaction(trx)
        targetWallet.amount += nextAmount
        await targetWallet.save()
      }

      return this.repository.update(
        income,
        {
          name: data.name,
          description: data.description,
          amount: data.amount,
          date: data.date,
          incomeCategoryId: data.incomeCategoryId,
          walletId: targetWallet.id,
        } as Partial<ModelProps<IncomeSchema>>,
        trx
      )
    })
  }
  async deleteIncome(id: number) {
    const income = await this.repository.findById(id)
    this.checkOwnership(income)

    return db.transaction(async (trx) => {
      if (income.walletId) {
        const wallet = await this.getOwnedWallet(income.walletId)
        wallet.useTransaction(trx)
        wallet.amount -= income.amount
        await wallet.save()
      }

      return this.repository.delete(income, trx)
    })
  }
  async getIncomeById(id: number) {
    const income = await this.repository.findById(id)
    this.checkOwnership(income)
    return income
  }
  async getAllUserIncomes() {
    return this.repository.findAllByUserId(this.userId)
  }
}
