'use client'

import { Button } from '@/components/ui/button'

interface ConfirmationDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  onConfirm: () => void | Promise<void>
  onCancel: () => void
  isConfirming?: boolean
}

export function ConfirmationDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  isConfirming = false,
}: ConfirmationDialogProps) {
  if (!open) {
    return null
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onCancel()
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirmation-dialog-title"
        aria-describedby="confirmation-dialog-description"
        className="w-full max-w-md rounded-xl border border-border bg-[#18181b] p-6 text-white shadow-xl"
      >
        <div className="mb-6">
          <h2 id="confirmation-dialog-title" className="text-lg font-semibold">
            {title}
          </h2>

          <p id="confirmation-dialog-description" className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        </div>

        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel} disabled={isConfirming}>
            {cancelLabel}
          </Button>

          <Button type="button" variant="destructive" onClick={onConfirm} disabled={isConfirming}>
            {isConfirming ? 'Deleting...' : confirmLabel}
          </Button>
        </div>
      </div>
    </div>
  )
}
