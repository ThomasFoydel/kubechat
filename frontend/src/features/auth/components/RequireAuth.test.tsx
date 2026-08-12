import { render, screen, waitFor } from '@testing-library/react'
import { beforeEach, describe, expect, it, vi } from 'vitest'

import { RequireAuth } from './RequireAuth'

const mockReplace = vi.fn()
const mockUseAuth = vi.fn()

vi.mock('next/navigation', () => ({
  useRouter: () => ({
    replace: mockReplace
  })
}))

vi.mock('../hooks/useAuth', () => ({
  useAuth: () => mockUseAuth()
}))

describe('RequireAuth', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders nothing while authentication is loading', () => {
    mockUseAuth.mockReturnValue({
      isLoading: true,
      isAuthenticated: false
    })

    render(
      <RequireAuth>
        <div>Protected content</div>
      </RequireAuth>
    )

    expect(
      screen.queryByText('Protected content')
    ).not.toBeInTheDocument()

    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('renders children when authenticated', () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: true
    })

    render(
      <RequireAuth>
        <div>Protected content</div>
      </RequireAuth>
    )

    expect(
      screen.getByText('Protected content')
    ).toBeInTheDocument()

    expect(mockReplace).not.toHaveBeenCalled()
  })

  it('redirects unauthenticated users to login', async () => {
    mockUseAuth.mockReturnValue({
      isLoading: false,
      isAuthenticated: false
    })

    render(
      <RequireAuth>
        <div>Protected content</div>
      </RequireAuth>
    )

    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('/login')
    })
  })
})