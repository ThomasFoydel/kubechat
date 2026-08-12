'use client'

import { ReactNode, useState } from 'react'

import { Sidebar } from './Sidebar'
import { TopNav } from './TopNav'

interface AppShellProps {
  children: ReactNode
}

export function AppShell({
  children
}: AppShellProps) {
  const [sidebarOpen, setSidebarOpen] =
    useState(false)

  return (
    <div className="flex min-h-screen bg-background text-foreground">
      <Sidebar
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <TopNav
          onOpenSidebar={() =>
            setSidebarOpen(true)
          }
        />

        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}