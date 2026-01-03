import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import ProductVariant from '#models/product_variant'
// import Database from '@adonisjs/lucid/database'
// import {productValidator} from '#validators/product'
import { productFormValidator } from '#validators/product'
import { productVariantsValidator } from '#validators/product'
import { editProductValidator } from '#validators/product'
import { editVariantValidator } from '#validators/product'
import Setting from '#models/site_setting'

// import { Application } from '@adonisjs/core/app'
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
   // 4️⃣ Gestion des variantes de produit
try {
  const validatedVariants = await request.validateUsing(productVariantsValidator)
  console.log('📦 Variantes validées:', validatedVariants)
  
  if (validatedVariants.variants && Array.isArray(validatedVariants.variants)) {
    const variantsToCreate = []
    
    for (let i = 0; i < validatedVariants.variants.length; i++) {
      const variant = validatedVariants.variants[i]
        if (!variant) continue // <-- ignore undefined
      let mediaUrl: string | null = null
      let mediaType: 'image' | 'video' | null = null
      
      // Récupérer le fichier POUR CETTE variante spécifique
      const variantFile = request.file(`variants.${i}.media_url`)
      console.log(`📄 Fichier variante ${i}:`, variantFile?.clientName)
      
      if (variantFile && variantFile.isValid) {
        const fileName = `${cuid()}_variant_${i}.${variantFile.extname}`
       await variantFile.move(app.makePath('public/uploads'), { name: fileName, overwrite: true })

        mediaUrl = `/uploads/${fileName}`
        mediaType = variantFile.extname?.includes('mp4') ? 'video' : 'image'
        console.log(`📁 Fichier variante sauvegardé:`, mediaUrl)
      }
      
      // Nettoyer les données
      const cleanVariant = {
        productId: product.id, // Utiliser l'ID du produit créé
        color: variant.color || null,
        size: variant.size || null,
        otherAttr: variant.otherAttr || null,
        price: variant.price || null,
        stock: variant.stock || null,
        mediaUrl, // camelCase pour le modèle
        mediaType, // camelCase pour le modèle
      }
      
      // Vérifier que la variante a au moins une donnée
      const hasData = cleanVariant.color || cleanVariant.size || cleanVariant.otherAttr || 
               cleanVariant.price || cleanVariant.stock || cleanVariant.mediaUrl
      
      if (hasData) {
        variantsToCreate.push(cleanVariant)
      }
    }
    
    // Créer toutes les variantes
    if (variantsToCreate.length > 0) {
      await ProductVariant.createMany(variantsToCreate)
      console.log(`✅ ${variantsToCreate.length} variante(s) créée(s)`)
    }
  }
} catch (error) {
  console.warn('⚠️ Erreur lors de la validation des variantes:', error.message)
  // On continue même si les variantes ont une erreur
}

      
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

  public async variants({ params, view }: HttpContext) {
  const product = await Product.findOrFail(params.id)
  const variants = await ProductVariant.query()
    .where('productId', params.id)
    .orderBy('price', 'asc')
   // Récupérer le setting correct
  let siteSetting = await Setting.query().orderBy('id', 'desc').first()
  
  if (!siteSetting) {
    siteSetting = await Setting.create({ whatsapp: null, email: null })
  }

  console.log('🔍 DEBUG variants:', {
    productId: params.id,
    product: product.toJSON(),
    variantsCount: variants.length,
    variants: variants.map(v => v.toJSON())
  })
  
  // Vérifie que les données sont correctes
  return view.render('pages/variants', {
    product: product.toJSON(),       // CONVERTIR EN JSON
    variants: variants.map(v => v.toJSON()),  // CONVERTIR EN JSON,
     settings: siteSetting.toJSON() 
  })
}

  public async showEditProduct({  view }: HttpContext) {
     // Récupérer TOUS les produits (ou limitez si vous voulez)
        const products = await Product.query()
          .orderBy('createdAt', 'desc') // Du plus récent au plus ancien
    return view.render('pages/edit_products', { products: products.map(p => p.toJSON()) })
  }

  public async deleteProduct({ params, response }: HttpContext) {
    const product = await Product.findOrFail(params.id)
    await product.delete()

    return response.redirect().back()
  }   
 public async showEditProductForm({ params, view }: HttpContext) {
    try {
      const product = await Product.findOrFail(params.id)
      const variants = await ProductVariant.query()
        .where('productId', product.id)
        .orderBy('price', 'asc')

      const productJson = product.toJSON()
      productJson.variants = variants.map(v => v.toJSON()) || []

      return view.render('pages/product_form_edit', {
        product: productJson
      })
    } catch (error) {
      console.error('❌ Erreur showEditProductForm:', error)
      // Gestion d'erreur...
    }
  }

  public async update({ params, request, response, session }: HttpContext) {
    try {
      // 1️⃣ Trouver le produit
      const product = await Product.findOrFail(params.id)
      console.log('📥 Début mise à jour produit ID:', product.id)

      // 2️⃣ Validation des données du produit
      const validatedData = await request.validateUsing(editProductValidator)
      console.log('✅ Données produit validées:', validatedData)

      // 3️⃣ Gestion du média principal
      let mainMediaUrl = product.mainMediaUrl
      let mainMediaType = product.mainMediaType

      const mainFile = request.file('main_media_url')
      if (mainFile && mainFile.isValid) {
        const fileName = `${cuid()}.${mainFile.extname}`
        await mainFile.move(app.makePath('uploads'), {
          name: fileName,
          overwrite: true,
        })
        mainMediaUrl = `/uploads/${fileName}`
        mainMediaType = mainFile.extname?.includes('mp4') ? 'video' : 'image'
        console.log('📁 Nouveau média principal:', mainMediaUrl)
      }

      // 4️⃣ Mise à jour du produit
      const updateData: any = {}
      if (validatedData.name !== undefined) updateData.name = validatedData.name
      if (validatedData.description !== undefined) updateData.description = validatedData.description
      if (validatedData.price !== undefined) updateData.price = validatedData.price
      if (mainMediaUrl !== product.mainMediaUrl) {
        updateData.mainMediaUrl = mainMediaUrl
        updateData.mainMediaType = mainMediaType
      }

      if (Object.keys(updateData).length > 0) {
        await product.merge(updateData).save()
        console.log('✅ Produit mis à jour:', product.id)
      } else {
        console.log('ℹ️ Aucun changement pour le produit principal')
      }

      // 5️⃣ Gestion des variantes
      console.log('🔍 Début gestion des variantes...')

      // Récupérer les variantes existantes
      const existingVariants = await ProductVariant.query()
        .where('productId', product.id)
      console.log('📋 Variantes existantes:', existingVariants.map(v => ({id: v.id, color: v.color, size: v.size})))

      // Gestion des variantes à supprimer
      const variantsToDelete = request.input('variants_to_delete', [])
      console.log('🗑️ Variantes à supprimer:', variantsToDelete)

      if (variantsToDelete.length > 0) {
        await ProductVariant.query()
          .whereIn('id', variantsToDelete)
          .delete()
        console.log(`✅ ${variantsToDelete.length} variante(s) supprimée(s)`)
      }

      // 6️⃣ Gestion des variantes existantes
      console.log('🔄 Recherche des variantes existantes dans le formulaire...')
      
      let variantIndex = 0
      const newVariantsToCreate: any[] = []
      const maxIterations = 20

      while (variantIndex < maxIterations) {
        const variantId = request.input(`variants[${variantIndex}][id]`)
        const color = request.input(`variants[${variantIndex}][color]`)
        const size = request.input(`variants[${variantIndex}][size]`)
          const otherAttr = request.input(`variants[${variantIndex}][otherAttr]`)

        const price = request.input(`variants[${variantIndex}][price]`)
        const stock = request.input(`variants[${variantIndex}][stock]`)

        console.log(`   🔍 Index ${variantIndex}:`, { variantId, color, size, otherAttr, price, stock })
        // Si aucun champ n'est rempli pour cet index, arrêter
        if (!variantId && !color && !size && !otherAttr && !price && !stock) {
    console.log(`   ⏹️ Aucune donnée pour index ${variantIndex}, arrêt`)
    break
  }

        // Récupérer le fichier pour cette variante
        const variantFile = request.file(`variants[${variantIndex}][media_url]`)
        console.log(`   📄 Fichier variante ${variantIndex}:`, variantFile?.clientName)

        let mediaUrl = null
        let mediaType = null

        if (variantFile && variantFile.isValid) {
          const fileName = `${cuid()}_variant_${variantIndex}.${variantFile.extname}`
          await variantFile.move(app.makePath('public/uploads'), {
            name: fileName,
            overwrite: true,
          })
          mediaUrl = `/uploads/${fileName}`
          mediaType = variantFile.extname?.includes('mp4') ? 'video' : 'image'
          console.log(`   📁 Fichier variante sauvegardé:`, mediaUrl)
        }

        // Préparer les données pour validation
        const variantDataForValidation: any = {
          color: color || null,
          size: size || null,
          otherAttr: otherAttr || null, 
          price: price || null,
          stock: stock || null,
        }

        if (variantFile) {
          variantDataForValidation.media_url = variantFile
        }

        try {
          // Validation des données de la variante
          const validatedVariant = await editVariantValidator.validate(variantDataForValidation)
          console.log(`   ✅ Variante ${variantIndex} validée:`, validatedVariant)

          // Préparer les données finales
          const variantData: any = {
            productId: product.id,
            color: validatedVariant.color,
            size: validatedVariant.size,
            otherAttr: validatedVariant.otherAttr || null,
            price: validatedVariant.price,
            stock: validatedVariant.stock,
            mediaUrl,
            mediaType,
          }

          // Si c'est une variante existante (avec ID)
          if (variantId && variantId !== '') {
            const existingVariant = existingVariants.find(v => v.id === parseInt(variantId))
            if (existingVariant) {
              // Garder l'URL média existante si aucun nouveau fichier
              if (!mediaUrl && existingVariant.mediaUrl) {
                variantData.mediaUrl = existingVariant.mediaUrl
                variantData.mediaType = existingVariant.mediaType
              }

              // Vérifier si quelque chose a changé
              const hasChanges = 
                variantData.color !== existingVariant.color ||
                variantData.size !== existingVariant.size ||
                 variantData.otherAttr !== existingVariant.otherAttr || 
                variantData.price !== existingVariant.price ||
                variantData.stock !== existingVariant.stock ||
                variantData.mediaUrl !== existingVariant.mediaUrl

              if (hasChanges) {
                await existingVariant.merge(variantData).save()
                console.log(`   🔄 Variante existante mise à jour:`, variantId)
              } else {
                console.log(`   ℹ️ Aucun changement pour variante`, variantId)
              }
            }
          } else if (color || size || price || stock || mediaUrl) {
            // Nouvelle variante (sans ID) - à créer plus tard
            newVariantsToCreate.push(variantData)
            console.log(`   ➕ Nouvelle variante ajoutée à créer`)
          }
        } catch (validationError) {
          console.warn(`   ⚠️ Erreur validation variante ${variantIndex}:`, validationError.message)
        }

        variantIndex++
      }

      // 7️⃣ Gestion des NOUVELLES variantes (celles ajoutées via le bouton "Ajouter une nouvelle variante")
      console.log('🆕 Recherche des NOUVELLES variantes...')
      const newVariantsData = request.all().new_variants || {}
      console.log('📦 Nouvelles variantes reçues:', Object.keys(newVariantsData).length)

      for (const key in newVariantsData) {
        const newVariant = newVariantsData[key]
        console.log(`   🔍 Nouvelle variante ${key}:`, {
          color: newVariant.color,
          size: newVariant.size,
           otherAttr: newVariant.otherAttr,
          price: newVariant.price,
          stock: newVariant.stock
        })

        // Vérifier si au moins un champ est rempli
        if (newVariant.color || newVariant.size || newVariant.price || newVariant.stock) {
          let mediaUrl = null
          let mediaType = null

          // Récupérer le fichier pour cette nouvelle variante
          const newVariantFile = request.file(`new_variants[${key}][media_url]`)
          console.log(`   📄 Fichier nouvelle variante ${key}:`, newVariantFile?.clientName)

          if (newVariantFile && newVariantFile.isValid) {
            const fileName = `${cuid()}_new_variant_${key}.${newVariantFile.extname}`
            await newVariantFile.move(app.makePath('public/uploads'), {
              name: fileName,
              overwrite: true,
            })
            mediaUrl = `/uploads/${fileName}`
            mediaType = newVariantFile.extname?.includes('mp4') ? 'video' : 'image'
            console.log(`   📁 Fichier nouvelle variante sauvegardé:`, mediaUrl)
          }

          // Validation des données
          try {
            const variantDataForValidation: any = {
              color: newVariant.color || null,
              size: newVariant.size || null,
               otherAttr: newVariant.otherAttr || null, 
              price: newVariant.price || null,
              stock: newVariant.stock || null,
            }

            if (newVariantFile) {
              variantDataForValidation.media_url = newVariantFile
            }

            const validatedVariant = await editVariantValidator.validate(variantDataForValidation)

            // Ajouter à la liste des nouvelles variantes à créer
            newVariantsToCreate.push({
              productId: product.id,
              color: validatedVariant.color,
              size: validatedVariant.size,
              otherAttr: validatedVariant.otherAttr || null,
              price: validatedVariant.price,
              stock: validatedVariant.stock,
              mediaUrl,
              mediaType,
            })
            console.log(`   ✅ Nouvelle variante ${key} préparée pour création`)
          } catch (validationError) {
            console.warn(`   ⚠️ Erreur validation nouvelle variante ${key}:`, validationError.message)
          }
        }
      }

      // 8️⃣ Créer TOUTES les nouvelles variantes (celles sans ID + celles de new_variants)
      if (newVariantsToCreate.length > 0) {
        await ProductVariant.createMany(newVariantsToCreate)
        console.log(`✅ ${newVariantsToCreate.length} nouvelle(s) variante(s) créée(s)`)
      }

      console.log(`🔚 Fin gestion des variantes. Traitées: ${variantIndex}, Nouvelles: ${newVariantsToCreate.length}`)

      // 9️⃣ Réponse
      session.flash('success', 'Produit mis à jour avec succès')
      return response.redirect().toRoute('products.editForm', { id: product.id })

    } catch (error) {
      console.error('❌ Erreur lors de la mise à jour:', {
        message: error.message,
        code: error.code,
        stack: error.stack
      })

      if (error.code === 'E_VALIDATION_ERROR') {
        session.flash('errors', error.messages)
        session.flashAll()
        return response.redirect().back()
      }

      session.flash('error', 'Erreur serveur lors de la mise à jour du produit')
      return response.redirect().back()
    }
  }

  public async deleteVariant({ params, response, session }: HttpContext) {
    try {
      const variant = await ProductVariant.findOrFail(params.variantId)
      await variant.delete()
      session.flash('success', 'Variante supprimée avec succès')
      return response.redirect().back()
    } catch (error) {
      session.flash('error', 'Erreur lors de la suppression de la variante')
      return response.redirect().back()
    }
  }
  public async showEditVariantForm({ params, view, response }: HttpContext) {
  try {
    const variant = await ProductVariant.findOrFail(params.variantId)
    const product = await Product.findOrFail(variant.productId)
    
    return view.render('pages/edit_variant', {
      product: product.toJSON(),
      variant: variant.toJSON()
    })
  } catch (error) {
    console.error('❌ Erreur showEditVariantForm:', error)
    return response.redirect().back()
  }
}

