'use client'

export function LoginForm() {
  return (
    <div>
      <h1>Sign in to KubeChat</h1>

      <form>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            autoComplete="current-password"
          />
        </div>

        <button type="submit">
          Sign in
        </button>
      </form>
    </div>
  )
}