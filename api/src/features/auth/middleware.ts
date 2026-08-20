import { NextFunction, Request, Response } from 'express'

import { authenticationRequired, invalidSession } from '../../errors/errors'
import { getUserIdFromSession } from './session'

export interface AuthenticatedRequest extends Request {
  userId?: string
}

export async function requireAuth(
  req: AuthenticatedRequest,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const sessionId = req.cookies.kubechat_session

  if (!sessionId) {
    next(authenticationRequired())
    return
  }

  const userId = await getUserIdFromSession(sessionId)

  if (!userId) {
    next(invalidSession())
    return
  }

  req.userId = userId

  next()
}
