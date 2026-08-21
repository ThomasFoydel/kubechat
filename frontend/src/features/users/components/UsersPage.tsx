'use client'

import { useUsers } from '../hooks/useUsers'

export function UsersPage() {
  const { users, isLoading, isError } = useUsers()

  return (
    <div className="space-y-6 p-6">
      <div>
        <h1 className="text-3xl font-bold">Users</h1>

        <p className="text-muted-foreground">View users and their current presence status.</p>
      </div>

      {isLoading && (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">Loading users...</div>
      )}

      {isError && (
        <div className="rounded-lg border border-destructive p-6 text-sm text-destructive">
          Failed to load users.
        </div>
      )}

      {!isLoading && !isError && users.length === 0 && (
        <div className="rounded-lg border p-6 text-sm text-muted-foreground">No users found.</div>
      )}

      {!isLoading && !isError && users.length > 0 && (
        <div className="overflow-hidden rounded-lg border">
          <div className="grid grid-cols-[1fr_1fr_120px] border-b px-6 py-3 text-sm font-medium text-muted-foreground">
            <span>Username</span>
            <span>Email</span>
            <span>Status</span>
          </div>

          {users.map((user) => (
            <div
              key={user.id}
              className="grid grid-cols-[1fr_1fr_120px] items-center border-b px-6 py-4 last:border-b-0"
            >
              <span className="font-medium">{user.username}</span>

              <span className="text-sm text-muted-foreground">{user.email}</span>

              <span
                className={`text-sm font-medium ${
                  user.presence.online ? 'text-green-500' : 'text-muted-foreground'
                }`}
              >
                {user.presence.online ? 'Online' : 'Offline'}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
