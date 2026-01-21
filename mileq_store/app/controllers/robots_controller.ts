import type { HttpContext } from '@adonisjs/core/http'
import env from '#start/env'  // ⬅️ Import direct

export default class RobotsController {
  async index({ response }: HttpContext) {
    const baseUrl = env.get('APP_URL')  // ⬅️ Direct du .env
    
    const robotsTxt = `User-agent: *
Allow: /
Disallow: /admin/
Disallow: /login/

Sitemap: ${baseUrl}/sitemap.xml
`
    response.header('Content-Type', 'text/plain')
    return robotsTxt
  }
}