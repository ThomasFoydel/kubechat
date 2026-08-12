'use client'

import Link from 'next/link'
import { MessageSquare } from 'lucide-react'

import { useAuth } from '../hooks/useAuth'

export function RegisterForm() {
  const {
    register,
    isRegistering,
    registerError
  } = useAuth()

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const formData = new FormData(
      event.currentTarget
    )

    const username = String(
      formData.get('username')
    )

    const email = String(
      formData.get('email')
    )

    const password = String(
      formData.get('password')
    )

    await register({
      username,
      email,
      password
    })
  }

  const validationErrors =
    registerError instanceof Error &&
    'errors' in registerError
      ? (
          registerError as {
            errors: {
              field: string
              message: string
            }[]
          }
        ).errors
      : []

  return (
    <div className="w-full max-w-md">
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-xl border border-border bg-card shadow-lg shadow-black/20">
          <MessageSquare
            size={24}
            className="text-primary"
          />
        </div>

        <h1 className="text-2xl font-semibold tracking-tight">
          Create your account
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          Get started with KubeChat
        </p>
      </div>

      <div className="rounded-xl border border-border bg-card p-6 shadow-xl shadow-black/20">
        <form
          onSubmit={handleSubmit}
          className="space-y-5"
        >
          <div className="space-y-2">
            <label
              htmlFor="username"
              className="text-sm font-medium"
            >
              Username
            </label>

            <input
              id="username"
              name="username"
              type="text"
              autoComplete="username"
              required
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />

            {validationErrors
              .filter(error => error.field === 'username')
              .map(error => (
                <p
                  key={error.message}
                  className="text-sm text-destructive"
                >
                  {error.message}
                </p>
              ))}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="email"
              className="text-sm font-medium"
            >
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

            {validationErrors
              .filter(error => error.field === 'email')
              .map(error => (
                <p
                  key={error.message}
                  className="text-sm text-destructive"
                >
                  {error.message}
                </p>
              ))}
          </div>

          <div className="space-y-2">
            <label
              htmlFor="password"
              className="text-sm font-medium"
            >
              Password
            </label>

            <input
              id="password"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              className="h-10 w-full rounded-lg border border-border bg-background px-3 text-sm outline-none transition placeholder:text-muted-foreground focus:border-primary focus:ring-1 focus:ring-primary"
            />

            {validationErrors
              .filter(error => error.field === 'password')
              .map(error => (
                <p
                  key={error.message}
                  className="text-sm text-destructive"
                >
                  {error.message}
                </p>
              ))}
          </div>

          {registerError &&
            validationErrors.length === 0 && (
              <div
                role="alert"
                className="rounded-lg border border-destructive/30 bg-destructive/10 px-3 py-2.5 text-sm text-destructive"
              >
                {registerError.message}
              </div>
            )}

          <button
            type="submit"
            disabled={isRegistering}
            className="h-10 w-full rounded-lg bg-primary text-sm font-medium text-primary-foreground transition hover:bg-primary/90 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isRegistering
              ? 'Creating account...'
              : 'Create account'}
          </button>
        </form>
      </div>

      <p className="mt-6 text-center text-sm text-muted-foreground">
        Already have an account?{' '}
        <Link
          href="/login"
          className="font-medium text-foreground underline underline-offset-4 transition hover:text-primary"
        >
          Sign in
        </Link>
      </p>
    </div>
  )
}