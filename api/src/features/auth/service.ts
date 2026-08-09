import { userService } from '../users/service'
import { hashPassword, verifyPassword } from './password'
import { LoginRequest, RegisterRequest } from './dto'
import {
  createSession,
  deleteSession
} from './session'

async function register(input: RegisterRequest) {
  const existingUser = await userService.getUserByEmail(input.email)

  if (existingUser) {
    throw new Error('Email already registered')
  }

  const passwordHash = await hashPassword(input.password)

  return userService.createUser({
    username: input.username,
    email: input.email,
    passwordHash
  })
}

async function login(input: LoginRequest) {
  const user = await userService.getUserByEmail(input.email)

  if (!user) {
    throw new Error('Invalid email or password')
  }

  const passwordValid = await verifyPassword(
    input.password,
    user.passwordHash
  )

  if (!passwordValid) {
    throw new Error('Invalid email or password')
  }

  const sessionId = await createSession(user.id)

  return {
    sessionId,
    user: {
      id: user.id,
      username: user.username,
      email: user.email
    }
  }
}

async function logout(sessionId: string): Promise<void> {
  await deleteSession(sessionId)
}

export const authService = {
  register,
  login,
  logout
}