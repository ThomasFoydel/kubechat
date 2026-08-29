'use client'

import { useCallback, useState } from 'react'
import Link from 'next/link'

import { Toast } from '@/components/ui/Toast'
import { useAuth } from '@/features/auth'
import { useUsers } from '@/features/users/hooks/useUsers'

import { useFriendships } from '../hooks/useFriendships'

export function FriendsPage() {
  const { user } = useAuth()

  const [friendRequestMessage, setFriendRequestMessage] = useState<
    string | null
  >(null)

  const {
    friendships,
    isLoading: friendshipsLoading,
    isError: friendshipsError,
    acceptFriendRequest,
    rejectFriendRequest,
    cancelFriendRequest,
    isMutating,
  } = useFriendships()

  const {
    users,
    isLoading: usersLoading,
    isError: usersError,
  } = useUsers()

  const isLoading = friendshipsLoading || usersLoading
  const isError = friendshipsError || usersError

  const closeFriendRequestToast = useCallback(() => {
    setFriendRequestMessage(null)
  }, [])

  if (isLoading) {
    return (
      <div className="flex h-full min-h-0 flex-col p-6">
        <h1 className="text-3xl font-bold">Friends</h1>
        <p className="pt-2 text-muted-foreground">Loading your friendships...</p>
      </div>
    )
  }

  if (isError || !user) {
    return (
      <div className="flex h-full min-h-0 flex-col p-6">
        <h1 className="text-3xl font-bold">Friends</h1>
        <p className="pt-2 text-destructive">Failed to load friendships.</p>
      </div>
    )
  }

  const userNames = new Map(users.map((item) => [item.id, item.username]))

  const getUserName = (userId: string): string => {
    return userNames.get(userId) ?? 'Unknown user'
  }

  const getUserLink = (userId: string): string => {
    return `/users/${userId}`
  }

  const incomingRequests = friendships.filter(
    (friendship) =>
      friendship.status === 'PENDING' &&
      friendship.recipientId === user.id,
  )

  const sentRequests = friendships.filter(
    (friendship) =>
      friendship.status === 'PENDING' &&
      friendship.requesterId === user.id,
  )

  const friends = friendships.filter(
    (friendship) => friendship.status === 'ACCEPTED',
  )

  async function handleAcceptFriendRequest(friendshipId: string) {
    closeFriendRequestToast()

    try {
      await acceptFriendRequest(friendshipId)
    } catch {
      setFriendRequestMessage(
        'This friend request is no longer available. The request may have been canceled.',
      )
    }
  }

  async function handleRejectFriendRequest(friendshipId: string) {
    closeFriendRequestToast()

    try {
      await rejectFriendRequest(friendshipId)
    } catch {
      // The request may have already been canceled.
      // The friendship query is still invalidated by the mutation hook,
      // so the stale request will disappear from the UI.
    }
  }

  return (
    <div className="flex h-full min-h-0 flex-col p-6">
      <div className="shrink-0">
        <h1 className="text-3xl font-bold">Friends</h1>

        <p className="text-muted-foreground">
          Manage your friends and friend requests.
        </p>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto pt-6">
        <section>
          <h2 className="text-xl font-semibold">Pending Requests</h2>

          {incomingRequests.length === 0 ? (
            <p className="pt-3 text-sm text-muted-foreground">
              You have no pending friend requests.
            </p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-lg border">
              {incomingRequests.map((friendship) => (
                <div
                  key={friendship.id}
                  className="flex items-center justify-between border-b px-6 py-4 last:border-b-0"
                >
                  <div>
                    <Link
                      href={getUserLink(friendship.requesterId)}
                      className="font-medium hover:underline"
                    >
                      {getUserName(friendship.requesterId)}
                    </Link>

                    <p className="text-sm text-muted-foreground">
                      Wants to be your friend
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      type="button"
                      disabled={isMutating}
                      onClick={() => handleAcceptFriendRequest(friendship.id)}
                      className="cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      disabled={isMutating}
                      onClick={() => handleRejectFriendRequest(friendship.id)}
                      className="cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="pt-8">
          <h2 className="text-xl font-semibold">Sent Requests</h2>

          {sentRequests.length === 0 ? (
            <p className="pt-3 text-sm text-muted-foreground">
              You have no pending sent requests.
            </p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-lg border">
              {sentRequests.map((friendship) => (
                <div
                  key={friendship.id}
                  className="flex items-center justify-between border-b px-6 py-4 last:border-b-0"
                >
                  <div>
                    <Link
                      href={getUserLink(friendship.recipientId)}
                      className="font-medium hover:underline"
                    >
                      {getUserName(friendship.recipientId)}
                    </Link>

                    <p className="text-sm text-muted-foreground">Pending</p>
                  </div>

                  <button
                    type="button"
                    disabled={isMutating}
                    onClick={() => cancelFriendRequest(friendship.id)}
                    className="cursor-pointer rounded-md border px-3 py-2 text-sm font-medium transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Cancel
                  </button>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="pt-8">
          <h2 className="text-xl font-semibold">Friends</h2>

          {friends.length === 0 ? (
            <p className="pt-3 text-sm text-muted-foreground">
              You don't have any friends yet.
            </p>
          ) : (
            <div className="mt-4 overflow-hidden rounded-lg border">
              {friends.map((friendship) => {
                const friendId =
                  friendship.requesterId === user.id
                    ? friendship.recipientId
                    : friendship.requesterId

                return (
                  <div
                    key={friendship.id}
                    className="border-b px-6 py-4 last:border-b-0"
                  >
                    <Link
                      href={getUserLink(friendId)}
                      className="font-medium hover:underline"
                    >
                      {getUserName(friendId)}
                    </Link>
                  </div>
                )
              })}
            </div>
          )}
        </section>
      </div>

      <Toast
        open={friendRequestMessage !== null}
        message={friendRequestMessage ?? ''}
        onClose={closeFriendRequestToast}
      />
    </div>
  )
}
