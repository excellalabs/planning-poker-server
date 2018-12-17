import { IResolvers } from 'apollo-server'
import gql from '../../helpers/noopTag'
import { Context } from '../../context'

import { Session } from './session.types'
import { SessionService } from './session.service'

export const typeDefs = gql`
  extend type Mutation {
    createSession: Session!
  }

  type Session implements Document {
    _id: ID!
    sessionId: String!
  }
`

export const sessionResolvers = {
  Mutation: {
    createSession: {
      async resolve (_source: any): Promise<Session> {
        return SessionService.instance.createSession()
      },
    },
  },
}

export const resolvers: IResolvers<Session, Context> = sessionResolvers
