import request from 'supertest'
import {
  beforeEach,
  describe,
  expect,
  it,
  vi
} from 'vitest'

import app from '../../app'
import { userService } from '../users/service'
import { authService } from './service'
import { getUserIdFromSession } from './session'

vi.mock('./service', () => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
    logout: vi.fn()
  }
}))

vi.mock('../users/service', () => ({
  userService: {
    createUser: vi.fn(),
    getUserById: vi.fn(),
    getUserByEmail: vi.fn()
  }
}))

vi.mock('./session', () => ({
  createSession: vi.fn(),
  getUserIdFromSession: vi.fn(),
  deleteSession: vi.fn()
}))

describe('POST /api/v1/auth/register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registers a user and sets a session cookie', async () => {
    vi.mocked(authService.register).mockResolvedValue({
      sessionId: 'session-123',
      user: {
        id: 'user-123',
        username: 'thomas',
        email: 'thomas@example.com'
      }
    })

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'thomas',
        email: 'thomas@example.com',
        password: 'password123'
      })

    expect(response.status).toBe(201)

    expect(response.body).toEqual({
      id: 'user-123',
      username: 'thomas',
      email: 'thomas@example.com'
    })

    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'kubechat_session=session-123'
        )
      ])
    )

    expect(authService.register).toHaveBeenCalledWith({
      username: 'thomas',
      email: 'thomas@example.com',
      password: 'password123'
    })
  })

  it('rejects invalid registration data', async () => {
    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'th',
        email: 'not-an-email',
        password: 'short'
      })

    expect(response.status).toBe(400)
    expect(authService.register).not.toHaveBeenCalled()
  })

  it('returns 409 when the email is already registered', async () => {
    vi.mocked(authService.register).mockRejectedValue(
      new Error('Email already registered')
    )

    const response = await request(app)
      .post('/api/v1/auth/register')
      .send({
        username: 'thomas',
        email: 'thomas@example.com',
        password: 'password123'
      })

    expect(response.status).toBe(409)

    expect(response.body).toEqual({
      message: 'Email already registered'
    })
  })
})

describe('POST /api/v1/auth/login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logs in a user and sets a session cookie', async () => {
    vi.mocked(authService.login).mockResolvedValue({
      sessionId: 'session-456',
      user: {
        id: 'user-123',
        username: 'thomas',
        email: 'thomas@example.com'
      }
    })

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'thomas@example.com',
        password: 'password123'
      })

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      id: 'user-123',
      username: 'thomas',
      email: 'thomas@example.com'
    })

    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringContaining(
          'kubechat_session=session-456'
        )
      ])
    )

    expect(authService.login).toHaveBeenCalledWith({
      email: 'thomas@example.com',
      password: 'password123'
    })
  })

  it('rejects invalid login data', async () => {
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'not-an-email',
        password: ''
      })

    expect(response.status).toBe(400)
    expect(authService.login).not.toHaveBeenCalled()
  })

  it('returns 401 for invalid credentials', async () => {
    vi.mocked(authService.login).mockRejectedValue(
      new Error('Invalid email or password')
    )

    const response = await request(app)
      .post('/api/v1/auth/login')
      .send({
        email: 'thomas@example.com',
        password: 'wrong-password'
      })

    expect(response.status).toBe(401)

    expect(response.body).toEqual({
      message: 'Invalid email or password'
    })
  })
})

describe('POST /api/v1/auth/logout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logs out the current session and clears the cookie', async () => {
    vi.mocked(authService.logout).mockResolvedValue()

    const response = await request(app)
      .post('/api/v1/auth/logout')
      .set(
        'Cookie',
        'kubechat_session=session-123'
      )

    expect(response.status).toBe(204)

    expect(authService.logout).toHaveBeenCalledWith(
      'session-123'
    )

    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringContaining('kubechat_session=')
      ])
    )
  })

  it('clears the cookie even when no session exists', async () => {
    const response = await request(app)
      .post('/api/v1/auth/logout')

    expect(response.status).toBe(204)

    expect(authService.logout).not.toHaveBeenCalled()

    expect(response.headers['set-cookie']).toEqual(
      expect.arrayContaining([
        expect.stringContaining('kubechat_session=')
      ])
    )
  })
})

describe('GET /api/v1/auth/me', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the current user for a valid session', async () => {
    vi.mocked(getUserIdFromSession).mockResolvedValue(
      'user-123'
    )

    vi.mocked(userService.getUserById).mockResolvedValue({
      id: 'user-123',
      username: 'thomas',
      email: 'thomas@example.com',
      createdAt: '2026-08-09T00:00:00.000Z'
    })

    const response = await request(app)
      .get('/api/v1/auth/me')
      .set(
        'Cookie',
        'kubechat_session=session-123'
      )

    expect(response.status).toBe(200)

    expect(response.body).toEqual({
      id: 'user-123',
      username: 'thomas',
      email: 'thomas@example.com',
      createdAt: '2026-08-09T00:00:00.000Z'
    })

    expect(getUserIdFromSession).toHaveBeenCalledWith(
      'session-123'
    )

    expect(userService.getUserById).toHaveBeenCalledWith(
      'user-123'
    )
  })

  it('rejects a request without a session cookie', async () => {
    const response = await request(app)
      .get('/api/v1/auth/me')

    expect(response.status).toBe(401)

    expect(response.body).toEqual({
      message: 'Authentication required'
    })

    expect(getUserIdFromSession).not.toHaveBeenCalled()
  })

  it('rejects an invalid or expired session', async () => {
    vi.mocked(getUserIdFromSession).mockResolvedValue(null)

    const response = await request(app)
      .get('/api/v1/auth/me')
      .set(
        'Cookie',
        'kubechat_session=expired-session'
      )

    expect(response.status).toBe(401)

    expect(response.body).toEqual({
      message: 'Invalid or expired session'
    })

    expect(userService.getUserById).not.toHaveBeenCalled()
  })

  it('rejects a session for a user that no longer exists', async () => {
    vi.mocked(getUserIdFromSession).mockResolvedValue(
      'deleted-user'
    )

    vi.mocked(userService.getUserById).mockResolvedValue(
      null
    )

    const response = await request(app)
      .get('/api/v1/auth/me')
      .set(
        'Cookie',
        'kubechat_session=session-123'
      )

    expect(response.status).toBe(401)

    expect(response.body).toEqual({
      message: 'User no longer exists'
    })
  })
})
