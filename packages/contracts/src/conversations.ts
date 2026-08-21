import { z } from 'zod'

export const conversationVisibilitySchema = z.enum(['PUBLIC', 'PRIVATE'])

export type ConversationVisibility = z.infer<typeof conversationVisibilitySchema>

export const conversationMemberRoleSchema = z.enum(['MEMBER', 'ADMIN', 'OWNER'])

export type ConversationMemberRole = z.infer<typeof conversationMemberRoleSchema>

export const conversationResponseSchema = z.object({
  id: z.string(),
  title: z.string().nullable(),
  visibility: conversationVisibilitySchema,
  createdAt: z.string(),
  updatedAt: z.string(),
})

export type ConversationResponse = z.infer<typeof conversationResponseSchema>

export const createConversationInputSchema = z.object({
  title: z.string().optional(),
  visibility: conversationVisibilitySchema.optional(),
})

export type CreateConversationInput = z.infer<typeof createConversationInputSchema>

export const updateConversationInputSchema = z.object({
  title: z.string().nullable().optional(),
  visibility: conversationVisibilitySchema.optional(),
})

export type UpdateConversationInput = z.infer<typeof updateConversationInputSchema>

export const conversationSchema = conversationResponseSchema.extend({
  isAdmin: z.boolean(),
})

export type Conversation = z.infer<typeof conversationSchema>
