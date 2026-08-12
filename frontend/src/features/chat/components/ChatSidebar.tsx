import {
  X,
  Plus,
  MessageSquare
} from 'lucide-react'

interface ChatSidebarProps {
  open: boolean
  onClose: () => void
  onNewChat: () => void
}

export function ChatSidebar({
  open,
  onClose,
  onNewChat
}: ChatSidebarProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-50 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-[60] flex w-72 flex-col
          border-r border-border bg-[#0f0f11]
          shadow-2xl
          transition-transform duration-200
          md:static md:z-auto md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 shrink-0 items-center justify-between border-b border-border px-4">
          <h2 className="text-sm font-semibold tracking-wide">
            KubeChat
          </h2>

          <button
            type="button"
            aria-label="Close sidebar"
            className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground md:hidden"
            onClick={onClose}
          >
            <X size={20} />
          </button>
        </div>

        <div className="shrink-0 p-3">
          <button
            type="button"
            onClick={onNewChat}
            className="flex w-full items-center gap-2 rounded-lg border border-border bg-[#18181b] px-3 py-2.5 text-sm font-medium transition hover:bg-muted"
          >
            <Plus size={18} />
            New chat
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3">
          <p className="px-2 py-2 text-xs font-medium uppercase tracking-wider text-muted-foreground">
            Chats
          </p>

          <button
            type="button"
            className="flex w-full items-center gap-3 rounded-lg bg-muted px-3 py-2.5 text-left text-sm"
          >
            <MessageSquare size={17} />

            <span className="truncate">
              Current conversation
            </span>
          </button>
        </div>
      </aside>
    </>
  )
}