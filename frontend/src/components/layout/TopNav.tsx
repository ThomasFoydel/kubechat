import { Button } from '@/components/ui/button'

export function TopNav() {
  return (
    <header className="flex h-16 items-center justify-between border-b px-6">
      <div>
        <h2 className="text-sm font-medium">
          KubeChat Dashboard
        </h2>
      </div>

      <Button variant="outline">
        Account
      </Button>
    </header>
  )
}