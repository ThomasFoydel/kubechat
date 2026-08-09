import { Request, Response } from 'express'
import { userService } from './service'

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