import { RegisterForm } from '@/features/auth'
import { AuthRedirect } from '@/features/auth/components/AuthRedirect'

export default function RegisterPage() {
  return (
    <AuthRedirect>
      <main>
        <RegisterForm />
      </main>
    </AuthRedirect>
  )
}