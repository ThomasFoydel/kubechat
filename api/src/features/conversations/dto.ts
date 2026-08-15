export type ConversationVisibility = 'PUBLIC' | 'PRIVATE'

export type ConversationMemberRole = 'MEMBER' | 'ADMIN' | 'OWNER'

export interface ConversationResponse {
  id: string
  title: string | null
  visibility: ConversationVisibility
  createdAt: string
  updatedAt: string
}

export interface CreateConversationInput {
  title?: string
  visibility?: ConversationVisibility
}

export interface UpdateConversationInput {
  title?: string | null
  visibility?: ConversationVisibility
}
