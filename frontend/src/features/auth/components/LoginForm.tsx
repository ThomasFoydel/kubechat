'use client'

import { useAuth } from '../hooks/useAuth'

export function LoginForm() {
  const { login, isLoggingIn, loginError } = useAuth()

  async function handleSubmit(
    event: React.SubmitEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const email = String(formData.get('email'))
    const password = String(formData.get('password'))

    await login({
      email,
      password
    })
  }

  return (
    <div>
      <h1>Sign in to KubeChat</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoggingIn}
        >
          {isLoggingIn ? 'Signing in...' : 'Sign in'}
        </button>

        {loginError && (
          <p role="alert">
            {loginError.message}
          </p>
        )}
      </form>
    </div>
  )
}
