import { Router } from 'express'
import { getUserById } from './controller'

const router = Router()

router.get('/users/:id', getUserById)

export default router
