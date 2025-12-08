/*
|--------------------------------------------------------------------------
| Routes file
|--------------------------------------------------------------------------
|
| The routes file is used for defining the HTTP routes.
|
*/

import router from '@adonisjs/core/services/router'
import LoginAdminsController from '#controllers/login_admins_controller'
 import { middleware } from '#start/kernel'
import CrudProductsController from '#controllers/crud_products_controller'
import HomeController from '#controllers/home_controller'
router.get('/', [HomeController, 'index']).as('home')

router.get('/login', [LoginAdminsController,'showLoginForm'])
router.post('/admin/login', [LoginAdminsController, 'login']).as('admin.login')

// ✅ Page publique d'accueil
router.get('/dashboard', async ({ view }) => {
  return view.render('pages/dashboard')
}).as('dashboard').use(middleware.auth())

router.post('/admin/products', [CrudProductsController, 'store']).as('products.store').use(middleware.auth())

// route pour la creation du produit phare 
router.get('/admin/products/create', [CrudProductsController, 'create']).as('products.create').use(middleware.auth())

// route pour voir les variantes d'un produit
router.get('/produits/:id/variants', [CrudProductsController, 'variants'])
  .as('product.variants')
  .where('id', router.matchers.number()) // ⬅️ ESSENTIEL !

  router.get('/admin/edit_product/', [CrudProductsController, 'showEditProduct']).as('products.edit').use(middleware.auth())

// router.post('/admin/update_product/:id', [CrudProductsController, 'update']).as('products.update').use(middleware.auth())

router.post('/admin/delete_product/:id', [CrudProductsController, 'deleteProduct']).as('products.destroy').use(middleware.auth())
// routes.ts
router.post('/admin/products/:id', [CrudProductsController, 'update'])
  .as('products.update')
  .where('id', router.matchers.number())
  .use(middleware.auth())

router.get('/admin/products/:id/edit', [CrudProductsController, 'showEditProductForm'])
  .as('products.editForm')
  .where('id', router.matchers.number())
  .use(middleware.auth())

  // Routes pour les variantes
router.get('/admin/variants/:variantId/edit', [CrudProductsController, 'showEditVariantForm'])
  .as('variants.editForm')
  .use(middleware.auth())

router.post('/admin/variants/:variantId/update', [CrudProductsController, 'updateVariant'])
  .as('variants.update')
  .use(middleware.auth())

router.get(
  '/admin/products/:id/variants',
  [CrudProductsController, 'adminVariants']
).as('admin.product.variants').use(middleware.auth())

router.post('/admin/variants/:variantId/delete', [CrudProductsController, 'deleteVariant'])
  .as('variants.destroy')
  .use(middleware.auth())