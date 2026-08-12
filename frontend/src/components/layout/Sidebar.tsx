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

interface SidebarProps {
  open: boolean
  onClose: () => void
}

export function Sidebar({
  open,
  onClose
}: SidebarProps) {
  return (
    <>
      {open && (
        <button
          type="button"
          aria-label="Close sidebar"
          className="fixed inset-0 z-40 bg-black/60 md:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 flex w-64 flex-col
          border-r border-border bg-[#0f0f11]
          shadow-2xl transition-transform duration-200
          md:static md:z-auto md:translate-x-0
          ${open ? 'translate-x-0' : '-translate-x-full'}
        `}
      >
        <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
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
                onClick={onClose}
                className="flex items-center gap-3 rounded-md px-3 py-2 text-sm transition hover:bg-muted"
              >
                <Icon className="h-4 w-4" />
                {item.name}
              </Link>
            )
          })}
        </nav>
      </aside>
    </>
  )
}