import { afterEach, describe, expect, it, vi } from 'vitest'
import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react'

import { PublicConversationDialog } from './PublicConversationDialog'

import { getPublicConversations } from '../api/chat.api'

import type { Conversation } from '../types/conversation.types'

vi.mock('../api/chat.api', () => ({
  getPublicConversations: vi.fn(),
}))

const mockedGetPublicConversations = vi.mocked(getPublicConversations)

const conversation: Conversation = {
  id: 'conversation-1',
  title: 'Kubernetes Discussion',
  visibility: 'PUBLIC',
  isAdmin: false,
  createdAt: '2026-08-18T00:00:00.000Z',
  updatedAt: '2026-08-18T00:00:00.000Z',
}

function renderDialog(
  overrides: Partial<React.ComponentProps<typeof PublicConversationDialog>> = {},
) {
  const onClose = vi.fn()
  const onJoin = vi.fn().mockResolvedValue(conversation)

  render(
    <PublicConversationDialog
      open
      onClose={onClose}
      onJoin={onJoin}
      isJoining={false}
      {...overrides}
    />,
  )

  return {
    onClose,
    onJoin,
  }
}

afterEach(() => {
  cleanup()
  vi.useRealTimers()
  vi.clearAllMocks()
})

describe('PublicConversationDialog', () => {
  it('does not render when closed', () => {
    renderDialog({ open: false })

    expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
  })

  it('renders the search UI when open', () => {
    renderDialog()

    expect(screen.getByRole('dialog')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Search conversations...')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Cancel' })).toBeInTheDocument()
  })

  it('closes when Cancel is clicked', () => {
    const { onClose } = renderDialog()

    fireEvent.click(screen.getByRole('button', { name: 'Cancel' }))

    expect(onClose).toHaveBeenCalledTimes(1)
  })

  it('does not search when the input is empty', async () => {
    renderDialog()

    await new Promise((resolve) => setTimeout(resolve, 600))

    expect(mockedGetPublicConversations).not.toHaveBeenCalled()
  })

  it('searches after the debounce delay', async () => {
    vi.useFakeTimers()

    mockedGetPublicConversations.mockResolvedValue([conversation])

    renderDialog()

    const input = screen.getByPlaceholderText('Search conversations...')

    fireEvent.change(input, {
      target: { value: 'kubernetes' },
    })

    expect(mockedGetPublicConversations).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(499)

    expect(mockedGetPublicConversations).not.toHaveBeenCalled()

    await vi.advanceTimersByTimeAsync(1)

    expect(mockedGetPublicConversations).toHaveBeenCalledTimes(1)
    expect(mockedGetPublicConversations).toHaveBeenCalledWith('kubernetes')
  })

  it('displays search results after the search completes', async () => {
    mockedGetPublicConversations.mockResolvedValue([conversation])

    renderDialog()

    fireEvent.change(screen.getByPlaceholderText('Search conversations...'), {
      target: { value: 'kubernetes' },
    })

    expect(await screen.findByText('Kubernetes Discussion')).toBeInTheDocument()
    expect(screen.getByText('Public conversation')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Join' })).toBeInTheDocument()
  })

  it('displays no-results after a search returns no conversations', async () => {
    mockedGetPublicConversations.mockResolvedValue([])

    renderDialog()

    fireEvent.change(screen.getByPlaceholderText('Search conversations...'), {
      target: { value: 'kubernetes' },
    })

    expect(await screen.findByText('No public conversations found.')).toBeInTheDocument()
  })

  it('passes the trimmed search text to the API', async () => {
    mockedGetPublicConversations.mockResolvedValue([])

    renderDialog()

    fireEvent.change(screen.getByPlaceholderText('Search conversations...'), {
      target: { value: '  kubernetes  ' },
    })

    await waitFor(() => {
      expect(mockedGetPublicConversations).toHaveBeenCalledWith('kubernetes')
    })
  })

  it('does not search when the input is cleared', async () => {
    vi.useFakeTimers()

    mockedGetPublicConversations.mockResolvedValue([conversation])

    renderDialog()

    const input = screen.getByPlaceholderText('Search conversations...')

    fireEvent.change(input, {
      target: { value: 'kubernetes' },
    })

    await vi.advanceTimersByTimeAsync(500)

    expect(mockedGetPublicConversations).toHaveBeenCalledTimes(1)

    fireEvent.change(input, {
      target: { value: '' },
    })

    await vi.advanceTimersByTimeAsync(500)

    expect(mockedGetPublicConversations).toHaveBeenCalledTimes(1)
  })

  it('displays an API error when the search fails', async () => {
    mockedGetPublicConversations.mockRejectedValue(new Error('Search failed'))

    renderDialog()

    fireEvent.change(screen.getByPlaceholderText('Search conversations...'), {
      target: { value: 'kubernetes' },
    })

    expect(await screen.findByText('Search failed')).toBeInTheDocument()
  })

  it('joins a conversation and closes the dialog', async () => {
    const { onClose, onJoin } = renderDialog()

    mockedGetPublicConversations.mockResolvedValue([conversation])

    fireEvent.change(screen.getByPlaceholderText('Search conversations...'), {
      target: { value: 'kubernetes' },
    })

    const joinButton = await screen.findByRole('button', { name: 'Join' })

    fireEvent.click(joinButton)

    await waitFor(() => {
      expect(onJoin).toHaveBeenCalledWith('conversation-1')
      expect(onClose).toHaveBeenCalledTimes(1)
    })
  })

  it('displays a join error when joining fails', async () => {
    const joinError = new Error('Failed to join')
    const onJoin = vi.fn().mockRejectedValue(joinError)

    mockedGetPublicConversations.mockResolvedValue([conversation])

    renderDialog({ onJoin })

    fireEvent.change(screen.getByPlaceholderText('Search conversations...'), {
      target: { value: 'kubernetes' },
    })

    const joinButton = await screen.findByRole('button', { name: 'Join' })

    fireEvent.click(joinButton)

    expect(await screen.findByText('Failed to join')).toBeInTheDocument()
  })

  it('disables Join while a join is already in progress', async () => {
    mockedGetPublicConversations.mockResolvedValue([conversation])

    renderDialog({ isJoining: true })

    fireEvent.change(screen.getByPlaceholderText('Search conversations...'), {
      target: { value: 'kubernetes' },
    })

    const joinButton = await screen.findByRole('button', { name: 'Joining...' })

    expect(joinButton).toBeDisabled()
  })

  it('disables Cancel while a join is in progress', () => {
    renderDialog({ isJoining: true })

    expect(screen.getByRole('button', { name: 'Cancel' })).toBeDisabled()
  })
})
