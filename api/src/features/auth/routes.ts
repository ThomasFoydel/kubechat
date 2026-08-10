import { Router } from 'express'
import { validateBody } from '../../middleware/validate'
import {
  getCurrentUser,
  login,
  logout,
  register
} from './controller'
import { loginSchema, registerSchema } from './dto'
import { requireAuth } from './middleware'

const router = Router()

router.post(
  '/auth/register',
  validateBody(registerSchema),
  register
)

router.post(
  '/auth/login',
  validateBody(loginSchema),
  login
)

router.get(
  '/auth/me',
  requireAuth,
  getCurrentUser
)

router.post('/auth/logout', logout)

export default router