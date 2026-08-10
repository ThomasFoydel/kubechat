import { beforeEach, describe, expect, it, vi } from 'vitest'

import { userService } from './service'
import { userRepository } from './repository'
import { toUserResponse } from './mapper'

vi.mock('./repository', () => ({
  userRepository: {
    createUser: vi.fn(),
    getUserById: vi.fn(),
    getUserByEmail: vi.fn()
  }
}))

vi.mock('./mapper', () => ({
  toUserResponse: vi.fn()
}))

describe('userService.createUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a user and returns the mapped response', async () => {
    const repositoryUser = {
      id: 'user-123',
      username: 'thomas',
      email: 'thomas@example.com',
      passwordHash: 'hashed-password',
      createdAt: new Date()
    }

    const userResponse = {
      id: 'user-123',
      username: 'thomas',
      email: 'thomas@example.com',
      createdAt: repositoryUser.createdAt.toISOString()
    }

    vi.mocked(userRepository.createUser).mockResolvedValue(
      repositoryUser
    )

    vi.mocked(toUserResponse).mockReturnValue(userResponse)

    const result = await userService.createUser({
      username: 'thomas',
      email: 'thomas@example.com',
      passwordHash: 'hashed-password'
    })

    expect(userRepository.createUser).toHaveBeenCalledWith(
      'thomas',
      'thomas@example.com',
      'hashed-password'
    )

    expect(toUserResponse).toHaveBeenCalledWith(repositoryUser)

    expect(result).toEqual(userResponse)
  })
})

describe('userService.getUserById', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the mapped user when the user exists', async () => {
    const repositoryUser = {
      id: 'user-123',
      username: 'thomas',
      email: 'thomas@example.com',
      passwordHash: 'hashed-password',
      createdAt: new Date()
    }

    const userResponse = {
      id: 'user-123',
      username: 'thomas',
      email: 'thomas@example.com',
      createdAt: repositoryUser.createdAt.toISOString()
    }

    vi.mocked(userRepository.getUserById).mockResolvedValue(
      repositoryUser
    )

    vi.mocked(toUserResponse).mockReturnValue(userResponse)

    const result = await userService.getUserById('user-123')

    expect(userRepository.getUserById).toHaveBeenCalledWith(
      'user-123'
    )

    expect(toUserResponse).toHaveBeenCalledWith(repositoryUser)

    expect(result).toEqual(userResponse)
  })

  it('returns null when the user does not exist', async () => {
    vi.mocked(userRepository.getUserById).mockResolvedValue(null)

    const result = await userService.getUserById('missing-user')

    expect(userRepository.getUserById).toHaveBeenCalledWith(
      'missing-user'
    )

    expect(toUserResponse).not.toHaveBeenCalled()

    expect(result).toBeNull()
  })
})

describe('userService.getUserByEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the repository user for authentication', async () => {
    const repositoryUser = {
      id: 'user-123',
      username: 'thomas',
      email: 'thomas@example.com',
      passwordHash: 'hashed-password',
      createdAt: new Date()
    }

    vi.mocked(userRepository.getUserByEmail).mockResolvedValue(
      repositoryUser
    )

    const result = await userService.getUserByEmail(
      'thomas@example.com'
    )

    expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
      'thomas@example.com'
    )

    expect(result).toEqual(repositoryUser)
    expect(result?.passwordHash).toBe('hashed-password')

    expect(toUserResponse).not.toHaveBeenCalled()
  })
})
