import { describe, expect, it } from 'vitest'
import { toUserResponse } from './mapper'

describe('toUserResponse', () => {
  it('maps a user to a user response', () => {
    const user = {
      id: 'user-123',
      username: 'thomas',
      email: 'thomas@example.com',
      passwordHash: 'secret-hash',
      createdAt: new Date('2026-08-09T12:00:00.000Z')
    }

    const result = toUserResponse(user)

    expect(result).toEqual({
      id: 'user-123',
      username: 'thomas',
      email: 'thomas@example.com',
      createdAt: '2026-08-09T12:00:00.000Z'
    })
  })

  it('does not expose the password hash', () => {
    const user = {
      id: 'user-123',
      username: 'thomas',
      email: 'thomas@example.com',
      passwordHash: 'secret-hash',
      createdAt: new Date('2026-08-09T12:00:00.000Z')
    }

    const result = toUserResponse(user)

    expect(result).not.toHaveProperty('passwordHash')
  })
})