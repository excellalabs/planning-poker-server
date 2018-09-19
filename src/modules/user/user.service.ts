
import { hash, compare } from 'bcrypt'
import { ObjectID } from 'mongodb'
import { test as testPassword } from 'owasp-password-strength-test'
import { BCRYPT_SALT_ROUNDS } from '../../config'
import { getCollection } from '../../db'
import { InputValidationError } from '../../errors'
import { LoginError } from '../auth/auth.errors'
import { Document, PaginationData } from '../common/common.types'
import { DbService } from '../common/common.service'

import {
  UserNotFoundError,
  UserExistsError,
  SetPasswordMismatchError,
  PasswordStrengthError,
} from './user.errors'
import {
  User,
  CreateUserRequest,
  ChangePasswordRequest,
} from './user.types'

interface PrivateUser extends Document {
  username: string
  passwordHash: string
}

export class UserService extends DbService<PrivateUser> {
  private constructor (
    collection = getCollection<PrivateUser>('users'),
  ) {
    super(collection)
  }

  static readonly instance = new UserService()

  async findAll (pagination?: PaginationData): Promise<User[]> {
    const users = await this.paginate(
      this.collection.find(),
      pagination,
    )
    return users.map(this.trim$)
  }

  async findById (_id: ObjectID): Promise<User | null> {
    const user = await this.collection.findOne({ _id })
    return this.trim(user)
  }

  async findById$ (_id: ObjectID): Promise<User> {
    const user = await this.findById(_id)
    if (user === null) {
      throw new UserNotFoundError({ _id })
    }

    return user
  }

  async findByUsername (username: string): Promise<User | null> {
    const user = await this.collection.findOne({ username })
    return this.trim(user)
  }

  async findByUsername$ (username: string): Promise<User> {
    const user = await this.findByUsername(username)
    if (user === null) {

      throw new UserNotFoundError({ username })
    }

    return user
  }

  async createUser ({ username, password, verifyPassword }: CreateUserRequest): Promise<User> {
    username = await this.validateUsername(username)
    const passwordHash = await this.validateNewPassword(password, verifyPassword)

    const user: PrivateUser = {
      username,
      passwordHash,
    }

    const result = await this.collection.insertOne(user)
    if (result.insertedCount < 1) {
      throw new Error(`User ${username} was not inserted correctly!`)
    }

    return this.trim$({
      ...user,
      _id: result.insertedId,
    })
  }

  async changePassword (_id: ObjectID, { password, verifyPassword }: ChangePasswordRequest): Promise<User> {
    const passwordHash = await this.validateNewPassword(password, verifyPassword)
    await this.findById$(_id) // verify the user exists

    const result = await this.collection.findOneAndUpdate(
      { _id },
      { $set: { passwordHash } },
      { returnOriginal: false }, // return the updated version, not the original
    )

    return this.trim$(result.value!)
  }

  async checkPassword (username: string, password: string): Promise<User> {
    const user = await this.collection.findOne({ username })
    if (!user) {
      throw new LoginError()
    }

    const passwordsMatch = await this.verifyPassword(password, user.passwordHash)
    if (!passwordsMatch) {
      throw new LoginError()
    }

    return this.trim$(user)
  }

  private async verifyPassword (password: string, hash: string): Promise<boolean> {
    return compare(password, hash)
  }

  private async validateNewPassword (password: string, verifyPassword: string): Promise<string> {
    if (password !== verifyPassword) {
      throw new SetPasswordMismatchError()
    }

    const testResult = testPassword(password)
    if (!testResult.strong) {
      throw new PasswordStrengthError(testResult)
    }

    return hash(password, BCRYPT_SALT_ROUNDS)
  }

  private async validateUsername (username: string): Promise<string> {
    if (username.length < 8) {
      throw new InputValidationError('Username must be at least 8 characters long')
    }

    const existingUser = await this.findByUsername(username)

    if (existingUser !== null) {
      throw new UserExistsError()
    }

    return username
  }

  private trim (user: PrivateUser | null): User | null {
    if (!user) {
      return user
    }

    return this.trim$(user)
  }

  private trim$ (user: PrivateUser): User {
    const trimmed: User = {
      _id: user._id,
      username: user.username,
      passwordHash: undefined,
    }

    delete trimmed.passwordHash

    return trimmed
  }

  // private serialize (user: User): IUser {
  //   const { _id, username } = user
  //   const passwordHash = passwordManager.get(user)
  //
  //   if (!passwordHash) {
  //     throw new Error('Could not re-serialize user!')
  //   }
  //
  //   return {
  //     _id,
  //     username,
  //     passwordHash,
  //   }
  // }
}
