import { IncomeSchema } from '#database/schema'
import IncomeCategoryRepository from '#repositories/income_category_repository'
import IncomeRepository from '#repositories/income_repository'
import WalletRepository from '#repositories/wallet_repository'
import ContactRepository from '#repositories/contact_repository'
import { INTERNAL_TRANSFER_INCOME_CATEGORY_NAME } from '#utils/internal_transfer'
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
  walletId: number
  date: DateTime
  fromContactId?: number | null
}

type UpdateIncomePayload = Partial<CreateIncomePayload>
type MassUpdateIncomePayload = UpdateIncomePayload & { id: number }

@inject()
export class IncomeService {
  constructor(
    private readonly repository: IncomeRepository,
    private readonly incomeCategoryRepository: IncomeCategoryRepository,
    private readonly walletRepository: WalletRepository,
    private readonly contactRepository: ContactRepository,
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

  private ensureIncomeIsEditable(income: IncomeSchema) {
    if (income.internalTransferId !== null) {
      throw httpError(422, 'This income comes from an internal transfer. Manage it from transfers.')
    }
  }

  private async getOwnedIncomeCategory(incomeCategoryId: number) {
    const incomeCategory = await this.incomeCategoryRepository.findById(incomeCategoryId)
    if (incomeCategory.userId !== this.userId) {
      throw httpError(422, 'The selected income category is invalid')
    }

    if (incomeCategory.isSystem || incomeCategory.name === INTERNAL_TRANSFER_INCOME_CATEGORY_NAME) {
      throw httpError(422, 'The selected income category is reserved for internal transfers')
    }

    return incomeCategory
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
    incomeCategoryId,
  }: Pick<CreateIncomePayload, 'walletId' | 'incomeCategoryId'>) {
    const [incomeCategory, wallet] = await Promise.all([
      this.getOwnedIncomeCategory(incomeCategoryId),
      this.getOwnedWallet(walletId),
    ])

    if (
      incomeCategory.defaultWalletTypeId !== null &&
      incomeCategory.defaultWalletTypeId !== undefined &&
      incomeCategory.defaultWalletTypeId !== wallet.walletTypeId
    ) {
      throw httpError(422, 'The selected wallet does not match the category default wallet type')
    }

    return { incomeCategory, wallet }
  }

  private async validateContactOwnership(fromContactId: number | null | undefined) {
    if (fromContactId === undefined || fromContactId === null) return
    const contact = await this.contactRepository.findById(fromContactId)
    if (contact.userId !== this.userId) {
      throw httpError(422, 'The selected contact is invalid')
    }
  }

  async createIncome(data: CreateIncomePayload) {
    const { wallet } = await this.validateWalletSelection(data)
    await this.validateContactOwnership(data.fromContactId)

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
          fromContactId: data.fromContactId ?? null,
          userId: this.userId,
        } as ModelProps<IncomeSchema>,
        trx
      )
    })
  }

  async updateIncome(id: number, data: UpdateIncomePayload) {
    const income = await this.repository.findById(id)
    this.checkOwnership(income)
    this.ensureIncomeIsEditable(income)
    await this.validateContactOwnership(data.fromContactId)

    const effectiveIncomeCategoryId = data.incomeCategoryId ?? income.incomeCategoryId

    let targetWallet = income.walletId ? await this.getOwnedWallet(income.walletId) : null

    if (data.walletId !== undefined) {
      const { wallet } = await this.validateWalletSelection({
        walletId: data.walletId,
        incomeCategoryId: effectiveIncomeCategoryId,
      })
      targetWallet = wallet
    } else {
      if (!targetWallet) {
        throw httpError(422, 'This income has no wallet assignment yet. Provide walletId')
      }

      const incomeCategory = await this.getOwnedIncomeCategory(effectiveIncomeCategoryId)
      if (
        incomeCategory.defaultWalletTypeId !== null &&
        incomeCategory.defaultWalletTypeId !== undefined &&
        incomeCategory.defaultWalletTypeId !== targetWallet.walletTypeId
      ) {
        throw httpError(422, 'The selected wallet does not match the category default wallet type')
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
          fromContactId: data.fromContactId,
        } as Partial<ModelProps<IncomeSchema>>,
        trx
      )
    })
  }
  async deleteIncome(id: number) {
    const income = await this.repository.findById(id)
    this.checkOwnership(income)
    this.ensureIncomeIsEditable(income)

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

  async getPaginatedUserIncomes(page: number, perPage: number) {
    return this.repository.paginateByUserId(this.userId, page, perPage)
  }

  async createMassIncomes(items: CreateIncomePayload[]) {
    const incomes = []
    for (const item of items) {
      incomes.push(await this.createIncome(item))
    }
    return incomes
  }

  async updateMassIncomes(items: MassUpdateIncomePayload[]) {
    const incomes = []
    for (const item of items) {
      const { id, ...data } = item
      incomes.push(await this.updateIncome(id, data))
    }
    return incomes
  }

  async deleteMassIncomes(ids: number[]) {
    for (const id of ids) {
      await this.deleteIncome(id)
    }
  }
}
