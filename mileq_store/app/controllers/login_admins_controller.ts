 import type { HttpContext } from '@adonisjs/core/http'
import Admin from '#models/admin'
import hash from '@adonisjs/core/services/hash'

export default class LoginAdminsController {
    public async showLoginForm({ view }: HttpContext) {
        return view.render('pages/authAdmin')
    }
    
    public async login({ auth, request, response, session }: HttpContext) {
    const email = request.input('email')
    const password = request.input('password')

    try {
      // 1) Vérifier que l'admin existe
      const admin = await Admin.findBy('email', email)

      if (!admin) {
        session.flash('error', 'Email ou mot de passe incorrect')
        return response.redirect().back()
      }

      // 2) Vérifier le mot de passe
      const isValid = await hash.verify(admin.password, password)

      if (!isValid) {
        session.flash('error', 'Email ou mot de passe incorrect')
        return response.redirect().back()
      }

      // 3) Connecter avec le guard admin
      await auth.use('admin').login(admin)

      return response.redirect().toRoute('dashboard')

    } catch (error) {
      console.log(error)
      session.flash('error', 'Une erreur est survenue')
      return response.redirect().back()
    }
  }
}