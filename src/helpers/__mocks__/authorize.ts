
import { ObjectID } from 'mongodb'
import { User } from '../../modules/user/user.types'

export const authorize = jest.fn(async (): Promise<User> => ({
  _id: new ObjectID(),
  username: 'dudeman',
  passwordHash: undefined,
}))
