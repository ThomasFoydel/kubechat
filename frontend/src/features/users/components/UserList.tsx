'use client'

import { Circle } from 'lucide-react'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { Button } from '@/components/ui/button'

import { useFriendships } from '@/features/friendships/hooks/useFriendships'
import { useUsers } from '../hooks/useUsers'

function formatCreatedAt(createdAt: string): string {
  return new Date(createdAt).toLocaleDateString()
}

function formatNodes(nodes: string[]): string {
  if (nodes.length === 0) {
    return '—'
  }

  return nodes.join(', ')
}

export function UserList() {
  const { user: currentUser } = useAuth()
  const { users, isLoading: usersLoading, isError: usersError } = useUsers()
  const {
    friendships,
    isLoading: friendshipsLoading,
    isError: friendshipsError,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    isMutating,
  } = useFriendships()

  if (usersLoading || friendshipsLoading) {
    return <p className="text-sm text-muted-foreground">Loading users...</p>
  }

  if (usersError || friendshipsError) {
    return <p className="text-sm text-destructive">Failed to load users.</p>
  }

  if (users.length === 0) {
    return <p className="text-sm text-muted-foreground">No users found.</p>
  }

  return (
    <div className="overflow-hidden rounded-lg border">
      <div className="grid grid-cols-[1fr_1fr_1fr_120px_180px] gap-4 border-b px-6 py-3 text-sm font-medium text-muted-foreground">
        <span>User</span>
        <span>Created</span>
        <span>Pod</span>
        <span>Status</span>
        <span>Friendship</span>
      </div>

      {users.map((user) => {
        const friendship = friendships.find(
          (item) =>
            item.requesterId === user.id ||
            item.recipientId === user.id,
        )

        const isSelf = user.id === currentUser?.id
        const isIncoming =
          friendship?.status === 'PENDING' &&
          friendship.recipientId === currentUser?.id
        const isOutgoing =
          friendship?.status === 'PENDING' &&
          friendship.requesterId === currentUser?.id

        return (
          <div
            key={user.id}
            className="grid grid-cols-[1fr_1fr_1fr_120px_180px] gap-4 border-b px-6 py-4 last:border-b-0"
          >
            <div className="min-w-0">
              <p className="truncate font-medium">{user.username}</p>
              <p className="truncate text-xs text-muted-foreground">{user.id}</p>
            </div>

            <p className="text-sm text-muted-foreground">
              {formatCreatedAt(user.createdAt)}
            </p>

            <p className="truncate text-sm text-muted-foreground">
              {formatNodes(user.presence.nodes)}
            </p>

            <div className="flex items-center gap-2">
              <Circle
                className={`h-2.5 w-2.5 fill-current ${
                  user.presence.online
                    ? 'text-green-500'
                    : 'text-muted-foreground'
                }`}
              />

              <span className="text-sm">
                {user.presence.online ? 'Online' : 'Offline'}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {isSelf && (
                <span className="text-sm text-muted-foreground">You</span>
              )}

              {!isSelf && !friendship && (
                <Button
                  size="sm"
                  disabled={isMutating}
                  onClick={() => sendFriendRequest(user.id)}
                >
                  Add Friend
                </Button>
              )}

              {!isSelf && friendship?.status === 'ACCEPTED' && (
                <span className="text-sm text-green-500">Friends</span>
              )}

              {!isSelf && isOutgoing && (
                <>
                  <span className="text-sm text-muted-foreground">
                    Pending
                  </span>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isMutating}
                    onClick={() => cancelFriendRequest(friendship.id)}
                  >
                    Cancel
                  </Button>
                </>
              )}

              {!isSelf && isIncoming && (
                <>
                  <Button
                    size="sm"
                    disabled={isMutating}
                    onClick={() => acceptFriendRequest(friendship.id)}
                  >
                    Accept
                  </Button>

                  <Button
                    size="sm"
                    variant="outline"
                    disabled={isMutating}
                    onClick={() => rejectFriendRequest(friendship.id)}
                  >
                    Reject
                  </Button>
                </>
              )}

              {!isSelf && friendship?.status === 'REJECTED' && (
                <Button
                  size="sm"
                  disabled={isMutating}
                  onClick={() => sendFriendRequest(user.id)}
                >
                  Add Friend
                </Button>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}
