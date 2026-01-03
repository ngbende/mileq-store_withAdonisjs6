import vine from '@vinejs/vine'


export const productFormValidator = vine.compile(
  vine.object({
    // Champs obligatoires avec minLength
    whatsapp: vine
    .string()
     .regex(/^\+\d{6,15}$/)
      .optional(),
    
    email: vine.string().email().optional(),
    
   
  })
)
