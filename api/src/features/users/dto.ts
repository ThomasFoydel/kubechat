export interface UserResponse {
  id: string
  username: string
  email: string
  createdAt: string
}

export interface UserPresence {
  online: boolean
  nodes: string[]
}

export interface UserWithPresenceResponse extends UserResponse {
  presence: UserPresence
}
