import { describe, expect, it } from 'vitest'

import { hashPassword, verifyPassword } from './password'
import { makePassword } from '../../test/factories/auth'

describe('password', () => {
  it('hashes a password', async () => {
    const password = makePassword()

    const hash = await hashPassword(password)

    expect(hash).not.toBe(password)
    expect(hash).toBeTruthy()
  })

  it('verifies a correct password', async () => {
    const password = makePassword()
    const hash = await hashPassword(password)

    const result = await verifyPassword(password, hash)

    expect(result).toBe(true)
  })

  it('rejects an incorrect password', async () => {
    const password = makePassword()
    const wrongPassword = 'wrong-password'

    const hash = await hashPassword(password)

    const result = await verifyPassword(wrongPassword, hash)

    expect(result).toBe(false)
  })
})
