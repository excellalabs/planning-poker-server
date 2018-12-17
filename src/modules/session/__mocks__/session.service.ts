
import { ObjectID } from 'mongodb'
import { Session } from '../session.types'

export const SessionService = {
  instance: {
    createSession: jest.fn(async (): Promise<Session> => {
      return {
        _id: new ObjectID(),
        sessionId: '1234',
      }
    }),
  },
}
