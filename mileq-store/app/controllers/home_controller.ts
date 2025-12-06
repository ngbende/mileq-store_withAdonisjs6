// app/controllers/home_controller.ts
import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'

export default class HomeController {
  /**
   * Page d'accueil - Affichage des produits phares
   */
  public async index({ view }: HttpContext) {
    // Récupérer TOUS les produits (ou limitez si vous voulez)
    const products = await Product.query()
      .orderBy('createdAt', 'desc') // Du plus récent au plus ancien
      // .limit(12) // Option: limiter à 12 produits
      // .where('is_featured', true) // Si vous ajoutez un champ "featured"
    
    return view.render('pages/home', { 
      products: products.map(product => product.toJSON()) 
    })
  }
}