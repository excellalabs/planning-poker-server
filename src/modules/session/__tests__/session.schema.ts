import { SessionService } from '../session.service'
import { authorize } from '../../../helpers/authorize'

import { sessionResolvers } from '../session.schema'
import { ObjectID } from 'mongodb'

jest.mock('../session.service')

describe('session resolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Mutation', () => {
    describe('createSession', () => {
      it('should call createSession once', async () => {
        await sessionResolvers.Mutation.createSession.resolve({})

        expect(SessionService.instance.createSession).toHaveBeenCalledTimes(1)
      })
      it('should return the result of SessionService:createSession', async () => {
        const session = {
          _id: new ObjectID(),
        };
        (SessionService.instance.createSession as jest.Mock).mockResolvedValue(session)

        const result = await sessionResolvers.Mutation.createSession.resolve({})

        expect(result).toBe(session)
      })
    })
  })
})
