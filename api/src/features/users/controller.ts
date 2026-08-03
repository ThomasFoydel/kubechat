import { Request, Response } from 'express'
import { CreateUserRequest } from './dto'
import { userService } from './service'

export async function createUser(
  req: Request<{}, {}, CreateUserRequest>,
  res: Response
): Promise<void> {
  const { username } = req.body

  const user = await userService.createUser(username)

  res.status(201).json(user)
}

export async function getUserById(
  req: Request<{ id: string }>,
  res: Response
): Promise<void> {
  const user = await userService.getUserById(req.params.id)

  if (!user) {
    return void res.status(404).json({
      message: 'User not found'
    })
  }

  res.json(user)
}