import { AppError } from './app-error'

export function authenticationRequired(): AppError {
  return new AppError({
    code: 'AUTHENTICATION_REQUIRED',
    statusCode: 401,
    message: 'Authentication required',
  })
}

export function invalidSession(): AppError {
  return new AppError({
    code: 'INVALID_SESSION',
    statusCode: 401,
    message: 'Invalid or expired session',
  })
}

export function invalidCredentials(): AppError {
  return new AppError({
    code: 'INVALID_CREDENTIALS',
    statusCode: 401,
    message: 'Invalid email or password',
  })
}

export function userNotFound(): AppError {
  return new AppError({
    code: 'USER_NOT_FOUND',
    statusCode: 404,
    message: 'User not found',
  })
}

export function emailAlreadyRegistered(): AppError {
  return new AppError({
    code: 'EMAIL_ALREADY_REGISTERED',
    statusCode: 409,
    message: 'Email already registered',
  })
}

export function forbidden(message = 'You do not have permission to perform this action'): AppError {
  return new AppError({
    code: 'FORBIDDEN',
    statusCode: 403,
    message,
  })
}

export function conversationNotFound(): AppError {
  return new AppError({
    code: 'CONVERSATION_NOT_FOUND',
    statusCode: 404,
    message: 'Conversation not found',
  })
}

export function conversationAccessDenied(): AppError {
  return new AppError({
    code: 'CONVERSATION_ACCESS_DENIED',
    statusCode: 403,
    message: 'You do not have access to this conversation',
  })
}

export function conversationNotPublic(): AppError {
  return new AppError({
    code: 'CONVERSATION_NOT_PUBLIC',
    statusCode: 403,
    message: 'You can only join public conversations',
  })
}

export function conversationCannotLeave(): AppError {
  return new AppError({
    code: 'CONVERSATION_CANNOT_LEAVE',
    statusCode: 403,
    message: 'Owners and admins cannot leave a conversation',
  })
}

export function validationError(details: unknown): AppError {
  return new AppError({
    code: 'VALIDATION_ERROR',
    statusCode: 400,
    message: 'Validation failed',
    details,
  })
}

export function corsError(): AppError {
  return new AppError({
    code: 'CORS_ERROR',
    statusCode: 403,
    message: 'Origin is not allowed',
  })
}

export function internalServerError(cause?: unknown): AppError {
  return new AppError({
    code: 'INTERNAL_SERVER_ERROR',
    statusCode: 500,
    message: 'Internal server error',
    isOperational: false,
    cause,
  })
}
