import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface HealthCardProps {
  status: string
  service: string
}

export function HealthCard({ status, service }: HealthCardProps) {
  return (
    <Card className="max-w-md">
      <CardHeader>
        <CardTitle>API Health</CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-sm text-muted-foreground">Service: {service}</p>

        <p className="mt-2 text-lg font-medium">Status: {status}</p>
      </CardContent>
    </Card>
  )
}
