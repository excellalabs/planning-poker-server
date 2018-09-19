
import { ObjectID } from 'mongodb'
import { User } from '../../user/user.types'
import { PaginationData } from '../../common/common.types'
import { Post, CreatePostRequest, UpdatePostRequest } from '../post.types'

const DEFAULT_LIMIT = 20
const content = 'foo'

const defaultPagination: PaginationData = {
  limit: DEFAULT_LIMIT,
}

export const PostService = {
  instance: {
    findAll: jest.fn(async ({ limit = DEFAULT_LIMIT }: PaginationData = defaultPagination): Promise<Post[]> => {
      return [...new Array(limit)].map(() => ({
        _id: new ObjectID(),
        content,
        posterId: new ObjectID(),
      }))
    }),
    findAllByPoster: jest.fn(async (posterId: ObjectID, { limit = DEFAULT_LIMIT }: PaginationData = defaultPagination): Promise<Post[]> => {
      return [...new Array(limit)].map(() => ({
        _id: new ObjectID(),
        content,
        posterId,
      }))
    }),
    findById: jest.fn(async (_id: ObjectID): Promise<Post | null> => {
      return {
        _id,
        content,
        posterId: new ObjectID(),
      }
    }),
    findById$: jest.fn(async (_id: ObjectID): Promise<Post> => {
      return {
        _id,
        content,
        posterId: new ObjectID(),
      }
    }),
    createPost: jest.fn(async ({ _id }: User, { content }: CreatePostRequest): Promise<Post> => {
      return {
        _id: new ObjectID(),
        content,
        posterId: _id!,
      }
    }),
    updatePost: jest.fn(async ({ _id }: User, { postId, data }: UpdatePostRequest): Promise<Post> => {
      return {
        _id: postId,
        posterId: _id!,
        content,
        ...data,
      }
    }),
  },
}
