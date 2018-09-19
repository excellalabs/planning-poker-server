
import { IResolvers } from 'apollo-server'
import * as glob from 'glob'
import { join } from 'path'
import gql from '../helpers/noopTag'

import { HeartbeatPubSub } from './common/common.pubsub'

const baseTypeDef = gql`
type Query {
  healthCheck: Boolean!
}
type Subscription {
  healthCheck: Boolean!
}
type Mutation {
  healthCheck: Boolean!
}
`

interface SchemaFileContent {
  typeDefs: string
  resolvers?: IResolvers
}

const schemaFiles = glob.sync(join(__dirname, './**/!(__tests__|__mocks__)/*.schema.ts'))

let gatheredTypeDefs: string[] = [baseTypeDef]
let gatheredResolvers: IResolvers = {
  Query: {
    healthCheck: {
      resolve: () => true,
    },
  },
  Subscription: {
    healthCheck: {
      subscribe: () => HeartbeatPubSub.instance.listen(),
    },
  },
  Mutation: {
    healthCheck: {
      resolve: () => true,
    },
  },
}

schemaFiles.forEach(file => {
  const { typeDefs, resolvers }: SchemaFileContent = require(file)

  gatheredTypeDefs.push(typeDefs)
  if (resolvers) {
    gatheredResolvers = {
      ...gatheredResolvers,
      ...resolvers,
      Query: {
        ...gatheredResolvers.Query,
        ...(resolvers.Query || {}),
      } as any,
      Mutation: {
        ...gatheredResolvers.Mutation,
        ...(resolvers.Mutation || {}),
      } as any,
      Subscription: {
        ...gatheredResolvers.Subscription,
        ...(resolvers.Subscription || {}),
      } as any,
    }
  }
})

export const typeDefs = gatheredTypeDefs
export const resolvers = gatheredResolvers
