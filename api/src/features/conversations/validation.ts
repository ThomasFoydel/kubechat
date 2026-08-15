import { z } from 'zod'

export const createConversationSchema = z.object({
  title: z.string().trim().max(200, 'Title must be at most 200 characters').optional(),
})

export const updateConversationSchema = z.object({
  title: z.string().trim().max(200, 'Title must be at most 200 characters').nullable(),
})
