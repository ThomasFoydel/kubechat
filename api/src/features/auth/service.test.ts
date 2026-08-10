import { beforeEach, describe, expect, it, vi } from 'vitest'

import { authService } from './service'
import { userService } from '../users/service'
import { hashPassword, verifyPassword } from './password'
import {
  createSession,
  deleteSession
} from './session'

vi.mock('../users/service', () => ({
  userService: {
    getUserByEmail: vi.fn(),
    createUser: vi.fn()
  }
}))

vi.mock('./password', () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn()
}))

vi.mock('./session', () => ({
  createSession: vi.fn(),
  deleteSession: vi.fn()
}))

describe('authService.register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registers a new user and creates a session', async () => {
    vi.mocked(userService.getUserByEmail).mockResolvedValue(null)

    vi.mocked(hashPassword).mockResolvedValue('hashed-password')

    vi.mocked(userService.createUser).mockResolvedValue({
      id: 'user-123',
      username: 'thomas',
      email: 'thomas@example.com',
      createdAt: new Date().toISOString()
    })
    
    vi.mocked(createSession).mockResolvedValue('session-123')

    const result = await authService.register({
      username: 'thomas',
      email: 'thomas@example.com',
      password: 'password123'
    })

    expect(userService.getUserByEmail).toHaveBeenCalledWith(
      'thomas@example.com'
    )

    expect(hashPassword).toHaveBeenCalledWith('password123')

    expect(userService.createUser).toHaveBeenCalledWith({
      username: 'thomas',
      email: 'thomas@example.com',
      passwordHash: 'hashed-password'
    })

    expect(createSession).toHaveBeenCalledWith('user-123')

    expect(result).toEqual({
      sessionId: 'session-123',
      user: {
        id: 'user-123',
        username: 'thomas',
        email: 'thomas@example.com'
      }
    })
  })

  it('rejects registration when the email is already registered', async () => {
    vi.mocked(userService.getUserByEmail).mockResolvedValue({
      id: 'existing-user',
      username: 'existing',
      email: 'thomas@example.com',
      passwordHash: 'existing-hash',
      createdAt: new Date()
    })

    await expect(
      authService.register({
        username: 'thomas',
        email: 'thomas@example.com',
        password: 'password123'
      })
    ).rejects.toThrow('Email already registered')

    expect(hashPassword).not.toHaveBeenCalled()
    expect(userService.createUser).not.toHaveBeenCalled()
    expect(createSession).not.toHaveBeenCalled()
  })
})

describe('authService.login', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('logs in with valid credentials and creates a session', async () => {
    vi.mocked(userService.getUserByEmail).mockResolvedValue({
      id: 'user-123',
      username: 'thomas',
      email: 'thomas@example.com',
      passwordHash: 'hashed-password',
      createdAt: new Date()
    })

    vi.mocked(verifyPassword).mockResolvedValue(true)
    vi.mocked(createSession).mockResolvedValue('session-123')

    const result = await authService.login({
      email: 'thomas@example.com',
      password: 'password123'
    })

    expect(userService.getUserByEmail).toHaveBeenCalledWith(
      'thomas@example.com'
    )

    expect(verifyPassword).toHaveBeenCalledWith(
      'password123',
      'hashed-password'
    )

    expect(createSession).toHaveBeenCalledWith('user-123')

    expect(result).toEqual({
      sessionId: 'session-123',
      user: {
        id: 'user-123',
        username: 'thomas',
        email: 'thomas@example.com'
      }
    })
  })

  it('rejects login when the user does not exist', async () => {
    vi.mocked(userService.getUserByEmail).mockResolvedValue(null)

    await expect(
      authService.login({
        email: 'unknown@example.com',
        password: 'password123'
      })
    ).rejects.toThrow('Invalid email or password')

    expect(verifyPassword).not.toHaveBeenCalled()
    expect(createSession).not.toHaveBeenCalled()
  })

  it('rejects login when the password is incorrect', async () => {
    vi.mocked(userService.getUserByEmail).mockResolvedValue({
      id: 'user-123',
      username: 'thomas',
      email: 'thomas@example.com',
      passwordHash: 'hashed-password',
      createdAt: new Date()
    })

    vi.mocked(verifyPassword).mockResolvedValue(false)

    await expect(
      authService.login({
        email: 'thomas@example.com',
        password: 'wrong-password'
      })
    ).rejects.toThrow('Invalid email or password')

    expect(verifyPassword).toHaveBeenCalledWith(
      'wrong-password',
      'hashed-password'
    )

    expect(createSession).not.toHaveBeenCalled()
  })
})

describe('authService.logout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes the session', async () => {
    vi.mocked(deleteSession).mockResolvedValue()

    await authService.logout('session-123')

    expect(deleteSession).toHaveBeenCalledWith('session-123')
  })
})
