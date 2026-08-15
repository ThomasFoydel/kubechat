export type ConversationVisibility =
  | 'PUBLIC'
  | 'PRIVATE'

export interface Conversation {
  id: string
  title: string | null
  visibility: ConversationVisibility
  createdAt: string
  updatedAt: string
  isAdmin: boolean
}

export interface Message {
  id: string
  content: string
  createdAt: string
  userId: string
  conversationId: string
}
