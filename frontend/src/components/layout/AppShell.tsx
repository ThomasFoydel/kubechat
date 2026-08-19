'use client'

import { ReactNode, useState } from 'react'
import { usePathname } from 'next/navigation'

import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'

interface AppShellProps {
  children: ReactNode
}

function getPageTitle(pathname: string): string {
  if (pathname === '/dashboard') {
    return 'Dashboard'
  }

  if (pathname === '/health') {
    return 'Health'
  }

  if (pathname === '/chat' || pathname.startsWith('/chat/')) {
    return 'Chat'
  }

  if (pathname === '/users' || pathname.startsWith('/users/')) {
    return 'Users'
  }

  return 'KubeChat'
}

export function AppShell({ children }: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const pathname = usePathname()

  const pageTitle = getPageTitle(pathname)

  return (
    <div className="flex h-screen overflow-hidden bg-background text-foreground">
      <Sidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav onOpenSidebar={() => setSidebarOpen(true)} title={pageTitle} />

        <main className="min-h-0 flex-1">{children}</main>
      </div>
    </div>
  )
}
