import type { HttpContext } from '@adonisjs/core/http'
import Product from '#models/product'
import app from '@adonisjs/core/services/app'
import { DateTime } from 'luxon'

export default class SitemapController {
  async index({ response }: HttpContext) {
    const products = await Product.query()
      .whereNotNull('mainMediaUrl')
      .orderBy('updatedAt', 'desc')

    const baseUrl = app.config.get('app.url')

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>${baseUrl}</loc>
    <lastmod>${DateTime.now().toISODate()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>

  ${products.map(product => `
  <url>
    <loc>${baseUrl}/produits/${product.id}/variants</loc>
    <lastmod>${product.updatedAt.toISODate()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>`).join('')}
</urlset>`

    response.header('Content-Type', 'application/xml')
    return sitemap
  }
}