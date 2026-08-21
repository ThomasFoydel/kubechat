import { z } from 'zod'

import { messageSchema } from './messages'

export const clientMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('conversation.subscribe'),
    conversationId: z.string(),
  }),
  z.object({
    type: z.literal('conversation.unsubscribe'),
    conversationId: z.string(),
  }),
  z.object({
    type: z.literal('message.send'),
    conversationId: z.string(),
    content: z.string(),
    clientMessageId: z.string().optional(),
  }),
])

export type ClientMessage = z.infer<typeof clientMessageSchema>

export const serverMessageSchema = z.discriminatedUnion('type', [
  z.object({
    type: z.literal('message.created'),
    message: messageSchema,
    clientMessageId: z.string().optional(),
  }),
  z.object({
    type: z.literal('conversation.subscribed'),
    conversationId: z.string(),
  }),
  z.object({
    type: z.literal('conversation.unsubscribed'),
    conversationId: z.string(),
  }),
  z.object({
    type: z.literal('error'),
    code: z.string(),
    message: z.string(),
    clientMessageId: z.string().optional(),
  }),
])

export type ServerMessage = z.infer<typeof serverMessageSchema>
