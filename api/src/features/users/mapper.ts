import { UserResponse } from './dto'
import { UserModel } from './repository'

export function toUserResponse(user: UserModel): UserResponse {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  }
}
