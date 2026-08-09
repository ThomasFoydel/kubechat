export interface CreateUserRequest {
  username: string
  email: string
  password: string
}

export interface UserResponse {
  id: string
  username: string
  createdAt: string
}