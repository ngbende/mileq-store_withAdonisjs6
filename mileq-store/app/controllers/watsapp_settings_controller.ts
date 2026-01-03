import type { HttpContext } from '@adonisjs/core/http'
import { productFormValidator } from '#validators/contact_admin'
import SiteSetting from '#models/site_setting'
export default class WatsappSettingsController {
public async udapteContactAdmin({ request, response, session }: HttpContext) {
    // Valider les données du formulaire
    const validatedData = await request.validateUsing(productFormValidator)

    try {
      // Mettre à jour les paramètres de contact dans la base de données
      const siteSetting = await SiteSetting.firstOrFail()
      siteSetting.whatsapp = validatedData.whatsapp ?? null
      siteSetting.email = validatedData.email ?? null
      await siteSetting.save()

      session.flash('success', 'Paramètres de contact mis à jour avec succès.')
      return response.redirect().back()
    } catch (error) {
      console.error('Erreur lors de la mise à jour des paramètres de contact :', error)
      session.flash('error', "Une erreur est survenue lors de la mise à jour des paramètres de contact.")
      return response.redirect().back()
    }
}
}