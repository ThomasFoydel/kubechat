export interface CreateUserRequest {
  username: string
}

export interface UserResponse {
  id: string
  username: string
  createdAt: string
}
