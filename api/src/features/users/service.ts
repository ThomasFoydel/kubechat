import { UserResponse } from './dto'
import { toUserResponse } from './mapper'
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

export const userService = {
  createUser,
  getUserById,
  getUserByEmail,
}
