import { z } from 'zod'

export const messageResponseSchema = z.object({
  id: z.string(),
  content: z.string(),
  createdAt: z.string(),
  userId: z.string(),
  username: z.string(),
  conversationId: z.string(),
})

export type MessageResponse = z.infer<typeof messageResponseSchema>

export const createMessageInputSchema = z.object({
  content: z.string(),
})

export type CreateMessageInput = z.infer<typeof createMessageInputSchema>

export const messageSchema = messageResponseSchema

export type Message = z.infer<typeof messageSchema>
