export interface MessageResponse {
  id: string
  content: string
  createdAt: string
  userId: string
  username: string
  conversationId: string
}

export interface CreateMessageInput {
  content: string
}
