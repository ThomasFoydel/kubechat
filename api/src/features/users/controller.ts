import { Request, Response } from 'express'

import { userNotFound } from '../../errors/errors'
import { userService } from './service'

export async function getUsers(_req: Request, res: Response): Promise<void> {
  const users = await userService.getUsers()

  res.json(users)
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  const { id } = req.params

  if (typeof id !== 'string') {
    res.status(400).json({
      message: 'Invalid user ID',
    })

    return
  }

  const user = await userService.getUserById(id)

  if (!user) {
    throw userNotFound()
  }

  res.json(user)
}
