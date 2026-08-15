'use client'

import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

import { useAuth } from '../hooks/useAuth'

export function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth()

  async function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const email = String(formData.get('email'))

    const password = String(formData.get('password'))

    await login({
      email,
      password,
    })
  }

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-border bg-card shadow-lg shadow-black/20">
          <MessageSquare size={24} className="text-primary" />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>

        <p className="mt-2 text-sm text-muted-foreground">Sign in to continue to KubeChat</p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-xl shadow-black/20">
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>

            <input
              id="email"
              name="email"
              type="email"
              autoComplete="email"
              required
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium">
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />
          </div>

          {loginError && (
            <div
              role="alert"
              className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
            >
              {loginError.message}
            </div>
          )}

          <button
            type="submit"
            disabled={isLoggingIn}
            className="h-10 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isLoggingIn ? 'Signing in...' : 'Sign in'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Don't have an account?{' '}
        <Link
          href="/register"
          className="font-medium text-foreground underline underline-offset-4 transition hover:text-primary"
        >
          Create one
        </Link>
      </p>
    </div>
  )
}
