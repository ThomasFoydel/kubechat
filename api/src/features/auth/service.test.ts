import { beforeEach, describe, expect, it, vi } from 'vitest'

import { userService } from '../users/service'
import { makeAuthUser, makePassword, makeSessionId } from '../../test/factories/auth'
import { authService } from './service'
import { hashPassword, verifyPassword } from './password'
import { createSession, deleteSession } from './session'

vi.mock('../users/service', () => ({
  userService: {
    getUserByEmail: vi.fn(),
    createUser: vi.fn(),
  },
}))

vi.mock('./password', () => ({
  hashPassword: vi.fn(),
  verifyPassword: vi.fn(),
}))

vi.mock('./session', () => ({
  createSession: vi.fn(),
  deleteSession: vi.fn(),
}))

describe('authService.register', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('registers a new user and creates a session', async () => {
    const password = makePassword()
    const sessionId = makeSessionId()
    const authUser = makeAuthUser()

    vi.mocked(userService.getUserByEmail).mockResolvedValue(null)

    vi.mocked(hashPassword).mockResolvedValue('hashed-password')

    vi.mocked(userService.createUser).mockResolvedValue({
      ...authUser,
      createdAt: '2026-08-09T00:00:00.000Z',
    })

    vi.mocked(createSession).mockResolvedValue(sessionId)

    const result = await authService.register({
      username: authUser.username,
      email: authUser.email,
      password,
    })

    expect(userService.getUserByEmail).toHaveBeenCalledWith(authUser.email)

    expect(hashPassword).toHaveBeenCalledWith(password)

    expect(userService.createUser).toHaveBeenCalledWith({
      username: authUser.username,
      email: authUser.email,
      passwordHash: 'hashed-password',
    })

    expect(createSession).toHaveBeenCalledWith(authUser.id)

    expect(result).toEqual({
      sessionId,
      user: authUser,
    })
  })

  it('rejects registration when the email is already registered', async () => {
    const authUser = makeAuthUser()

    vi.mocked(userService.getUserByEmail).mockResolvedValue({
      ...authUser,
      passwordHash: 'existing-hash',
      createdAt: new Date(),
    })

    await expect(
      authService.register({
        username: authUser.username,
        email: authUser.email,
        password: makePassword(),
      }),
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
    const authUser = makeAuthUser()
    const password = makePassword()
    const sessionId = makeSessionId()

    vi.mocked(userService.getUserByEmail).mockResolvedValue({
      ...authUser,
      passwordHash: 'hashed-password',
      createdAt: new Date(),
    })

    vi.mocked(verifyPassword).mockResolvedValue(true)
    vi.mocked(createSession).mockResolvedValue(sessionId)

    const result = await authService.login({
      email: authUser.email,
      password,
    })

    expect(userService.getUserByEmail).toHaveBeenCalledWith(authUser.email)

    expect(verifyPassword).toHaveBeenCalledWith(password, 'hashed-password')

    expect(createSession).toHaveBeenCalledWith(authUser.id)

    expect(result).toEqual({
      sessionId,
      user: authUser,
    })
  })

  it('rejects login when the user does not exist', async () => {
    const email = makeAuthUser().email

    vi.mocked(userService.getUserByEmail).mockResolvedValue(null)

    await expect(
      authService.login({
        email,
        password: makePassword(),
      }),
    ).rejects.toThrow('Invalid email or password')

    expect(verifyPassword).not.toHaveBeenCalled()
    expect(createSession).not.toHaveBeenCalled()
  })

  it('rejects login when the password is incorrect', async () => {
    const authUser = makeAuthUser()
    const password = makePassword()

    vi.mocked(userService.getUserByEmail).mockResolvedValue({
      ...authUser,
      passwordHash: 'hashed-password',
      createdAt: new Date(),
    })

    vi.mocked(verifyPassword).mockResolvedValue(false)

    await expect(
      authService.login({
        email: authUser.email,
        password,
      }),
    ).rejects.toThrow('Invalid email or password')

    expect(verifyPassword).toHaveBeenCalledWith(password, 'hashed-password')

    expect(createSession).not.toHaveBeenCalled()
  })
})

describe('authService.logout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('deletes the session', async () => {
    const sessionId = makeSessionId()

    vi.mocked(deleteSession).mockResolvedValue()

    await authService.logout(sessionId)

    expect(deleteSession).toHaveBeenCalledWith(sessionId)
  })
})
