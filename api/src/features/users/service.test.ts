import { beforeEach, describe, expect, it, vi } from 'vitest'
import {
  makeDatabaseUser,
  makeUser
} from '../../test/factories/user'
import { userRepository } from './repository'
import { userService } from './service'
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
    const repositoryUser = makeDatabaseUser()
    const userResponse = makeUser({
      createdAt: repositoryUser.createdAt.toISOString()
    })

    vi.mocked(userRepository.createUser).mockResolvedValue(
      repositoryUser
    )

    vi.mocked(toUserResponse).mockReturnValue(userResponse)

    const result = await userService.createUser({
      username: repositoryUser.username,
      email: repositoryUser.email,
      passwordHash: repositoryUser.passwordHash
    })

    expect(userRepository.createUser).toHaveBeenCalledWith(
      repositoryUser.username,
      repositoryUser.email,
      repositoryUser.passwordHash
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
      createdAt: repositoryUser.createdAt.toISOString()
    })

    vi.mocked(userRepository.getUserById).mockResolvedValue(
      repositoryUser
    )

    vi.mocked(toUserResponse).mockReturnValue(userResponse)

    const result = await userService.getUserById(
      repositoryUser.id
    )

    expect(userRepository.getUserById).toHaveBeenCalledWith(
      repositoryUser.id
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
    const repositoryUser = makeDatabaseUser()

    vi.mocked(userRepository.getUserByEmail).mockResolvedValue(
      repositoryUser
    )

    const result = await userService.getUserByEmail(
      repositoryUser.email
    )

    expect(userRepository.getUserByEmail).toHaveBeenCalledWith(
      repositoryUser.email
    )

    expect(result).toEqual(repositoryUser)
    expect(result?.passwordHash).toBe(
      repositoryUser.passwordHash
    )

    expect(toUserResponse).not.toHaveBeenCalled()
  })
})