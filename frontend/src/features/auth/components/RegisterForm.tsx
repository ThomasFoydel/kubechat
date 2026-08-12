'use client'

import { useAuth } from '../hooks/useAuth'

export function RegisterForm() {
  const {
    register,
    isRegistering,
    registerError
  } = useAuth()

  async function handleSubmit(
    event: React.SyntheticEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const username = String(formData.get('username'))
    const email = String(formData.get('email'))
    const password = String(formData.get('password'))
    const confirmPassword = String(
      formData.get('confirm-password')
    )

    if (password !== confirmPassword) {
      return
    }

    await register({
      username,
      email,
      password
    })
  }

  return (
    <div>
      <h1>Create your KubeChat account</h1>

      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            id="username"
            name="username"
            type="text"
            autoComplete="username"
            required
          />
        </div>

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
            autoComplete="new-password"
            required
          />
        </div>

        <div>
          <label htmlFor="confirm-password">
            Confirm password
          </label>
          <input
            id="confirm-password"
            name="confirm-password"
            type="password"
            autoComplete="new-password"
            required
          />
        </div>

        {registerError && (
          <p role="alert">
            {registerError.message}
          </p>
        )}

        <button
          type="submit"
          disabled={isRegistering}
        >
          {isRegistering
            ? 'Creating account...'
            : 'Create account'}
        </button>
      </form>
    </div>
  )
}