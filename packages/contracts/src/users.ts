import { z } from 'zod'

export const userResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  email: z.string(),
  createdAt: z.string(),
})

export type User = z.infer<typeof userResponseSchema>

export type UserResponse = User

export const publicUserResponseSchema = z.object({
  id: z.string(),
  username: z.string(),
  createdAt: z.string(),
})

export type PublicUserResponse = z.infer<typeof publicUserResponseSchema>

export const userPresenceSchema = z.object({
  online: z.boolean(),
  nodes: z.array(z.string()),
})

export type UserPresence = z.infer<typeof userPresenceSchema>

export const userWithPresenceResponseSchema = publicUserResponseSchema.extend({
  presence: userPresenceSchema,
})

export type UserWithPresenceResponse = z.infer<typeof userWithPresenceResponseSchema>
