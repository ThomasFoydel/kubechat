import { AppShell } from '@/components/layout'
import { RequireAuth } from '@/features/auth/components/RequireAuth'

export default function AuthenticatedLayout({
  children
}: {
  children: React.ReactNode
}) {
  return (
    <RequireAuth>
      <AppShell>
        {children}
      </AppShell>
    </RequireAuth>
  )
}