
import { voteResolvers } from '../vote.schema'

describe('vote resolvers', () => {
  describe('Query', () => {
    describe('votes', () => {
      it('should return votes', () => {
        const sessionId = '12354'

        voteResolvers.Query.votes.resolve({}, { sessionId })
          .then(result => {
            expect(result).toEqual([ { content: '1' }, { content: '3' } ])
          })
      })
    })
  })
})
