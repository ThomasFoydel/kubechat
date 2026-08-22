export type ErrorCode =
  | 'AUTHENTICATION_REQUIRED'
  | 'INVALID_SESSION'
  | 'INVALID_CREDENTIALS'
  | 'USER_NOT_FOUND'
  | 'EMAIL_ALREADY_REGISTERED'
  | 'FORBIDDEN'
  | 'CONVERSATION_NOT_FOUND'
  | 'CONVERSATION_ACCESS_DENIED'
  | 'CONVERSATION_NOT_PUBLIC'
  | 'CONVERSATION_CANNOT_LEAVE'
  | 'VALIDATION_ERROR'
  | 'CORS_ERROR'
  | 'INTERNAL_SERVER_ERROR'

interface AppErrorOptions {
  code: ErrorCode
  statusCode: number
  message: string
  details?: unknown
  isOperational?: boolean
  cause?: unknown
}

export class AppError extends Error {
  readonly code: ErrorCode
  readonly statusCode: number
  readonly isOperational: boolean
  readonly details?: unknown

  constructor(options: AppErrorOptions) {
    super(options.message, {
      cause: options.cause,
    })

    this.name = 'AppError'
    this.code = options.code
    this.statusCode = options.statusCode
    this.isOperational = options.isOperational ?? true
    this.details = options.details

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export function isAppError(error: unknown): error is AppError {
  return error instanceof AppError
}
