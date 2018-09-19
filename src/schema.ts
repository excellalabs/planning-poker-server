
import { makeExecutableSchema } from 'apollo-server'

import { typeDefs, resolvers } from './modules'

export default makeExecutableSchema({
  typeDefs,
  resolvers,
  resolverValidationOptions: {
    requireResolversForResolveType: false,
  },
})
