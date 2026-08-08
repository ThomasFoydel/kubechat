import { apiClient } from '@/lib/api-client'
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse
} from '../types/auth.types'

export const authApi = {
  login(data: LoginRequest) {
    return apiClient<LoginResponse>('/api/v1/auth/login', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  },

  register(data: RegisterRequest) {
    return apiClient<RegisterResponse>('/api/v1/auth/register', {
      method: 'POST',
      body: JSON.stringify(data)
    })
  }
}