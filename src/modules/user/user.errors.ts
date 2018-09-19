
import { TestResult } from 'owasp-password-strength-test'
import { UserInputError } from 'apollo-server'
import { FilterQuery } from 'mongodb'
import { DbNotFoundError, InputValidationError } from '../../errors'

import { User } from './user.types'

export class UserNotFoundError extends DbNotFoundError<User> {
  constructor (query: FilterQuery<User>) {
    super('User', query)
  }
}

export class UserExistsError extends UserInputError {
  constructor () {
    super(`Username already exists`)
  }
}

export class SetPasswordMismatchError extends UserInputError {
  constructor () {
    super('Passwords do not match')
  }
}

export class PasswordStrengthError extends InputValidationError {
  constructor (
    public result: TestResult,
  ) {
    super(`Password is not strong enough: [${result.errors.join(', ')}]`)
  }
}
