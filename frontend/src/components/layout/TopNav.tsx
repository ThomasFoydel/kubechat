'use client'

import { Menu } from 'lucide-react'

import { useAuth } from '@/features/auth'

interface TopNavProps {
  onOpenSidebar: () => void
}

export function TopNav({
  onOpenSidebar
}: TopNavProps) {
  const { user } = useAuth()

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-6">
      <div className="flex items-center gap-3">
        <button
          type="button"
          aria-label="Open navigation"
          className="rounded-md p-2 text-muted-foreground transition hover:bg-muted hover:text-foreground md:hidden"
          onClick={onOpenSidebar}
        >
          <Menu size={21} />
        </button>

        <div>
          <h1 className="text-sm font-semibold">
            KubeChat
          </h1>

          {user && (
            <p className="text-xs text-muted-foreground">
              {user.username}
            </p>
          )}
        </div>
      </div>
    </header>
  )
}
