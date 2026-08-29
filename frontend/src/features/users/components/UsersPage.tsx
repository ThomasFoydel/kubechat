'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'
import { Circle, Search } from 'lucide-react'

import { useUsers } from '../hooks/useUsers'

function formatNodes(nodes: string[]): string {
  if (nodes.length === 0) {
    return '—'
  }

  return nodes.join(', ')
}

export function UsersPage() {
  const { users, isLoading, isError } = useUsers()
  const [search, setSearch] = useState('')

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()

    if (!query) {
      return users
    }

    return users.filter((user) => user.username.toLowerCase().includes(query))
  }, [users, search])

  return (
    <div className="flex h-full min-h-0 flex-col p-6">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold">Users</h1>

        <p className="text-muted-foreground">
          Find people and connect with them.
        </p>

        <div className="relative mt-6 max-w-md">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search users..."
            className="h-10 w-full rounded-md border bg-background pl-9 pr-3 text-sm outline-none focus:ring-2 focus:ring-ring"
          />
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pt-6">
        {isLoading && (
          <div className="rounded-lg border p-6 text-sm text-muted-foreground">
            Loading users...
          </div>
        )}

        {isError && (
          <div className="rounded-lg border border-destructive p-6 text-sm text-destructive">
            Failed to load users.
          </div>
        )}

        {!isLoading && !isError && filteredUsers.length === 0 && (
          <div className="rounded-lg border p-6 text-sm text-muted-foreground">
            {search ? 'No users match your search.' : 'No users found.'}
          </div>
        )}

        {!isLoading && !isError && filteredUsers.length > 0 && (
          <div className="overflow-hidden rounded-lg border">
            <div className="grid grid-cols-[1fr_1fr_120px] border-b px-6 py-3 text-sm font-medium text-muted-foreground">
              <span>Username</span>
              <span>Pod</span>
              <span>Status</span>
            </div>

            {filteredUsers.map((user) => (
              <Link
                key={user.id}
                href={`/users/${user.id}`}
                className="grid grid-cols-[1fr_1fr_120px] items-center border-b px-6 py-4 transition-colors last:border-b-0 hover:bg-muted/50"
              >
                <span className="font-medium">{user.username}</span>

                <span className="truncate text-sm text-muted-foreground">
                  {formatNodes(user.presence.nodes)}
                </span>

                <span className="flex items-center gap-2 text-sm">
                  <Circle
                    className={`h-2.5 w-2.5 fill-current ${
                      user.presence.online
                        ? 'text-green-500'
                        : 'text-muted-foreground'
                    }`}
                  />
                  {user.presence.online ? 'Online' : 'Offline'}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
