import { Request, Response } from 'express'
import { userService } from '../users/service'
import { LoginRequest, RegisterRequest } from './dto'
import { authService } from './service'
import { AuthenticatedRequest } from './middleware'

export async function register(
  req: Request<{}, {}, RegisterRequest>,
  res: Response
): Promise<void> {
  try {
    const user = await authService.register(req.body)

    res.status(201).json(user)
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Email already registered'
    ) {
      res.status(409).json({
        message: error.message
      })
      return
    }

    res.status(500).json({
      message: 'Internal server error'
    })
  }
}

export async function login(
  req: Request<{}, {}, LoginRequest>,
  res: Response
): Promise<void> {
  try {
    const result = await authService.login(req.body)

    res.cookie('kubechat_session', result.sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1000 * 60 * 60 * 24 * 7,
      path: '/'
    })

    res.json(result.user)
  } catch (error) {
    if (
      error instanceof Error &&
      error.message === 'Invalid email or password'
    ) {
      res.status(401).json({
        message: error.message
      })
      return
    }

    res.status(500).json({
      message: 'Internal server error'
    })
  }
}

export async function logout(
  req: Request,
  res: Response
): Promise<void> {
  const sessionId = req.cookies?.kubechat_session

  if (sessionId) {
    await authService.logout(sessionId)
  }

  res.clearCookie('kubechat_session', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/'
  })

  res.status(204).send()
}

export async function getCurrentUser(
  req: AuthenticatedRequest,
  res: Response
): Promise<void> {
  if (!req.userId) {
    res.status(401).json({
      message: 'Authentication required'
    })
    return
  }

  const user = await userService.getUserById(req.userId)

  if (!user) {
    res.status(401).json({
      message: 'User no longer exists'
    })
    return
  }

  res.json(user)
}