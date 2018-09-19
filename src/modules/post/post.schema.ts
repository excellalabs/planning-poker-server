
import { ObjectID } from 'mongodb'
import { IResolvers } from 'apollo-server'
import { authorize } from '../../helpers/authorize'
import gql from '../../helpers/noopTag'
import { Context } from '../../context'
import { User } from '../user/user.types'
import { UserService } from '../user/user.service'
import { PaginationRequest } from '../common/common.types'

import { PostService } from './post.service'
import { PostPubSub } from './post.pubsub'
import { Post, CreatePostRequest, UpdatePostRequest } from './post.types'

export const typeDefs = gql`
  extend type Query {
    posts (pagination: PaginationData): [Post!]!
    post (postId: ID!): Post!
  }

  extend type Mutation {
    createPost (content: String!): Post!
    updatePost (postId: ID!, data: UpdatePost!): Post!
  }

  extend type Subscription {
    post (postId: ID!): Post!
  }

  input UpdatePost {
    content: String
  }

  type Post implements Document {
    _id: ID!
    content: String!
    poster: User!
  }
`

export const postResolvers = {
  Query: {
    posts: {
      description: 'Used to retrieve all posts.',
      async resolve (_source: any, { pagination }: PaginationRequest): Promise<Post[]> {
        const posts = await PostService.instance.findAll(pagination)
        return posts
      },
    },
    post: {
      async resolve (_source: any, { postId }: { postId: ObjectID }): Promise<Post | null> {
        return PostService.instance.findById(postId)
      },
    },
  },
  Mutation: {
    createPost: {
      async resolve (_source: any, args: CreatePostRequest, ctx: Context): Promise<Post> {
        const user = await authorize(ctx)
        return PostService.instance.createPost(user._id!, args)
      },
    },
    updatePost: {
      async resolve (_source: any, args: UpdatePostRequest, ctx: Context): Promise<Post> {
        const user = await authorize(ctx)
        const post = await PostService.instance.updatePost(user._id!, args)
        PostPubSub.instance.publishUpdate(post)
        return post
      },
    },
  },
  Subscription: {
    post: {
      async subscribe (_source: any, { postId }: { postId: ObjectID }): Promise<AsyncIterator<Post>> {
        const post = await PostService.instance.findById$(postId)
        return PostPubSub.instance.listenForUpdates(post)
      },
    },
  },
  Post: {
    poster: {
      async resolve (source: Post): Promise<User> {
        return UserService.instance.findById$(source.posterId)
      },
    },
  },
}

export const resolvers: IResolvers<Post, Context> = postResolvers
