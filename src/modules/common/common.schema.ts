
import { GraphQLScalarType } from 'graphql'
import { Kind } from 'graphql/language'
import { ObjectID } from 'mongodb'
import { IResolvers } from 'apollo-server'
import gql from '../../helpers/noopTag'
import { Context } from '../../context'

import { Document } from './common.types'

export const typeDefs = gql`
  input PaginationData {
    skip: Int
    limit: Int
  }

  scalar ID

  interface Document {
    _id: ID!
  }
`

const objectIdDescription = `
The \`ObjectID\` scalar type represents a [\`BSON\`](https://en.wikipedia.org/wiki/BSON) ID
commonly used in \`mongodb\`.
`

export const resolvers: IResolvers<Document, Context> = {
  ID: new GraphQLScalarType({
    name: 'ID',
    description: objectIdDescription,
    serialize (_id): string {
      if (_id instanceof ObjectID) {
        return _id.toHexString()
      } else if (typeof _id === 'string') {
        return _id
      } else {
        throw new Error(`${Object.getPrototypeOf(_id).constructor.name} not convertible to `)
      }
    },
    parseValue (_id): ObjectID {
      if (typeof _id === 'string') {
        return ObjectID.createFromHexString(_id)
      } else {
        throw new Error(`${typeof _id} not convertible to ObjectID`)
      }
    },
    parseLiteral (ast): ObjectID {
      if (ast.kind === Kind.STRING) {
        return ObjectID.createFromHexString(ast.value)
      } else {
        throw new Error(`${ast.kind} not convertible to ObjectID`)
      }
    },
  }),
}
