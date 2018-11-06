import { IResolvers } from 'apollo-server'
import gql from '../../helpers/noopTag'
import { Context } from '../../context'

import { Vote } from './vote.types'

export const typeDefs = gql`
  extend type Query {
    votes (sessionId: String): [Vote!]!
  }

  type Vote implements Document {
    _id: ID!
    content: String!
  }
`

export const voteResolvers = {
  Query: {
    votes: {
      description: 'Used to retrieve all votes.',
      async resolve (_source: any, { sessionId }: { sessionId: String }): Promise<Vote[]> {
        return [ { content: '1' }, { content: '3' } ]
      },
    },
  },
  Subscription: {
  },
}

export const resolvers: IResolvers<Vote, Context> = voteResolvers
