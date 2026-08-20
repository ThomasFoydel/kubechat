import { emailAlreadyRegistered, invalidCredentials } from '../../errors/errors'
import { userService } from '../users/service'
import { hashPassword, verifyPassword } from './password'
import { LoginRequest, RegisterRequest } from './dto'
import { createSession, deleteSession } from './session'

async function register(input: RegisterRequest) {
  const existingUser = await userService.getUserByEmail(input.email)

  if (existingUser) {
    throw emailAlreadyRegistered()
  }

  const passwordHash = await hashPassword(input.password)

  const user = await userService.createUser({
    username: input.username,
    email: input.email,
    passwordHash,
  })

  const sessionId = await createSession(user.id)

  return {
    sessionId,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  }
}

async function login(input: LoginRequest) {
  const user = await userService.getUserByEmail(input.email)

  if (!user) {
    throw invalidCredentials()
  }

  const passwordValid = await verifyPassword(input.password, user.passwordHash)

  if (!passwordValid) {
    throw invalidCredentials()
  }

  const sessionId = await createSession(user.id)

  return {
    sessionId,
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
    },
  }
}

async function logout(sessionId: string): Promise<void> {
  await deleteSession(sessionId)
}

export const authService = {
  register,
  login,
  logout,
}
