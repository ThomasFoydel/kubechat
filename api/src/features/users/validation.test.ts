import { describe, expect, it } from 'vitest'

import { createUserSchema } from './validation'

describe('createUserSchema', () => {
  it('accepts a valid user', () => {
    const result = createUserSchema.safeParse({
      username: 'thomas',
      email: 'thomas@example.com',
      password: 'password123'
    })

    expect(result.success).toBe(true)
  })

  it('rejects a username shorter than 3 characters', () => {
    const result = createUserSchema.safeParse({
      username: 'ab',
      email: 'thomas@example.com',
      password: 'password123'
    })

    expect(result.success).toBe(false)
  })

  it('rejects a username longer than 50 characters', () => {
    const result = createUserSchema.safeParse({
      username: 'a'.repeat(51),
      email: 'thomas@example.com',
      password: 'password123'
    })

    expect(result.success).toBe(false)
  })

  it('rejects an invalid email address', () => {
    const result = createUserSchema.safeParse({
      username: 'thomas',
      email: 'not-an-email',
      password: 'password123'
    })

    expect(result.success).toBe(false)
  })

  it('rejects a password shorter than 8 characters', () => {
    const result = createUserSchema.safeParse({
      username: 'thomas',
      email: 'thomas@example.com',
      password: 'short'
    })

    expect(result.success).toBe(false)
  })

  it('rejects a password longer than 100 characters', () => {
    const result = createUserSchema.safeParse({
      username: 'thomas',
      email: 'thomas@example.com',
      password: 'a'.repeat(101)
    })

    expect(result.success).toBe(false)
  })

  it('trims whitespace from the username and email', () => {
    const result = createUserSchema.safeParse({
      username: '  thomas  ',
      email: '  thomas@example.com  ',
      password: 'password123'
    })

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.username).toBe('thomas')
      expect(result.data.email).toBe('thomas@example.com')
    }
  })
})
