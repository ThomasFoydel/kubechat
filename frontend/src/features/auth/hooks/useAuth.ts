'use client'

import { authApi } from '../api/auth.api'

export function useAuth() {
  async function login(email: string, password: string) {
    return authApi.login({
      email,
      password
    })
  }

  async function register(email: string, password: string) {
    return authApi.register({
      email,
      password
    })
  }

  return {
    login,
    register
  }
}