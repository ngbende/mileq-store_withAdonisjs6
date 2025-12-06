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

router.get('/login', [LoginAdminsController,'showLoginForm'])
router.post('/admin/login', [LoginAdminsController, 'login']).as('admin.login')
router.on('/').render('pages/home')

router.get('/dashboard', async ({ view }) => {
  return view.render('pages/dashboard')
}).as('dashboard').use(middleware.auth())
