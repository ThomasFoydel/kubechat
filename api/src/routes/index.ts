import { Router } from 'express'

import authRoutes from '../features/auth/routes'
import healthRoutes from '../features/health/routes'
import userRoutes from '../features/users/routes'

const router = Router()

router.use(healthRoutes)
router.use(userRoutes)
router.use(authRoutes)

export default router
