'use client'

import { useState } from 'react'
import { useQuery } from '@tanstack/react-query'
import { Circle } from 'lucide-react'
import type { FriendshipResponse } from '@kubechat/contracts'

import { useAuth } from '@/features/auth/hooks/useAuth'
import { useFriendships } from '@/features/friendships/hooks/useFriendships'
import { ConfirmationDialog } from '@/features/chat/components/ConfirmationDialog'

import { getUserById } from '../api/users.api'

interface UserProfilePageProps {
  userId: string
}

export function UserProfilePage({ userId }: UserProfilePageProps) {
  const { user: currentUser } = useAuth()
  const [isRemoveDialogOpen, setIsRemoveDialogOpen] = useState(false)

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
    cancelFriendRequest,
    removeFriend,
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

  async function handleCancelFriendRequest(
    friendship: FriendshipResponse,
  ) {
    await cancelFriendRequest(friendship.id)
  }

  async function handleRemoveFriend() {
    if (!friendship) {
      return
    }

    await removeFriend(friendship.id)
    setIsRemoveDialogOpen(false)
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
      </div>
    )
  }

  const user = userQuery.data

  return (
    <div className="h-full overflow-y-auto p-6">
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
                    className="cursor-pointer rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {isMutating ? 'Sending...' : 'Add Friend'}
                  </button>
                )}

                {friendshipState === 'outgoing' && friendship && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Friend request pending.
                    </p>

                    <button
                      type="button"
                      onClick={() => handleCancelFriendRequest(friendship)}
                      disabled={isMutating}
                      className="mt-3 cursor-pointer rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isMutating
                        ? 'Cancelling...'
                        : 'Cancel Friend Request'}
                    </button>
                  </div>
                )}

                {friendshipState === 'incoming' && friendship && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {user.username} sent you a friend request.
                    </p>

                    <div className="mt-3 flex items-center gap-3">
                      <button
                        type="button"
                        onClick={() => handleAcceptFriendRequest(friendship)}
                        disabled={isMutating}
                        className="cursor-pointer rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Accept
                      </button>

                      <button
                        type="button"
                        onClick={() => handleRejectFriendRequest(friendship)}
                        disabled={isMutating}
                        className="cursor-pointer rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                      >
                        Reject
                      </button>
                    </div>
                  </div>
                )}

                {friendshipState === 'friends' && friendship && (
                  <div>
                    <p className="text-sm text-muted-foreground">
                      You are friends with this user.
                    </p>

                    <button
                      type="button"
                      onClick={() => setIsRemoveDialogOpen(true)}
                      disabled={isMutating}
                      className="mt-3 cursor-pointer rounded-md border px-4 py-2 text-sm font-medium transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Remove Friend
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        )}
      </div>

      <ConfirmationDialog
        open={isRemoveDialogOpen}
        title="Remove friend?"
        description={`Are you sure you want to remove ${user.username} as a friend?`}
        confirmLabel="Remove Friend"
        cancelLabel="Cancel"
        onConfirm={handleRemoveFriend}
        onCancel={() => setIsRemoveDialogOpen(false)}
        isConfirming={isMutating}
      />
    </div>
  )
}
