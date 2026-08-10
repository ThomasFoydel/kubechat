import { describe, expect, it } from 'vitest'
import {
  hashPassword,
  verifyPassword
} from './password'

describe('password', () => {
  it('hashes a password', async () => {
    const password = 'password123'

    const hash = await hashPassword(password)

    expect(hash).not.toBe(password)
    expect(hash).toBeTruthy()
  })

  it('verifies a correct password', async () => {
    const password = 'password123'
    const hash = await hashPassword(password)

    const result = await verifyPassword(password, hash)

    expect(result).toBe(true)
  })

  it('rejects an incorrect password', async () => {
    const hash = await hashPassword('password123')

    const result = await verifyPassword(
      'wrongpassword',
      hash
    )

    expect(result).toBe(false)
  })
})