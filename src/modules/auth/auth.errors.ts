
import { UserInputError } from 'apollo-server'

export class LoginError extends UserInputError {
  constructor () {
    super('Incorrect username or password')
  }
}
