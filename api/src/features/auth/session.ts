import crypto from 'crypto'
import { redis } from '../../db/redis'

const SESSION_PREFIX = 'session:'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function getSessionKey(sessionId: string): string {
  return `${SESSION_PREFIX}${sessionId}`
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomBytes(32).toString('hex')

  await redis.set(getSessionKey(sessionId), userId, {
    EX: SESSION_TTL_SECONDS,
  })

  return sessionId
}

export async function getUserIdFromSession(sessionId: string): Promise<string | null> {
  return redis.get(getSessionKey(sessionId))
}

export async function deleteSession(sessionId: string): Promise<void> {
  await redis.del(getSessionKey(sessionId))
}

export async function getUserIdFromCookieHeader(cookieHeader?: string): Promise<string | null> {
  if (!cookieHeader) {
    return null
  }

  const cookies = cookieHeader.split(';').map((cookie) => cookie.trim())

  const sessionCookie = cookies.find((cookie) => cookie.startsWith('kubechat_session='))

  if (!sessionCookie) {
    return null
  }

  const sessionId = sessionCookie.slice('kubechat_session='.length)

  if (!sessionId) {
    return null
  }

  return getUserIdFromSession(sessionId)
}
