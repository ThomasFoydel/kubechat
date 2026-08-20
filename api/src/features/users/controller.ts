import { Request, Response } from 'express'

import { userNotFound } from '../../errors/errors'
import { userService } from './service'

export async function getUserById(req: Request<{ id: string }>, res: Response): Promise<void> {
  const user = await userService.getUserById(req.params.id)

  if (!user) {
    throw userNotFound()
  }

  res.json(user)
}
