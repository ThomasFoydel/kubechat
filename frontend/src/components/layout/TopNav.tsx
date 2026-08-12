'use client'

import { Menu } from 'lucide-react'
import { useRouter } from 'next/navigation'

import { Button } from '@/components/ui/button'
import { useAuth } from '@/features/auth'

interface TopNavProps {
  onOpenSidebar: () => void
}

export function TopNav({
  onOpenSidebar
}: TopNavProps) {
  const router = useRouter()
  const {
    user,
    logout,
    isLoggingOut
  } = useAuth()

  async function handleLogout() {
    await logout()
    router.replace('/login')
  }

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-background px-4 md:px-6">
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

          {user && (
            <p className="text-xs text-muted-foreground">
              {user.username}
            </p>
          )}
        </div>
      </div>

      <Button
        variant="outline"
        onClick={handleLogout}
        disabled={isLoggingOut}
      >
        {isLoggingOut
          ? 'Signing out...'
          : 'Sign out'}
      </Button>
    </header>
  )
}