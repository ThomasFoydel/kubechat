import { Request, Response } from 'express'
import { describe, expect, it, vi } from 'vitest'

import { makeUser } from '../../test/factories/user'
import { getUserById } from './controller'
import { userService } from './service'

vi.mock('./service', () => ({
  userService: {
    getUserById: vi.fn(),
  },
}))

describe('getUserById', () => {
  it('returns the user when found', async () => {
    const user = makeUser()

    vi.mocked(userService.getUserById).mockResolvedValue(user)

    const req = {
      params: {
        id: user.id,
      },
    } as Request<{ id: string }>

    const json = vi.fn()

    const res = {
      json,
    } as unknown as Response

    await getUserById(req, res)

    expect(userService.getUserById).toHaveBeenCalledWith(user.id)
    expect(json).toHaveBeenCalledWith(user)
  })

  it('throws a user not found error when the user does not exist', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(null)

    const req = {
      params: {
        id: 'missing-user',
      },
    } as Request<{ id: string }>

    const res = {} as Response

    await expect(getUserById(req, res)).rejects.toMatchObject({
      code: 'USER_NOT_FOUND',
      statusCode: 404,
      message: 'User not found',
    })

    expect(userService.getUserById).toHaveBeenCalledWith('missing-user')
  })
})
