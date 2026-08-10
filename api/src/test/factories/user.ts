import { UserResponse } from '../../features/users/dto'

export function makeUser(
  overrides: Partial<UserResponse> = {}
): UserResponse {
  return {
    id: 'user-123',
    username: 'thomas',
    email: 'thomas@example.com',
    createdAt: '2026-08-09T00:00:00.000Z',
    ...overrides
  }
}

export function makeDatabaseUser(
  overrides: Partial<{
    id: string
    username: string
    email: string
    passwordHash: string
    createdAt: Date
  }> = {}
) {
  return {
    id: 'user-123',
    username: 'thomas',
    email: 'thomas@example.com',
    passwordHash: 'secret-hash',
    createdAt: new Date('2026-08-09T12:00:00.000Z'),
    ...overrides
  }
}

export function makeCreateUserRequest(
  overrides: Partial<{
    username: string
    email: string
    password: string
  }> = {}
) {
  return {
    username: 'thomas',
    email: 'thomas@example.com',
    password: 'password123',
    ...overrides
  }
}

export function makeUserResponse(): UserResponse {
  return {
    id: 'user-123',
    username: 'thomas',
    email: 'thomas@example.com',
    createdAt: '2026-08-09T00:00:00.000Z'
  }
}
