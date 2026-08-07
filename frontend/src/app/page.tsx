import { HealthDashboard } from '@/features/health'

export default function DashboardPage() {
  return (
    <main className="p-8">
      <h1 className="mb-6 text-3xl font-bold">
        KubeChat Dashboard
      </h1>

      <HealthDashboard />
    </main>
  )
}