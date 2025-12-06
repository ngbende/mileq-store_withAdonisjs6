import Hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Admin from '#models/admin'
export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
      await Admin.query().delete()

    // Liste des admins à créer
    const admins = [
      {
         name: 'Joyce Ngbende',
        email: 'ngbendej@gmail.com',
        password: 'bj1465',
      },
      {
        name: 'Dounia Mang',
        email: 'douniamang@hotmail.com',
        password: 'Dounia@7929',
      },
    ]

    for (const admin of admins) {
      await Admin.create({
        name: admin.name,
        email: admin.email,
        password: await Hash.make(admin.password),
      })
    }

    console.log('✅ 2 admins seedés avec succès !')
  }
}