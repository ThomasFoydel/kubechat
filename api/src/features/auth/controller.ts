import { Request, Response } from 'express'
import { userService } from '../users/service'
import { clearSessionCookie, getSessionCookie, setSessionCookie } from './cookies'
import { LoginRequest, RegisterRequest } from './dto'
import { AuthenticatedRequest } from './middleware'
import { authService } from './service'

export async function register(
  req: Request<{}, {}, RegisterRequest>,
  res: Response,
): Promise<void> {
  try {
    const result = await authService.register(req.body)

    setSessionCookie(res, result.sessionId)

    res.status(201).json(result.user)
  } catch (error) {
    console.error('Register error:', error)

    if (error instanceof Error && error.message === 'Email already registered') {
      res.status(409).json({
        message: error.message,
      })
      return
    }

    res.status(500).json({
      message: 'Internal server error',
    })
  }
}

export async function login(req: Request<{}, {}, LoginRequest>, res: Response): Promise<void> {
  try {
    const result = await authService.login(req.body)

    setSessionCookie(res, result.sessionId)

    res.json(result.user)
  } catch (error) {
    console.error('Login error:', error)

    if (error instanceof Error && error.message === 'Invalid email or password') {
      res.status(401).json({
        message: error.message,
      })
      return
    }

    res.status(500).json({
      message: 'Internal server error',
    })
  }
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
    res.status(401).json({
      message: 'Authentication required',
    })
    return
  }

  const user = await userService.getUserById(req.userId)

  if (!user) {
    res.status(401).json({
      message: 'User no longer exists',
    })
    return
  }

  res.json(user)
}
