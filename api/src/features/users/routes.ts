import { Router } from 'express'

import { getUserById, getUsers } from './controller'

const router = Router()

router.get('/users', getUsers)
router.get('/users/:id', getUserById)

export default router
