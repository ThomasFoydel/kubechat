import { Request, Response } from 'express'
import { getReadinessStatus } from './service'

export async function livenessCheck(_req: Request, res: Response) {
  return res.json({
    status: 'ok',
    service: 'kubechat-api',
    timestamp: new Date().toISOString(),
  })
}

export async function readinessCheck(_req: Request, res: Response) {
  const health = await getReadinessStatus()

  if (health.status === 'ok') {
    return res.json(health)
  }

  return res.status(503).json(health)
}
