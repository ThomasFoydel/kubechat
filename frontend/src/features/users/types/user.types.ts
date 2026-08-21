export interface UserPresence {
  online: boolean
}

export interface UserWithPresence {
  id: string
  username: string
  email: string
  createdAt: string
  presence: UserPresence
}
