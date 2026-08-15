interface DashboardCardProps {
  title: string
  value: string
}

export function DashboardCard({ title, value }: DashboardCardProps) {
  return (
    <div className="rounded-lg border p-6">
      <p className="text-sm text-muted-foreground">{title}</p>

      <p className="mt-2 text-2xl font-bold">{value}</p>
    </div>
  )
}
