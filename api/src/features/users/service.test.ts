import { beforeEach, describe, expect, it, vi } from 'vitest'

import { makeDatabaseUser, makeUser } from '../../test/factories/user'

import { toPublicUserResponse, toUserResponse } from './mapper'
import { userRepository } from './repository'
import { userService } from './service'

vi.mock('./repository', () => ({
  userRepository: {
    createUser: vi.fn(),
    getUserById: vi.fn(),
    getUserByEmail: vi.fn(),
    getUsers: vi.fn(),
  },
}))

vi.mock('./mapper', () => ({
  toPublicUserResponse: vi.fn(),
  toUserResponse: vi.fn(),
}))

vi.mock('../../db/redisPresence', () => ({
  getUserPresence: vi.fn(),
}))

import { getUserPresence } from '../../db/redisPresence'

describe('userService.createUser', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('creates a user and returns the mapped response', async () => {
    const repositoryUser = makeDatabaseUser()
    const userResponse = makeUser({
      createdAt: repositoryUser.createdAt.toISOString(),
    })

    vi.mocked(userRepository.createUser).mockResolvedValue(repositoryUser)

    vi.mocked(toUserResponse).mockReturnValue(userResponse)

    const result = await userService.createUser({
      username: repositoryUser.username,
      email: repositoryUser.email,
      passwordHash: repositoryUser.passwordHash,
    })

    expect(userRepository.createUser).toHaveBeenCalledWith(
      repositoryUser.username,
      repositoryUser.email,
      repositoryUser.passwordHash,
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
    const repositoryUser = makeDatabaseUser()
    const userResponse = makeUser({
      createdAt: repositoryUser.createdAt.toISOString(),
    })

    vi.mocked(userRepository.getUserById).mockResolvedValue(repositoryUser)

    vi.mocked(toUserResponse).mockReturnValue(userResponse)

    const result = await userService.getUserById(repositoryUser.id)

    expect(userRepository.getUserById).toHaveBeenCalledWith(repositoryUser.id)

    expect(toUserResponse).toHaveBeenCalledWith(repositoryUser)

    expect(result).toEqual(userResponse)
  })

  it('returns null when the user does not exist', async () => {
    vi.mocked(userRepository.getUserById).mockResolvedValue(null)

    const result = await userService.getUserById('missing-user')

    expect(userRepository.getUserById).toHaveBeenCalledWith('missing-user')

    expect(toUserResponse).not.toHaveBeenCalled()

    expect(result).toBeNull()
  })
})

describe('userService.getUserByEmail', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns the repository user for authentication', async () => {
    const repositoryUser = makeDatabaseUser()

    vi.mocked(userRepository.getUserByEmail).mockResolvedValue(repositoryUser)

    const result = await userService.getUserByEmail(repositoryUser.email)

    expect(userRepository.getUserByEmail).toHaveBeenCalledWith(repositoryUser.email)

    expect(result).toEqual(repositoryUser)
    expect(result?.passwordHash).toBe(repositoryUser.passwordHash)

    expect(toUserResponse).not.toHaveBeenCalled()
  })
})

describe('userService.getUsers', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('returns users with their presence information', async () => {
    const repositoryUsers = [makeDatabaseUser(), makeDatabaseUser()]

    const userResponses = repositoryUsers.map((user) => ({
      id: user.id,
      username: user.username,
      createdAt: user.createdAt.toISOString(),
    }))

    vi.mocked(userRepository.getUsers).mockResolvedValue(repositoryUsers)
    vi.mocked(toPublicUserResponse)
      .mockReturnValueOnce(userResponses[0])
      .mockReturnValueOnce(userResponses[1])

    vi.mocked(getUserPresence)
      .mockResolvedValueOnce({
        online: true,
        nodes: ['kubechat-api-abc123'],
      })
      .mockResolvedValueOnce({
        online: false,
        nodes: [],
      })

    const result = await userService.getUsers()

    expect(userRepository.getUsers).toHaveBeenCalledOnce()
    expect(toPublicUserResponse).toHaveBeenCalledTimes(2)

    expect(getUserPresence).toHaveBeenCalledWith(repositoryUsers[0].id)
    expect(getUserPresence).toHaveBeenCalledWith(repositoryUsers[1].id)

    expect(result).toEqual([
      {
        ...userResponses[0],
        presence: {
          online: true,
          nodes: ['kubechat-api-abc123'],
        },
      },
      {
        ...userResponses[1],
        presence: {
          online: false,
          nodes: [],
        },
      },
    ])
  })

  it('returns an empty array when there are no users', async () => {
    vi.mocked(userRepository.getUsers).mockResolvedValue([])

    const result = await userService.getUsers()

    expect(result).toEqual([])
    expect(toPublicUserResponse).not.toHaveBeenCalled()
    expect(getUserPresence).not.toHaveBeenCalled()
  })
})
