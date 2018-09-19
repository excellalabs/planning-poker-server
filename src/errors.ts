
import { UserInputError } from 'apollo-server'
import { FilterQuery } from 'mongodb'

export class DbNotFoundError<T> extends UserInputError {
  constructor (
    public modelName: string,
    query: FilterQuery<T>,
    message = `${modelName} not found`,
  ) {
    super(message, query)
  }
}

export class InputValidationError extends UserInputError {
  constructor (message: string) {
    super(message)
  }
}
