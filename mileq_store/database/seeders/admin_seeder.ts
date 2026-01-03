import Hash from '@adonisjs/core/services/hash'
import { BaseSeeder } from '@adonisjs/lucid/seeders'
import Admin from '#models/admin'
import env from '#start/env'

export default class extends BaseSeeder {
  async run() {
    // Write your database queries inside the run method
      const exists = await Admin.first()
if (exists) {
  console.log('Admins déjà présents, seed ignoré')
  return
}


    // Liste des admins à créer
    const admins = [
    {
    name: env.get('ADMIN_NAME')!,
    email: env.get('ADMIN_EMAIL')!,
    password: env.get('ADMIN_PASSWORD')!,
  },
  {
    name: env.get('ADMIN_NAME1')!,
    email: env.get('ADMIN_EMAIL1')!,
    password: env.get('ADMIN_PASSWORD1')!,
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