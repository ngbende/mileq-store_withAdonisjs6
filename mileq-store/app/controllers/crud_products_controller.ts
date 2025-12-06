import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import ProductVariant from '#models/product_variant'
// import Database from '@adonisjs/lucid/database'
// import {productValidator} from '#validators/product'
import { productFormValidator } from '#validators/product'
import { Application } from '@adonisjs/core/app'
import { cuid } from '@adonisjs/core/helpers'
import app from '@adonisjs/core/services/app'

export default class CrudProductsController {
    public async create({ view }: HttpContext) {

        return view.render('pages/dashboard')
    }
     public async store({ request, response }: HttpContext) {
    try {
      // DEBUG: Voir les données entrantes
      console.log('📥 Données reçues:', {
        name: request.input('name'),
        description: request.input('description'),
        price: request.input('price'),
        file: request.file('main_media_url')?.clientName
      })

      // 1️⃣ Validation des données
      const validatedData = await request.validateUsing(productFormValidator)
      
      console.log('✅ Données validées:', validatedData)

      // 2️⃣ Gestion du média principal
      let mainMediaUrl: string | null = null
      let mainMediaType: 'image' | 'video' | null = null

      const mainFile = request.file('main_media_url')
      if (mainFile && mainFile.isValid) {
        const fileName = `${cuid()}.${mainFile.extname}`
        
        // Sauvegarder le fichier
        await mainFile.move(app.makePath('uploads'), {
          name: fileName,
          overwrite: true,
        })
        
        // Générer l'URL (ajuster selon votre configuration)
        mainMediaUrl = `/uploads/${fileName}`
        mainMediaType = mainFile.extname?.includes('mp4') ? 'video' : 'image'
        
        console.log('📁 Fichier sauvegardé:', mainMediaUrl)
      }

      // 3️⃣ Création du produit avec les types corrects
      const productData = {
        name: validatedData.name,
        description: validatedData.description,
        price: validatedData.price ?? null, // Assure que c'est null si undefined
        mainMediaUrl,
        mainMediaType,
      }

      console.log('📝 Données pour création:', productData)

      const product = await Product.create(productData)

      // 4️⃣ Réponse
      return response.status(201).json({
        success: true,
        message: 'Produit créé avec succès',
        data: product.toJSON()
      })

    } catch (error) {
      console.error('❌ Erreur détaillée:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      })
      
      // Gestion des erreurs de validation
      if (error.code === 'E_VALIDATION_ERROR') {
        return response.status(422).json({
          success: false,
          message: 'Erreur de validation',
          errors: error.messages
        })
      }

      // Erreur serveur
      return response.status(500).json({
        success: false,
        message: 'Erreur serveur lors de la création du produit',
        error: process.env.NODE_ENV === 'development' ? error.message : undefined
      })
    }
  }
     
}