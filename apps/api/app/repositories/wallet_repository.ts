import Wallet from '#models/wallet'
import type { WalletSchema } from '#database/schema'
import { type ModelProps } from '#utils/generics'
import type { TransactionClientContract } from '@adonisjs/lucid/types/database'

export default class WalletRepository {
  private model = Wallet

  get getModel(): typeof Wallet {
    return this.model
  }

  async create(data: ModelProps<WalletSchema>, trx?: TransactionClientContract): Promise<Wallet> {
    const wallet = new this.model()
    if (trx) {
      wallet.useTransaction(trx)
    }
    wallet.fill(data)
    await wallet.save()
    return wallet
  }

  async createMany(
    data: ModelProps<WalletSchema>[],
    trx?: TransactionClientContract
  ): Promise<Wallet[]> {
    const wallets: Wallet[] = []
    for (const item of data) {
      wallets.push(await this.create(item, trx))
    }
    return wallets
  }

  async update(
    wallet: Wallet,
    data: Partial<ModelProps<WalletSchema>>,
    trx?: TransactionClientContract
  ): Promise<Wallet> {
    if (trx) {
      wallet.useTransaction(trx)
    }
    return wallet.merge(data).save()
  }

  async delete(wallet: Wallet, trx?: TransactionClientContract): Promise<void> {
    if (trx) {
      wallet.useTransaction(trx)
    }
    await wallet.delete()
  }

  async findById(id: number): Promise<Wallet> {
    return this.model.query().where('id', id).preload('walletType').firstOrFail()
  }

  async findAllByUserId(userId: number): Promise<Wallet[]> {
    return this.model.query().where('user_id', userId).preload('walletType')
  }
}
