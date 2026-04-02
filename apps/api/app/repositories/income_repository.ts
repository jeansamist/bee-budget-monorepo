import { type IncomeSchema } from '#database/schema'
import Income from '#models/income'
import { type ModelProps } from '#utils/generics'
export default class IncomeRepository {
  private model = Income
  get getModel(): typeof Income {
    return this.model
  }
  async create(data: ModelProps<IncomeSchema>): Promise<Income> {
    return this.model.create(data)
  }
  async update(income: Income, data: Partial<ModelProps<IncomeSchema>>): Promise<Income> {
    return income.merge(data).save()
  }
  async delete(income: Income): Promise<void> {
    await income.delete()
  }
  async deleteById(id: number): Promise<void> {
    await this.model.query().where('id', id).delete()
  }
  async findById(id: number): Promise<Income> {
    return this.model.findOrFail(id)
  }
  async createMany(data: ModelProps<IncomeSchema>[]): Promise<Income[]> {
    return this.model.createMany(data)
  }
  async findAllByUserId(userId: number): Promise<Income[]> {
    return this.model.query().where('user_id', userId)
  }
}
