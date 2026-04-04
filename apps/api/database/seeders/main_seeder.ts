import { BaseSeeder } from '@adonisjs/lucid/seeders'

export default class MainSeeder extends BaseSeeder {
  private async seed(Seeder: { default: typeof BaseSeeder }) {
    await new Seeder.default(this.client).run()
  }

  async run() {
    await this.seed(await import('./user_seeder.js'))
    await this.seed(await import('./wallet_type_seeder.js'))
    await this.seed(await import('./wallet_seeder.js'))
    await this.seed(await import('./income_category_seeder.js'))
    await this.seed(await import('./contact_seeder.js'))
    await this.seed(await import('./income_seeder.js'))
  }
}
