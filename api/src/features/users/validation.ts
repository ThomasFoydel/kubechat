import { z } from 'zod'

export const createUserSchema = z.object({
  username: z
    .string()
    .trim()
    .min(3, 'Username must be at least 3 characters')
    .max(50, 'Username must be at most 50 characters'),

  email: z
    .string()
    .trim()
    .email('Invalid email address'),

  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(100, 'Password must be at most 100 characters')
})