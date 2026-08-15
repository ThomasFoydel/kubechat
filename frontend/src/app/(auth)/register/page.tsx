import { RegisterForm } from '@/features/auth'
import { AuthRedirect } from '@/features/auth/components/AuthRedirect'

export default function RegisterPage() {
  return (
    <AuthRedirect>
      <main className="flex min-h-screen items-center justify-center bg-background px-4 py-8 text-foreground">
        <RegisterForm />
      </main>
    </AuthRedirect>
  )
}
