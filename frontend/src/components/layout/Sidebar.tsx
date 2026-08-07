import Link from 'next/link'
import {
  Activity,
  LayoutDashboard,
  MessageSquare,
  Users,
} from 'lucide-react'

const navigation = [
  {
    name: 'Dashboard',
    href: '/dashboard',
    icon: LayoutDashboard,
  },
  {
    name: 'Health',
    href: '/health',
    icon: Activity,
  },
  {
    name: 'Messages',
    href: '/messages',
    icon: MessageSquare,
  },
  {
    name: 'Users',
    href: '/users',
    icon: Users,
  },
]

export function Sidebar() {
  return (
    <aside className="hidden w-64 border-r bg-muted/40 md:block">
      <div className="flex h-16 items-center border-b px-6">
        <h1 className="text-lg font-semibold">
          KubeChat
        </h1>
      </div>

      <nav className="space-y-1 p-4">
        {navigation.map((item) => {
          const Icon = item.icon

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 rounded-md px-3 py-2 text-sm hover:bg-accent"
            >
              <Icon className="h-4 w-4" />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}