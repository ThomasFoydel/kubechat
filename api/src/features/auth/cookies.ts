import { Request, Response } from 'express'

const SESSION_COOKIE = 'kubechat_session'

const sessionCookieOptions = {
  httpOnly: true,
  secure: true,
  sameSite: 'none' as const,
  maxAge: 1000 * 60 * 60 * 24 * 7,
  path: '/'
}

export function setSessionCookie(
  res: Response,
  sessionId: string
): void {
  res.cookie(
    SESSION_COOKIE,
    sessionId,
    sessionCookieOptions
  )
}

export function clearSessionCookie(
  res: Response
): void {
  res.clearCookie(
    SESSION_COOKIE,
    sessionCookieOptions
  )
}

export function getSessionCookie(
  req: Request
): string | undefined {
  return req.cookies?.[SESSION_COOKIE]
}