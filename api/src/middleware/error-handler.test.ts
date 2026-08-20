import { describe, expect, it, vi } from 'vitest'
import { Request, Response } from 'express'

import { AppError } from '../errors/app-error'
import { errorHandler } from './error-handler'

describe('errorHandler', () => {
  it('returns an operational application error', () => {
    const error = new AppError({
      code: 'USER_NOT_FOUND',
      statusCode: 404,
      message: 'User not found',
    })

    const json = vi.fn()
    const status = vi.fn().mockReturnValue({ json })

    const res = {
      status,
    } as unknown as Response

    errorHandler(error, {} as Request, res, vi.fn())

    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({
      message: 'User not found',
      code: 'USER_NOT_FOUND',
    })
  })

  it('includes error details when provided', () => {
    const error = new AppError({
      code: 'VALIDATION_ERROR',
      statusCode: 400,
      message: 'Validation failed',
      details: [
        {
          field: 'email',
          message: 'Invalid email address',
        },
      ],
    })

    const json = vi.fn()
    const status = vi.fn().mockReturnValue({ json })

    const res = {
      status,
    } as unknown as Response

    errorHandler(error, {} as Request, res, vi.fn())

    expect(json).toHaveBeenCalledWith({
      message: 'Validation failed',
      code: 'VALIDATION_ERROR',
      details: [
        {
          field: 'email',
          message: 'Invalid email address',
        },
      ],
    })
  })

  it('normalizes unknown errors to a 500 response', () => {
    const error = new Error('Database connection failed')

    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => undefined)

    const json = vi.fn()
    const status = vi.fn().mockReturnValue({ json })

    const res = {
      status,
    } as unknown as Response

    errorHandler(error, {} as Request, res, vi.fn())

    expect(status).toHaveBeenCalledWith(500)

    expect(json).toHaveBeenCalledWith({
      message: 'Internal server error',
      code: 'INTERNAL_SERVER_ERROR',
    })

    expect(json).not.toHaveBeenCalledWith(
      expect.objectContaining({
        message: 'Database connection failed',
      }),
    )

    expect(consoleError).toHaveBeenCalled()

    consoleError.mockRestore()
  })

  it('does not expose internal error details', () => {
    const error = new Error('secret database information')

    const json = vi.fn()
    const status = vi.fn().mockReturnValue({ json })

    const res = {
      status,
    } as unknown as Response

    errorHandler(error, {} as Request, res, vi.fn())

    expect(JSON.stringify(json.mock.calls[0][0])).not.toContain('secret database information')
  })
})
