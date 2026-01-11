// validators/messages/fr.ts
export const frenchValidationMessages = {
  // Messages globaux
  required: 'Le champ {{ field }} est obligatoire',
  string: 'Le champ {{ field }} doit être une chaîne de caractères',
  'string.minLength': 'Le champ {{ field }} doit contenir au moins {{ min }} caractères',
  file: 'Le champ {{ field }} doit être un fichier',
  'file.extnames': 'Le fichier doit avoir l\'une des extensions suivantes : {{ extnames }}',
  'file.size': 'Le fichier ne doit pas dépasser {{ size }}',
  number: 'Le champ {{ field }} doit être un nombre',
  
  // Messages spécifiques par champ
  'name.required': 'Le nom du produit est obligatoire',
  'name.minLength': 'Le nom doit contenir au moins {{ min }} caractères',
  
  'description.required': 'La description est obligatoire',
  'description.minLength': 'La description doit contenir au moins {{ min }} caractères',
  
  'main_media_url.required': 'Le fichier média principal est obligatoire',
  'main_media_url.file': 'Le fichier média principal est requis',
  
  'price.string': 'Le prix doit être une valeur valide',
  
  // MESSAGES AMÉLIORÉS POUR LES VARIANTES
  'variants.*.color.required': 'La couleur de la variante {{ index }} est obligatoire',
  'variants.*.size.required': 'La taille de la variante {{ index }} est obligatoire',
  'variants.*.otherAttr.required': 'L\'attribut de la variante {{ index }} est obligatoire',
  'variants.*.price.required': 'Le prix de la variante {{ index }} est obligatoire',
  'variants.*.stock.required': 'Le stock de la variante {{ index }} est obligatoire',
  
    // Messages pour les fichiers média des variantes
  'variants.*.media_url.required': 'Le fichier de la variante {{ index }} est obligatoire',
  'variants.*.media_url.file': 'Le fichier de la variante {{ index }} doit être un fichier valide',
  'variants.*.media_url.extnames': 'Le fichier de la variante {{ index }} doit avoir l\'une des extensions suivantes : {{ extnames }}',
  'variants.*.media_url.size': 'Le fichier de la variante {{ index }} ne doit pas dépasser {{ size }}',

  // Messages spécifiques par index (optionnel)
  'variants.0.media_url.required': 'Le fichier de la première variante est obligatoire',
  'variants.1.media_url.required': 'Le fichier de la deuxième variante est obligatoire',
  'variants.2.media_url.required': 'Le fichier de la troisième variante est obligatoire',
  'variants.*.color.string': 'La couleur de la variante {{ index }} doit être une chaîne de caractères',
  'variants.*.size.string': 'La taille de la variante {{ index }} doit être une chaîne de caractères',
  'variants.*.otherAttr.string': 'L\'attribut de la variante {{ index }} doit être une chaîne de caractères',
  'variants.*.price.string': 'Le prix de la variante {{ index }} doit être une valeur valide',
  'variants.*.stock.string': 'Le stock de la variante {{ index }} doit être un nombre valide',
  
  'variants.*.color.maxLength': 'La couleur de la variante {{ index }} ne doit pas dépasser {{ max }} caractères',
  'variants.*.size.maxLength': 'La taille de la variante {{ index }} ne doit pas dépasser {{ max }} caractères',
  'variants.*.otherAttr.maxLength': 'L\'attribut de la variante {{ index }} ne doit pas dépasser {{ max }} caractères',
  
  // Messages pour les indices spécifiques (optionnel, pour plus de clarté)
  'variants.0.color.required': 'La couleur de la première variante est obligatoire',
  'variants.0.size.required': 'La taille de la première variante est obligatoire',
  'variants.0.price.required': 'Le prix de la première variante est obligatoire',
  'variants.0.stock.required': 'Le stock de la première variante est obligatoire',
  
  'variants.1.color.required': 'La couleur de la deuxième variante est obligatoire',
  'variants.1.size.required': 'La taille de la deuxième variante est obligatoire',
  'variants.1.price.required': 'Le prix de la deuxième variante est obligatoire',
  
  'variants.2.color.required': 'La couleur de la troisième variante est obligatoire',
  'variants.2.size.required': 'La taille de la troisième variante est obligatoire',
  'variants.2.price.required': 'Le prix de la troisième variante est obligatoire',
}

// Version OPTIMISÉE avec boucle propre
export const frenchFieldNames = (() => {
  const fieldNames: Record<string, string> = {
    'name': 'nom du produit',
    'description': 'description',
    'price': 'prix',
    'main_media_url': 'fichier média principal',
  }
  
  // Générer dynamiquement pour 20 variantes (0-19)
  const variantFields = ['color', 'size', 'otherAttr', 'price', 'stock', 'media_url']
  
  for (let i = 0; i < 20; i++) {
    const variantNum = i + 1
    
    for (const field of variantFields) {
      const key = `variants.${i}.${field}`
      
      // Traduction des noms de champs
      const translations: Record<string, string> = {
        'color': 'couleur',
        'size': 'taille',
        'otherAttr': 'attribut',
        'price': 'prix',
        'stock': 'stock',
        'media_url': 'fichier'
      }
      
      fieldNames[key] = `${translations[field] || field} (variante ${variantNum})`
    }
  }
  
  return fieldNames
})()