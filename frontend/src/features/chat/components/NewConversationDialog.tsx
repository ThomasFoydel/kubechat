'use client'

import { useEffect, useState } from 'react'

import { Button } from '@/components/ui/button'

import type { ConversationVisibility } from '@kubechat/contracts'

interface NewConversationDialogProps {
  open: boolean
  onClose: () => void
  onSubmit: (title: string, visibility: ConversationVisibility) => Promise<void>
  isCreating: boolean
}

export function NewConversationDialog({
  open,
  onClose,
  onSubmit,
  isCreating,
}: NewConversationDialogProps) {
  const [title, setTitle] = useState('')

  const [visibility, setVisibility] = useState<ConversationVisibility>('PRIVATE')

  useEffect(() => {
    if (!open) {
      setTitle('')
      setVisibility('PRIVATE')
    }
  }, [open])

  if (!open) {
    return null
  }

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    const trimmedTitle = title.trim()

    await onSubmit(trimmedTitle, visibility)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="new-conversation-title"
        className="w-full max-w-md rounded-xl border border-border bg-[#18181b] p-6 text-white shadow-xl"
      >
        <div className="mb-6">
          <h2 id="new-conversation-title" className="text-lg font-semibold">
            New conversation
          </h2>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a conversation and choose who can access it.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="conversation-name" className="text-sm font-medium">
              Name
            </label>

            <input
              id="conversation-name"
              type="text"
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder="e.g. Kubernetes architecture"
              autoFocus
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition focus:border-ring focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <div className="space-y-3">
            <div>
              <p className="text-sm font-medium">Visibility</p>

              <p className="mt-1 text-xs text-muted-foreground">
                Choose who can access this conversation.
              </p>
            </div>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition hover:bg-muted/50">
              <input
                type="radio"
                name="visibility"
                value="PRIVATE"
                checked={visibility === 'PRIVATE'}
                onChange={() => setVisibility('PRIVATE')}
                className="mt-1"
              />

              <span>
                <span className="block text-sm font-medium">Private</span>

                <span className="block text-xs text-muted-foreground">
                  Only you and invited users can access this conversation.
                </span>
              </span>
            </label>

            <label className="flex cursor-pointer items-start gap-3 rounded-lg border border-border p-3 transition hover:bg-muted/50">
              <input
                type="radio"
                name="visibility"
                value="PUBLIC"
                checked={visibility === 'PUBLIC'}
                onChange={() => setVisibility('PUBLIC')}
                className="mt-1"
              />

              <span>
                <span className="block text-sm font-medium">Public</span>

                <span className="block text-xs text-muted-foreground">
                  Anyone with access to KubeChat can access this conversation.
                </span>
              </span>
            </label>
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isCreating}>
              Cancel
            </Button>

            <Button type="submit" disabled={isCreating || !title.trim()}>
              {isCreating ? 'Creating...' : 'Create conversation'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
