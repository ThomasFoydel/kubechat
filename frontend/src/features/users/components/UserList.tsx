'use client'

import { Circle } from 'lucide-react'

import { useUsers } from '../hooks/useUsers'

function formatCreatedAt(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString()
}

export function UserList() {
  const { users, isLoading, isError } = useUsers()

  if (isLoading) {
    return <p className="text-sm text-muted-foreground">Loading users...</p>
  }

  if (isError) {
    return <p className="text-sm text-destructive">Failed to load users.</p>
  }

  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">No users found.</p>
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="grid grid-cols-[1fr_1fr_1fr_120px] gap-4 border-b px-6 py-3 text-sm font-medium text-muted-foreground">
        <span>User</span>
        <span>Email</span>
        <span>Created</span>
        <span>Status</span>
      </div>

      {users.map((user) => (
        <div
          key={user.id}
          className="grid grid-cols-[1fr_1fr_1fr_120px] gap-4 border-b px-6 py-4 last:border-b-0"
        >
          <div className="min-w-0">
            <p className="truncate font-medium">{user.username}</p>
            <p className="truncate text-xs text-muted-foreground">{user.id}</p>
          </div>

          <p className="truncate text-sm text-muted-foreground">{user.email}</p>

          <p className="text-sm text-muted-foreground">{formatCreatedAt(user.createdAt)}</p>

          <div className="flex items-center gap-2">
            <Circle
              className={`h-2.5 w-2.5 fill-current ${
                user.presence.online ? 'text-green-500' : 'text-muted-foreground'
              }`}
            />

            <span className="text-sm">{user.presence.online ? 'Online' : 'Offline'}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
