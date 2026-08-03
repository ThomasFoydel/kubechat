import { Router } from 'express'

import healthRoutes from '../features/health/routes'
import userRoutes from '../features/users/routes'

const router = Router()

router.use(healthRoutes)
router.use(userRoutes)

export default router