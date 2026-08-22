'use client'

import { AppShell } from '@/components/layout'
import { RequireAuth } from '@/features/auth/components/RequireAuth'
import { ChatProvider } from '@/features/chat/context/ChatProvider'

export default function AuthenticatedLayout({ children }: { children: React.ReactNode }) {
  return (
    <RequireAuth>
      <ChatProvider>
        <AppShell>{children}</AppShell>
      </ChatProvider>
    </RequireAuth>
  )
}
