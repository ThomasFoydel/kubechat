import type {
  AuthUserResponse,
  LoginRequest,
  RegisterRequest,
  UserResponse,
} from '@kubechat/contracts'

import { ApiError, apiClient } from '@/lib/api-client'

export function register(data: RegisterRequest): Promise<AuthUserResponse> {
  return apiClient<AuthUserResponse>('/api/v1/auth/register', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function login(data: LoginRequest): Promise<AuthUserResponse> {
  return apiClient<AuthUserResponse>('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify(data),
  })
}

export function logout(): Promise<void> {
  return apiClient<void>('/api/v1/auth/logout', {
    method: 'POST',
  })
}

export async function getCurrentUser(): Promise<UserResponse | null> {
  try {
    return await apiClient<UserResponse>('/api/v1/auth/me')
  } catch (error) {
    if (error instanceof ApiError && error.status === 401) {
      return null
    }

    throw error
  }
}
