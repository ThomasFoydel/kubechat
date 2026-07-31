import { Router } from 'express'

import healthRoutes from '../features/health/routes'

const router = Router()

router.use(healthRoutes)

export default router