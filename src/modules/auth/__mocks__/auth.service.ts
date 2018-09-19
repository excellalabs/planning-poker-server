
import { ObjectID } from 'mongodb'

import { JwtPayload } from '../auth.types'

export const AuthService = {
  instance: {
    encodeJwt: jest.fn(async () => {
      return 'arbitrary string'
    }),
    decodeJwt: jest.fn(async (): Promise<JwtPayload> => {
      return {
        _id: new ObjectID(),
      }
    }),
  },
}
