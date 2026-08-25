'use client'

import Link from 'next/link'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { ArrowLeft, Circle } from 'lucide-react'
import type { FriendshipResponse } from '@kubechat/contracts'

import { useAuth } from '@/features/auth/hooks/useAuth'

import { getUserById } from '../api/users.api'
import {
  FRIENDSHIPS_QUERY_KEY,
  useFriendships,
} from '@/features/friendships/hooks/useFriendships'

interface UserProfilePageProps {
  userId: string
}

export function UserProfilePage({ userId }: UserProfilePageProps) {
  const { user: currentUser } = useAuth()
  const queryClient = useQueryClient()

  const userQuery = useQuery({
    queryKey: ['users', userId],
    queryFn: () => getUserById(userId),
  })

  const {
    friendships,
    isLoading: friendshipsLoading,
    isError: friendshipsError,
    sendFriendRequest,
    acceptFriendRequest,
    rejectFriendRequest,
    isMutating,
  } = useFriendships()

  const friendship = friendships.find(
    (item) =>
      item.requesterId === userId ||
      item.recipientId === userId,
  )

  const isSelf = currentUser?.id === userId

  async function handleSendFriendRequest() {
    await sendFriendRequest(userId)
  }

  async function handleAcceptFriendRequest(
    friendship: FriendshipResponse,
  ) {
    await acceptFriendRequest(friendship.id)
  }

  async function handleRejectFriendRequest(
    friendship: FriendshipResponse,
  ) {
    await rejectFriendRequest(friendship.id)
  }

  function getFriendshipState() {
    if (isSelf) {
      return null
    }

    if (!friendship) {
      return 'none'
    }

    if (friendship.status === 'ACCEPTED') {
      return 'friends'
    }

    if (
      friendship.status === 'PENDING' &&
      friendship.requesterId === currentUser?.id
    ) {
      return 'outgoing'
    }

    if (
      friendship.status === 'PENDING' &&
      friendship.recipientId === currentUser?.id
    ) {
      return 'incoming'
    }

    if (friendship.status === 'REJECTED') {
      return 'none'
    }

    return 'none'
  }

  const friendshipState = getFriendshipState()

  if (userQuery.isLoading) {
    return (
      <div className="p-6 text-sm text-muted-foreground">
        Loading profile...
      </div>
    )
  }

  if (userQuery.isError || !userQuery.data) {
    return (
      <div className="p-6">
        <p className="text-sm text-destructive">Failed to load user.</p>
        <Link
          href="/users"
          className="mt-4 inline-block text-sm underline"
        >
          Back to users
        </Link>
      </div>
    )
  }

  const user = userQuery.data

  return (
    <div className="h-full overflow-y-auto p-6">
      <Link
        href="/users"
        className="mb-6 inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to users
      </Link>

      <div className="max-w-2xl rounded-lg border">
        <div className="border-b p-6">
          <div className="flex items-center gap-3">
            <Circle
              className={`h-3 w-3 fill-current ${
                user.id === currentUser?.id
                  ? 'text-green-500'
                  : 'text-muted-foreground'
              }`}
            />

            <div>
              <h1 className="text-2xl font-bold">{user.username}</h1>

              {user.id === currentUser?.id && (
                <p className="text-sm text-muted-foreground">
                  Your profile
                </p>
              )}
            </div>
          </div>
        </div>

        {!isSelf && (
          <div className="p-6">
            {friendshipsLoading && (
              <p className="text-sm text-muted-foreground">
                Loading friendship status...
              </p>
            )}

            {friendshipsError && (
              <p className="text-sm text-destructive">
                Failed to load friendship status.
              </p>
            )}

            {!friendshipsLoading && !friendshipsError && (
              <>
                {friendshipState === 'none' && (
                  <button
                    type="button"
                    onClick={handleSendFriendRequest}
                    disabled={isMutating}
                    className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                  >
                    {isMutating ? 'Sending...' : 'Add Friend'}
                  </button>
                )}

                {friendshipState === 'outgoing' && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Friend request pending.
                    </p>
                  </div>
                )}

                {friendshipState === 'incoming' && friendship && (
                  <div className="flex items-center gap-3">
                    <button
                      type="button"
                      onClick={() =>
                        handleAcceptFriendRequest(friendship)
                      }
                      disabled={isMutating}
                      className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground disabled:opacity-50"
                    >
                      Accept
                    </button>

                    <button
                      type="button"
                      onClick={() =>
                        handleRejectFriendRequest(friendship)
                      }
                      disabled={isMutating}
                      className="rounded-md border px-4 py-2 text-sm font-medium disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                )}

                {friendshipState === 'friends' && (
                  <p className="text-sm font-medium">
                    Friends
                  </p>
                )}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
