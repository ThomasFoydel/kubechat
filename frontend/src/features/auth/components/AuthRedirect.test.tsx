import { render, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { AuthRedirect } from './AuthRedirect'

const { mockReplace, mockUseAuth } = vi.hoisted(() => ({
  mockReplace: vi.fn(),
  mockUseAuth: vi.fn(),
}))

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace,
  }),
}))

vi.mock('../hooks/useAuth', () => ({
  useAuth: mockUseAuth,
}))

describe('AuthRedirect', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('redirects authenticated users to chat', async () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: true,
      isLoading: false,
    })

    render(
      <AuthRedirect>
        <div>Login page</div>
      </AuthRedirect>,
    )

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/chat')
    })
  })

  it('does not redirect while authentication is loading', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: true,
    })

    render(
      <AuthRedirect>
        <div>Login page</div>
      </AuthRedirect>,
    )

    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('does not redirect unauthenticated users', () => {
    mockUseAuth.mockReturnValue({
      isAuthenticated: false,
      isLoading: false,
    })

    render(
      <AuthRedirect>
        <div>Login page</div>
      </AuthRedirect>,
    )

    expect(mockReplace).not.toHaveBeenCalled()
  })
})
