
import { ObjectID } from 'mongodb'
import { PaginationData } from '../../common/common.types'
import { User, CreateUserRequest } from '../user.types'

function generateRandomUser (user: Partial<User> = {}): User {
  return {
    _id: new ObjectID(),
    username: (new ObjectID()).toHexString(),
    passwordHash: undefined,
    ...user,
  }
}

export const UserService = {
  instance: {
    findAll: jest.fn(async ({ limit = 20 }: PaginationData = { limit: 20 }): Promise<User[]> => {
      return [...new Array(limit)].map(generateRandomUser)
    }),
    findById: jest.fn(async (_id: ObjectID): Promise<User | null> => {
      return generateRandomUser({ _id })
    }),
    findById$: jest.fn(async (_id: ObjectID): Promise<User> => {
      return generateRandomUser({ _id })
    }),
    findByUsername: jest.fn(async (username: string): Promise<User | null> => {
      return generateRandomUser({ username })
    }),
    findByUsername$: jest.fn(async (username: string): Promise<User> => {
      return generateRandomUser({ username })
    }),
    createUser: jest.fn(async ({ username }: CreateUserRequest): Promise<User> => {
      return generateRandomUser({ username })
    }),
    changePassword: jest.fn(async (username: string): Promise<User> => {
      return generateRandomUser({ username })
    }),
    checkPassword: jest.fn(async (username: string): Promise<User> => {
      return generateRandomUser({ username })
    }),
  },
}
