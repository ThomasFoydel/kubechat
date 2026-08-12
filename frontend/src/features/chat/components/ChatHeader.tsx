import { Menu } from 'lucide-react'

interface ChatHeaderProps {
  onOpenSidebar: () => void
}

export function ChatHeader({
  onOpenSidebar
}: ChatHeaderProps) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border bg-background px-4">
      <button
        type="button"
        aria-label="Open sidebar"
        className="mr-3 rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground md:hidden"
        onClick={onOpenSidebar}
      >
        <Menu size={21} />
      </button>

      <div>
        <h1 className="text-sm font-semibold">
          Current conversation
        </h1>

        <p className="text-xs text-muted-foreground">
          KubeChat
        </p>
      </div>
    </header>
  )
}