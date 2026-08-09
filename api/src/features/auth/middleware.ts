import { NextFunction, Request, Response } from 'express'
import { getUserIdFromSession } from './session'

export interface AuthenticatedRequest extends Request {
  userId?: string
}

export async function requireAuth(
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> {
  const sessionId = req.cookies.kubechat_session

  if (!sessionId) {
    res.status(401).json({
      message: 'Authentication required'
    })
    return
  }

  const userId = await getUserIdFromSession(sessionId)

  if (!userId) {
    res.status(401).json({
      message: 'Invalid or expired session'
    })
    return
  }

  req.userId = userId

  next()
}