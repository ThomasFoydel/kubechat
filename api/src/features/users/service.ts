import { UserResponse } from './dto'
import { toUserResponse } from './mapper'
import { userRepository } from './repository'

async function createUser(username: string): Promise<UserResponse> {
  const user = await userRepository.createUser(username)
  return toUserResponse(user)
}

async function getUserById(id: string): Promise<UserResponse | null> {
  const user = await userRepository.getUserById(id)
  if (!user) return null
  return toUserResponse(user)
}

export const userService = {
  createUser,
  getUserById
}