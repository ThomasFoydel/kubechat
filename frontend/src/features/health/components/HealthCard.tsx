import { CheckCircle2, XCircle } from 'lucide-react'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

interface HealthCardProps {
  title: string
  status: string
  description?: string
}

export function HealthCard({ title, status, description }: HealthCardProps) {
  const healthy = status === 'ok' || status === 'connected'

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-base">
          {title}

          {healthy ? (
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
        </CardTitle>
      </CardHeader>

      <CardContent>
        <p className="text-lg font-medium capitalize">{status}</p>

        {description && <p className="mt-1 text-sm text-muted-foreground">{description}</p>}
      </CardContent>
    </Card>
  )
}
