import { describe, expect, it } from 'vitest'
import { loginSchema, registerSchema } from './dto'

describe('registerSchema', () => {
  it('accepts valid registration data', () => {
    const result = registerSchema.safeParse({
      username: 'testuser',
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result.success).toBe(true)
  })

  it('rejects a username shorter than 3 characters', () => {
    const result = registerSchema.safeParse({
      username: 'ab',
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result.success).toBe(false)
  })

  it('rejects a username longer than 30 characters', () => {
    const result = registerSchema.safeParse({
      username: 'a'.repeat(31),
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result.success).toBe(false)
  })

  it('rejects an invalid email', () => {
    const result = registerSchema.safeParse({
      username: 'testuser',
      email: 'not-an-email',
      password: 'password123',
    })

    expect(result.success).toBe(false)
  })

  it('rejects a password shorter than 8 characters', () => {
    const result = registerSchema.safeParse({
      username: 'testuser',
      email: 'test@example.com',
      password: 'short',
    })

    expect(result.success).toBe(false)
  })

  it('rejects a password longer than 128 characters', () => {
    const result = registerSchema.safeParse({
      username: 'testuser',
      email: 'test@example.com',
      password: 'a'.repeat(129),
    })

    expect(result.success).toBe(false)
  })

  it('rejects a missing username', () => {
    const result = registerSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result.success).toBe(false)
  })

  it('trims whitespace from the username and email', () => {
    const result = registerSchema.safeParse({
      username: '  testuser  ',
      email: '  test@example.com  ',
      password: 'password123',
    })

    expect(result.success).toBe(true)

    if (result.success) {
      expect(result.data.username).toBe('testuser')
      expect(result.data.email).toBe('test@example.com')
    }
  })
})

describe('loginSchema', () => {
  it('accepts valid login data', () => {
    const result = loginSchema.safeParse({
      email: 'test@example.com',
      password: 'password123',
    })

    expect(result.success).toBe(true)
  })

  it('rejects an invalid email', () => {
    const result = loginSchema.safeParse({
      email: 'not-an-email',
      password: 'password123',
    })

    expect(result.success).toBe(false)
  })
})
