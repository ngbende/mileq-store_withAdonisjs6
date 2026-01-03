import vine from '@vinejs/vine'
// validators/product.js

// Utilisez une fonction de transformation séparée pour réutilisabilité
// Correction : accepte string | null | undefined
const parsePrice = (value: string | null | undefined): number | null => {
  if (!value || value.trim() === '') return null
  
  // Nettoyer la chaîne
  const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.')
  if (cleaned === '') return null
  
  const number = parseFloat(cleaned)
  return isNaN(number) ? null : number
}

export const productFormValidator = vine.compile(
  vine.object({
    // Champs obligatoires avec minLength
    name: vine
      .string()
      .trim()
      .minLength(3)
      .toLowerCase()
      .transform((value) => value.charAt(0).toUpperCase() + value.slice(1)), // Capitaliser
    
    description: vine
      .string()
      .trim()
      .minLength(10)
      .escape(), // Sécurité contre XSS
    
    // Prix avec transformation propre
    price: vine
      .string()
      .optional()
      .transform(parsePrice), // Retourne number | null
      // NOTE: Pas besoin de .nullable() car transform retourne déjà null
    
    // Fichier optionnel
    main_media_url: vine
      .file({
        extnames: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'],
        size: '10mb',
      })
      .optional(),
  })
)

// Exportez aussi la fonction parsePrice pour la réutiliser ailleurs
export { parsePrice }
export const productVariantsValidator = vine.compile(
  vine.object({
    variants: vine
      .array(
        vine.object({
          color: vine.string().trim().optional(),
          size: vine.string().trim().optional(),
            otherAttr: vine.string().trim().optional(),

          price: vine.string().optional().transform((value) => {
            if (!value) return null
            const cleaned = value.replace(/[^\d.,]/g, '').replace(',', '.')
            const number = parseFloat(cleaned)
            return isNaN(number) ? null : number
          }),

          stock: vine.string().optional().transform((value) => {
            if (!value) return null
            const number = parseInt(value)
            return isNaN(number) ? null : number
          }),

          media_url: vine.file({
            extnames: ['jpg', 'jpeg', 'png', 'gif', 'mp4'],
            size: '10mb',
          }).optional(),
        }).optional() // 🔥 Permet des objets vides
      )
      .optional()     // 🔥 Permet zéro variante
      .nullable(),    // 🔥 Permet même absence complète
  })
)


// Validator pour l'édition d'un produit - tous les champs optionnels
export const editProductValidator = vine.compile(
  vine.object({
    name: vine
      .string()
      .trim()
      .minLength(3)
      .toLowerCase()
      .transform((value) => value.charAt(0).toUpperCase() + value.slice(1))
      .optional()
      .nullable(),
    
    description: vine
      .string()
      .trim()
      .minLength(10)
      .escape()
      .optional()
      .nullable(),
    
    price: vine
      .string()
      .optional()
      .nullable()
      .transform((value) => value ? parsePrice(value) : null),
    
    main_media_url: vine
      .file({
        extnames: ['jpg', 'jpeg', 'png', 'gif', 'mp4', 'mov', 'avi'],
        size: '10mb',
      })
      .optional()
      .nullable(),
  })
)

// Validator pour l'édition d'une variante - tous les champs optionnels
export const editVariantValidator = vine.compile(
  vine.object({
    color: vine.string().trim().optional().nullable(),
    size: vine.string().trim().optional().nullable(),
    otherAttr: vine.string().trim().optional().nullable(),
    price: vine.string().optional().nullable().transform(parsePrice),
    stock: vine.string().optional().nullable().transform((value) => {
      if (!value) return null
      const number = parseInt(value)
      return isNaN(number) ? null : number
    }),
    media_url: vine
      .file({
        extnames: ['jpg', 'jpeg', 'png', 'gif', 'mp4'],
        size: '10mb',
      })
      .optional()
      .nullable(),
  })
)
