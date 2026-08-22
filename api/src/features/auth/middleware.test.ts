import { beforeEach, describe, expect, it, vi } from 'vitest'

import { requireAuth, AuthenticatedRequest } from './middleware'
import { getUserIdFromSession } from './session'

vi.mock('./session', () => ({
  getUserIdFromSession: vi.fn(),
}))

describe('requireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('passes an authentication error to next when no session cookie is present', async () => {
    const req = {
      cookies: {},
    } as unknown as AuthenticatedRequest

    const res = {} as any
    const next = vi.fn()

    await requireAuth(req, res, next)

    expect(next).toHaveBeenCalledOnce()

    const error = next.mock.calls[0][0]

    expect(error).toMatchObject({
      code: 'AUTHENTICATION_REQUIRED',
      statusCode: 401,
      message: 'Authentication required',
    })

    expect(getUserIdFromSession).not.toHaveBeenCalled()
  })

  it('passes an invalid session error to next when the session is invalid or expired', async () => {
    vi.mocked(getUserIdFromSession).mockResolvedValue(null)

    const req = {
      cookies: {
        kubechat_session: 'invalid-session',
      },
    } as unknown as AuthenticatedRequest

    const res = {} as any
    const next = vi.fn()

    await requireAuth(req, res, next)

    expect(getUserIdFromSession).toHaveBeenCalledWith('invalid-session')

    expect(next).toHaveBeenCalledOnce()

    const error = next.mock.calls[0][0]

    expect(error).toMatchObject({
      code: 'INVALID_SESSION',
      statusCode: 401,
      message: 'Invalid or expired session',
    })

    expect(req.userId).toBeUndefined()
  })

  it('sets the user ID and calls next for a valid session', async () => {
    vi.mocked(getUserIdFromSession).mockResolvedValue('user-123')

    const req = {
      cookies: {
        kubechat_session: 'valid-session',
      },
    } as unknown as AuthenticatedRequest

    const res = {} as any
    const next = vi.fn()

    await requireAuth(req, res, next)

    expect(getUserIdFromSession).toHaveBeenCalledWith('valid-session')

    expect(req.userId).toBe('user-123')
    expect(next).toHaveBeenCalledOnce()
    expect(next).toHaveBeenCalledWith()
  })
})
