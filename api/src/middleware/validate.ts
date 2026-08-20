import { NextFunction, Request, Response } from 'express'
import { ZodType } from 'zod'

import { validationError } from '../errors/errors'

export function validateBody(schema: ZodType) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      next(
        validationError(
          result.error.issues.map((issue) => ({
            field: issue.path.join('.'),
            message: issue.message,
          })),
        ),
      )
      return
    }

    req.body = result.data
    next()
  }
}
