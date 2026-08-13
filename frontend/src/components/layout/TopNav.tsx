'use client'

import { Menu } from 'lucide-react'

interface TopNavProps {
  onOpenSidebar: () => void
}

export function TopNav({
  onOpenSidebar
}: TopNavProps) {
  return (
    <header className="flex h-16 shrink-0 items-center border-b border-border bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open sidebar"
          className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground md:hidden"
          onClick={onOpenSidebar}
        >
          <Menu size={21} />
        </button>

        <div>
          <h2 className="text-sm font-semibold">
            KubeChat Dashboard
          </h2>
        </div>
      </div>
    </header>
  )
}