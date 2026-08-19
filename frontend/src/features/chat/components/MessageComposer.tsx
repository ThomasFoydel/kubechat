interface MessageComposerProps {
  message: string
  onMessageChange: (message: string) => void
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void
  disabled?: boolean
  error?: string | null
}

export function MessageComposer({
  message,
  onMessageChange,
  onSubmit,
  disabled = false,
  error = null,
}: MessageComposerProps) {
  return (
    <form onSubmit={onSubmit} className="shrink-0 border-t border-border bg-background p-3 sm:p-4">
      <div className="mx-auto w-full max-w-3xl">
        <div className="flex gap-2">
          <input
            value={message}
            onChange={(event) => onMessageChange(event.target.value)}
            disabled={disabled}
            placeholder={disabled ? 'Connecting...' : 'Type a message...'}
            className="min-w-0 flex-1 rounded-lg border border-border bg-card px-3 py-2.5 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary disabled:cursor-not-allowed disabled:opacity-50"
          />

          <button
            type="submit"
            disabled={disabled || !message.trim()}
            className="cursor-pointer rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            Send
          </button>
        </div>

        {error && <p className="mt-2 text-xs text-destructive">{error}</p>}
      </div>
    </form>
  )
}
