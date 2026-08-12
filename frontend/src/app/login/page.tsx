import { LoginForm } from '@/features/auth'
import { AuthRedirect } from '@/features/auth/components/AuthRedirect'

export default function LoginPage() {
  return (
    <AuthRedirect>
      <main>
        <LoginForm />
      </main>
    </AuthRedirect>
  )
}