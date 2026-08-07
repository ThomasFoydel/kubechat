import { AppShell } from '@/components/layout/AppShell'
import { HealthDashboard } from '@/features/health'

export default function Home() {
  return (
    <AppShell>
      <HealthDashboard />
    </AppShell>
  )
}