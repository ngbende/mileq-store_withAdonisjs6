import vine from '@vinejs/vine'
// validators/product.js

// Utilisez une fonction de transformation séparée pour réutilisabilité
const parsePrice = (value: string | undefined): number | null => {
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
export const productVariantValidator = vine.compile(
  vine.object({
    color: vine.string().trim().optional(),
    size: vine.string().trim().optional(),
    price: vine.number().positive().optional(),
    stock: vine.number().positive().optional(),
    media_url: vine.file({ extnames: ['jpg', 'png', 'mp4'] }).optional(),
  })
)
