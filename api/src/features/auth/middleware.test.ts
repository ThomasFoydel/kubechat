import { beforeEach, describe, expect, it, vi } from 'vitest'

import {
  requireAuth,
  AuthenticatedRequest
} from './middleware'
import { getUserIdFromSession } from './session'

vi.mock('./session', () => ({
  getUserIdFromSession: vi.fn()
}))

describe('requireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns 401 when no session cookie is present', async () => {
    const req = {
      cookies: {}
    } as AuthenticatedRequest

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }

    const next = vi.fn()

    await requireAuth(req, res, next)

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Authentication required'
    })

    expect(getUserIdFromSession).not.toHaveBeenCalled()
    expect(next).not.toHaveBeenCalled()
  })

  it('returns 401 when the session is invalid or expired', async () => {
    vi.mocked(getUserIdFromSession).mockResolvedValue(null)

    const req = {
      cookies: {
        kubechat_session: 'invalid-session'
      }
    } as AuthenticatedRequest

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }

    const next = vi.fn()

    await requireAuth(req, res, next)

    expect(getUserIdFromSession).toHaveBeenCalledWith(
      'invalid-session'
    )

    expect(res.status).toHaveBeenCalledWith(401)
    expect(res.json).toHaveBeenCalledWith({
      message: 'Invalid or expired session'
    })

    expect(next).not.toHaveBeenCalled()
    expect(req.userId).toBeUndefined()
  })

  it('sets the user ID and calls next for a valid session', async () => {
    vi.mocked(getUserIdFromSession).mockResolvedValue('user-123')

    const req = {
      cookies: {
        kubechat_session: 'valid-session'
      }
    } as AuthenticatedRequest

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    }

    const next = vi.fn()

    await requireAuth(req, res, next)

    expect(getUserIdFromSession).toHaveBeenCalledWith(
      'valid-session'
    )

    expect(req.userId).toBe('user-123')
    expect(next).toHaveBeenCalledOnce()

    expect(res.status).not.toHaveBeenCalled()
    expect(res.json).not.toHaveBeenCalled()
  })
})