import type { PublicUserResponse, UserResponse } from '@kubechat/contracts'

import { UserModel } from './repository'

export function toUserResponse(user: UserModel): UserResponse {
  return {
    id: user.id,
    username: user.username,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  }
}

export function toPublicUserResponse(user: UserModel): PublicUserResponse {
  return {
    id: user.id,
    username: user.username,
    createdAt: user.createdAt.toISOString(),
  }
}
