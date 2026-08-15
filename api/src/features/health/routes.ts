import { Router } from 'express'
import { livenessCheck, readinessCheck } from './controller'

const router = Router()

router.get('/health/live', livenessCheck)
router.get('/health/ready', readinessCheck)

export default router
