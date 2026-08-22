import type {
  PublicUserResponse,
  UserResponse,
  UserWithPresenceResponse,
} from '@kubechat/contracts'

import { getUserPresence } from '../../db/redisPresence'
import { toPublicUserResponse, toUserResponse } from './mapper'
import { userRepository } from './repository'

interface CreateUserInput {
  username: string
  email: string
  passwordHash: string
}

async function createUser(input: CreateUserInput): Promise<UserResponse> {
  const user = await userRepository.createUser(input.username, input.email, input.passwordHash)

  return toUserResponse(user)
}

async function getUserById(id: string): Promise<UserResponse | null> {
  const user = await userRepository.getUserById(id)

  if (!user) return null

  return toUserResponse(user)
}

async function getUserByEmail(email: string) {
  return userRepository.getUserByEmail(email)
}

async function getUsers(): Promise<UserWithPresenceResponse[]> {
  const users = await userRepository.getUsers()

  return Promise.all(
    users.map(async (user) => {
      const response = toPublicUserResponse(user)
      const presence = await getUserPresence(user.id)

      return {
        ...response,
        presence,
      }
    }),
  )
}

export const userService = {
  createUser,
  getUserById,
  getUserByEmail,
  getUsers,
}
