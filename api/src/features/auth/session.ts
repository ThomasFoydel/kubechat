import crypto from 'crypto'
import { redis } from '../../db/redis'

const SESSION_PREFIX = 'session:'
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 7

function getSessionKey(sessionId: string): string {
  return `${SESSION_PREFIX}${sessionId}`
}

export async function createSession(userId: string): Promise<string> {
  const sessionId = crypto.randomBytes(32).toString('hex')

  await redis.set(
    getSessionKey(sessionId),
    userId,
    {
      EX: SESSION_TTL_SECONDS
    }
  )

  return sessionId
}

export async function getUserIdFromSession(
  sessionId: string
): Promise<string | null> {
  return redis.get(getSessionKey(sessionId))
}

export async function deleteSession(
  sessionId: string
): Promise<void> {
  await redis.del(getSessionKey(sessionId))
}