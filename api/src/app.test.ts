import { beforeEach, describe, expect, it, vi } from 'vitest'
import request from 'supertest'

const mocks = vi.hoisted(() => ({
  authService: {
    register: vi.fn(),
    login: vi.fn(),
    logout: vi.fn()
  },

  userService: {
    getUserById: vi.fn()
  },

  getReadinessStatus: vi.fn(),

  requireAuth: vi.fn()
}))

vi.hoisted(() => {
  process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test'
  process.env.REDIS_URL = 'redis://localhost:6379'
  process.env.SESSION_SECRET = 'test-session-secret'
  process.env.CORS_ORIGINS = 'http://localhost:3000'
})

vi.mock('./features/auth/service', () => ({
  authService: mocks.authService
}))

vi.mock('./features/users/service', () => ({
  userService: mocks.userService
}))

vi.mock('./features/health/service', () => ({
  getReadinessStatus: mocks.getReadinessStatus
}))

vi.mock('./features/auth/middleware', () => ({
  requireAuth: mocks.requireAuth
}))

import app from './app'

describe('API', () => {
  beforeEach(() => {
    vi.clearAllMocks()

    mocks.getReadinessStatus.mockResolvedValue({
      status: 'ok',
      service: 'kubechat-api',
      database: 'connected',
      redis: 'connected',
      timestamp: '2026-01-01T00:00:00.000Z'
    })

    mocks.requireAuth.mockImplementation((req, _res, next) => {
      req.userId = 'user-123'
      next()
    })
  })

  describe('health routes', () => {
    it('returns a successful liveness response', async () => {
      const response = await request(app)
        .get('/api/v1/health/live')

      expect(response.status).toBe(200)
      expect(response.body.status).toBe('ok')
      expect(response.body.service).toBe('kubechat-api')
      expect(response.body.timestamp).toEqual(expect.any(String))
    })

    it('returns a successful readiness response', async () => {
      const response = await request(app)
        .get('/api/v1/health/ready')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        status: 'ok',
        service: 'kubechat-api',
        database: 'connected',
        redis: 'connected',
        timestamp: '2026-01-01T00:00:00.000Z'
      })

      expect(mocks.getReadinessStatus).toHaveBeenCalledTimes(1)
    })

    it('returns 503 when the service is not ready', async () => {
      mocks.getReadinessStatus.mockResolvedValue({
        status: 'error',
        service: 'kubechat-api',
        database: 'unavailable',
        redis: 'connected',
        timestamp: '2026-01-01T00:00:00.000Z'
      })

      const response = await request(app)
        .get('/api/v1/health/ready')

      expect(response.status).toBe(503)
      expect(response.body.status).toBe('error')
      expect(response.body.database).toBe('unavailable')
    })
  })

  describe('auth routes', () => {
    it('registers a user', async () => {
      mocks.authService.register.mockResolvedValue({
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

      expect(mocks.authService.register).toHaveBeenCalledWith({
        username: 'thomas',
        email: 'thomas@example.com',
        password: 'password123'
      })

      expect(response.headers['set-cookie']).toBeDefined()
    })

    it('rejects an invalid registration request', async () => {
      const response = await request(app)
        .post('/api/v1/auth/register')
        .send({
          username: 'ab',
          email: 'not-an-email',
          password: 'short'
        })

      expect(response.status).toBe(400)
      expect(mocks.authService.register).not.toHaveBeenCalled()
    })

    it('logs in a user', async () => {
      mocks.authService.login.mockResolvedValue({
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

      expect(mocks.authService.login).toHaveBeenCalledWith({
        email: 'thomas@example.com',
        password: 'password123'
      })

      expect(response.headers['set-cookie']).toBeDefined()
    })

    it('returns 401 for invalid login credentials', async () => {
      mocks.authService.login.mockRejectedValue(
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

    it('returns the current user for an authenticated request', async () => {
      mocks.userService.getUserById.mockResolvedValue({
        id: 'user-123',
        username: 'thomas',
        email: 'thomas@example.com',
        createdAt: '2026-01-01T00:00:00.000Z'
      })

      const response = await request(app)
        .get('/api/v1/auth/me')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: 'user-123',
        username: 'thomas',
        email: 'thomas@example.com',
        createdAt: '2026-01-01T00:00:00.000Z'
      })

      expect(mocks.userService.getUserById).toHaveBeenCalledWith(
        'user-123'
      )
    })

    it('logs out a user', async () => {
      const response = await request(app)
        .post('/api/v1/auth/logout')

      expect(response.status).toBe(204)
      expect(mocks.authService.logout).not.toHaveBeenCalled()
    })
  })

  describe('user routes', () => {
    it('returns a user by ID', async () => {
      mocks.userService.getUserById.mockResolvedValue({
        id: 'user-456',
        username: 'alice',
        email: 'alice@example.com',
        createdAt: '2026-01-01T00:00:00.000Z'
      })

      const response = await request(app)
        .get('/api/v1/users/user-456')

      expect(response.status).toBe(200)
      expect(response.body).toEqual({
        id: 'user-456',
        username: 'alice',
        email: 'alice@example.com',
        createdAt: '2026-01-01T00:00:00.000Z'
      })

      expect(mocks.userService.getUserById).toHaveBeenCalledWith(
        'user-456'
      )
    })

    it('returns 404 when the user does not exist', async () => {
      mocks.userService.getUserById.mockResolvedValue(null)

      const response = await request(app)
        .get('/api/v1/users/missing-user')

      expect(response.status).toBe(404)
      expect(response.body).toEqual({
        message: 'User not found'
      })
    })
  })
})
