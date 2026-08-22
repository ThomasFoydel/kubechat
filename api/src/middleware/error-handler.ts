import { NextFunction, Request, Response } from 'express'

import { AppError, isAppError } from '../errors/app-error'
import { internalServerError } from '../errors/errors'

export function errorHandler(
  error: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  const appError = normalizeError(error)

  if (!appError.isOperational) {
    console.error('Unhandled application error:', error)
  }

  const response: {
    message: string
    code: string
    details?: unknown
  } = {
    message: appError.message,
    code: appError.code,
  }

  if (appError.details !== undefined) {
    response.details = appError.details
  }

  res.status(appError.statusCode).json(response)
}

function normalizeError(error: unknown): AppError {
  if (isAppError(error)) {
    return error
  }

  return internalServerError(error)
}
