import { z } from 'zod'

export const registerSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(30, 'Username must be at most 30 characters'),

  email: z
    .string()
    .trim()
    .email('Invalid email address')
    .max(254, 'Email must be at most 254 characters'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password must be at most 128 characters'),
})

export type RegisterRequest = z.infer<typeof registerSchema>

export const loginSchema = z.object({
  email: z.string().trim().email('Invalid email address'),

  password: z.string().min(1, 'Password is required'),
})

export type LoginRequest = z.infer<typeof loginSchema>
