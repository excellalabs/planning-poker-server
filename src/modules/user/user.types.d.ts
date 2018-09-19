
import { Document } from '../common/common.types'

export interface User extends Document {
  username: string
  passwordHash: void
}

export interface CreateUserRequest {
  username: string
  password: string
  verifyPassword: string
}

export interface ChangePasswordRequest {
  password: string
  verifyPassword: string
}
