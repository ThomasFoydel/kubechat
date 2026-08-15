import { z } from 'zod'
import { createUserSchema } from './validation'

export type CreateUserRequest = z.infer<typeof createUserSchema>

export interface UserResponse {
  id: string
  username: string
  email: string
  createdAt: string
}
