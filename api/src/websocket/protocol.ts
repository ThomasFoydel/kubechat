import { MessageResponse } from '../features/messages/dto'

export type ClientMessage =
  | {
    type: 'conversation.subscribe'
    conversationId: string
  }
  | {
    type: 'conversation.unsubscribe'
    conversationId: string
  }
  | {
    type: 'message.send'
    conversationId: string
    content: string
    clientMessageId?: string
  }

export type ServerMessage =
  | {
    type: 'message.created'
    message: MessageResponse
    clientMessageId?: string
  }
  | {
    type: 'conversation.subscribed'
    conversationId: string
  }
  | {
    type: 'conversation.unsubscribed'
    conversationId: string
  }
  | {
    type: 'error'
    code: string
    message: string
    clientMessageId?: string
  }
