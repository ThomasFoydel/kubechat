import { apiClient } from '@/lib/api-client'

import {
  AuthUserResponse,
  LoginRequest,
  RegisterRequest,
  User
} from '../types/auth.types'

export function register(
  data: RegisterRequest
): Promise<AuthUserResponse> {
  return apiClient<AuthUserResponse>(
    '/api/v1/auth/register',
    {
      method: 'POST',
      body: JSON.stringify(data)
    }
  )
}

export function login(
  data: LoginRequest
): Promise<AuthUserResponse> {
  return apiClient<AuthUserResponse>(
    '/api/v1/auth/login',
    {
      method: 'POST',
      body: JSON.stringify(data)
    }
  )
}

export function logout(): Promise<void> {
  return apiClient<void>(
    '/api/v1/auth/logout',
    {
      method: 'POST'
    }
  )
}

export function getCurrentUser(): Promise<User> {
  return apiClient<User>('/api/v1/auth/me')
}