public async updateVariant({ params, request, response, session }: HttpContext) {
  try {
    const variant = await ProductVariant.findOrFail(params.variantId)
    
    const validatedData = await request.validateUsing(editVariantValidator)
    
    // Gestion du fichier média
    let mediaUrl = variant.mediaUrl
    let mediaType = variant.mediaType
    
    const mediaFile = request.file('media_url')
    if (mediaFile && mediaFile.isValid) {
      const fileName = `${cuid()}_variant_${variant.id}.${mediaFile.extname}`
      await mediaFile.move(app.makePath('public/uploads'), {
        name: fileName,
        overwrite: true,
      })
      mediaUrl = `/uploads/${fileName}`
      mediaType = mediaFile.extname?.includes('mp4') ? 'video' : 'image'
    }
    
    // Mise à jour
    await variant.merge({
      color: validatedData.color,
      size: validatedData.size,
      otherAttr: validatedData.otherAttr,
      price: validatedData.price,
      stock: validatedData.stock,
      mediaUrl,
      mediaType
    }).save()
    
    session.flash('success', 'Variante mise à jour avec succès')
    return response.redirect().back()
    
  } catch (error) {
    console.error('❌ Erreur updateVariant:', error)
    session.flash('error', 'Erreur lors de la mise à jour')
    return response.redirect().back()
  }
}
public async adminVariants({ params, view }: HttpContext) {
  const product = await Product.findOrFail(params.id)
  const variants = await ProductVariant.query()
    .where('productId', params.id)
    .orderBy('price', 'asc')
  
  return view.render('pages/variants_edit', {
    product: product.toJSON(),
    variants: variants.map(v => v.toJSON())
  })
}
}