import { Router } from 'express'
import {
  register,
  login,
  logout,
  getCurrentUser
} from './controller'
import { requireAuth } from './middleware'

const router = Router()

router.post('/auth/register', register)
router.post('/auth/login', login)
router.post('/auth/logout', logout)
router.get('/auth/me', requireAuth, getCurrentUser)

export default router