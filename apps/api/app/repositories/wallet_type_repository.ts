import WalletType from '#models/wallet_type'
import { type ModelProps } from '#utils/generics'
import type { WalletTypeSchema } from '#database/schema'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class WalletTypeRepository {
  private model = WalletType

  get getModel(): typeof WalletType {
    return this.model
  }

  async create(
    data: ModelProps<WalletTypeSchema>,
    trx?: TransactionClientContract
  ): Promise<WalletType> {
    const walletType = new this.model()
    if (trx) {
      walletType.useTransaction(trx)
    }
    walletType.fill(data)
    await walletType.save()
    return walletType
  }

  async createMany(
    data: ModelProps<WalletTypeSchema>[],
    trx?: TransactionClientContract
  ): Promise<WalletType[]> {
    const walletTypes: WalletType[] = []
    for (const item of data) {
      walletTypes.push(await this.create(item, trx))
    }
    return walletTypes
  }

  async update(
    walletType: WalletType,
    data: Partial<ModelProps<WalletTypeSchema>>,
    trx?: TransactionClientContract
  ): Promise<WalletType> {
    if (trx) {
      walletType.useTransaction(trx)
    }
    return walletType.merge(data).save()
  }

  async delete(walletType: WalletType, trx?: TransactionClientContract): Promise<void> {
    if (trx) {
      walletType.useTransaction(trx)
    }
    await walletType.delete()
  }

  async findById(id: number): Promise<WalletType> {
    return this.model.findOrFail(id)
  }

  async findAllByUserId(userId: number): Promise<WalletType[]> {
    return this.model.query().where('user_id', userId)
  }

  async paginateByUserId(userId: number, page: number, perPage: number) {
    return this.model.query().where('user_id', userId).paginate(page, perPage)
  }
}
