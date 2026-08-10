import { describe, expect, it } from 'vitest'
import { makeDatabaseUser } from '../../test/factories/user'
import { toUserResponse } from './mapper'

describe('toUserResponse', () => {
  it('maps a user to a user response', () => {
    const user = makeDatabaseUser()

    const result = toUserResponse(user)

    expect(result).toEqual({
      id: user.id,
      username: user.username,
      email: user.email,
      createdAt: user.createdAt.toISOString()
    })
  })

  it('does not expose the password hash', () => {
    const user = makeDatabaseUser()

    const result = toUserResponse(user)

    expect(result).not.toHaveProperty('passwordHash')
  })
})