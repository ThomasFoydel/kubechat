'use client'

import { useAuth } from '../hooks/useAuth'

export function RegisterForm() {
  const { register } = useAuth()

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault()

    const formData = new FormData(event.currentTarget)

    const email = String(formData.get('email'))
    const password = String(formData.get('password'))

    await register(email, password)
  }

  return (
    <div>
      <h1>Create your KubeChat account</h1>

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

        <button type="submit">
          Create account
        </button>
      </form>
    </div>
  )
}