
import { IResolvers } from 'apollo-server'
import { ObjectID } from 'mongodb'
import gql from '../../helpers/noopTag'
import { Context } from '../../context'
import { PostService } from '../post/post.service'
import { PaginationRequest } from '../common/common.types'
import { Post } from '../post/post.types'

import { UserService } from './user.service'
import { User, CreateUserRequest } from './user.types'

export const typeDefs = gql`
  extend type Query {
    user (username: String!): User
    userById (userId: ID!): User
    users (pagination: PaginationData): [User!]!
  }

  extend type Mutation {
    createUser (
      username: String!,
      password: String!,
      verifyPassword: String!,
    ): User!
  }

  type User implements Document {
    _id: ID!
    username: String!
    posts (pagination: PaginationData): [Post!]!
  }
`

export const userResolvers = {
  Query: {
    user: {
      async resolve (_source: any, { username }: { username: string }): Promise<User | null> {
        return UserService.instance.findByUsername(username)
      },
    },
    userById: {
      async resolve (_source: any, { userId }: { userId: ObjectID }): Promise<User | null> {
        return UserService.instance.findById(userId)
      },
    },
    users: {
      async resolve (_source: any, { pagination }: PaginationRequest): Promise<User[]> {
        return UserService.instance.findAll(pagination)
      },
    },
  },
  Mutation: {
    createUser: {
      async resolve (_source: any, args: CreateUserRequest): Promise<User> {
        return UserService.instance.createUser(args)
      },
    },
  },
  User: {
    posts: {
      description: 'All of the posts created by a particular User.',
      async resolve ({ _id }: User, { pagination }: PaginationRequest): Promise<Post[]> {
        return PostService.instance.findAllByPoster(_id!, pagination)
      },
    },
  },
}

export const resolvers: IResolvers<User, Context> = userResolvers
