import { Request, Response } from 'express'
import { describe, expect, it, vi } from 'vitest'
import { makeUser } from '../../test/factories/user'
import { getUserById } from './controller'
import { userService } from './service'

vi.mock('./service', () => ({
  userService: {
    getUserById: vi.fn()
  }
}))

describe('getUserById', () => {
  it('returns the user when found', async () => {
    const user = makeUser()

    vi.mocked(userService.getUserById).mockResolvedValue(user)

    const req = {
      params: {
        id: user.id
      }
    } as Request<{ id: string }>

    const json = vi.fn()

    const res = {
      json
    } as unknown as Response

    await getUserById(req, res)

    expect(userService.getUserById).toHaveBeenCalledWith(user.id)
    expect(json).toHaveBeenCalledWith(user)
  })

  it('returns 404 when the user is not found', async () => {
    vi.mocked(userService.getUserById).mockResolvedValue(null)

    const req = {
      params: {
        id: 'missing-user'
      }
    } as Request<{ id: string }>

    const json = vi.fn()
    const status = vi.fn().mockReturnValue({ json })

    const res = {
      status
    } as unknown as Response

    await getUserById(req, res)

    expect(userService.getUserById).toHaveBeenCalledWith('missing-user')
    expect(status).toHaveBeenCalledWith(404)
    expect(json).toHaveBeenCalledWith({
      message: 'User not found'
    })
  })
})