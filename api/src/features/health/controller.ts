import { Request, Response } from 'express'
import { getHealthStatus } from './service'

export async function healthCheck(_req: Request, res: Response) {
  const health = await getHealthStatus()

  if(health.status === 'ok') {
    return res.json(health)
  }

  return res.status(503).json(health)
}