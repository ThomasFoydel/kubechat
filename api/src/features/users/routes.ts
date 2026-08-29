import { Router } from 'express'

import {
  getUserById,
  getUserPresenceById,
  getUsers,
} from './controller'

const router = Router()

router.get('/users', getUsers)
router.get('/users/:id/presence', getUserPresenceById)
router.get('/users/:id', getUserById)

export default router
