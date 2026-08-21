import { Request, Response } from 'express'

import type { LoginRequest, RegisterRequest } from '@kubechat/contracts'
import { authenticationRequired } from '../../errors/errors'
import { userService } from '../users/service'
import { clearSessionCookie, getSessionCookie, setSessionCookie } from './cookies'
import { AuthenticatedRequest } from './middleware'
import { authService } from './service'

export async function register(
  req: Request<{}, {}, RegisterRequest>,
  res: Response,
): Promise<void> {
  const result = await authService.register(req.body)

  setSessionCookie(res, result.sessionId)

  res.status(201).json(result.user)
}

export async function login(req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> {
  const result = await authService.login(req.body)

  setSessionCookie(res, result.sessionId)

  res.json(result.user)
}

export async function logout(req: Request, res: Response): Promise<void> {
  const sessionId = getSessionCookie(req)

  if (sessionId) {
    await authService.logout(sessionId)
  }

  clearSessionCookie(res)

  res.status(204).send()
}

export async function getCurrentUser(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.userId) {
    throw authenticationRequired()
  }

  const user = await userService.getUserById(req.userId)

  if (!user) {
    throw authenticationRequired()
  }

  res.json(user)
}
