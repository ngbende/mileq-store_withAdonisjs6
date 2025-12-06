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