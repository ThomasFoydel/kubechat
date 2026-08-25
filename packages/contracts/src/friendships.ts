import { z } from 'zod'

export const friendshipStatusSchema = z.enum(['PENDING', 'ACCEPTED', 'REJECTED'])

export type FriendshipStatus = z.infer<typeof friendshipStatusSchema>

export const friendshipResponseSchema = z.object({
  id: z.string(),
  requesterId: z.string(),
  recipientId: z.string(),
  status: friendshipStatusSchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type FriendshipResponse = z.infer<typeof friendshipResponseSchema>
