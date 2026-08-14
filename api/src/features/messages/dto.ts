export interface MessageResponse {
  id: string
  content: string
  createdAt: string
  userId: string
  conversationId: string
}

export interface CreateMessageInput {
  content: string
}
