import { type InternalTransferSchema } from '#database/schema'
import InternalTransfer from '#models/internal_transfer'
import { type ModelProps } from '#utils/generics'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class InternalTransferRepository {
  private model = InternalTransfer

  get getModel(): typeof InternalTransfer {
    return this.model
  }

  async create(
    data: ModelProps<InternalTransferSchema>,
    trx?: TransactionClientContract
  ): Promise<InternalTransfer> {
    const transfer = new this.model()
    if (trx) {
      transfer.useTransaction(trx)
    }
    transfer.fill(data)
    await transfer.save()
    return transfer
  }

  async update(
    transfer: InternalTransfer,
    data: Partial<ModelProps<InternalTransferSchema>>,
    trx?: TransactionClientContract
  ): Promise<InternalTransfer> {
    if (trx) {
      transfer.useTransaction(trx)
    }
    return transfer.merge(data).save()
  }

  async delete(transfer: InternalTransfer, trx?: TransactionClientContract): Promise<void> {
    if (trx) {
      transfer.useTransaction(trx)
    }
    await transfer.delete()
  }

  async findById(id: number): Promise<InternalTransfer> {
    return this.model
      .query()
      .where('id', id)
      .preload('sourceWallet')
      .preload('targetWallet')
      .preload('linkedExpense')
      .preload('linkedIncome')
      .firstOrFail()
  }

  async findAllByUserId(userId: number): Promise<InternalTransfer[]> {
    return this.model
      .query()
      .where('user_id', userId)
      .preload('sourceWallet')
      .preload('targetWallet')
      .preload('linkedExpense')
      .preload('linkedIncome')
      .orderBy('created_at', 'desc')
  }

  async paginateByUserId(userId: number, page: number, perPage: number) {
    return this.model
      .query()
      .where('user_id', userId)
      .preload('sourceWallet')
      .preload('targetWallet')
      .preload('linkedExpense')
      .preload('linkedIncome')
      .orderBy('created_at', 'desc')
      .paginate(page, perPage)
  }
}
