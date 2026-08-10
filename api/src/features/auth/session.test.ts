import { beforeEach, describe, expect, it, vi } from 'vitest'

const { redisMock } = vi.hoisted(() => ({
  redisMock: {
    set: vi.fn(),
    get: vi.fn(),
    del: vi.fn()
  }
}))

vi.mock('../../db/redis', () => ({
  redis: redisMock
}))

import {
  createSession,
  getUserIdFromSession,
  deleteSession
} from './session'

describe('createSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a session with a 7-day expiration', async () => {
    redisMock.set.mockResolvedValue('OK')

    const sessionId = await createSession('user-123')

    expect(sessionId).toMatch(/^[a-f0-9]{64}$/)

    expect(redisMock.set).toHaveBeenCalledWith(
      `session:${sessionId}`,
      'user-123',
      {
        EX: 60 * 60 * 24 * 7
      }
    )
  })
})

describe('getUserIdFromSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the user ID for a valid session', async () => {
    redisMock.get.mockResolvedValue('user-123')

    const result = await getUserIdFromSession('session-123')

    expect(redisMock.get).toHaveBeenCalledWith(
      'session:session-123'
    )

    expect(result).toBe('user-123')
  })

  it('returns null when the session does not exist', async () => {
    redisMock.get.mockResolvedValue(null)

    const result = await getUserIdFromSession('invalid-session')

    expect(redisMock.get).toHaveBeenCalledWith(
      'session:invalid-session'
    )

    expect(result).toBeNull()
  })
})

describe('deleteSession', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes the session from Redis', async () => {
    redisMock.del.mockResolvedValue(1)

    await deleteSession('session-123')

    expect(redisMock.del).toHaveBeenCalledWith(
      'session:session-123'
    )
  })
})