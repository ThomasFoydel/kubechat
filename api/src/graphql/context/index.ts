import { Request } from 'express'

import { getSessionCookie } from '../../features/auth/cookies'
import { getUserIdFromSession } from '../../features/auth/session'

export interface GraphQLContext {
  userId: string | null
}

export async function createGraphQLContext(req: Request): Promise<GraphQLContext> {
  const sessionId = getSessionCookie(req)

  if (!sessionId) {
    return {
      userId: null,
    }
  }

  const userId = await getUserIdFromSession(sessionId)

  return {
    userId,
  }
}
