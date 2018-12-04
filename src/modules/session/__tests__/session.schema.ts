import { SessionService } from '../session.service'
import { authorize } from '../../../helpers/authorize'

import { sessionResolvers } from '../session.schema'

jest.mock('../session.service')
jest.mock('../../../helpers/authorize')

describe('session resolvers', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Mutation', () => {
    describe('createSession', () => {
      it('should return a valid session object', async () => {
        await sessionResolvers.Mutation.createSession.resolve({})

        expect(SessionService.instance.createSession).toHaveBeenCalledTimes(1)
      })
    })
  })
})
