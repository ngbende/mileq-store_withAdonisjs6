// app/controllers/disconnects_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import LogoutService from '#services/LogoutService'

export default class DisconnectsController {
  public async disconnect({ auth, response }: HttpContext) {
    await auth.use('admin').logout()
    return response.redirect().toRoute('loginAdminForm')
  }
}