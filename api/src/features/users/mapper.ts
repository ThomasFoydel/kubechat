import { UserResponse } from "./dto"
import { UserModel } from "./repository"

export function toUserResponse(user: UserModel): UserResponse {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt.toISOString()
  }
}