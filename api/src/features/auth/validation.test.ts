import { describe, expect, it } from 'vitest'
import {
  registerSchema,
  loginSchema
} from './dto'

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123'
    })

    expect(result.success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({
      username: 'testuser',
      email: 'not-an-email',
      password: 'password123'
    })

    expect(result.success).toBe(false)
  })

  it('rejects a short password', () => {
    const result = registerSchema.safeParse({
      username: 'testuser',
      email: 'test@example.com',
      password: 'short'
    })

    expect(result.success).toBe(false)
  })
})

describe('loginSchema', () => {
  it('accepts valid login data', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123'
    })

    expect(result.success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123'
    })

    expect(result.success).toBe(false)
  })

  it('rejects an empty password', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: ''
    })

    expect(result.success).toBe(false)
  })
})